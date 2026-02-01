# 🚀 Railway Deployment - Oral Lesion TFLite API

Simple REST API for classifying oral lesions as benign or malignant.

## Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API info |
| `/health` | GET | Health check |
| `/predict` | POST | Classify image |

## Usage

### File Upload
```bash
curl -X POST -F "image=@oral_lesion.jpg" https://your-app.railway.app/predict
```

### Base64 Image
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"image": "base64_encoded_image_here"}' \
  https://your-app.railway.app/predict
```

### Response
```json
{
  "success": true,
  "classification": "benign",
  "confidence": 87.5,
  "is_malignant": false
}
```

## Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select this repository or upload files
4. Railway will auto-detect Python and deploy
5. Your API will be live at `https://your-app.railway.app`

## Files

- `app.py` - Flask API
- `requirements.txt` - Python dependencies
- `Procfile` - Railway/Heroku start command
- `malignant_benign.tflite` - TFLite model
