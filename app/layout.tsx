import './globals.css'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'NØID - Luxury AI Platform',
  description:
    'Drive Unseen. Tap Less. Earn Smart. Luxury-grade AI for drivers, founders, and investors.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}

