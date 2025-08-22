export default function HomePage() {
	if (typeof window !== 'undefined') {
		console.log('%cNØID landing render', 'color:#0ff;background:#000;padding:4px 8px;border-radius:4px');
	}
	return (
		<main className="min-h-screen flex flex-col">
			<header className="w-full py-6 px-6 flex items-center justify-between border-b border-white/10">
				<div className="text-2xl font-bold tracking-wide">NØID</div>
				<nav className="flex gap-6 text-sm text-white/80">
					<a href="#features" className="hover:text-white">Features</a>
					<a href="#dashboard" className="hover:text-white">Dashboard</a>
					<a href="#founder" className="hover:text-white">Founder</a>
				</nav>
			</header>
			<section className="flex-1 grid place-items-center px-6">
				<div className="max-w-3xl text-center space-y-6">
					<h1 className="text-5xl md:text-6xl font-extralight">Identity without compromise</h1>
					<p className="text-lg text-white/80">NØID is a privacy-forward identity layer. Own your identity. Share only what you need.</p>
					<div className="flex items-center justify-center gap-4">
						<a href="#features" className="px-5 py-3 bg-white text-black rounded-md">Explore Features</a>
						<a href="#dashboard" className="px-5 py-3 border border-white/20 rounded-md">Open Dashboard</a>
					</div>
				</div>
			</section>
			<footer className="py-8 text-center text-xs text-white/60">© {new Date().getFullYear()} NØID</footer>
		</main>
	);
}