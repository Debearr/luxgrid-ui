import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NØID Team",
  description: "Digital business cards for the NØID team",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

