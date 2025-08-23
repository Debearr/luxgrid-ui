export const metadata = { title: 'LuxGrid', description: 'Minimal deploy' };

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}