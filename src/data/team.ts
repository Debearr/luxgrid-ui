export interface Member {
  slug: string
  name: string
  title: string
  email: string
  phone: string
  location: string
  org: string
  website: string
  links: {
    linkedin: string
    x: string
    calendly: string
  }
}

export const TEAM: Member[] = [
  {
    slug: "debear",
    name: "Leroy De Beer — De Bear™",
    title: "Founder & Architect",
    email: "debear@noidlux.com",
    phone: "+1-555-100-0001",
    location: "Toronto / New York",
    org: "NØID",
    website: "https://noidlux.com/debear",
    links: {
      linkedin: "https://linkedin.com/in/debear",
      x: "https://x.com/debear",
      calendly: "https://calendly.com/debear"
    }
  },
  {
    slug: "andre",
    name: "Andre Allen",
    title: "Chief Operating Officer",
    email: "andre@noidlux.com",
    phone: "+1-555-100-0002",
    location: "Toronto / New York",
    org: "NØID",
    website: "https://noidlux.com/andre",
    links: {
      linkedin: "https://linkedin.com/in/andreallen",
      x: "https://x.com/andreallen",
      calendly: "https://calendly.com/andre"
    }
  },
  {
    slug: "swapnil",
    name: "Swapnil Shinde",
    title: "Chief Sales Officer",
    email: "swapnil@noidlux.com",
    phone: "+1-555-100-0003",
    location: "Mumbai / Toronto",
    org: "NØID",
    website: "https://noidlux.com/swapnil",
    links: {
      linkedin: "https://linkedin.com/in/swapnilshinde",
      x: "https://x.com/swapnilshinde",
      calendly: "https://calendly.com/swapnil"
    }
  },
  {
    slug: "mustafa",
    name: "Mustafa Ali",
    title: "Chief Financial Officer",
    email: "mustafa@noidlux.com",
    phone: "+1-555-100-0004",
    location: "Toronto, Canada",
    org: "NØID",
    website: "https://noidlux.com/mustafa",
    links: {
      linkedin: "https://linkedin.com/in/mustafaali",
      x: "https://x.com/mustafaali",
      calendly: "https://calendly.com/mustafa"
    }
  },
  {
    slug: "josh",
    name: "Josh [Last Name]",
    title: "Business Development Officer",
    email: "josh@noidlux.com",
    phone: "+1-555-100-0005",
    location: "Toronto / New York",
    org: "NØID",
    website: "https://noidlux.com/josh",
    links: {
      linkedin: "https://linkedin.com/in/josh",
      x: "https://x.com/josh",
      calendly: "https://calendly.com/josh"
    }
  }
]

