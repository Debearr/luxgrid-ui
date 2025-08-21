export default function Page() {
	return (
		<div className="grid grid-cols-12 gap-4 p-4">
			<aside className="col-span-3 rounded-lg border bg-white p-4 shadow-sm">
				<h2 className="font-semibold">Penny</h2>
				<p className="text-sm text-zinc-600">Voice chat + transcript</p>
			</aside>
			<main className="col-span-6 rounded-lg border bg-white p-4 shadow-sm">
				<h2 className="font-semibold">Live Preview</h2>
				<p className="text-sm text-zinc-600">Storybook + Next.js dev</p>
			</main>
			<section className="col-span-3 rounded-lg border bg-white p-4 shadow-sm">
				<h2 className="font-semibold">Components</h2>
				<p className="text-sm text-zinc-600">Tree, props, styling</p>
			</section>
		</div>
	)
}