/**
 * Root layout component
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Mic, History } from 'lucide-react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Voice Notes AI - Record, Transcribe, Summarize',
  description:
    'AI-powered voice recording, transcription, and summarization app using Groq Whisper and Google Gemini',
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-primary text-primary-foreground shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <Mic size={28} />
                  <h1 className="text-xl font-bold">Voice Notes AI</h1>
                </Link>

                <nav className="flex gap-4">
                  <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary-foreground/10 transition-colors"
                  >
                    <Mic size={18} />
                    <span>Record</span>
                  </Link>
                  <Link
                    href="/history"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary-foreground/10 transition-colors"
                  >
                    <History size={18} />
                    <span>History</span>
                  </Link>
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-secondary/30 border-t border-border">
            <div className="container mx-auto px-4 py-6">
              <div className="text-center text-sm text-muted-foreground">
                <p>
                  Powered by{' '}
                  <a
                    href="https://groq.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Groq Whisper
                  </a>
                  {' '}and{' '}
                  <a
                    href="https://ai.google.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google Gemini
                  </a>
                </p>
                <p className="mt-2">
                  Built with Next.js, TypeScript, and Tailwind CSS
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
