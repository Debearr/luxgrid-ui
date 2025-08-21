export default function ContactPage() {
  return (
    <main className="min-h-screen px-6 py-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-semibold">Contact</h1>
        <p className="mt-4 text-zinc-300">
          Tell us about your project. Well get back within 48 hours.
        </p>
        <a
          href="/"
          className="mt-8 inline-block rounded border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-medium hover:bg-zinc-800"
        >
          Back to home
        </a>
      </div>
    </main>
  );
}

