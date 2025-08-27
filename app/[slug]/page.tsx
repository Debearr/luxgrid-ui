import { getMember } from "@/data/team";
import ProfilePage from "@/components/profile/page-shell";

export default function Page({ params }: { params: { slug: string } }) {
  const m = getMember(params.slug);
  if (!m) return <div className="container mx-auto px-4 py-20">Profile not found.</div>;
  return <ProfilePage m={m} />;
}

