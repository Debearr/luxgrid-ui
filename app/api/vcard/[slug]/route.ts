import { NextResponse } from "next/server";
import { getMember } from "@/data/team";

function vcardText({
  name, title, email, phone, location, org, slug,
}: {
  name: string; title: string; email: string; phone?: string; location?: string; org?: string; slug: string;
}) {
  const host = process.env.NEXT_PUBLIC_SITE_URL || "https://noidlux.com";
  const profileUrl = `${host}/${slug}`;
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${name}`,
    org ? `ORG:${org}` : "",
    `TITLE:${title}`,
    `EMAIL:${email}`,
    phone ? `TEL;TYPE=CELL:${phone}` : "",
    location ? `ADR:;;${location};;;;` : "",
    `URL:${profileUrl}`,
    "END:VCARD",
  ].filter(Boolean);
  return lines.join("\n");
}

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const member = getMember(params.slug);
  if (!member) return new NextResponse("Not found", { status: 404 });
  const body = vcardText({ ...member, slug: member.slug });
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${member.slug}.vcf"`,
    },
  });
}

