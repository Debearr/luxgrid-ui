import Link from "next/link";
import { TEAM } from "@/data/team";

export default function TeamPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">NØID Team</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEAM.map((m) => (
          <Link key={m.slug} href={`/${m.slug}`} className="rounded-2xl p-6 border hover:shadow-lg transition">
            <div className="text-xl font-semibold">{m.name}</div>
            <div className="text-sm text-muted-foreground">{m.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

