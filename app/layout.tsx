export const metadata = {
  title: "LuxGrid UI — NØID",
  description: "Luxury-grade AI platform landing page",
};

import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

