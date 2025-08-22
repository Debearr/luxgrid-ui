import './globals.css';

export const metadata = {
	title: 'NØID',
	description: 'Identity without compromise'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className="min-h-screen bg-black text-white">
				{children}
			</body>
		</html>
	);
}