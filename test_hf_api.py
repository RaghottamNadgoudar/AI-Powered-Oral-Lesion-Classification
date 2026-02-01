"""Test HuggingFace Space API - try different approaches"""
from gradio_client import Client

print("Connecting...")
client = Client("Praneel12/oral-lesion-tflite")
print("Connected!")

# Try positional argument instead of keyword
print("\nTrying positional argument...")
try:
    from gradio_client import handle_file
    result = client.predict(handle_file("1_benig.jpg"), api_name="/predict")
    print("SUCCESS!")
    print(f"Result: {result}")
except Exception as e:
    print(f"Error: {e}")
