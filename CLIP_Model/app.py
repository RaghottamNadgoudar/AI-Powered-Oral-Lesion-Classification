"""
Gradio App for Hugging Face Spaces
Oral Health Image Classifier using CLIP
"""

import gradio as gr
from PIL import Image
import torch
from transformers import CLIPProcessor, CLIPModel

# Load model
print("Loading CLIP model...")
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
model.eval()
print("Model loaded!")

# Classification labels
LABELS = [
    "a photo of healthy normal oral tissue, pink tongue, no lesions",
    "a photo of unhealthy diseased oral tissue with cancer, tumor, white patches, or lesions"
]

def classify_image(image):
    """Classify uploaded image as healthy or unhealthy"""
    if image is None:
        return "Please upload an image", "", ""
    
    # Process image
    inputs = processor(text=LABELS, images=image, return_tensors="pt", padding=True)
    
    with torch.no_grad():
        outputs = model(**inputs)
        probs = outputs.logits_per_image.softmax(dim=1).numpy()[0]
    
    healthy_prob = float(probs[0]) * 100
    unhealthy_prob = float(probs[1]) * 100
    
    classification = "✅ HEALTHY" if healthy_prob > unhealthy_prob else "⚠️ UNHEALTHY"
    confidence = max(healthy_prob, unhealthy_prob)
    
    result = f"**{classification}**\n\nConfidence: {confidence:.1f}%"
    details = f"Healthy: {healthy_prob:.1f}%\nUnhealthy: {unhealthy_prob:.1f}%"
    
    return result, details, f"{healthy_prob:.2f}% healthy, {unhealthy_prob:.2f}% unhealthy"


# Create Gradio interface
demo = gr.Interface(
    fn=classify_image,
    inputs=gr.Image(type="pil", label="Upload Oral/Tongue Image"),
    outputs=[
        gr.Markdown(label="Classification"),
        gr.Textbox(label="Probability Details"),
        gr.Textbox(label="API Response (for developers)")
    ],
    title="🩺 Oral Health Classifier",
    description="Upload an image of oral tissue to check if it appears healthy or shows signs of disease. This uses CLIP for zero-shot classification.",
    examples=[],
    flagging_mode="never"

)

# For API access
demo.queue()
demo.launch()
