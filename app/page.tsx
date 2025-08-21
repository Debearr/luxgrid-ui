export default function HomePage() {
  return (
    <main>
      <header className="px-4 py-5">
        <div className="mx-auto max-w-6xl flex items-center gap-4">
          <a href="#" className="text-2xl font-bold">NØID</a>
          <nav className="ml-auto flex items-center gap-5 md:gap-8 text-sm sm:text-base md:text-lg whitespace-nowrap">
            <a href="#features" className="hover:text-teal-400">Features</a>
            <a href="#dashboard" className="hover:text-teal-400">Dashboard</a>
            <a href="#founder" className="hover:text-teal-400">Founder</a>
          </nav>
        </div>
      </header>
    </main>
  )
}

