import type { ReactNode } from 'react'

export function Panel({ title, children }: { title: string; children: ReactNode }) {
	return (
		<div className="rounded-lg border bg-white p-4 shadow-sm">
			<h2 className="font-semibold">{title}</h2>
			<div className="text-sm text-zinc-600">{children}</div>
		</div>
	)
}

export default Panel