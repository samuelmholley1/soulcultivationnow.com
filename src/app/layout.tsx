import type { Metadata } from "next";
import "../styles/globals.css";
import { ToastProvider } from '@/components/ui/Toast';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const siteTitle = "Soul Cultivation | Ancient Wisdom Meets Modern Psychology";
const siteDescription = "Transform from trauma to flow with shamanic wisdom. Take the Dagara Numerology Quiz to discover your elemental path to enlightenment.";

export const metadata: Metadata = {
  metadataBase: new URL('https://soulcultivationnow.com'),
  title: {
    default: siteTitle,
    template: '%s | Soul Cultivation'
  },
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/og.png'],
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: '48x48' }
    ],
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
        <link rel="preconnect" href="https://www.zeffy.com" crossOrigin="" />
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
