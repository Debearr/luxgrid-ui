export const metadata = {
	title: "AuraFX NØID",
	description: "Unified ecosystem portal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}