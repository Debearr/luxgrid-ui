import './globals.css';
export const metadata = { title: 'NØID', description: 'Luxgrid UI' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
