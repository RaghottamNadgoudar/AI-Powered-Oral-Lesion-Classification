"""
TFLite Model Handler for Oral Lesion Classification
Handles loading and inference for the malignant/benign classification model

Based on user's working Colab code:
- class_labels = ['Benign', 'Malignant'] (index 0 = Benign, index 1 = Malignant)
- Uses np.argmax(output_data) to get predicted class
"""

import numpy as np
from PIL import Image
import tensorflow as tf
import os

# Class labels - Index 0 = Benign, Index 1 = Malignant
CLASS_LABELS = ['benign', 'malignant']


class MalignantBenignClassifier:
    def __init__(self, model_path=None):
        """Initialize the TFLite model"""
        if model_path is None:
            # Default path relative to this file
            current_dir = os.path.dirname(os.path.abspath(__file__))
            model_path = os.path.join(current_dir, '..', 'models', 'malignant_benign.tflite')
        
        self.model_path = model_path
        self.interpreter = None
        self.input_details = None
        self.output_details = None
        self.load_model()
    
    def load_model(self):
        """Load the TFLite model"""
        try:
            self.interpreter = tf.lite.Interpreter(model_path=self.model_path)
            self.interpreter.allocate_tensors()
            self.input_details = self.interpreter.get_input_details()
            self.output_details = self.interpreter.get_output_details()
            
            print("=" * 50)
            print("TFLite Model Loaded:")
            print("=" * 50)
            print(f"  Model Path: {self.model_path}")
            print(f"  Input Shape: {self.input_details[0]['shape']}")
            print(f"  Input Type: {self.input_details[0]['dtype']}")
            print(f"  Output Shape: {self.output_details[0]['shape']}")
            print(f"  Output Type: {self.output_details[0]['dtype']}")
            print(f"  Class Labels: {CLASS_LABELS}")
            print("=" * 50)
        except Exception as e:
            print(f"Error loading model: {e}")
            raise
    
    def preprocess_image(self, image):
        """
        Preprocess image for model input
        MATCHING COLAB PREPROCESSING EXACTLY:
        - Resize to 304x304 (model's expected size)
        - Convert to RGB
        - Convert to float32
        - DO NOT normalize to [0,1] - keep values in [0,255] range
        
        Args:
            image: PIL Image or numpy array
        Returns:
            Preprocessed numpy array ready for model input
        """
        # Get expected input shape from model
        input_shape = self.input_details[0]['shape']
        height, width = input_shape[1], input_shape[2]
        input_dtype = self.input_details[0]['dtype']
        
        print(f"  Preprocessing: target size=({width}, {height}), dtype={input_dtype}")
        
        # Convert to PIL Image if numpy array
        if isinstance(image, np.ndarray):
            image = Image.fromarray(image)
        
        # Convert to RGB if necessary (like cv2.cvtColor BGR2RGB)
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        print(f"  Original image size: {image.size}, mode: {image.mode}")
        
        # Resize to model's expected input size (like cv2.resize)
        image = image.resize((width, height), Image.Resampling.LANCZOS)
        
        # Convert to numpy array as float32 (matching Colab: astype(np.float32))
        # IMPORTANT: DO NOT normalize to [0,1] - keep values in [0,255] range!
        img_array = np.array(image, dtype=np.float32)
        
        print(f"  Array shape before expand: {img_array.shape}")
        print(f"  Array min/max (should be 0-255): {img_array.min():.2f} / {img_array.max():.2f}")
        
        # Add batch dimension (like np.expand_dims(resized_img, axis=0))
        preprocessed_img = np.expand_dims(img_array, axis=0)
        
        print(f"  Final preprocessed shape: {preprocessed_img.shape}")
        print(f"  Final dtype: {preprocessed_img.dtype}")
        
        return preprocessed_img
    
    def predict(self, image):
        """
        Predict whether the lesion is malignant or benign
        Using the same approach as user's Colab code:
        - predicted_class_index = np.argmax(output_data)
        - class_labels = ['Benign', 'Malignant']
        
        Args:
            image: PIL Image or numpy array
        Returns:
            dict with prediction results
        """
        try:
            print("=" * 50)
            print("TFLite Model Prediction:")
            print("=" * 50)
            
            # Preprocess the image
            preprocessed_img = self.preprocess_image(image)
            
            # Set input tensor
            self.interpreter.set_tensor(self.input_details[0]['index'], preprocessed_img)
            
            # Run inference
            self.interpreter.invoke()
            
            # Get output tensor (same as Colab: output_data = interpreter.get_tensor(...))
            output_data = self.interpreter.get_tensor(self.output_details[0]['index'])
            
            print(f"  Raw prediction output: {output_data}")
            print(f"  Output shape: {output_data.shape}")
            
            # Get the predicted class index using np.argmax (same as Colab)
            predicted_class_index = int(np.argmax(output_data))
            
            print(f"  Predicted class index: {predicted_class_index}")
            
            # Get the predicted label (same as Colab: class_labels = ['Benign', 'Malignant'])
            predicted_label = CLASS_LABELS[predicted_class_index]
            
            print(f"  Predicted label: {predicted_label}")
            
            # Calculate confidence
            if output_data.shape[-1] >= 2:
                # For softmax output with 2 classes
                probs = output_data[0]
                benign_prob = float(probs[0])
                malignant_prob = float(probs[1])
                confidence = float(probs[predicted_class_index])
            else:
                # For single sigmoid output
                prob = float(output_data[0][0])
                if predicted_class_index == 1:
                    malignant_prob = prob
                    benign_prob = 1 - prob
                else:
                    benign_prob = prob
                    malignant_prob = 1 - prob
                confidence = max(benign_prob, malignant_prob)
            
            is_malignant = predicted_label == 'malignant'
            
            result = {
                'classification': predicted_label,
                'confidence': round(confidence * 100, 2),
                'is_malignant': is_malignant,
                'benign_probability': round(benign_prob * 100, 2),
                'malignant_probability': round(malignant_prob * 100, 2),
                'raw_output': output_data.tolist(),
                'predicted_class_index': predicted_class_index
            }
            
            print("=" * 50)
            print("TFLite Model (Malignant/Benign) Final Result:")
            print("=" * 50)
            print(f"  Classification: {result['classification'].upper()}")
            print(f"  Confidence: {result['confidence']}%")
            print(f"  Benign Probability: {result['benign_probability']}%")
            print(f"  Malignant Probability: {result['malignant_probability']}%")
            print(f"  Is Malignant: {result['is_malignant']}")
            print(f"  Predicted Class Index: {result['predicted_class_index']}")
            print(f"  Raw Output: {result['raw_output']}")
            print("=" * 50)
            
            return result
            
        except Exception as e:
            print(f"Prediction error: {e}")
            import traceback
            traceback.print_exc()
            raise


# Singleton instance for the model
_classifier_instance = None

def get_classifier():
    """Get or create the singleton classifier instance"""
    global _classifier_instance
    if _classifier_instance is None:
        _classifier_instance = MalignantBenignClassifier()
    return _classifier_instance


def predict_malignant_benign(image):
    """
    Convenience function to predict malignant/benign
    Args:
        image: PIL Image or numpy array
    Returns:
        dict with prediction results
    """
    classifier = get_classifier()
    return classifier.predict(image)
