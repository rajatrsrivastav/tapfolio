import Image from "next/image";
import { profile } from "@/content/profile";
import { Director } from "@/components/director";
import { Film } from "@/components/film";
import { Finale } from "@/components/finale";
import { Intro } from "@/components/intro";
import { About, Projects, Upstream } from "@/components/sections";
import { CopyLinkButton, Dock } from "@/components/share-actions";
import { availableResumes, publicFileExists, siteUrl, visibleLinks } from "@/lib/site";

function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: profile.name,
      url: siteUrl,
      image: `${siteUrl}${profile.photo.src}`,
      jobTitle: profile.role,
      description: profile.headline,
      email: `mailto:${profile.email}`,
      homeLocation: { "@type": "Place", name: profile.location },
      sameAs: visibleLinks().map((link) => link.href),
      alumniOf: profile.education.map((item) => ({ "@type": "CollegeOrUniversity", name: item.school })),
      knowsAbout: profile.stack.flatMap((layer) => layer.items),
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function ProfilePage() {
  const resumes = availableResumes();
  const primary = resumes[0];
  const share = { url: siteUrl, title: `${profile.name}, ${profile.role.toLowerCase()}`, text: profile.headline };

  return (
    <>
      <Intro />
      <a
        href="#upstream"
        className="sr-only z-[80] rounded-lg bg-field px-4 py-3 font-semibold text-abyss focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to work
      </a>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 bg-[linear-gradient(to_bottom,#060a14_0%,rgb(6_10_20/0.85)_55%,transparent)]">
        <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-5 sm:px-8">
          <a href="#hero-name" className="pointer-events-auto flex min-h-11 items-center gap-3">
            {publicFileExists(profile.photo.src) && (
              <Image
                src={profile.photo.src}
                alt=""
                width={64}
                height={64}
                sizes="32px"
                className="size-8 rounded-[10px] object-cover ring-1 ring-white/20"
              />
            )}
            <span className="hud text-[10.5px] text-paper/90">{profile.name}</span>
          </a>
          <div className="pointer-events-auto">
            <CopyLinkButton share={share} />
          </div>
        </div>
      </header>

      <span aria-hidden className="rail left-3 hidden sm:block md:left-6" />
      <span aria-hidden className="rail right-3 hidden sm:block md:right-6" />

      <main>
        <Film />
        <Upstream />
        <Projects />
        <About />
        <Finale />

        <footer className="px-5 pt-10 pb-36 text-center sm:px-8">
          <p className="mx-auto max-w-[36rem] text-[12.5px] leading-relaxed text-fog">
            Tapfolio is {profile.givenName}’s independent page, reached from an NFC card or QR code. It is not
            affiliated with or endorsed by Devcon, the Ethereum Foundation or any employer.
          </p>
          {profile.sourceUrl && (
            <a href={profile.sourceUrl} className="mt-2 inline-block text-[12.5px] text-field underline-offset-4 hover:underline">
              Source on GitHub
            </a>
          )}
        </footer>
      </main>

      <Dock
        share={share}
        resume={primary ? { href: primary.file, label: primary.id === "web3" ? "Web3 resume" : "Resume" } : null}
        contactHref="/contact.vcf"
      />
      <Director />
      <StructuredData />
    </>
  );
}
