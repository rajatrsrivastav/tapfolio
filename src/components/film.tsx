import type { CSSProperties } from "react";
import { profile } from "@/content/profile";
import { CardStack, LAYER_Z } from "@/components/card";
import { LinkIcon } from "@/components/icons";
import { visibleLinks } from "@/lib/site";

const vars = (values: Record<string, string | number>) => values as CSSProperties;

function SocialLinks() {
  const links = [...visibleLinks(), { kind: "email" as const, label: "Email", href: `mailto:${profile.email}` }];
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

/**
 * The opening shot, scrubbed by scroll: the card is held up (who), lies down
 * and comes apart into the layers of the stack (what), then closes again and
 * fires a beam into the upstream work that follows (proof).
 */
export function Film() {
  const pulls = profile.upstream.pulls.length;
  return (
    <section data-scene className="stage film" aria-labelledby="hero-name">
      <div className="stage-pin film-pin">
        {/* Sky: a dawn glow behind the card that sets as the film moves on */}
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#060a14_0%,#0b1326_55%,#0d1830_100%)]" />
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

            {/* HUD labels for the exploded view: one per physical layer */}
            <div className="beat-layers-labels">
              <h2 className="sr-only">The stack, layer by layer</h2>
              <ul>
                {profile.stack.map((layer, index) => (
                  <li
                    key={layer.layer}
                    className="hud-label"
                    style={vars({ "--z": LAYER_Z[layer.layer], "--i": index })}
                  >
                    <div className="hud-label-inner">
                      <span aria-hidden className="hud-leader" />
                      <div>
                        <p className="hud text-[9.5px] text-field md:text-[10.5px]">{layer.label}</p>
                        <p className="mt-0.5 text-[11.5px] leading-[1.3] text-paper/85 md:mt-1 md:text-[13.5px]">
                          {layer.items.join(", ")}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
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
            <p className="text-[clamp(1.75rem,6.4vw,3rem)] leading-[1.05] font-light tracking-[-0.01em] text-paper">
              built in layers
            </p>
            <p className="mx-auto mt-3 max-w-[22rem] text-[14px] leading-relaxed text-fog">
              Each layer of the card carries a layer of the stack I work in.
            </p>
          </div>

          {/* Beat three: the beam, into the pull requests that follow */}
          <div aria-hidden className="beat-beam beat-overlay text-center">
            <p className="text-[clamp(1.75rem,6.4vw,3rem)] leading-[1.05] font-light tracking-[-0.01em] text-paper">
              merged upstream
            </p>
            <p className="mx-auto mt-3 max-w-[22rem] text-[14px] leading-relaxed text-fog">
              {pulls} pull requests merged into {profile.upstream.project}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
