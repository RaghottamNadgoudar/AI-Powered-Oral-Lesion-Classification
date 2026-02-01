# 📱 Complete Telegram Bot Setup Guide

A step-by-step guide to create and configure your Oral Lesion Classification Telegram Bot with HuggingFace Spaces integration.

---

## 📋 Prerequisites

Before starting, make sure you have:
- [ ] A Telegram account
- [ ] GROQ API key (you already have this!)
- [ ] HuggingFace account (for deploying the TFLite model)
- [ ] Python 3.8+ installed on your computer

---

## Part 1: Create Your Telegram Bot

### Step 1: Open Telegram and Find BotFather

1. Open Telegram on your phone or desktop
2. In the search bar, type: `@BotFather`
3. Click on the official BotFather (verified with a blue checkmark)
4. Click **"START"** or send `/start`

### Step 2: Create a New Bot

1. Send the command: `/newbot`

2. BotFather will ask: **"Alright, a new bot. How are we going to call it?"**
   - Choose a display name (can contain spaces)
   - Example: `Oral Lesion Classifier Bot`
   - Type it and press Enter

3. BotFather will ask: **"Good. Now let's choose a username for your bot."**
   - Username must:
     - End with `bot`
     - Be unique
     - Contain no spaces
   - Example: `oral_lesion_ai_bot` or `my_oral_health_bot`
   - Type it and press Enter

### Step 3: Save Your Bot Token

If successful, BotFather will send a message like:

```
Done! Congratulations on your new bot. You will find it at 
t.me/oral_lesion_ai_bot. You can now add a description...

Use this token to access the HTTP API:
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz-123456789

For a description of the Bot API, see this page: 
https://core.telegram.org/bots/api
```

**IMPORTANT:** Copy the token (the long string with numbers and letters)
- This is your `TELEGRAM_BOT_TOKEN`
- Keep it secret!
- You'll need it in Step 7

### Step 4: Customize Your Bot (Optional)

You can enhance your bot with:

1. **Set Description** (shown when users start the bot):
   ```
   /setdescription
   ```
   Then send:
   ```
   AI-powered oral lesion classification bot. Upload images for instant analysis using advanced deep learning models.
   ```

2. **Set About Text** (shown in bot profile):
   ```
   /setabouttext
   ```
   Then send:
   ```
   Two-level AI classification: Healthy/Unhealthy + Benign/Malignant. Powered by CLIP, TFLite, and GROQ AI.
   ```

3. **Set Profile Picture**:
   ```
   /setuserpic
   ```
   Then upload an image (you can use a medical/health-related icon)

4. **Set Commands** (helps users discover features):
   ```
   /setcommands
   ```
   Then send:
   ```
   start - Start the bot and see main menu
   help - Get help and usage instructions
   cancel - Cancel current operation
   ```

---

## Part 2: Deploy TFLite Model to HuggingFace Spaces

You need to deploy your TFLite model before the bot can use it.

### Step 5: Deploy to HuggingFace Spaces

#### Option A: Web Upload (Easiest)

1. **Go to HuggingFace:**
   - Visit [huggingface.co](https://huggingface.co)
   - Sign up or log in

2. **Create a New Space:**
   - Click your profile → "New Space"
   - **Name:** `oral-lesion-tflite`
   - **License:** MIT
   - **SDK:** Gradio
   - **Hardware:** CPU (free)
   - Click "Create Space"

3. **Upload Files:**
   - Click "Files" tab → "Add file" → "Upload files"
   - Upload ALL files from `HF_TFLite_Space` folder:
     - ✅ `app.py`
     - ✅ `requirements.txt`
     - ✅ `README.md`
     - ✅ `malignant_benign.tflite`
   - Add commit message: "Initial deployment"
   - Click "Commit changes"

4. **Wait for Build:**
   - Watch the "Logs" tab
   - Build takes 2-5 minutes
   - When you see "Running on public URL", it's ready!

5. **Copy Your Space URL:**
   - Your URL will be: `https://huggingface.co/spaces/YOUR_USERNAME/oral-lesion-tflite`
   - You'll need this for the bot configuration

#### Option B: Git Upload (Advanced)

```bash
cd HF_TFLite_Space

# Clone your space
git clone https://huggingface.co/spaces/YOUR_USERNAME/oral-lesion-tflite
cd oral-lesion-tflite

# Copy files
cp ../app.py .
cp ../requirements.txt .
cp ../README.md .
cp ../malignant_benign.tflite .

# Commit and push
git add .
git commit -m "Initial deployment of TFLite classifier"
git push
```

### Step 6: Test Your HuggingFace Space

1. Go to your Space URL
2. Upload a test image
3. Verify classification works
4. You should see: Benign or Malignant result with confidence

---

## Part 3: Configure the Telegram Bot

### Step 7: Set Up Environment Variables

1. **Navigate to Telegram_Bot folder:**
   ```bash
   cd Telegram_Bot
   ```

2. **Open the `.env` file** (it already exists in your folder)

3. **Fill in ALL the values:**

   ```env
   # Telegram Bot Configuration
   # Get your bot token from @BotFather on Telegram
   TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz-123456789
   
   # GROQ API key for AI suggestions (already have this!)
   GROQ_API_KEY=gsk_MHXm6dzDzVKrS9mWGdyb3FYiCEFdQnX3VQuEwkTdPU6UpYj
   
   # HuggingFace Space URLs
   HF_CLIP_SPACE_URL=Praneel12/oral-health-classifier
   HF_TFLITE_SPACE_URL=YOUR_USERNAME/oral-lesion-tflite
   ```

4. **Replace the placeholders:**
   - `TELEGRAM_BOT_TOKEN`: Paste the token from Step 3
   - `GROQ_API_KEY`: Already filled in (your GROQ key)
   - `HF_CLIP_SPACE_URL`: Already correct (Praneel12/oral-health-classifier)
   - `HF_TFLITE_SPACE_URL`: Replace `YOUR_USERNAME` with your HuggingFace username
     - Example: `raghottam/oral-lesion-tflite`

5. **Save the file**

### Step 8: Install Bot Dependencies

```bash
# Make sure you're in Telegram_Bot directory
cd Telegram_Bot

# Install required packages
pip install -r requirements.txt
```

You should see installations for:
- ✅ python-telegram-bot
- ✅ groq
- ✅ gradio_client
- ✅ pillow
- ✅ requests
- ✅ python-dotenv

---

## Part 4: Test Your Bot Locally

### Step 9: Run the Bot

1. **Start the bot:**
   ```bash
   python bot.py
   ```

2. **You should see:**
   ```
   INFO - Bot is starting...
   INFO - CLIP client initialized successfully
   INFO - TFLite client initialized successfully
   ```

3. **If you see errors:**
   - Check your `.env` file has all values filled
   - Verify HuggingFace Spaces are running (not sleeping)
   - Make sure your bot token is correct

### Step 10: Test on Telegram

1. **Open Telegram** on your phone

2. **Search for your bot:**
   - Type `@your_bot_username` in search
   - Example: `@oral_lesion_ai_bot`

3. **Start the bot:**
   - Click on your bot
   - Press the **"START"** button
   - You should see the welcome message with buttons

4. **Test the analysis:**
   - Click "📸 Analyze Lesion"
   - Send a photo of an oral lesion
   - Wait 10-30 seconds
   - You should receive:
     - ✅ Level 1 classification (Healthy/Unhealthy)
     - ✅ Level 2 classification (if unhealthy: Benign/Malignant)
     - ✅ GROQ AI suggestions
     - ✅ Medical disclaimer

### Step 11: Verify the Full Pipeline

**Test Flow:**

1. **Send `/start`** → Should show welcome menu
2. **Click "Analyze Lesion"** → Bot asks for image
3. **Send image** → Bot shows "Processing..."
4. **Wait for results** → Should show:
   ```
   📊 Analysis Results
   
   Level 1: Initial Screening
   • Classification: UNHEALTHY
   • Confidence: 84.3%
   
   Level 2: Detailed Analysis
   • Classification: BENIGN
   • Confidence: 72.5%
   
   🤖 AI Health Suggestions
   
   1. Professional Evaluation: Get examined by...
   2. Monitor Changes: Watch for size or...
   3. Gentle Care: Use a soft toothbrush...
   4. Stay Informed: Learn about benign...
   
   ⚠️ IMPORTANT DISCLAIMER
   This is an AI prediction for educational purposes only...
   ```

5. **Click "Analyze Another"** → Should restart process

---

## Part 5: Deploy Bot to Cloud (24/7 Operation)

Your bot currently only works when `python bot.py` is running on your computer. To make it available 24/7, deploy to a cloud service.

### Option 1: Render.com (Recommended - Free)

1. **Create Account:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Prepare Files:**
   - Make sure your code is in a GitHub repository
   - Ensure `.env` is in `.gitignore` (it already is)

3. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Select the repository
   - **Root Directory:** Leave blank or set to `Telegram_Bot`

4. **Configure:**
   ```
   Name: oral-lesion-telegram-bot
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: python bot.py
   ```

5. **Add Environment Variables:**
   - Go to "Environment" tab
   - Click "Add Environment Variable"
   - Add each variable from your `.env`:
     ```
     TELEGRAM_BOT_TOKEN = your_token_here
     GROQ_API_KEY = gsk_MHXm6dzDzVKrS9mWGdyb3FYiCEFdQnX3VQuEwkTdPU6UpYj
     HF_CLIP_SPACE_URL = Praneel12/oral-health-classifier
     HF_TFLITE_SPACE_URL = YOUR_USERNAME/oral-lesion-tflite
     ```

6. **Deploy:**
   - Click "Create Web Service"
   - Wait 3-5 minutes
   - Bot will start automatically!

### Option 2: Railway.app (Alternative - Free)

1. Visit [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables in dashboard
5. Deploy!

### Option 3: Run on VPS (DigitalOcean, AWS, etc.)

```bash
# SSH into your server
ssh user@your-server-ip

# Install Python and dependencies
sudo apt update
sudo apt install python3 python3-pip git

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
```

---

## 🎯 Complete Configuration Summary

### Your Configuration Should Look Like:

**`.env` file:**
```env
TELEGRAM_BOT_TOKEN=<from @BotFather>
GROQ_API_KEY=gsk_MHXm6dzDzVKrS9mWGdyb3FYiCEFdQnX3VQuEwkTdPU6UpYj
HF_CLIP_SPACE_URL=Praneel12/oral-health-classifier
HF_TFLITE_SPACE_URL=<your-username>/oral-lesion-tflite
```

### Endpoints Being Used:

| Level | Model | Endpoint |
|-------|-------|----------|
| Level 1 | CLIP Classifier | `Praneel12/oral-health-classifier` |
| Level 2 | TFLite Classifier | `YOUR_USERNAME/oral-lesion-tflite` |
| AI Suggestions | GROQ Llama 3.3 | `llama-3.3-70b-versatile` |

---

## 🔧 Troubleshooting

### Bot Not Responding

**Check 1: Bot Token**
- Verify token in `.env` is correct
- No extra spaces before/after token
- Token starts with numbers, contains a colon

**Check 2: Bot is Running**
```bash
# Check if bot.py is running
python bot.py
# Should see "Bot is starting..."
```

**Check 3: Bot Name**
- Search for exact username (e.g., `@oral_lesion_ai_bot`)
- Check spelling

### HuggingFace API Errors

**Error: "Space not found"**
- ✅ Check Space URL in `.env` is correct
- ✅ Format: `username/space-name` (no https://)
- ✅ Example: `raghottam/oral-lesion-tflite`

**Error: "Space is sleeping"**
- ✅ HuggingFace free Spaces sleep after inactivity
- ✅ First request may take 30-60 seconds to wake up
- ✅ Visit Space URL in browser to wake it
- ✅ For 24/7 uptime, upgrade to paid tier ($9/month)

**Error: "Model loading failed"**
- ✅ Check `malignant_benign.tflite` file uploaded to Space
- ✅ Verify Space build completed successfully
- ✅ Check Logs tab for errors

### GROQ API Errors

**Error: "Invalid API key"**
- ✅ Verify GROQ key is correct: `gsk_MHXm6dzDzVKrS9mWGdyb3FYiCEFdQnX3VQuEwkTdPU6UpYj`
- ✅ Check for typos or extra characters

**Error: "Rate limit exceeded"**
- ✅ Wait a few minutes
- ✅ GROQ has generous limits, this is rare
- ✅ Check usage at [console.groq.com](https://console.groq.com)

---

## ✅ Success Checklist

- [ ] Created bot with @BotFather
- [ ] Received and saved bot token
- [ ] Deployed TFLite model to HuggingFace Spaces
- [ ] Tested HuggingFace Space manually
- [ ] Filled in all `.env` variables
- [ ] Installed Python dependencies
- [ ] Ran `python bot.py` successfully
- [ ] Bot responds to `/start` on Telegram
- [ ] Successfully analyzed a test image
- [ ] Received Level 1 classification
- [ ] Received Level 2 classification (if unhealthy)
- [ ] GROQ AI suggestions generated
- [ ] Deployed to cloud (optional but recommended)

---

## 📞 Getting Help

### If Bot Still Not Working:

1. **Check Logs:**
   ```bash
   python bot.py
   # Read the console output for errors
   ```

2. **Verify Environment:**
   ```bash
   # Print environment variables (for debugging)
   python -c "from dotenv import load_dotenv; import os; load_dotenv(); print('Token:', os.getenv('TELEGRAM_BOT_TOKEN')[:20]+'...'); print('GROQ:', os.getenv('GROQ_API_KEY')[:20]+'...'); print('CLIP:', os.getenv('HF_CLIP_SPACE_URL')); print('TFLite:', os.getenv('HF_TFLITE_SPACE_URL'))"
   ```

3. **Test Individual Components:**
   - Test CLIP Space: Visit `https://huggingface.co/spaces/Praneel12/oral-health-classifier`
   - Test TFLite Space: Visit your deployed Space URL
   - Test GROQ: Check [console.groq.com](https://console.groq.com)

---

## 🎉 Congratulations!

Your Telegram bot should now be:
- ✅ Accepting image uploads
- ✅ Performing two-level AI classification
- ✅ Generating personalized health suggestions
- ✅ Providing medical disclaimers
- ✅ Running 24/7 (if deployed to cloud)

**Share your bot** with friends and colleagues to get feedback!

**Remember:** This is for educational purposes only. Always advise users to consult healthcare professionals for proper medical diagnosis.
