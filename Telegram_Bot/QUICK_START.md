# ⚡ Telegram Bot Quick Start Checklist

Use this checklist to quickly set up your Telegram bot. For detailed instructions, see [TELEGRAM_BOT_SETUP.md](./TELEGRAM_BOT_SETUP.md).

---

## ☐ Step 1: Create Telegram Bot (5 minutes)

- [ ] Open Telegram and search for `@BotFather`
- [ ] Send `/newbot` command
- [ ] Choose bot name (e.g., `Oral Lesion Classifier Bot`)
- [ ] Choose username (must end with `bot`, e.g., `oral_lesion_ai_bot`)
- [ ] **Copy and save the bot token** (looks like: `1234567890:ABC...`)

---

## ☐ Step 2: Deploy TFLite Model to HuggingFace (10 minutes)

- [ ] Go to [huggingface.co](https://huggingface.co) and log in
- [ ] Click "New Space"
- [ ] Name: `oral-lesion-tflite`, SDK: `Gradio`
- [ ] Upload files from `HF_TFLite_Space/` folder:
  - [ ] `app.py`
  - [ ] `requirements.txt`
  - [ ] `README.md`
  - [ ] `malignant_benign.tflite`
- [ ] Wait for build to complete (check Logs tab)
- [ ] **Copy Space URL** (format: `your-username/oral-lesion-tflite`)
- [ ] Test by uploading an image

---

## ☐ Step 3: Configure Bot Environment (2 minutes)

Edit the `.env` file in `Telegram_Bot/` directory:

```env
# Replace these values:
TELEGRAM_BOT_TOKEN=<paste token from Step 1>
GROQ_API_KEY=gsk_MHXm6dzDzVKrS9mWGdyb3FYiCEFdQnX3VQuEwkTdPU6UpYj
HF_CLIP_SPACE_URL=Praneel12/oral-health-classifier
HF_TFLITE_SPACE_URL=<your-username>/oral-lesion-tflite
```

- [ ] Filled in `TELEGRAM_BOT_TOKEN`
- [ ] Verified `GROQ_API_KEY` is correct
- [ ] Verified `HF_CLIP_SPACE_URL` is `Praneel12/oral-health-classifier`
- [ ] Updated `HF_TFLITE_SPACE_URL` with your HuggingFace username

---

## ☐ Step 4: Install Dependencies (3 minutes)

```bash
cd Telegram_Bot
pip install -r requirements.txt
```

- [ ] All packages installed successfully
- [ ] No error messages

---

## ☐ Step 5: Test Bot Locally (5 minutes)

```bash
python bot.py
```

**Expected output:**
```
INFO - Bot is starting...
INFO - CLIP client initialized successfully
INFO - TFLite client initialized successfully
```

- [ ] Bot starts without errors
- [ ] Search for your bot on Telegram (e.g., `@oral_lesion_ai_bot`)
- [ ] Send `/start` command
- [ ] See welcome message with buttons
- [ ] Click "📸 Analyze Lesion"
- [ ] Send a test image
- [ ] Receive analysis results (Level 1 + Level 2 + AI suggestions)

---

## ☐ Step 6: Deploy to Cloud (Optional, 15 minutes)

Choose one deployment option to run your bot 24/7:

### Option A: Render.com (Recommended)
- [ ] Create account at [render.com](https://render.com)
- [ ] Create new "Web Service"
- [ ] Connect GitHub repository
- [ ] Set build command: `pip install -r requirements.txt`
- [ ] Set start command: `python bot.py`
- [ ] Add environment variables from `.env`
- [ ] Deploy and wait for build

### Option B: Railway.app
- [ ] Create account at [railway.app](https://railway.app)
- [ ] Deploy from GitHub repo
- [ ] Add environment variables
- [ ] Deploy

### Option C: VPS
- [ ] SSH into server
- [ ] Clone repository
- [ ] Install Python 3.8+
- [ ] Install dependencies
- [ ] Run with `screen` or `systemd`

---

## ✅ Verification Checklist

Test these features to ensure everything works:

- [ ] Bot responds to `/start`
- [ ] Bot responds to `/help`
- [ ] Can send images to bot
- [ ] Level 1 classification works (Healthy/Unhealthy via CLIP)
- [ ] Level 2 classification works (Benign/Malignant via TFLite) for unhealthy images
- [ ] GROQ AI suggestions are generated
- [ ] Results display properly formatted
- [ ] Medical disclaimer appears
- [ ] "Analyze Another" button works
- [ ] `/cancel` command works

---

## 🎯 Your Endpoints Configuration

Once setup is complete, your bot uses:

| Component | Endpoint/Model | Status |
|-----------|---------------|--------|
| **Level 1 Classifier** | `Praneel12/oral-health-classifier` | ✅ Already deployed |
| **Level 2 Classifier** | `YOUR_USERNAME/oral-lesion-tflite` | ⏳ Deploy in Step 2 |
| **AI Suggestions** | GROQ `llama-3.3-70b-versatile` | ✅ API key ready |
| **Bot Platform** | Telegram | ⏳ Create in Step 1 |

---

## 🆘 Common Issues

### Bot not responding?
- ✅ Check bot token in `.env` is correct
- ✅ Make sure `python bot.py` is running
- ✅ Search for exact bot username on Telegram

### HuggingFace errors?
- ✅ Verify Space URL format: `username/space-name` (no https://)
- ✅ Check Space is built and running (visit in browser)
- ✅ Space may be sleeping (first request takes 30s)

### No AI suggestions?
- ✅ Check GROQ API key is correct
- ✅ Verify no typos in `.env` file
- ✅ Check internet connection

---

## 📚 Full Documentation

For detailed explanations, see:
- [TELEGRAM_BOT_SETUP.md](./TELEGRAM_BOT_SETUP.md) - Complete step-by-step guide
- [README.md](./README.md) - Bot features and usage
- [../DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) - Deployment options

---

## ⏱️ Estimated Time

- **Minimum setup (local testing):** 25 minutes
- **With cloud deployment:** 40 minutes
- **With customization (bot picture, commands):** 50 minutes

---

## 🎉 Success!

Once all checkboxes are complete, your bot is:
- ✅ Accessible 24/7 on Telegram
- ✅ Performing two-level AI classification
- ✅ Generating personalized health suggestions
- ✅ Ready to help users analyze oral lesions

**Share your bot with colleagues and get feedback!**
