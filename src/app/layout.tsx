import "./globals.css";
export const metadata = {
  title: "Noidlux",
  description: "LuxGrid ecosystem",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {children}
      </body>
    </html>
  );
}

