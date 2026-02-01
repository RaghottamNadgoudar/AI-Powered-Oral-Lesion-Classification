# 🚀 Frontend Setup Instructions

## Prerequisites

Before running the frontend, you need to obtain a GROQ API key.

## Getting GROQ API Key

1. Visit [GROQ Console](https://console.groq.com/keys)
2. Sign up or log in with your account
3. Click "Create API Key"
4. Copy the API key

## Environment Setup

1. **Create `.env` file** in the `frontend` directory:
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. **Edit `.env` file** and add your GROQ API key:
   ```env
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```
   
   > ⚠️ **Important:** Vite requires environment variables to be prefixed with `VITE_` to be accessible in the frontend code.

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variable:
   - Key: `VITE_GROQ_API_KEY`
   - Value: Your GROQ API key
4. Deploy

### Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Environment variable: `VITE_GROQ_API_KEY`

## Features Using GROQ API

The frontend uses GROQ's Llama 3.3 70B model to generate:
- Personalized oral health suggestions
- Context-aware recommendations based on analysis results
- Fast, reliable AI-powered insights

## Troubleshooting

### GROQ API Not Working
- ✅ Check that `.env` file exists in the `frontend` directory
- ✅ Verify the variable is named `VITE_GROQ_API_KEY` (with VITE_ prefix)
- ✅ Restart the dev server after changing `.env`
- ✅ Check browser console for errors

### "dangerouslyAllowBrowser" Warning
This is expected when using GROQ SDK in the browser. The setting is required for client-side usage.

## API Rate Limits

GROQ offers generous rate limits on their free tier:
- Multiple requests per second
- High token limits
- Fast response times

For production usage with high traffic, consider implementing:
- Request caching
- Rate limiting on client side
- Fallback to default suggestions if API fails
