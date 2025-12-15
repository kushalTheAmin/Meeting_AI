# Quick Start Guide - Voice Notes AI

## 🚀 Get Running in 5 Minutes

### Step 1: Get Your API Keys (All Free!)

#### Groq API (Free, Unlimited)
1. Visit: https://console.groq.com
2. Sign up with Google/GitHub
3. Click "API Keys" → "Create API Key"
4. Copy your key

#### Google Gemini API (Free)
1. Visit: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Select "Create API key in new project"
4. Copy your key

#### Supabase (Free)
1. Visit: https://supabase.com
2. Sign up and create a new project
3. Wait 2 minutes for setup
4. Go to: Settings → API
5. Copy:
   - Project URL
   - anon/public key

### Step 2: Configure Environment

Edit `.env.local` with your real API keys:

```bash
# Replace these placeholder values with your actual API keys
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
```

### Step 3: Set Up Supabase Database

1. Go to your Supabase project
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Paste this SQL and click "Run":

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Recordings table
CREATE TABLE IF NOT EXISTS recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  transcript TEXT,
  summary JSONB,
  duration INTEGER,
  audio_url TEXT,
  template_used TEXT,
  metadata JSONB
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_recordings_created_at ON recordings(created_at DESC);

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('recordings', 'recordings', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy (public read access)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'recordings' );

-- Allow inserts
CREATE POLICY "Allow inserts"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'recordings' );
```

### Step 4: Run the App

```bash
# Start the development server
npm run dev
```

Open **http://localhost:3000** in your browser!

### Step 5: Test It Out

1. Click the microphone button
2. Allow microphone access
3. Say something like: "This is a test recording for my voice notes app. It should transcribe this and create a summary."
4. Click stop
5. Select "Voice Memo" template
6. Click "Transcribe & Summarize"
7. Wait ~10 seconds
8. See your transcript and AI-generated summary!

## ✅ Verify Everything Works

Run the self-test:

```bash
npm run self-test
```

This validates:
- ✅ All dependencies installed
- ✅ Environment variables set
- ✅ TypeScript compiles
- ✅ Groq API connected
- ✅ Gemini API connected
- ✅ Supabase connected
- ✅ Tests pass

## 🐛 Troubleshooting

### "GROQ_API_KEY not found"
- Make sure `.env.local` exists (not `.env.example`)
- Check there are no quotes around the API key
- Restart the dev server after editing `.env.local`

### "Microphone permission denied"
- Allow microphone access in your browser
- Use Chrome, Firefox, or Edge (Safari may have issues)
- Make sure you're on localhost or HTTPS

### "Supabase error"
- Verify you ran the SQL schema
- Check your Supabase URL and anon key are correct
- Ensure your project is active (green status in Supabase dashboard)

### "Transcription failed"
- Check your Groq API key is valid
- Make sure audio recording completed (you should see the audio player)
- Try a shorter recording first (5-10 seconds)

## 📱 Deploy to Production

Once testing works locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Project Settings → Environment Variables
```

## 🎯 Next Steps

- Try different summary templates (Meeting, Interview, Lecture)
- Record longer audio (up to 10 minutes)
- Export your recordings to TXT/MD/JSON
- Search through your recording history
- Customize the summary prompts in `lib/prompts.ts`

## 💡 Tips

- **Best audio quality**: Use a good microphone, minimize background noise
- **Faster transcription**: Keep recordings under 2 minutes
- **Better summaries**: Speak clearly and structure your thoughts
- **Save bandwidth**: The app stores audio in Supabase, not your device

---

Need help? Check the full [README.md](./README.md) or open an issue!
