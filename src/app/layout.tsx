export const metadata = {
	title: 'App',
	description: 'App Layout',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<link rel="stylesheet" href="/styles.css" />
			</head>
			<body>{children}</body>
		</html>
	);
}