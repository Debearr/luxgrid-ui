import { Analytics } from '@vercel/analytics/react'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="px-4 py-5">
        <div className="mx-auto max-w-6xl flex items-center gap-4">
          <a href="#" className="text-2xl font-bold gold-text">NØID</a>

          {/* Single-line nav, no Contact */}
          <nav className="ml-auto flex items-center gap-5 md:gap-8 text-sm sm:text-base md:text-lg whitespace-nowrap">
            <a href="#features" className="hover:text-teal-400 transition-colors">Features</a>
            <a href="#dashboard" className="hover:text-teal-400 transition-colors">Dashboard</a>
            <a href="#founder" className="hover:text-teal-400 transition-colors">Founder</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Welcome to Noidlux
          </h1>
          <p className="text-xl md:text-2xl text-muted mb-8">
            Interfaces, distilled.
          </p>
          <p className="text-lg text-muted mb-12 max-w-2xl mx-auto">
            Quiet luxury interfaces that speak softly but carry exceptional impact. 
            Where minimalism meets sophistication.
          </p>
          <button className="btn-primary text-lg px-8 py-4">
            Explore Platform
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Refined by Design
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="panel text-center">
              <h3 className="text-xl font-bold mb-4 gold-text">Minimal</h3>
              <p className="text-muted">
                Every element serves a purpose. Nothing more, nothing less.
              </p>
            </div>
            <div className="panel text-center">
              <h3 className="text-xl font-bold mb-4 gold-text">Luxurious</h3>
              <p className="text-muted">
                Premium materials and finishes in digital form.
              </p>
            </div>
            <div className="panel text-center">
              <h3 className="text-xl font-bold mb-4 gold-text">Intelligent</h3>
              <p className="text-muted">
                Adaptive interfaces that understand context and intent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="dashboard" className="px-4 py-20 bg-black/20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Dashboard Preview
          </h2>
          <p className="text-lg text-muted mb-12 max-w-2xl mx-auto">
            Experience the future of interface design with our integrated platform.
          </p>
          <div className="panel max-w-4xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-lg flex items-center justify-center">
              <p className="text-2xl font-bold gold-text">Dashboard Coming Soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section id="founder" className="px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Built by Visionaries
          </h2>
          <p className="text-lg text-muted mb-8">
            Noidlux emerges from the intersection of luxury design principles 
            and cutting-edge technology, crafted for those who appreciate 
            the extraordinary in the everyday.
          </p>
          <div className="panel max-w-2xl mx-auto">
            <p className="text-muted">
              "True luxury lies not in excess, but in the perfect distillation 
              of intent into form."
            </p>
            <p className="mt-4 gold-text font-semibold">— The Noidlux Team</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 border-t border-white/10">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-muted">
            © 2024 Noidlux. Quiet luxury interfaces.
          </p>
          <p className="text-sm text-muted mt-2">
            hello@noidlux.com
          </p>
        </div>
      </footer>
    </main>
  )
}