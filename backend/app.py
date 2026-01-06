"""
Flask Backend for Oral Lesion Classification
Two-level classification: Healthy/Unhealthy -> Malignant/Benign
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import base64
import requests
import os

from utils.model_handler import predict_malignant_benign

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:5173", 
    "http://localhost:5174", 
    "http://localhost:3000", 
    "http://127.0.0.1:5173", 
    "http://127.0.0.1:5174",
    "https://ai-powered-oral-lesion-classification.vercel.app",  # Your Vercel deployment
    "https://*.vercel.app",  # Allow all Vercel preview deployments
], supports_credentials=True)

# Configuration
# Hugging Face Spaces for healthy/unhealthy classification
HUGGINGFACE_SPACE_ID = "Praneel12/oral-health-classifier"

# Gradio client instance (will be initialized on first use)
_gradio_client = None

def get_gradio_client():
    """Get or create the Gradio client singleton"""
    global _gradio_client
    if _gradio_client is None:
        from gradio_client import Client
        print(f"Connecting to Hugging Face Space: {HUGGINGFACE_SPACE_ID}")
        _gradio_client = Client(HUGGINGFACE_SPACE_ID)
        print("Gradio client connected successfully!")
    return _gradio_client


def classify_healthy_unhealthy(image_bytes):
    """
    Level 1 Classification: Healthy vs Unhealthy
    Uses the Hugging Face Spaces hosted model via gradio_client
    
    Args:
        image_bytes: Image bytes
    Returns:
        dict with classification result
    """
    import tempfile
    import os as temp_os
    import re
    
    try:
        # Save image bytes to a temporary file (gradio_client needs a file path)
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp_file:
            tmp_file.write(image_bytes)
            tmp_path = tmp_file.name
        
        try:
            print(f"Calling Hugging Face Space: {HUGGINGFACE_SPACE_ID}")
            
            # Get the Gradio client
            client = get_gradio_client()
            
            # Call the correct API endpoint: /classify_image
            from gradio_client import handle_file
            result = client.predict(
                image=handle_file(tmp_path),
                api_name="/classify_image"
            )
            
            print("=" * 50)
            print("Hugging Face API (Healthy/Unhealthy) Raw Response:")
            print("=" * 50)
            print(f"  Result Type: {type(result)}")
            print(f"  Result: {result}")
            print("=" * 50)
            
            # Parse the result
            # Expected format: ["**⚠️ UNHEALTHY**\n\nConfidence: 84.4%", "Healthy: 15.6%\nUnhealthy: 84.4%", "15.63% healthy, 84.37% unhealthy"]
            
            healthy_confidence = 0
            unhealthy_confidence = 0
            
            if isinstance(result, (list, tuple)) and len(result) >= 3:
                # Parse the third element which has format: "15.63% healthy, 84.37% unhealthy"
                percentages_str = result[2]
                
                # Extract percentages using regex
                healthy_match = re.search(r'([\d.]+)%\s*healthy', percentages_str, re.IGNORECASE)
                unhealthy_match = re.search(r'([\d.]+)%\s*unhealthy', percentages_str, re.IGNORECASE)
                
                if healthy_match:
                    healthy_confidence = float(healthy_match.group(1))
                if unhealthy_match:
                    unhealthy_confidence = float(unhealthy_match.group(1))
            
            elif isinstance(result, str):
                # Handle string response
                healthy_match = re.search(r'([\d.]+)%\s*healthy', result, re.IGNORECASE)
                unhealthy_match = re.search(r'([\d.]+)%\s*unhealthy', result, re.IGNORECASE)
                
                if healthy_match:
                    healthy_confidence = float(healthy_match.group(1))
                if unhealthy_match:
                    unhealthy_confidence = float(unhealthy_match.group(1))
            
            is_healthy = healthy_confidence > unhealthy_confidence
            confidence = healthy_confidence if is_healthy else unhealthy_confidence
            classification = 'healthy' if is_healthy else 'unhealthy'
            
            parsed_result = {
                'classification': classification,
                'confidence': round(confidence, 2),
                'is_healthy': is_healthy,
                'healthy_confidence': round(healthy_confidence, 2),
                'unhealthy_confidence': round(unhealthy_confidence, 2)
            }
            
            print("=" * 50)
            print("Hugging Face API (Healthy/Unhealthy) Parsed Result:")
            print("=" * 50)
            print(f"  Classification: {parsed_result['classification']}")
            print(f"  Confidence: {parsed_result['confidence']}%")
            print(f"  Is Healthy: {parsed_result['is_healthy']}")
            print(f"  Healthy Confidence: {parsed_result['healthy_confidence']}%")
            print(f"  Unhealthy Confidence: {parsed_result['unhealthy_confidence']}%")
            print("=" * 50)
            
            return parsed_result
                
        finally:
            # Clean up temporary file
            try:
                temp_os.unlink(tmp_path)
            except:
                pass
            
    except Exception as e:
        print(f"HuggingFace API error: {e}")
        import traceback
        traceback.print_exc()
        return {
            'classification': 'unhealthy',
            'confidence': 50.0,
            'is_healthy': False,
            'message': f'API error: {str(e)}'
        }


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Oral Lesion Classification API is running',
        'huggingface_space': HUGGINGFACE_SPACE_ID
    })


@app.route('/api/classify', methods=['POST'])
def classify_lesion():
    """
    Main classification endpoint
    Performs two-level classification:
    1. Healthy vs Unhealthy (using Render API)
    2. If Unhealthy -> Malignant vs Benign (using local TFLite model)
    """
    try:
        # Check if image is in the request
        if 'image' not in request.files and 'image' not in request.json:
            return jsonify({
                'error': 'No image provided',
                'message': 'Please provide an image file or base64 encoded image'
            }), 400
        
        # Handle file upload
        if 'image' in request.files:
            file = request.files['image']
            if file.filename == '':
                return jsonify({
                    'error': 'No file selected',
                    'message': 'Please select an image file'
                }), 400
            
            # Read and process image
            image_bytes = file.read()
            image = Image.open(io.BytesIO(image_bytes))
            image_base64 = base64.b64encode(image_bytes).decode('utf-8')
        
        # Handle base64 encoded image
        elif 'image' in request.json:
            image_base64 = request.json['image']
            # Remove data URL prefix if present
            if ',' in image_base64:
                image_base64 = image_base64.split(',')[1]
            image_bytes = base64.b64decode(image_base64)
            image = Image.open(io.BytesIO(image_bytes))
        
        # Level 1: Healthy vs Unhealthy classification
        level1_result = classify_healthy_unhealthy(image_bytes)
        
        response = {
            'success': True,
            'level1': {
                'classification': level1_result['classification'],
                'confidence': level1_result['confidence'],
                'is_healthy': level1_result.get('is_healthy', False)
            },
            'level2': None,
            'final_result': level1_result['classification']
        }
        
        # If unhealthy, perform Level 2 classification
        if not level1_result.get('is_healthy', True):
            try:
                level2_result = predict_malignant_benign(image)
                response['level2'] = {
                    'classification': level2_result['classification'],
                    'confidence': level2_result['confidence'],
                    'is_malignant': level2_result['is_malignant']
                }
                response['final_result'] = level2_result['classification']
            except Exception as e:
                print(f"Level 2 classification error: {e}")
                response['level2'] = {
                    'error': str(e),
                    'message': 'Malignant/Benign classification failed'
                }
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Classification error: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'An error occurred during classification'
        }), 500


@app.route('/api/classify/level2', methods=['POST'])
def classify_level2_only():
    """
    Direct Level 2 classification endpoint
    Classifies directly as Malignant vs Benign using TFLite model
    Useful for testing the local model independently
    """
    try:
        if 'image' not in request.files and 'image' not in request.json:
            return jsonify({
                'error': 'No image provided'
            }), 400
        
        # Handle file upload
        if 'image' in request.files:
            file = request.files['image']
            image_bytes = file.read()
            image = Image.open(io.BytesIO(image_bytes))
        else:
            image_base64 = request.json['image']
            if ',' in image_base64:
                image_base64 = image_base64.split(',')[1]
            image_bytes = base64.b64decode(image_base64)
            image = Image.open(io.BytesIO(image_bytes))
        
        # Perform classification
        result = predict_malignant_benign(image)
        
        return jsonify({
            'success': True,
            'classification': result['classification'],
            'confidence': result['confidence'],
            'is_malignant': result['is_malignant']
        })
    
    except Exception as e:
        print(f"Level 2 classification error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


if __name__ == '__main__':
    print("=" * 50)
    print("Oral Lesion Classification API")
    print("=" * 50)
    print(f"Hugging Face Space: {HUGGINGFACE_SPACE_ID}")
    print("Starting server on http://localhost:5000")
    print("=" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
