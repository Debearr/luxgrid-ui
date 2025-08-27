import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Head from "next/head"
import { QR } from "../../components/qr"
import { TEAM, type Member } from "../../data/team"

interface TeamMemberPageProps {
  member: Member
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = TEAM.map((member) => ({ params: { slug: member.slug } }))
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<TeamMemberPageProps> = async (
  context
) => {
  const slug = context.params?.slug as string
  const member = TEAM.find((m) => m.slug === slug)

  if (!member) {
    return { notFound: true }
  }

  return {
    props: {
      member
    }
  }
}

const TeamMemberPage: NextPage<TeamMemberPageProps> = ({ member }) => {
  return (
    <>
      <Head>
        <title>
          {member.name} — {member.title} | {member.org}
        </title>
        <meta name="description" content={`${member.name} — ${member.title}`} />
      </Head>

      <main className="mx-auto max-w-2xl px-4 py-10">
        <section className="flex items-start justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">{member.name}</h1>
            <p className="text-sm text-muted-foreground">
              {member.title} • {member.org}
            </p>
            <p className="text-sm text-muted-foreground">{member.location}</p>

            <div className="mt-4 space-y-1 text-sm">
              <a href={`mailto:${member.email}`} className="underline">
                {member.email}
              </a>
              <div>{member.phone}</div>
              <a href={member.website} target="_blank" rel="noreferrer" className="underline">
                {member.website}
              </a>
            </div>

            <div className="mt-4 flex items-center gap-3 text-sm">
              <a href={member.links.linkedin} target="_blank" rel="noreferrer" className="underline">
                LinkedIn
              </a>
              <a href={member.links.x} target="_blank" rel="noreferrer" className="underline">
                X
              </a>
              <a href={member.links.calendly} target="_blank" rel="noreferrer" className="underline">
                Calendly
              </a>
            </div>
          </div>

          <QR value={member.website} label="Scan to open profile" size={6} />
        </section>
      </main>
    </>
  )
}

export default TeamMemberPage

