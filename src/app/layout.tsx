import "./globals.css";

export const metadata = {
	title: "LuxGrid UI",
	description: "Luxury identity OS: NØID, AuraFX, Noidlux, PostPilot",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				{children}
			</body>
		</html>
	);
}