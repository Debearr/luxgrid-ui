export type Theme = "obsidian" | "teal";

export type Member = {
  slug: string;
  name: string;
  title: string;
  email: string;
  phone?: string;
  location?: string;
  org?: string;
  links: {
    website?: string;
    linkedin?: string;
    x?: string;
    calendly?: string;
  };
  theme: Theme;
};

export const TEAM: Member[] = [
  {
    slug: "debear",
    name: "De Bear",
    title: "Founder & Architect",
    email: "debear@noidlux.com",
    phone: "",
    location: "New York, NY",
    org: "NØID",
    links: {
      website: "https://noidlux.com",
      linkedin: "https://www.linkedin.com/in/",
      x: "https://x.com/",
      calendly: "https://calendly.com/",
    },
    theme: "obsidian",
  },
  {
    slug: "andre",
    name: "Andre",
    title: "Chief Operating Officer",
    email: "andre@noidlux.com",
    location: "New York, NY",
    org: "NØID",
    links: { website: "https://noidlux.com" },
    theme: "obsidian",
  },
  {
    slug: "swapnil",
    name: "Swapnil",
    title: "Chief Strategy Officer",
    email: "swapnil@noidlux.com",
    location: "New York, NY",
    org: "NØID",
    links: { website: "https://noidlux.com" },
    theme: "teal",
  },
  {
    slug: "mustafa",
    name: "Mustafa",
    title: "Chief Financial Officer",
    email: "mustafa@noidlux.com",
    location: "New York, NY",
    org: "NØID",
    links: { website: "https://noidlux.com" },
    theme: "teal",
  },
  {
    slug: "josh",
    name: "Josh",
    title: "Business Development Officer",
    email: "josh@noidlux.com",
    location: "New York, NY",
    org: "NØID",
    links: { website: "https://noidlux.com" },
    theme: "teal",
  },
];

export function getMember(slug: string) {
  return TEAM.find((m) => m.slug === slug);
}

