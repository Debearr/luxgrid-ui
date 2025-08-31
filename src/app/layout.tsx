import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Noidlux - Quiet luxury interfaces',
  description: 'Interfaces, distilled.',
  metadataBase: new URL('https://noidlux.com'),
  openGraph: {
    title: 'Noidlux - Quiet luxury interfaces',
    description: 'Interfaces, distilled.',
    url: 'https://noidlux.com',
    siteName: 'Noidlux',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Noidlux - Quiet luxury interfaces',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Noidlux - Quiet luxury interfaces',
    description: 'Interfaces, distilled.',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon_black_32x32.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon_black_512x512.png" />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}