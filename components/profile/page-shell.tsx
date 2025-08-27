import { Member } from "@/data/team";
import { QR } from "@/components/qr";
import Link from "next/link";

export default function ProfilePage({ m }: { m: Member }) {
  const host = process.env.NEXT_PUBLIC_SITE_URL || "";
  const profileUrl = `${host ? host : ""}/${m.slug}`;
  const isObsidian = m.theme === "obsidian";

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
        {/* Card preview block */}
        <div className={`rounded-2xl p-8 border ${isObsidian ? "bg-noid-onyx border-noid-teal/30" : "bg-white border-gray-200"} shadow-xl`}>
          <div className="flex items-center justify-between mb-8">
            <div className={`text-2xl font-bold tracking-widest ${isObsidian ? "text-noid-gold" : "text-primary"}`}>NØID</div>
            <QR value={typeof window !== "undefined" ? window.location.href : profileUrl} className="w-24 h-24 rounded-md border border-black/10" />
          </div>
          <div className={isObsidian ? "text-white" : "text-primary"}>
            <div className="text-xl font-semibold">{m.name}</div>
            <div className={`uppercase tracking-wide text-sm ${isObsidian ? "text-gray-300" : "text-muted-foreground"}`}>{m.title}</div>
            <div className="mt-6 space-y-2 text-sm">
              <div>{m.email}</div>
              {m.links.website && <div>{m.links.website}</div>}
              {m.location && <div className={`${isObsidian ? "text-gray-400" : "text-muted-foreground"}`}>{m.location}</div>}
            </div>
          </div>
        </div>

        {/* Details + actions */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{m.name}</h1>
            <p className="text-muted-foreground">{m.title}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <a className="btn" href={`/api/vcard/${m.slug}`}>Download vCard</a>
            {m.links.calendly && <a className="btn" href={m.links.calendly} target="_blank">Book a Meeting</a>}
            {m.links.linkedin && <a className="btn" href={m.links.linkedin} target="_blank">LinkedIn</a>}
            {m.links.x && <a className="btn" href={m.links.x} target="_blank">X</a>}
            {m.links.website && <a className="btn" href={m.links.website} target="_blank">Website</a>}
            <a className="btn" href={`mailto:${m.email}`}>Email</a>
          </div>

          <p className="text-sm text-muted-foreground">
            NØID is building a new standard for digital privacy and identity.
          </p>
        </div>
      </div>

      <style jsx>{`
        .btn {
          display: inline-flex; align-items:center; justify-content:center;
          padding: 0.6rem 0.9rem; border-radius: 0.75rem; border: 1px solid rgba(0,0,0,0.08);
        }
      `}</style>
    </div>
  );
}

