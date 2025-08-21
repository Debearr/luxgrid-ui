export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <section className="flex-1 flex items-center justify-center text-center px-6 py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            NØID
          </h1>
          <p className="mt-4 text-lg text-zinc-300">
            Precision-built systems for luxury commerce. Black, white, and a hint of gold.
          </p>
          <div className="mt-8">
            <a
              href="/contact"
              className="inline-block rounded border border-[#FFD700]/30 bg-[#111] px-5 py-3 text-sm font-medium text-white hover:bg-[#1a1a1a]"
              style={{ boxShadow: '0 0 0 1px #3f3f46 inset' }}
            >
              Contact
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 border-t border-zinc-800">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold">Craft</h3>
            <p className="mt-2 text-zinc-300">Tailored interfaces, minimal and deliberate.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Velocity</h3>
            <p className="mt-2 text-zinc-300">Fast by default. No compromise.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Signal</h3>
            <p className="mt-2 text-zinc-300">Clarity in every interaction.</p>
          </div>
        </div>
      </section>

      <footer className="relative px-6 py-10 border-t border-zinc-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-sm text-zinc-400">
            © {new Date().getFullYear()} NØID. All rights reserved.
          </p>
          <a href="/contact" className="text-sm text-zinc-200 hover:text-white">
            Contact
          </a>
        </div>
        <div className="absolute bottom-3 right-3 h-6 w-28 bg-gradient-to-r from-zinc-700 to-white [mask-image:repeating-linear-gradient(90deg,black_0_2px,transparent_2px_4px)]"></div>
      </footer>
    </main>
  );
}

