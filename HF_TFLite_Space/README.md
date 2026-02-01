---
title: Oral Lesion Malignant/Benign Classifier
emoji: 🔬
colorFrom: red
colorTo: pink
sdk: docker
pinned: false
license: mit
---

# 🔬 Oral Lesion Classification: Malignant vs Benign

An AI-powered tool for classifying oral lesions as **benign** or **malignant** using a TensorFlow Lite deep learning model.

## 🎯 Features

- **Fast Classification:** Upload an image and get instant results
- **High Accuracy:** Uses a trained CNN model for classification
- **Detailed Explanations:** Get comprehensive recommendations based on results
- **User-Friendly Interface:** Simple drag-and-drop image upload

## 🚀 How to Use

1. Visit the application
2. Upload a clear image of an oral lesion
3. Click "Classify Lesion"
4. Review the classification results and recommendations

## 🧠 Model Information

- **Model Type:** TensorFlow Lite (TFLite)
- **Input Size:** 304x304 pixels (RGB)
- **Classes:** 
  - Benign
  - Malignant
- **Architecture:** Deep Convolutional Neural Network (CNN)
- **Framework:** TensorFlow 2.x

## 📊 API Usage

You can use this model programmatically via the Gradio Client:

```python
from gradio_client import Client

client = Client("YOUR_USERNAME/oral-lesion-malignant-benign")
result = client.predict(
    image="path/to/oral_lesion.jpg",
    api_name="/predict"
)
print(result)
```

## ⚠️ Medical Disclaimer

**IMPORTANT:** This application is for **educational and research purposes only**. It should NOT be used as a substitute for professional medical diagnosis.

- Always consult qualified healthcare providers for proper evaluation
- The AI predictions are probabilistic and may not be accurate in all cases
- Do not make medical decisions based solely on this tool's output
- If you have concerns about an oral lesion, seek immediate medical attention

## 🔗 Related Models

This model is part of a two-level classification pipeline:

- **Level 1:** [Healthy/Unhealthy Classifier](https://huggingface.co/spaces/Praneel12/oral-health-classifier) (CLIP-based)
- **Level 2:** This model - Malignant/Benign Classifier (TFLite-based)

## 📝 Citation

If you use this model in your research, please cite:

```bibtex
@misc{oral_lesion_classifier,
  title={AI-Powered Oral Lesion Classification},
  author={Your Name},
  year={2026},
  howpublished={\url{https://huggingface.co/spaces/YOUR_USERNAME/oral-lesion-malignant-benign}}
}
```

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

For questions or collaboration opportunities, please reach out through the discussion tab.

---

**Remember:** This is an AI tool to assist healthcare professionals and should never replace professional medical judgment.
