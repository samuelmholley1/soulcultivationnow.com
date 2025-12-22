import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from '@/components/Toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  metadataBase: new URL('https://soulcultivationnow.com'),
  title: "Soul Cultivation - Guided Pathways to Personal Growth",
  description: "Discover your path to spiritual growth and personal development. Choose from healing, spiritual awakening, ancestral wisdom, or holistic health journeys.",
  openGraph: {
    title: "Soul Cultivation - Guided Pathways to Personal Growth",
    description: "Discover your path to spiritual growth and personal development. Choose from healing, spiritual awakening, ancestral wisdom, or holistic health journeys.",
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Soul Cultivation Logo' }],
    type: 'website',
    siteName: 'Soul Cultivation',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Soul Cultivation - Guided Pathways to Personal Growth",
    description: "Discover your path to spiritual growth and personal development. Choose from healing, spiritual awakening, ancestral wisdom, or holistic health journeys.",
    images: ['/og-image.png'],
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://www.zeffy.com" crossOrigin="" />
        <script dangerouslySetInnerHTML={{ __html: `
          // Unregister all service workers (cache buster)
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
              for(let registration of registrations) {
                registration.unregister();
              }
            });
          }
          // Clear all caches
          if ('caches' in window) {
            caches.keys().then(function(names) {
              for (let name of names) caches.delete(name);
            });
          }
        `}} />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <ToastProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </ToastProvider>
      </body>
    </html>
  );
}
