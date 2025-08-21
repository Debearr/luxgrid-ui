export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 text-center">
        <div className="mb-8">
          <span className="inline-block px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-sm text-neutral-300">
            Luxury AI Platform
          </span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
            Drive Unseen.
          </span>
          <br />
          <span className="text-[#FFD700]">Tap Less.</span>
          <br />
          <span className="bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
            Earn Smart.
          </span>
        </h1>
        
        <p className="text-xl text-neutral-300 max-w-2xl mx-auto mb-10">
          Luxury-grade AI for drivers, founders, and investors. 
          Built with precision by <strong>NØID</strong>.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/contact" 
            className="inline-flex items-center px-8 py-4 rounded-2xl bg-[#FFD700] text-black font-semibold hover:bg-[#FFE55C] transition-colors duration-300"
          >
            Get Started
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          
          <a 
            href="#features" 
            className="inline-flex items-center px-8 py-4 rounded-2xl border border-neutral-700 text-white hover:border-neutral-600 hover:bg-neutral-900 transition-all duration-300"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose NØID</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FFD700]/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
            <p className="text-neutral-400">AI responses in milliseconds, optimized for real-world performance.</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FFD700]/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Ultra Secure</h3>
            <p className="text-neutral-400">Enterprise-grade encryption with zero-knowledge architecture.</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FFD700]/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Analytics</h3>
            <p className="text-neutral-400">Real-time insights and predictive intelligence.</p>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-neutral-900 to-neutral-800 border border-neutral-700">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-neutral-300 mb-8 text-lg">
            Join the future of luxury AI technology. Contact us to learn more.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center px-8 py-4 rounded-2xl bg-[#FFD700] text-black font-semibold hover:bg-[#FFE55C] transition-colors duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact NØID
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="text-2xl font-bold text-white mb-2">NØID</div>
            <p className="text-neutral-400">© {new Date().getFullYear()} All rights reserved</p>
          </div>
          
          <div className="flex items-center gap-8">
            <a 
              href="/contact" 
              className="text-neutral-300 hover:text-white transition-colors underline"
            >
              Contact
            </a>
            <a 
              href="/about" 
              className="text-neutral-300 hover:text-white transition-colors underline"
            >
              About
            </a>
          </div>
        </div>
        
        {/* Signature barcode */}
        <div className="fixed bottom-4 right-4 opacity-30 select-none text-neutral-600 font-mono text-sm">
          ||||| || ||| ||||| || |||
        </div>
      </footer>
    </main>
  );
}

