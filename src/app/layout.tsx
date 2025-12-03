import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Soul Cultivation | Ancient Wisdom Meets Modern Psychology',
  description: 'Transform from trauma to flow with shamanic wisdom. Take the Dagara Numerology Quiz to discover your elemental path.',
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Soul Cultivation'
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Soul Cultivation',
    title: 'Soul Cultivation | Ancient Wisdom Meets Modern Psychology',
    description: 'Transform from trauma to flow with shamanic wisdom. Discover your elemental path.',
  },
  keywords: ['shamanic', 'healing', 'dagara', 'numerology', 'scott sherman', 'soul cultivation', 'blue heron', 'mendocino', 'spirituality', 'coaching']
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#008B8B',
  viewportFit: 'cover'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="UUMC Liturgists" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log('[RootLayout] Initializing app');
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('[SW] Service Worker registered:', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('[SW] Service Worker registration failed:', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}