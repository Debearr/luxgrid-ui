import './globals.css';

export const metadata = {
	title: 'AuraFX / NØID Ecosystem',
	description: 'Unified Next.js app scaffold',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className="min-h-screen bg-[#0A0E1A] text-white">
				{children}
			</body>
		</html>
	);
}