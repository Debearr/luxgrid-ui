export default function HomePage() {
	return (
		<main className="mx-auto max-w-6xl p-6">
			<header className="flex items-center gap-4 py-6">
				<a className="text-2xl font-bold text-yellow-400">NØID</a>
				<nav className="ml-auto flex items-center gap-6 text-sm md:text-base">
					<a href="#features" className="hover:text-teal-400">Features</a>
					<a href="#dashboard" className="hover:text-teal-400">Dashboard</a>
					<a href="#founder" className="hover:text-teal-400">Founder</a>
				</nav>
			</header>
			<section id="features" className="mt-12">
				<h1 className="text-4xl font-semibold">LuxGrid UI</h1>
				<p className="mt-3 text-zinc-300">Next.js App Router is live.</p>
			</section>
		</main>
	);
}