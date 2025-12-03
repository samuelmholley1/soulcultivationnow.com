import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from '@/components/Toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  metadataBase: new URL('https://memberships.ukiahseniorcenter.org'),
  title: "Membership - Ukiah Senior Center",
  description: "Become a member of the Ukiah Senior Center. Join over 500 active members supporting our mission to enhance quality of life for seniors.",
  openGraph: {
    title: "Membership - Ukiah Senior Center",
    description: "Become a member of the Ukiah Senior Center. Join over 500 active members supporting our mission to enhance quality of life for seniors.",
    images: [{ url: '/logo.png', width: 500, height: 500 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Membership - Ukiah Senior Center",
    description: "Become a member of the Ukiah Senior Center. Join over 500 active members supporting our mission to enhance quality of life for seniors.",
    images: ['/logo.png'],
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
