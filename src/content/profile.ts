/**
 * Tapfolio profile data — the single file to edit.
 *
 * Every value below was verified against Rajat's resume, his GitHub profile
 * (github.com/rajatrsrivastav), his portfolio (rajatsrivastav.dev) or the
 * linked repositories on 30 Oct 2026. Fields set to `null` are unknown: the UI
 * hides them, so nothing fake is ever published. Search for "TODO" to find them.
 */

export type LinkKind =
  | "github"
  | "linkedin"
  | "portfolio"
  | "x"
  | "leetcode"
  | "telegram"
  | "email";

export type ProfileLink = {
  kind: LinkKind;
  label: string;
  /** `null` hides the link. */
  href: string | null;
};

export type Resume = {
  id: string;
  label: string;
  /** Path inside /public. A resume is shown only if this file exists at build time. */
  file: string;
  /** File name used when the visitor downloads it. */
  downloadName: string;
};

export type PullRequest = {
  number: number;
  /** The title exactly as merged, in Conventional Commits form. */
  title: string;
  merged: string; // ISO date
};

export type Project = {
  name: string;
  summary: string;
  problem: string;
  contribution: string;
  stack: string[];
  repo: string;
  /** `null` when there is no public deployment. */
  live: string | null;
  /** Screenshot of the live site in /public, or `null` to use the diagram treatment. */
  image: { src: string; alt: string; width: number; height: number } | null;
};

export type StackLayer = {
  /** The physical layer of the card this skill group is drawn on. */
  layer: "face" | "inlay" | "core" | "back";
  label: string;
  items: string[];
};

export const profile = {
  /**
   * The permanent public address. The NFC tag and printed QR code point to
   * `${siteUrl}/c`, so change this only before writing the tag. The
   * NEXT_PUBLIC_SITE_URL environment variable overrides it.
   */
  siteUrl: "https://card.rajatsrivastav.dev",

  name: "Rajat Srivastav",
  givenName: "Rajat",
  familyName: "Srivastav",
  photo: {
    src: "/rajat-srivastav.jpg",
    alt: "Rajat Srivastav",
    width: 460,
    height: 460,
  },

  /** The line above the card in the opening shot. */
  tagline: "One tap. Full stack.",

  /** Shown under the name and used as the vCard job title. */
  headline: "Full-stack engineer building cloud-native infrastructure",
  role: "Full-stack engineer",

  intro:
    "I write Go for Kuadrant’s MCP Gateway, an Envoy-based gateway for Model Context Protocol traffic, and ship full-stack products in TypeScript. Before that I built AWS infrastructure and payment systems as an intern at Safcurl Technologies.",

  location: "Mumbai, India",

  /**
   * GitHub and the portfolio say he is open to platform, DevOps and SRE roles,
   * internships and full-time. "Web3" comes from the Devcon brief.
   */
  availability: "Open to platform, backend and Web3 roles",
  availabilityDetail: "Internship or full-time, based in Mumbai",

  email: "rajatrsrivastav810@gmail.com",

  /**
   * The phone number is deliberately NOT stored here, because this file is
   * public. To put it in the downloadable contact card, set CONTACT_PHONE
   * (e.g. "+91 98765 43210") in the hosting provider's environment variables.
   */

  links: [
    { kind: "github", label: "GitHub", href: "https://github.com/rajatrsrivastav" },
    { kind: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/rajatrsrivastav/" },
    { kind: "portfolio", label: "Portfolio", href: "https://rajatsrivastav.dev" },
    { kind: "x", label: "X", href: "https://x.com/rajatrsrivastav" },
    { kind: "leetcode", label: "LeetCode", href: "https://leetcode.com/u/rajatrsrivastav/" },
    // TODO: add a Telegram link (https://t.me/<handle>) if you want one shown.
    { kind: "telegram", label: "Telegram", href: null },
  ] satisfies ProfileLink[],

  /**
   * Ordered by priority: the first resume whose file exists becomes the main
   * button. Replace a PDF by dropping a new file at the same path — the NFC
   * card and QR code never change.
   */
  resumes: [
    {
      id: "web3",
      label: "Web3 resume",
      // TODO: add the Web3 / blockchain resume at this path to show it first.
      file: "/resumes/rajat-srivastav-web3-resume.pdf",
      downloadName: "Rajat-Srivastav-Web3-Resume.pdf",
    },
    {
      id: "full-stack",
      label: "Full-stack resume",
      file: "/resumes/rajat-srivastav-full-stack-resume.pdf",
      downloadName: "Rajat-Srivastav-Full-Stack-Resume.pdf",
    },
  ] satisfies Resume[],

  upstream: {
    project: "Kuadrant MCP Gateway",
    description:
      "An Envoy-based gateway that adds authentication, authorization and rate limiting to Model Context Protocol traffic on Istio.",
    repo: "https://github.com/Kuadrant/mcp-gateway",
    allMerged:
      "https://github.com/Kuadrant/mcp-gateway/pulls?q=is%3Apr+author%3Arajatrsrivastav+is%3Amerged",
    pulls: [
      { number: 1478, title: "fix(controller): decouple config sync from extension readiness", merged: "2026-09-07" },
      { number: 1433, title: "feat(observability): add protocol.version span attribute to router and broker", merged: "2026-09-04" },
      { number: 1420, title: "docs: add rate limiting guide for MCP traffic", merged: "2026-08-31" },
      { number: 1415, title: "feat: report build version in MCP serverInfo instead of hardcoded value", merged: "2026-08-25" },
      { number: 1405, title: "chore: harden final Alpine Dockerfile stages to run as non-root", merged: "2026-08-24" },
      { number: 1381, title: "chore: stop serving v1alpha1 APIs", merged: "2026-08-20" },
      { number: 1380, title: "chore: bump Go toolchain from 1.26.0 to 1.26.5", merged: "2026-08-18" },
      { number: 938, title: "fix(charts): support advanced MCPGatewayExtension configuration", merged: "2026-06-24" },
    ] satisfies PullRequest[],
  },

  projects: [
    {
      name: "OSSGrid",
      summary:
        "A free, no-login index of Google Summer of Code and LFX Mentorship organizations, past projects and mentors.",
      problem:
        "Students preparing for mentorship programs piece together past projects and mentors from dozens of repos, spreadsheets and blog posts.",
      contribution:
        "Author and maintainer. Built a static-first pipeline: scheduled GitHub Actions fetch official program data, audit it, and open a pull request when it changes, so every data update is reviewed like code.",
      stack: ["Next.js 16", "TypeScript", "Tailwind CSS", "GitHub Actions", "d3-force"],
      repo: "https://github.com/rajatrsrivastav/ossgrid",
      live: "https://www.ossgrid.tech",
      image: {
        src: "/projects/ossgrid.jpg",
        alt: "OSSGrid home page",
        width: 1280,
        height: 720,
      },
    },
    {
      name: "Apna Hostel",
      summary: "A mobile-first hostel fee portal for ITI and Diploma students.",
      problem:
        "Hostel residents need to see dues, pay monthly rent in parts and get receipts, while the office needs collections it can trust.",
      contribution:
        "Built it end to end: Google sign-in with admin approval, automated monthly rent, partial payments, printable receipts, and Cashfree payments verified through signed, idempotent webhooks.",
      stack: ["Next.js 16", "TypeScript", "Better Auth", "Drizzle ORM", "Neon PostgreSQL", "Cashfree"],
      repo: "https://github.com/rajatrsrivastav/apna-hostel",
      live: "https://apna-hostel-zeta.vercel.app",
      image: {
        src: "/projects/apna-hostel.jpg",
        alt: "Apna Hostel sign-in page",
        width: 1280,
        height: 720,
      },
    },
    {
      name: "termrent",
      summary: "End-to-end encrypted file exchange between a terminal and any device on the same network.",
      problem:
        "Moving a file between a laptop and a phone usually means a cable or a detour through a cloud upload.",
      contribution:
        "Author. Terminal and browser peers share one AES-256-GCM encrypted WebSocket protocol; the relay never sees keys or plaintext. Phones pair by QR code and nearby rooms are found over mDNS.",
      stack: ["Node.js", "WebSockets", "WebCrypto", "mDNS"],
      repo: "https://github.com/rajatrsrivastav/termrent",
      live: null,
      image: null,
    },
    {
      name: "PeerBot",
      summary: "Create focused AI chatbots from your own instructions and context.",
      problem:
        "Teams want an assistant that answers only from their own material, without building a chatbot each time.",
      contribution:
        "Built the full-stack app: email and Google sign-in, chatbot create, update and delete flows, a public gallery, and Gemini-powered conversations.",
      stack: ["Next.js", "MongoDB", "NextAuth", "Gemini API"],
      repo: "https://github.com/rajatrsrivastav/Peer_Bot",
      live: "https://peerbot-ai.vercel.app",
      image: null,
    },
  ] satisfies Project[],

  experience: [
    {
      role: "Full-stack engineer, internship",
      company: "Safcurl Technologies",
      period: "Apr – Aug 2026",
      place: "Remote",
      points: [
        "Provisioned secure AWS EC2 environments with Terraform and OIDC-based session access.",
        "Built a polymorphic authentication layer and an Nginx API gateway that enforce multi-tenancy across microservices.",
        "Built Razorpay webhook listeners for auth-first, charge-later billing, with Resend for system emails.",
      ],
      proof: {
        label: "Completion letter",
        href: "https://drive.google.com/file/d/1jmB4c72-UxUmNKrKPyqVNMARUCFynWv2/view?usp=sharing",
      },
    },
  ],

  education: [
    { degree: "B.Tech, Data Science", school: "Newton School of Technology, Rishihood University", period: "2024 – 2028" },
    { degree: "B.S., Artificial Intelligence & Machine Learning", school: "Indian Institute of Technology Guwahati", period: "2024 – 2028" },
  ],

  /**
   * The exploded view of the card: each physical layer carries one layer of
   * the stack. Groups come from the skills section of the resume.
   */
  stack: [
    { layer: "face", label: "Interface", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
    { layer: "inlay", label: "Services", items: ["Go", "Node.js", "Express", "Nginx"] },
    { layer: "core", label: "Platform", items: ["Kubernetes", "Docker", "Terraform", "AWS", "GitHub Actions"] },
    { layer: "back", label: "Data", items: ["PostgreSQL", "MongoDB", "MySQL", "Prisma"] },
  ] satisfies StackLayer[],

  skills: [
    { area: "Languages", items: ["Go", "TypeScript", "Python", "SQL", "Bash"] },
    { area: "Infrastructure", items: ["Kubernetes", "Docker", "Terraform", "AWS", "GitHub Actions", "Nginx"] },
    { area: "Product", items: ["Next.js", "React", "Node.js", "PostgreSQL", "MongoDB"] },
  ],

  /** Shown until `showUntil`, then hidden automatically. Set to `null` to remove. */
  event: {
    text: "Meeting Web3 and infrastructure teams at the Devcon career fair in Mumbai on 6 November 2026.",
    showUntil: "2026-11-07T23:59:59+05:30",
  } as { text: string; showUntil: string } | null,

  /** TODO: set to this repository's public GitHub URL once it is pushed. */
  sourceUrl: null as string | null,
};

export type Profile = typeof profile;
