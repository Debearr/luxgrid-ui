export const metadata = { title: 'LuxGrid', description: 'LuxGrid UI' };

import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}