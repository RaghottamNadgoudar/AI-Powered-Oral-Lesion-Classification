# 🤖 Telegram Bot for Oral Lesion Classification

A Telegram bot that provides AI-powered oral lesion classification using a two-level analysis pipeline.

## 🎯 Features

- **Two-Level AI Classification**
  - Level 1: Healthy vs Unhealthy (CLIP Model)
  - Level 2: Malignant vs Benign (TFLite Model)
- **AI-Powered Suggestions** using GROQ (Llama 3.3 70B)
- **Interactive Inline Keyboards** for easy navigation
- **Real-time Image Analysis** via HuggingFace Spaces APIs
- **Medical Disclaimers** for responsible usage

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- Telegram account
- GROQ API key
- HuggingFace Spaces deployed (CLIP and TFLite models)

### Installation

1. **Clone the repository**
   ```bash
   cd Telegram_Bot
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   
   Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and fill in your credentials:
   ```env
   TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
   GROQ_API_KEY=your_groq_api_key
   HF_CLIP_SPACE_URL=Praneel12/oral-health-classifier
   HF_TFLITE_SPACE_URL=YOUR_USERNAME/oral-lesion-malignant-benign
   ```

4. **Run the bot**
   ```bash
   python bot.py
   ```

## 🔧 Getting Bot Token

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow the prompts to create your bot
4. Copy the bot token provided
5. Paste it in your `.env` file

## 🔑 Getting GROQ API Key

1. Go to [GROQ Console](https://console.groq.com/keys)
2. Sign up or log in
3. Click "Create API Key"
4. Copy the key and paste it in your `.env` file

## 📱 How to Use the Bot

1. **Start the bot** - Search for your bot on Telegram and click "Start"
2. **Click "Analyze Lesion"** - Begin the analysis process
3. **Send an image** - Upload a clear photo of the oral lesion
4. **Review results** - Get AI classification and health suggestions
5. **Consult a doctor** - Always follow up with healthcare professionals

## 🧠 Classification Pipeline

```
Image Upload
    ↓
Level 1: CLIP Model (HuggingFace)
    ├─→ Healthy → End with suggestions
    └─→ Unhealthy → Continue to Level 2
            ↓
    Level 2: TFLite Model (HuggingFace)
        ├─→ Benign
        └─→ Malignant
            ↓
    GROQ AI Suggestions (Llama 3.3 70B)
```

## 📊 Bot Commands

| Command | Description |
|---------|-------------|
| `/start` | Start the bot and show main menu |
| `/help` | Display help information |
| `/cancel` | Cancel current operation |

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TELEGRAM_BOT_TOKEN` | Bot token from @BotFather | ✅ Yes |
| `GROQ_API_KEY` | GROQ API key from console.groq.com | ✅ Yes |
| `HF_CLIP_SPACE_URL` | HuggingFace CLIP model space | ✅ Yes |
| `HF_TFLITE_SPACE_URL` | HuggingFace TFLite model space | ✅ Yes |

## 🌐 Deployment Options

### Option 1: Run Locally
```bash
python bot.py
```

### Option 2: Deploy to Cloud

**Heroku:**
```bash
# Install Heroku CLI
heroku create your-bot-name
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set GROQ_API_KEY=your_key
heroku config:set HF_CLIP_SPACE_URL=your_clip_url
heroku config:set HF_TFLITE_SPACE_URL=your_tflite_url
git push heroku main
```

**Railway.app:**
1. Connect your GitHub repo
2. Add environment variables in dashboard
3. Deploy automatically

**Render:**
1. Create a new Web Service
2. Connect GitHub repository
3. Add environment variables
4. Deploy

### Option 3: Use a VPS

Run the bot in a screen session or use systemd:

```bash
# Using screen
screen -S telegram-bot
python bot.py
# Press Ctrl+A, then D to detach
```

## 📝 Code Structure

```
Telegram_Bot/
├── bot.py              # Main bot application
├── requirements.txt    # Python dependencies
├── .env.example        # Environment template
├── README.md          # This file
└── .gitignore         # Git ignore file
```

## ⚠️ Medical Disclaimer

**IMPORTANT:** This bot is for **educational and research purposes only**. 

- Results are AI predictions and may not be accurate
- Always consult qualified healthcare professionals
- Do not use this as the sole basis for medical decisions
- Seek immediate medical attention for serious concerns

## 🐛 Troubleshooting

### Bot not responding
- Check if `TELEGRAM_BOT_TOKEN` is correct
- Ensure the bot is running (`python bot.py`)
- Check internet connection

### API errors
- Verify HuggingFace Space URLs are correct
- Ensure your HF Spaces are running (not sleeping)
- Check GROQ API key is valid and has remaining credits

### Image processing fails
- Ensure image is clear and well-lit
- Try with a different image format (JPG recommended)
- Check HuggingFace Spaces are responding

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## 📄 License

MIT License - See LICENSE file for details

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Remember:** This is an AI assistant tool and should never replace professional medical judgment!
