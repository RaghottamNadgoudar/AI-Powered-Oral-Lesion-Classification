"""
Flask API for Oral Lesion Classification (Malignant/Benign)
Deploy on Railway.app
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
import tensorflow as tf
import io
import base64

app = Flask(__name__)
CORS(app)

# Class labels
CLASS_LABELS = ['benign', 'malignant']

class MalignantBenignClassifier:
    def __init__(self, model_path='malignant_benign.tflite'):
        """Initialize the TFLite model interpreter"""
        print(f"Loading model from {model_path}...")
        self.interpreter = tf.lite.Interpreter(model_path=model_path)
        self.interpreter.allocate_tensors()
        
        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()
        self.input_shape = self.input_details[0]['shape']
        print(f"Model loaded! Input shape: {self.input_shape}")
    
    def preprocess_image(self, image):
        """Preprocess image for model input"""
        img_resized = image.resize((304, 304))
        if img_resized.mode != 'RGB':
            img_resized = img_resized.convert('RGB')
        img_array = np.array(img_resized, dtype=np.float32)
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    
    def predict(self, image):
        """Run inference on the image"""
        processed_image = self.preprocess_image(image)
        self.interpreter.set_tensor(self.input_details[0]['index'], processed_image)
        self.interpreter.invoke()
        output_data = self.interpreter.get_tensor(self.output_details[0]['index'])
        
        prediction_idx = np.argmax(output_data[0])
        confidence = float(output_data[0][prediction_idx] * 100)
        classification = CLASS_LABELS[prediction_idx]
        
        return classification, confidence

# Initialize classifier
classifier = MalignantBenignClassifier()

@app.route('/')
def home():
    return jsonify({
        "service": "Oral Lesion Classification API",
        "version": "1.0.0",
        "endpoints": {
            "/predict": "POST - Upload image for classification",
            "/health": "GET - Health check"
        }
    })

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "model": "loaded"})

@app.route('/predict', methods=['POST'])
def predict():
    """
    Classify an oral lesion image as benign or malignant
    
    Accepts:
    - Form data with 'image' file
    - JSON with 'image' as base64 string
    """
    try:
        image = None
        
        # Check for file upload
        if 'image' in request.files:
            file = request.files['image']
            image = Image.open(file.stream)
        
        # Check for base64 image
        elif request.is_json and 'image' in request.json:
            image_data = request.json['image']
            # Remove data URL prefix if present
            if 'base64,' in image_data:
                image_data = image_data.split('base64,')[1]
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes))
        
        else:
            return jsonify({
                "success": False,
                "error": "No image provided. Send 'image' as file or base64 string."
            }), 400
        
        # Run prediction
        classification, confidence = classifier.predict(image)
        
        return jsonify({
            "success": True,
            "classification": classification,
            "confidence": round(confidence, 2),
            "is_malignant": classification == "malignant"
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
