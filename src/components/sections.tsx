import { cacheLife } from "next/cache";
import Image from "next/image";
import type { ReactNode } from "react";
import { profile, type Project, type PullRequest } from "@/content/profile";
import { ExternalIcon } from "@/components/icons";
import { publicFileExists } from "@/lib/site";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-09-07" → "7 Sep 2026", identical on every server and browser locale. */
function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

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

/** Split "fix(controller): decouple …" into its kind and a readable sentence. */
function parseTitle(pull: PullRequest) {
  const match = pull.title.match(/^(\w+)(?:\(([^)]+)\))?:\s*(.+)$/);
  if (!match) return { kind: null, text: pull.title };
  const [, type, scope, rest] = match;
  return { kind: scope ? `${type}(${scope})` : type, text: rest.charAt(0).toUpperCase() + rest.slice(1) };
}

export function Upstream() {
  const { upstream } = profile;
  return (
    <section id="upstream" aria-labelledby="upstream-title" className="relative px-5 pt-24 pb-28 sm:px-8 md:pt-32">
      <Heading id="upstream" eyebrow="Open source" title={`Merged into ${upstream.project}`}>
        {upstream.description}
      </Heading>

      <ol className="mx-auto mt-14 max-w-[52rem] border-b border-rule">
        {upstream.pulls.map((pull) => {
          const { kind, text } = parseTitle(pull);
          return (
            <li key={pull.number} data-reveal className="row-reveal border-t border-rule">
              <a
                href={`${upstream.repo}/pull/${pull.number}`}
                target="_blank"
                rel="noopener"
                className="group grid grid-cols-[4.5rem_1fr] gap-x-3 py-4 transition-colors duration-150 hover:bg-white/[0.03] sm:grid-cols-[5.5rem_1fr_auto] sm:items-baseline sm:px-3"
              >
                <span className="font-semiwide text-[15px] font-semibold text-field tabular-nums">#{pull.number}</span>
                <span className="min-w-0">
                  <span className="block text-[15.5px] leading-snug text-paper group-hover:underline group-hover:decoration-field/60 group-hover:underline-offset-4">
                    {text}
                  </span>
                  <span className="mt-1 block text-[13px] text-fog">
                    {kind}
                    <span className="sm:hidden">, merged {formatDate(pull.merged)}</span>
                  </span>
                </span>
                <time dateTime={pull.merged} className="hidden text-[13px] whitespace-nowrap text-fog tabular-nums sm:block">
                  {formatDate(pull.merged)}
                </time>
              </a>
            </li>
          );
        })}
      </ol>
      <div className="mx-auto mt-4 flex max-w-[52rem] flex-wrap justify-center gap-x-8">
        <ExternalLink href={upstream.allMerged}>All merged pull requests</ExternalLink>
        <ExternalLink href={upstream.repo}>Repository</ExternalLink>
      </div>
    </section>
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
  return (
    <article
      data-reveal
      className="panel mx-auto grid max-w-[60rem] origin-top gap-7 md:grid-cols-[1.35fr_1fr] md:items-center md:gap-12"
    >
      <div className={index % 2 === 1 ? "md:order-2" : undefined}>
        <ProjectVisual project={project} />
      </div>
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

export function About() {
  const hasPhoto = publicFileExists(profile.photo.src);
  return (
    <section id="about" aria-labelledby="about-title" className="relative px-5 pt-16 pb-24 sm:px-8">
      <Heading id="about" eyebrow="Background" title="the person behind the card" />

      <div className="mx-auto mt-14 grid max-w-[52rem] gap-12 md:grid-cols-[13rem_1fr] md:gap-14">
        <div className="flex flex-col items-center gap-4 md:items-start">
          {hasPhoto && (
            <Image
              src={profile.photo.src}
              alt={profile.photo.alt}
              width={profile.photo.width}
              height={profile.photo.height}
              sizes="208px"
              className="size-40 rounded-[28px] object-cover ring-1 ring-field/40 md:size-52"
            />
          )}
          <p className="text-center text-[14px] text-fog md:text-left">{profile.location}</p>
        </div>

        <div className="grid gap-10">
          <p className="text-[17px] leading-relaxed font-light text-paper/90">{profile.intro}</p>
          <EventNote />

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
        </div>
      </div>
    </section>
  );
}
