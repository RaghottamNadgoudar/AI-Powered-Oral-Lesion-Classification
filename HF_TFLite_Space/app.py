import gradio as gr
import numpy as np
from PIL import Image
import tensorflow as tf

CLASS_LABELS = ['benign', 'malignant']

# Load model at startup
print("Loading TFLite model...")
interpreter = tf.lite.Interpreter(model_path='malignant_benign.tflite')
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()
print(f"Model loaded! Input shape: {input_details[0]['shape']}")

def classify(image):
    """Classify oral lesion as benign or malignant"""
    if image is None:
        return "Please upload an image", "No image provided"
    
    try:
        # Convert to PIL if needed
        if isinstance(image, np.ndarray):
            image = Image.fromarray(image.astype('uint8'), 'RGB')
        
        # Preprocess
        img = image.resize((304, 304))
        if img.mode != 'RGB':
            img = img.convert('RGB')
        img_array = np.array(img, dtype=np.float32)
        img_array = np.expand_dims(img_array, axis=0)
        
        # Predict
        interpreter.set_tensor(input_details[0]['index'], img_array)
        interpreter.invoke()
        output = interpreter.get_tensor(output_details[0]['index'])
        
        idx = np.argmax(output[0])
        conf = float(output[0][idx] * 100)
        label = CLASS_LABELS[idx]
        
        result = f"Classification: {label.upper()}\nConfidence: {conf:.1f}%"
        
        if label == "malignant":
            info = f"⚠️ MALIGNANT detected ({conf:.1f}%)\n\nPlease consult a healthcare professional immediately."
        else:
            info = f"✅ BENIGN detected ({conf:.1f}%)\n\nMonitor for changes and consult a dentist if concerned."
        
        return result, info
        
    except Exception as e:
        return f"Error: {str(e)}", "Classification failed"

# Create Blocks interface with explicit API
with gr.Blocks() as demo:
    gr.Markdown("# 🔬 Oral Lesion: Malignant vs Benign")
    gr.Markdown("Upload an oral lesion image for AI classification.\n\n⚠️ DISCLAIMER: For educational purposes only.")
    
    with gr.Row():
        with gr.Column():
            image_input = gr.Image(type="pil", label="Upload Image")
            submit_btn = gr.Button("Submit", variant="primary")
        
        with gr.Column():
            result_output = gr.Textbox(label="Result")
            info_output = gr.Textbox(label="Recommendation")
    
    submit_btn.click(
        fn=classify,
        inputs=[image_input],
        outputs=[result_output, info_output],
        api_name="predict"
    )

if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860)
