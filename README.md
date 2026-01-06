 # 🔬 AI-Powered Oral Lesion Classification

An intelligent web application for oral lesion classification using a two-level AI pipeline. The system first determines if a lesion is **healthy or unhealthy**, and if unhealthy, further classifies it as **malignant or benign**.

![OralScan AI](https://img.shields.io/badge/OralScan-AI-red?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Flask](https://img.shields.io/badge/Flask-3.0-green?style=flat-square&logo=flask)
![TensorFlow](https://img.shields.io/badge/TensorFlow-Lite-orange?style=flat-square&logo=tensorflow)

## 🎯 Features

- **Two-Level Classification Pipeline**
  - Level 1: Healthy vs Unhealthy (Hugging Face Spaces API)
  - Level 2: Malignant vs Benign (Local TFLite Model)
  
- **Modern UI/UX**
  - Netflix-inspired dark theme
  - Drag & drop image upload
  - Real-time loading states
  - Color-coded results
  
- **Full Stack Architecture**
  - React.js + Tailwind CSS frontend
  - Flask backend with REST API
  - TensorFlow Lite for on-device inference

## 📁 Project Structure

```
AI-Powered-Oral-Lesion-Classification/
├── backend/
│   ├── app.py                    # Flask application
│   ├── requirements.txt          # Python dependencies
│   ├── models/
│   │   └── malignant_benign.tflite
│   └── utils/
│       └── model_handler.py      # TFLite inference
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ImageUploader.jsx
│   │   │   └── ResultCard.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   └── AnalysisPage.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv myenv

# Activate virtual environment
# Windows:
.\myenv\Scripts\activate
# macOS/Linux:
source myenv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
```

The backend will start at `http://localhost:5000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start at `http://localhost:5173`

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/classify` | POST | Full two-level classification |
| `/api/classify/level2` | POST | Direct malignant/benign classification |

### Example Request

```bash
curl -X POST http://localhost:5000/api/classify \
  -F "image=@path/to/image.jpg"
```

### Example Response

```json
{
  "success": true,
  "level1": {
    "classification": "unhealthy",
    "confidence": 84.37,
    "is_healthy": false,
    "healthy_confidence": 15.63,
    "unhealthy_confidence": 84.37
  },
  "level2": {
    "classification": "benign",
    "confidence": 72.5,
    "is_malignant": false
  },
  "final_result": "benign"
}
```

## 🤖 Models

### Level 1: Healthy vs Unhealthy
- Hosted on [Hugging Face Spaces](https://huggingface.co/spaces/Praneel12/oral-health-classifier)
- API: `Praneel12/oral-health-classifier`

### Level 2: Malignant vs Benign
- TensorFlow Lite model
- Input: 304x304x3 RGB image
- Output: [benign_prob, malignant_prob]

## 🛠️ Technologies

**Frontend:**
- React.js 18
- Tailwind CSS
- React Router DOM
- Axios

**Backend:**
- Flask 3.0
- Flask-CORS
- TensorFlow Lite
- Gradio Client
- Pillow

## ⚠️ Disclaimer

This application is for **educational and research purposes only**. It should NOT be used as a substitute for professional medical diagnosis. Always consult with qualified healthcare providers for proper evaluation of oral lesions.

## 📄 License

MIT License

## 👥 Contributors

- Built with ❤️ for oral health awareness
