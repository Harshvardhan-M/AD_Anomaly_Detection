import type { Metadata } from 'next'
import { Syne, DM_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const syne = Syne({ 
  subsets: ["latin"],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700', '800']
});

const dmMono = DM_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono',
  weight: ['300', '400', '500']
});

export const metadata: Metadata = {
  title: 'Adaptive Threshold Learning for Time Series Anomaly Detection',
  description: 'A hybrid LSTM-Transformer autoencoder with adaptive threshold learning for multivariate time series anomaly detection.',
  keywords: ['anomaly detection', 'time series', 'machine learning', 'LSTM', 'Transformer', 'deep learning'],
  generator: 'v0.app',
  openGraph: {
    title: 'Adaptive Threshold Learning for Anomaly Detection',
    description: 'Interactive web platform showcasing a novel approach to time series anomaly detection',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmMono.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
