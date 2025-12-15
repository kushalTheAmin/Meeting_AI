# Voice Notes AI

AI-powered voice recording, transcription, and summarization web application built with Next.js 14+, featuring 100% FREE services.

[![Next.js](https://img.shields.io/badge/Next.js-14+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## Features

- **🎙️ High-Quality Recording** - Browser-based audio recording up to 10 minutes
- **✨ AI Transcription** - Powered by Groq Whisper-large-v3 (unlimited free tier)
- **📝 Smart Summaries** - Google Gemini 2.0 Flash (experimental) for intelligent summarization
- **💾 Cloud Storage** - Supabase for audio files and recordings database
- **🎯 Multiple Templates** - Meeting notes, interviews, lectures, and voice memos
- **📱 Responsive Design** - Works seamlessly on desktop and mobile
- **🌙 Dark Mode** - Built-in dark mode support
- **♿ Accessible** - Full keyboard navigation and screen reader support
- **📤 Export Options** - Export to TXT, Markdown, or JSON
- **🔍 Search & History** - Search across all transcripts and recordings

## Tech Stack

### Frontend
- **Next.js 14+** with App Router
- **TypeScript** (strict mode)
- **Tailwind CSS** for styling
- **React Hooks** for state management
- **Lucide React** for icons

### Backend & APIs (100% FREE)
- **Groq API** - Whisper-large-v3 transcription (unlimited free)
- **Google Gemini 2.0 Flash** - AI summarization (experimental, free tier)
- **Supabase** - Storage and database (free tier)

### Testing
- **Vitest** for unit tests
- **React Testing Library** for component tests
- **Playwright** for E2E tests
- **80%+ code coverage**

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- API keys for:
  - Groq API (free, unlimited)
  - Google Gemini API (free tier)
  - Supabase account (free tier)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/voice-notes-ai.git
cd voice-notes-ai
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your API keys (see [API Setup](#api-setup) below).

4. **Set up Supabase database**

Run the SQL schema in your Supabase SQL Editor (see [Supabase Setup](#supabase-setup) below).

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Setup

### 1. Groq API (Free, Unlimited)

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Click "Create API Key"
5. Copy the key and add to `.env.local`:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### 2. Google Gemini API (Free Tier)

1. Go to [https://ai.google.dev/](https://ai.google.dev/)
2. Click "Get API key in Google AI Studio"
3. Sign in with your Google account
4. Click "Create API Key"
5. Copy the key and add to `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Supabase Setup

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up and create a new project
3. Go to Project Settings > API
4. Copy the Project URL and anon/public key
5. Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

6. **Run the database schema:**

Go to your Supabase project > SQL Editor and run:

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

-- Allow authenticated inserts
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'recordings' );
```

## Usage

### Recording a Voice Note

1. Click the microphone button on the home page
2. Allow microphone access when prompted
3. Speak clearly - you can record up to 10 minutes
4. Click stop when finished
5. Choose a summary template:
   - **Meeting Notes** - Overview, key points, action items, decisions
   - **Interview Notes** - Questions, responses, insights
   - **Lecture Notes** - Main topics, concepts, takeaways
   - **Voice Memo** - Quick summary and categorization
6. Click "Transcribe & Summarize"
7. Review the transcript and AI-generated summary
8. Optionally edit the title
9. Click "Save Recording"

### Managing Recordings

- Navigate to the **History** page to view all recordings
- Use the search bar to find specific recordings
- Click on a recording to view details
- Play audio directly in the browser
- Export recordings to TXT, Markdown, or JSON
- Delete recordings you no longer need

## Architecture

```mermaid
graph TD
    A[User] --> B[Next.js Frontend]
    B --> C[Audio Recording Component]
    C --> D[MediaRecorder API]
    D --> E[Audio Blob]
    E --> F[/api/transcribe]
    F --> G[Groq Whisper API]
    G --> H[Transcript]
    H --> I[/api/summarize]
    I --> J[Google Gemini API]
    J --> K[AI Summary]
    K --> L[/api/recordings]
    L --> M[Supabase Database]
    E --> N[Supabase Storage]
    M --> B
    N --> B
```

## Testing

### Run all tests

```bash
npm run test:all
```

### Run unit tests

```bash
npm run test:unit
```

### Run integration tests

```bash
npm run test:integration
```

### Run E2E tests

```bash
npm run test:e2e
```

### Run self-test script

```bash
npm run self-test
```

This will validate:
- Dependencies installation
- Environment variables
- TypeScript compilation
- API connections (Groq, Gemini, Supabase)
- Unit tests
- Integration tests
- Production build
- Linting

## Project Structure

```
voice-notes-ai/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── transcribe/    # Groq transcription endpoint
│   │   ├── summarize/     # Gemini summarization endpoint
│   │   ├── recordings/    # CRUD for recordings
│   │   └── health/        # Health check endpoints
│   ├── history/           # Recordings history page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── VoiceRecorder.tsx  # Main recorder
│   ├── AudioPlayer.tsx    # Playback controls
│   ├── TranscriptDisplay.tsx
│   ├── SummaryDisplay.tsx
│   ├── TemplateSelector.tsx
│   ├── RecordingsList.tsx
│   ├── ExportButton.tsx
│   └── LoadingSpinner.tsx
├── hooks/                 # Custom React hooks
│   ├── useRecorder.ts
│   ├── useTranscription.ts
│   └── useRecordings.ts
├── lib/                   # Utility libraries
│   ├── groq.ts           # Groq API client
│   ├── gemini.ts         # Gemini API client
│   ├── supabase.ts       # Supabase client
│   ├── audio-utils.ts    # Audio utilities
│   └── prompts.ts        # AI prompt templates
├── types/                # TypeScript types
│   └── index.ts
├── __tests__/            # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── scripts/              # Utility scripts
│   ├── test-groq.js
│   ├── test-gemini.js
│   └── test-supabase.js
└── tests/
    └── self-test.sh      # Self-test script
```

## Deployment

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
vercel
```

3. Add environment variables in Vercel Dashboard:
   - Go to your project settings
   - Add all variables from `.env.local`

### Build for Production

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Groq API key for transcription | Yes |
| `GEMINI_API_KEY` | Google Gemini API key for summarization | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (optional) | No |

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note:** Audio recording requires browser support for MediaRecorder API and microphone access.

## Performance

- Audio recording latency: <100ms
- Transcription starts within: 2 seconds
- UI remains responsive during processing
- Supports recordings up to 10 minutes (max 25MB)
- Lazy loading for 100+ recordings

## Accessibility

- ✅ Full keyboard navigation
- ✅ Screen reader compatible
- ✅ ARIA labels on all interactive elements
- ✅ High contrast mode support
- ✅ Keyboard shortcuts (Space, Escape)

## Troubleshooting

### Microphone not working

- Check browser permissions
- Ensure HTTPS or localhost
- Try a different browser

### API connection errors

- Verify API keys in `.env.local`
- Run health check scripts:
  ```bash
  npm run test:groq
  npm run test:gemini
  npm run test:supabase
  ```

### Supabase errors

- Ensure database schema is created
- Check storage bucket permissions
- Verify URL and keys are correct

### Build errors

- Run `npm install` to update dependencies
- Check TypeScript errors: `npm run type-check`
- Clear `.next` folder and rebuild

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Acknowledgments

- [Groq](https://groq.com) for lightning-fast Whisper transcription
- [Google Gemini](https://ai.google.dev/) for intelligent AI summaries
- [Supabase](https://supabase.com) for database and storage
- [Vercel](https://vercel.com) for hosting
- [Next.js](https://nextjs.org/) for the amazing framework

## Support

- 📧 Email: support@voicenotesai.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/voice-notes-ai/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/voice-notes-ai/discussions)

---

**Built with ❤️ using 100% FREE services**
