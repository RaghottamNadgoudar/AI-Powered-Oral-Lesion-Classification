"""
Flask API for Oral Health Image Classification
Hosted on Render - Uses CLIP model for healthy/unhealthy classification
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import torch
from transformers import CLIPProcessor, CLIPModel
import io
import base64
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# Global model variables
model = None
processor = None

# Classification labels
LABELS = [
    "a photo of healthy normal oral tissue, pink tongue, no lesions",
    "a photo of unhealthy diseased oral tissue with cancer, tumor, white patches, or lesions"
]

def load_model():
    """Load CLIP model (called once at startup)"""
    global model, processor
    print("Loading CLIP model...")
    model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
    processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
    model.eval()
    print("Model loaded successfully!")

def classify_image(image):
    """Classify a PIL Image as healthy or unhealthy"""
    inputs = processor(text=LABELS, images=image, return_tensors="pt", padding=True)
    
    with torch.no_grad():
        outputs = model(**inputs)
        probs = outputs.logits_per_image.softmax(dim=1).numpy()[0]
    
    healthy_prob = float(probs[0]) * 100
    unhealthy_prob = float(probs[1]) * 100
    
    classification = "HEALTHY" if healthy_prob > unhealthy_prob else "UNHEALTHY"
    confidence = max(healthy_prob, unhealthy_prob)
    
    return {
        "classification": classification,
        "confidence": round(confidence, 2),
        "healthy_probability": round(healthy_prob, 2),
        "unhealthy_probability": round(unhealthy_prob, 2)
    }


@app.route("/", methods=["GET"])
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "running",
        "message": "Oral Health Classifier API",
        "endpoints": {
            "POST /predict": "Upload image for classification",
            "POST /predict-base64": "Send base64 encoded image"
        }
    })


@app.route("/predict", methods=["POST"])
def predict():
    """
    Predict endpoint - accepts image file upload
    
    Usage:
        curl -X POST -F "image=@photo.jpg" https://your-app.onrender.com/predict
    """
    if "image" not in request.files:
        return jsonify({"error": "No image file provided. Use 'image' field."}), 400
    
    try:
        file = request.files["image"]
        image = Image.open(file.stream).convert("RGB")
        result = classify_image(image)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/predict-base64", methods=["POST"])
def predict_base64():
    """
    Predict endpoint - accepts base64 encoded image
    
    Usage (JavaScript):
        fetch('https://your-app.onrender.com/predict-base64', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({image: base64ImageString})
        })
    """
    try:
        data = request.get_json()
        if not data or "image" not in data:
            return jsonify({"error": "No 'image' field in JSON body"}), 400
        
        # Remove data URL prefix if present
        image_data = data["image"]
        if "," in image_data:
            image_data = image_data.split(",")[1]
        
        # Decode base64
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        result = classify_image(image)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Load model at startup
load_model()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)