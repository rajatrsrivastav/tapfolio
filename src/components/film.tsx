import type { CSSProperties } from "react";
import { profile } from "@/content/profile";
import { CardStack, LAYER_Z } from "@/components/card";
import { ExternalIcon, LinkIcon } from "@/components/icons";
import { visibleLinks } from "@/lib/site";

const vars = (values: Record<string, string | number>) => values as CSSProperties;

/** Secondary ways to reach him; LinkedIn and X live in the dock. */
function SocialLinks() {
  const links = [
    ...visibleLinks().filter((link) => link.kind !== "linkedin" && link.kind !== "x"),
    { kind: "email" as const, label: "Email", href: `mailto:${profile.email}` },
  ];
  return (
    <ul className="flex justify-center gap-1" aria-label="Profiles and contact">
      {links.map((link) => (
        <li key={link.kind}>
          <a
            href={link.href}
            {...(link.kind === "email" ? {} : { target: "_blank", rel: "noopener me" })}
            aria-label={link.label}
            title={link.label}
            className="grid size-11 place-items-center rounded-xl text-fog transition-colors duration-150 hover:bg-white/[0.07] hover:text-paper"
          >
            <LinkIcon kind={link.kind} className="size-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Each layer of the exploded card, labelled with the channel it opens. */
function ChannelLabels() {
  const links = visibleLinks();
  const channels = profile.channels.flatMap((channel) => {
    const link = links.find((candidate) => candidate.kind === channel.kind);
    return link ? [{ ...channel, label: link.label, href: link.href }] : [];
  });

  return (
    <ul aria-label="Ways to stay in touch">
      {channels.map((channel, index) => (
        <li
          key={channel.kind}
          className="hud-label"
          style={vars({ "--z": LAYER_Z[channel.layer], "--i": index })}
        >
          {/* Only reachable while the layers are apart (see Director) */}
          <a
            href={channel.href}
            target="_blank"
            rel="noopener me"
            data-live="0.33 0.59"
            className="hud-label-inner group rounded-lg"
          >
            <span aria-hidden className="hud-leader" />
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 text-field">
                <LinkIcon kind={channel.kind} className="size-3 md:size-3.5" />
                <span className="hud text-[9.5px] md:text-[10.5px]">{channel.label}</span>
              </span>
              <span className="mt-0.5 flex items-center gap-1 text-[13px] font-medium text-paper group-hover:underline md:mt-1 md:text-[15px]">
                {channel.action}
                <ExternalIcon className="size-3 opacity-70" />
              </span>
              <span className="block truncate text-[11px] text-fog md:text-[12.5px]">{channel.detail}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * The opening shot, scrubbed by scroll: the card introduces who I am, lies down
 * and comes apart into its layers, each one a way to stay in touch, then
 * closes again and fires a beam: the moment of contact, which leads into
 * the introduction.
 */
export function Film() {
  return (
    <section data-scene className="stage film" aria-labelledby="hero-name">
      <div className="stage-pin film-pin">
        {/* Sky: a dawn glow behind the card that sets as the film moves on */}
        {/* Ends on the page colour, so no seam shows when the film scrolls away */}
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#060a14_0%,#0d1830_50%,#060a14_100%)]" />
        <div
          aria-hidden
          className="sky-dawn absolute inset-0 bg-[radial-gradient(ellipse_70%_48%_at_50%_46%,rgb(124_151_212/0.55)_0%,rgb(42_61_115/0.45)_42%,transparent_75%)]"
        />

        <div className="film-layout relative mx-auto flex h-full max-w-[1180px] flex-col px-5">
          <p className="beat-hero enter-fade hud text-center text-[12.5px] text-paper md:text-[13.5px]" style={vars({ "--d": "0ms" })}>
            {profile.tagline}
          </p>

          <div className="card-zone relative">
            {/* The beam: the tap, made visible */}
            <div
              aria-hidden
              className="beam pointer-events-none absolute bottom-1/2 left-1/2 h-[70svh] w-[min(46vw,220px)] -translate-x-1/2 origin-bottom"
            >
              <span className="absolute inset-0 bg-[linear-gradient(to_top,rgb(180_167_255/0.85),rgb(180_167_255/0.25)_45%,transparent)] blur-[28px]" />
              <span className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-[linear-gradient(to_top,#fff,rgb(196_185_255/0.8)_40%,transparent)] blur-[0.5px]" />
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span
                aria-hidden
                className="shadow absolute -bottom-[10%] left-1/2 h-[9%] w-[90%] -translate-x-1/2 rounded-[50%] bg-black blur-[22px]"
              />
              <div className="enter-card">
                <div className="card-frame">
                  <div className="card-pose">
                    <CardStack />
                  </div>
                </div>
              </div>
            </div>

            {/* Where the beam meets the card: a glint on its far edge */}
            <span
              aria-hidden
              className="beam-flare pointer-events-none absolute top-1/2 left-1/2 h-[calc(var(--card-w)*0.06)] w-[calc(var(--card-w)*0.5)] rounded-[50%] bg-[radial-gradient(closest-side,#fff,rgb(196_185_255/0.7)_40%,transparent)] mix-blend-screen"
            />

            {/* HUD labels for the exploded view: one channel per physical layer */}
            <div className="beat-layers-labels">
              <ChannelLabels />
            </div>
          </div>

          <div className="beat-hero hero-copy text-center">
            <h1
              id="hero-name"
              className="enter-fade font-wide text-[clamp(1.9rem,8.4vw,4rem)] leading-none font-extrabold tracking-[-0.02em] text-paper"
              style={vars({ "--d": "80ms" })}
            >
              {profile.name}
            </h1>
            <p
              className="enter-fade mx-auto mt-3 max-w-[30rem] text-[16px] leading-snug font-light text-paper/90 md:text-[19px]"
              style={vars({ "--d": "160ms" })}
            >
              {profile.headline}
            </p>
            <div className="enter-fade mt-3 text-[13.5px] leading-snug" style={vars({ "--d": "240ms" })}>
              <p className="inline-flex items-center gap-2 font-medium text-paper">
                <span aria-hidden className="size-2 rounded-full bg-mint shadow-[0_0_0_3px_rgb(125_219_178/0.2)]" />
                {profile.availability}
              </p>
              <p className="mt-0.5 text-fog">{profile.availabilityDetail}</p>
            </div>
            <div className="enter-fade mt-2" style={vars({ "--d": "320ms" })}>
              <SocialLinks />
            </div>
          </div>

          {/* Beat two: the exploded view */}
          <div className="beat-layers beat-overlay text-center">
            <h2 className="text-[clamp(1.75rem,6.4vw,3rem)] leading-[1.05] font-light tracking-[-0.01em] text-paper">
              ways to connect
            </h2>
            <p className="mx-auto mt-3 max-w-[22rem] text-[14px] leading-relaxed text-fog">
              LinkedIn, X, GitHub and my portfolio — pick whichever works for you.
            </p>
          </div>

          {/* Beat three: the beam, the moment of contact, into the introduction */}
          <div aria-hidden className="beat-beam beat-overlay text-center">
            <p className="text-[clamp(1.75rem,6.4vw,3rem)] leading-[1.05] font-light tracking-[-0.01em] text-paper">
              what I’m working on
            </p>
            <p className="mx-auto mt-3 max-w-[22rem] text-[14px] leading-relaxed text-fog">
              Projects, open-source contributions and experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
