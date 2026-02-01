# 🚀 Deployment Guide

This guide covers deploying both the HuggingFace Spaces TFLite model and the Telegram Bot.

## Part 1: Deploy TFLite Model to HuggingFace Spaces

### Step 1: Create HuggingFace Account
1. Go to [HuggingFace.co](https://huggingface.co)
2. Sign up or log in
3. Verify your email

### Step 2: Create a New Space
1. Click on your profile → "New Space"
2. Fill in the details:
   - **Space name:** `oral-lesion-malignant-benign` (or your preferred name)
   - **License:** MIT
   - **SDK:** Gradio
   - **Visibility:** Public
3. Click "Create Space"

### Step 3: Upload Files
You have two options:

#### Option A: Web Interface
1. In your Space, click "Files" tab
2. Click "Add file" → "Upload files"
3. Upload these files from `HF_TFLite_Space` folder:
   - `app.py`
   - `requirements.txt`
   - `README.md`
   - `malignant_benign.tflite`
4. Commit the changes

#### Option B: Git (Recommended)
```bash
# Navigate to HF_TFLite_Space folder
cd HF_TFLite_Space

# Clone your space
git clone https://huggingface.co/spaces/YOUR_USERNAME/oral-lesion-malignant-benign
cd oral-lesion-malignant-benign

# Copy files
cp ../app.py .
cp ../requirements.txt .
cp ../README.md .
cp ../malignant_benign.tflite .

# Commit and push
git add .
git commit -m "Initial commit: TFLite oral lesion classifier"
git push
```

### Step 4: Wait for Build
- HuggingFace will automatically build your Space
- This takes 2-5 minutes
- Check the "Logs" tab for build status
- Once complete, your app will be live!

### Step 5: Test Your Space
1. Visit your Space URL: `https://huggingface.co/spaces/YOUR_USERNAME/oral-lesion-malignant-benign`
2. Upload a test image
3. Verify the classification works
4. Copy the Space URL for Telegram bot setup

---

## Part 2: Set Up Telegram Bot

### Step 1: Create Telegram Bot
1. Open Telegram and search for `@BotFather`
2. Start a chat and send `/newbot`
3. Choose a name: `Oral Lesion Classifier Bot` (or your preferred name)
4. Choose a username: `oral_lesion_bot` (must end with 'bot')
5. Copy the bot token provided (looks like `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Step 2: Get GROQ API Key
1. Go to [GROQ Console](https://console.groq.com/keys)
2. Sign up or log in with your account
3. Click "Create API Key"
4. Copy the key

### Step 3: Configure Environment Variables
1. Navigate to the `Telegram_Bot` folder
2. Copy `.env.example` to `.env`:
   ```bash
   cd Telegram_Bot
   cp .env.example .env
   ```
3. Edit `.env` file and fill in your credentials:
   ```env
   TELEGRAM_BOT_TOKEN=your_bot_token_from_step1
   GROQ_API_KEY=your_groq_api_key
   HF_CLIP_SPACE_URL=Praneel12/oral-health-classifier
   HF_TFLITE_SPACE_URL=YOUR_USERNAME/oral-lesion-malignant-benign
   ```

### Step 4: Install Dependencies
```bash
# Make sure you're in Telegram_Bot folder
cd Telegram_Bot

# Install required packages
pip install -r requirements.txt
```

### Step 5: Test Locally
```bash
# Run the bot
python bot.py
```

You should see:
```
INFO - Bot is starting...
INFO - CLIP client initialized successfully
INFO - TFLite client initialized successfully
```

### Step 6: Test on Telegram
1. Open Telegram
2. Search for your bot username (e.g., `@oral_lesion_bot`)
3. Click "Start"
4. Click "Analyze Lesion"
5. Send a test image
6. Verify you receive results

---

## Part 3: Deploy Telegram Bot to Cloud

Once tested locally, deploy your bot so it runs 24/7.

### Option 1: Render (Free - Recommended)

1. **Create Account**
   - Go to [Render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Or use Render's upload feature

3. **Configure Service**
   ```yaml
   Name: oral-lesion-telegram-bot
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: python bot.py
   ```

4. **Add Environment Variables**
   - Go to "Environment" tab
   - Add each variable from your `.env` file:
     - `TELEGRAM_BOT_TOKEN`
     - `GROQ_API_KEY`
     - `HF_CLIP_SPACE_URL`
     - `HF_TFLITE_SPACE_URL`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (3-5 minutes)
   - Bot will start automatically!

### Option 2: Railway.app (Free Tier)

1. **Create Account** at [Railway.app](https://railway.app)
2. **New Project** → "Deploy from GitHub repo"
3. **Select** `Telegram_Bot` folder
4. **Add Environment Variables** in the dashboard
5. **Deploy** - automatically starts!

### Option 3: Heroku

```bash
# Install Heroku CLI first
heroku login
heroku create oral-lesion-bot

# Set environment variables
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set GROQ_API_KEY=your_key
heroku config:set HF_CLIP_SPACE_URL=Praneel12/oral-health-classifier
heroku config:set HF_TFLITE_SPACE_URL=YOUR_USERNAME/oral-lesion-malignant-benign

# Create Procfile
echo "worker: python bot.py" > Procfile

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# Scale worker
heroku ps:scale worker=1
```

### Option 4: VPS (DigitalOcean, AWS, etc.)

```bash
# SSH into your VPS
ssh user@your-server-ip

# Install Python and dependencies
sudo apt update
sudo apt install python3 python3-pip

# Clone your code
git clone your-repo-url
cd Telegram_Bot

# Install dependencies
pip3 install -r requirements.txt

# Create .env file
nano .env
# Paste your environment variables

# Run with screen (keeps running after logout)
screen -S telegram-bot
python3 bot.py
# Press Ctrl+A, then D to detach

# Or use systemd (recommended for production)
sudo nano /etc/systemd/system/telegram-bot.service
```

**Systemd service file:**
```ini
[Unit]
Description=Oral Lesion Telegram Bot
After=network.target

[Service]
User=your_username
WorkingDirectory=/path/to/Telegram_Bot
Environment="PATH=/usr/local/bin:/usr/bin"
EnvironmentFile=/path/to/Telegram_Bot/.env
ExecStart=/usr/bin/python3 /path/to/Telegram_Bot/bot.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable telegram-bot
sudo systemctl start telegram-bot
sudo systemctl status telegram-bot
```

---

## 📊 Monitoring and Logs

### Check Bot Status
```bash
# If using systemd
sudo systemctl status telegram-bot

# If using screen
screen -r telegram-bot

# Check logs
tail -f /var/log/syslog | grep telegram
```

### HuggingFace Spaces Logs
1. Go to your Space
2. Click "Logs" tab
3. Monitor for errors

---

## 🔧 Troubleshooting

### Bot Not Responding
- ✅ Check bot token is correct
- ✅ Verify bot is running (check logs)
- ✅ Ensure internet connection is stable
- ✅ Test with @BotFather using `/mybots` → your bot → "Test"

### HuggingFace API Errors
- ✅ Verify Space URLs are correct
- ✅ Check if Spaces are "Running" (not sleeping)
- ✅ Test Spaces individually in browser
- ✅ Spaces sleep after inactivity - first request may be slow

### GROQ API Errors
- ✅ Check API key is valid
- ✅ Verify you have remaining credits
- ✅ Check [GROQ Console](https://console.groq.com) for usage limits

### Image Processing Fails
- ✅ Ensure image is JPG/PNG format
- ✅ Check image size (< 5MB recommended)
- ✅ Verify image is clear and well-lit

---

## 🎉 Success Checklist

- [ ] HuggingFace TFLite Space is deployed and running
- [ ] CLIP Space is accessible
- [ ] Telegram bot responds to `/start`
- [ ] Bot can receive images
- [ ] Level 1 classification works (Healthy/Unhealthy)
- [ ] Level 2 classification works (Benign/Malignant)
- [ ] GROQ AI suggestions are generated
- [ ] Bot is deployed to cloud (24/7 operation)

---

## 📞 Need Help?

- **HuggingFace:** [Community Forum](https://discuss.huggingface.co/)
- **Telegram Bots:** [Bot API Docs](https://core.telegram.org/bots/api)
- **GROQ API:** [Documentation](https://console.groq.com/docs)

---

**Congratulations! 🎊** Your oral lesion classification system is now live on both HuggingFace Spaces and Telegram!
