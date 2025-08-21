import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NØID — LuxGrid',
  description: 'Black/gold landing page for NØID',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

