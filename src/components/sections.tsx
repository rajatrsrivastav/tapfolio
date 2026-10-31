import { cacheLife } from "next/cache";
import Image from "next/image";
import type { ReactNode } from "react";
import { profile, type Project } from "@/content/profile";
import { ExternalIcon, LinkIcon } from "@/components/icons";
import { publicFileExists, visibleLinks } from "@/lib/site";

function Heading({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <header className="mx-auto max-w-[44rem] text-center">
      <p className="hud text-fog">{eyebrow}</p>
      <h2
        id={`${id}-title`}
        className="mt-4 text-[clamp(1.9rem,6.6vw,3.25rem)] leading-[1.05] font-light tracking-[-0.015em] text-paper"
      >
        {title}
      </h2>
      {children && <p className="mx-auto mt-4 max-w-[32rem] text-[15px] leading-relaxed text-fog">{children}</p>}
    </header>
  );
}

function ExternalLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={`inline-flex min-h-11 items-center gap-1.5 text-[14.5px] font-medium text-field underline-offset-4 hover:underline ${className}`}
    >
      {children}
      <ExternalIcon />
    </a>
  );
}

/** termrent has no public deployment, so it gets a diagram of how it works. */
function TransferDiagram() {
  return (
    <svg viewBox="0 0 320 120" className="h-auto w-full" role="img" aria-labelledby="termrent-diagram">
      <title id="termrent-diagram">A terminal and a phone exchange files through a relay that only sees ciphertext</title>
      <g fill="none" stroke="#95a2be" strokeWidth="1.5">
        <rect x="8" y="30" width="80" height="54" rx="7" />
        <path d="M21 49l8 6-8 6M35 63h14" stroke="#eef1f8" />
        <rect x="262" y="20" width="46" height="74" rx="9" />
        <path d="M279 28h12" />
      </g>
      <g stroke="#b4a7ff" strokeWidth="1.5" fill="none">
        <path d="M94 57h162" strokeDasharray="3 5" />
        <rect x="146" y="43" width="28" height="28" rx="6" fill="#0b1326" />
        <path d="M155 55v-3a5 5 0 0 1 10 0v3" />
        <rect x="152" y="55" width="16" height="11" rx="2" fill="#b4a7ff" stroke="none" />
      </g>
      <g fill="#95a2be" fontSize="10" fontFamily="inherit" textAnchor="middle">
        <text x="48" y="102">terminal</text>
        <text x="160" y="32">AES-256-GCM</text>
        <text x="160" y="90">relay sees ciphertext</text>
        <text x="285" y="110">phone</text>
      </g>
    </svg>
  );
}

function ProjectVisual({ project }: { project: Project }) {
  if (project.image && publicFileExists(project.image.src)) {
    return (
      <figure className="overflow-hidden rounded-[22px] border border-white/10 bg-panel shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)]">
        <div className="flex h-8 items-center gap-1.5 border-b border-white/8 bg-[#0d162b] px-3.5" aria-hidden>
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          {project.live && (
            <span className="ml-2 truncate text-[11.5px] text-fog">{project.live.replace(/^https?:\/\//, "")}</span>
          )}
        </div>
        <div className="overflow-hidden">
          <Image
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            sizes="(min-width: 1024px) 560px, 100vw"
            className="panel-image aspect-[16/9] w-full object-cover object-top"
          />
        </div>
      </figure>
    );
  }
  if (project.name === "termrent") {
    return (
      <figure className="rounded-[22px] border border-white/10 bg-[radial-gradient(ellipse_at_50%_0%,rgb(124_151_212/0.18),transparent_70%),#0d162b] px-6 py-8 sm:px-12">
        <TransferDiagram />
      </figure>
    );
  }
  return null;
}

function ProjectPanel({ project, index }: { project: Project; index: number }) {
  const hasVisual = Boolean(project.image && publicFileExists(project.image.src)) || project.name === "termrent";

  return (
    <article
      data-reveal
      className={`panel mx-auto grid w-full origin-top gap-7 ${
        hasVisual ? "max-w-[60rem] md:grid-cols-[1.35fr_1fr] md:items-center md:gap-12" : "max-w-[44rem]"
      }`}
    >
      {hasVisual && (
        <div className={index % 2 === 1 ? "md:order-2" : undefined}>
          <ProjectVisual project={project} />
        </div>
      )}
      <div>
        <h3 className="font-semiwide text-[24px] leading-tight font-bold text-paper">{project.name}</h3>
        <p className="mt-2 text-[16px] leading-relaxed font-light text-paper/90">{project.summary}</p>
        <dl className="mt-5 grid gap-4 text-[14.5px] leading-relaxed">
          <div>
            <dt className="hud text-[10px] text-fog">Problem</dt>
            <dd className="mt-1 text-paper/80">{project.problem}</dd>
          </div>
          <div>
            <dt className="hud text-[10px] text-fog">My part</dt>
            <dd className="mt-1 text-paper/80">{project.contribution}</dd>
          </div>
        </dl>
        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={`${project.name} technology`}>
          {project.stack.map((tech) => (
            <li key={tech} className="rounded-md border border-white/10 px-2 py-1 text-[12.5px] text-fog">
              {tech}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-x-6">
          {project.live && <ExternalLink href={project.live}>Live site</ExternalLink>}
          <ExternalLink href={project.repo}>Source on GitHub</ExternalLink>
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="relative px-5 pt-16 pb-28 sm:px-8">
      <Heading id="projects" eyebrow="Selected work" title="things I’ve built" />
      <div className="mt-16 grid gap-24 md:mt-20 md:gap-32">
        {profile.projects.map((project, index) => (
          <ProjectPanel key={project.name} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}

/** Checked on the server and cached for an hour, so the note disappears after the event. */
async function eventIsUpcoming(showUntil: string) {
  "use cache";
  cacheLife("hours");
  return Date.now() <= Date.parse(showUntil);
}

async function EventNote() {
  const event = profile.event;
  if (!event || !(await eventIsUpcoming(event.showUntil))) return null;
  return (
    <p className="border-l-2 border-field/60 pl-4 text-[14.5px] leading-relaxed text-fog">{event.text}</p>
  );
}

function ConnectButtons() {
  const links = visibleLinks();
  const linkedin = links.find((link) => link.kind === "linkedin");
  const x = links.find((link) => link.kind === "x");
  return (
    <div className="flex flex-wrap gap-2.5">
      {linkedin && (
        <a
          href={linkedin.href}
          target="_blank"
          rel="noopener me"
          className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-field px-5 text-[15px] font-semibold text-abyss transition-colors hover:bg-[#c4b9ff]"
        >
          <LinkIcon kind="linkedin" className="size-[18px]" />
          Connect on LinkedIn
        </a>
      )}
      {x && (
        <a
          href={x.href}
          target="_blank"
          rel="noopener me"
          className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/12 bg-white/[0.05] px-5 text-[15px] font-medium text-paper transition-colors hover:bg-white/[0.1]"
        >
          <LinkIcon kind="x" className="size-4" />
          Follow on X
        </a>
      )}
    </div>
  );
}

/** First thing after the film: a plain-language introduction, and a way to connect. */
export function Introduction() {
  const hasPhoto = publicFileExists(profile.photo.src);
  return (
    <section id="about" aria-labelledby="about-title" className="relative px-5 pt-24 pb-20 sm:px-8 md:pt-32">
      <div className="mx-auto grid max-w-[52rem] items-center gap-10 md:grid-cols-[15rem_1fr] md:gap-14">
        {hasPhoto && (
          <Image
            src={profile.photo.src}
            alt={profile.photo.alt}
            width={profile.photo.width}
            height={profile.photo.height}
            sizes="240px"
            className="mx-auto size-44 rounded-[32px] object-cover ring-1 ring-field/40 md:size-60"
          />
        )}
        <div>
          <p className="hud text-fog">About</p>
          <h2
            id="about-title"
            className="mt-3 text-[clamp(1.9rem,6.6vw,3.25rem)] leading-[1.05] font-light tracking-[-0.015em] text-paper"
          >
            hi, I’m {profile.givenName}
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed font-light text-paper/90">{profile.intro}</p>

          <dl className="mt-6 grid gap-3 text-[14.5px] sm:grid-cols-[7.5rem_1fr] sm:gap-x-4">
            <dt className="hud pt-[3px] text-[10px] text-fog">Looking for</dt>
            <dd className="-mt-2 text-paper sm:mt-0">{profile.lookingFor}</dd>
            <dt className="hud pt-[3px] text-[10px] text-fog">Based in</dt>
            <dd className="-mt-2 text-paper sm:mt-0">{profile.location}</dd>
          </dl>

          <div className="mt-6 grid gap-6">
            <EventNote />
            <ConnectButtons />
          </div>
        </div>
      </div>
    </section>
  );
}

const pillarIcons = [
  // A window with layers: a product, front to back
  <svg key="product" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" aria-hidden>
    <rect x="3" y="4" width="18" height="13" rx="2.5" />
    <path d="M3 8h18M8 20h8M12 17v3" />
  </svg>,
  // A cloud
  <svg key="cloud" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" aria-hidden>
    <path d="M7 18h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.6 9.1 4.5 4.5 0 0 0 7 18Z" />
  </svg>,
  // A branch merging back: open source
  <svg key="oss" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden>
    <circle cx="6" cy="5" r="2" />
    <circle cx="6" cy="19" r="2" />
    <circle cx="18" cy="9" r="2" />
    <path d="M6 7v10M18 11c0 4-6 3-11.2 6.5" />
  </svg>,
];

/** What he does, in plain language, each with one piece of evidence. */
export function WhatIDo() {
  const merged = String(profile.upstream.pulls.length);
  return (
    <section id="what-i-do" aria-labelledby="what-i-do-title" className="relative px-5 pt-12 pb-24 sm:px-8">
      <Heading id="what-i-do" eyebrow="What I do" title="the short version" />
      <ul className="mx-auto mt-14 grid max-w-[60rem] gap-4 md:grid-cols-3 md:gap-5">
        {profile.pillars.map((pillar, index) => (
          <li
            key={pillar.title}
            data-reveal
            className="panel flex flex-col rounded-[22px] border border-white/10 bg-[linear-gradient(160deg,rgb(124_151_212/0.1),transparent_60%),#0c1428] p-6"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-field/12 text-field">{pillarIcons[index]}</span>
            <h3 className="font-semiwide mt-5 text-[19px] leading-snug font-bold text-paper">{pillar.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-paper/80">{pillar.body.replace("{merged}", merged)}</p>
            <ExternalLink href={pillar.link.href} className="mt-auto pt-3">
              {pillar.link.label}
            </ExternalLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Experience, education and tools: the detail behind the short version. */
export function Background() {
  return (
    <section id="background" aria-labelledby="background-title" className="relative px-5 pt-16 pb-24 sm:px-8">
      <Heading id="background" eyebrow="Background" title="experience and education" />

      <div className="mx-auto mt-14 grid max-w-[44rem] gap-10">
        {profile.experience.map((job) => (
          <article key={job.company} data-reveal className="row-reveal">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-[17px] font-semibold text-paper">{job.company}</h3>
              <p className="text-[13.5px] text-fog tabular-nums">{job.period}</p>
            </div>
            <p className="mt-0.5 text-[14.5px] text-fog">
              {job.role}, {job.place.toLowerCase()}
            </p>
            <ul className="mt-3 grid gap-2 text-[14.5px] leading-relaxed text-paper/85">
              {job.points.map((point) => (
                <li
                  key={point}
                  className="relative pl-4 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2 before:bg-field/70"
                >
                  {point}
                </li>
              ))}
            </ul>
            {job.proof && (
              <ExternalLink href={job.proof.href} className="mt-1">
                {job.proof.label}
              </ExternalLink>
            )}
          </article>
        ))}

        <ul data-reveal className="row-reveal grid gap-4 border-t border-rule pt-7">
          {profile.education.map((item) => (
            <li key={item.school} className="grid grid-cols-[1fr_auto] items-baseline gap-x-4">
              <p className="text-[15px] font-medium text-paper">{item.degree}</p>
              <p className="text-[13.5px] whitespace-nowrap text-fog tabular-nums">{item.period}</p>
              <p className="col-span-2 mt-0.5 text-[14px] text-fog">{item.school}</p>
            </li>
          ))}
        </ul>

        <div data-reveal className="row-reveal border-t border-rule pt-7">
          <h3 className="hud text-[10px] text-fog">Tools I use</h3>
          <dl className="mt-4 grid gap-3 text-[14.5px] sm:grid-cols-[7rem_1fr] sm:gap-x-4">
            {profile.stack.map((group) => (
              <div key={group.label} className="contents">
                <dt className="pt-px text-fog">{group.label}</dt>
                <dd className="-mt-2 mb-1 text-paper/90 sm:mt-0 sm:mb-0">{group.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
