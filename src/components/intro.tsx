"use client";

import { profile } from "@/content/profile";

/**
 * The opening title. A brief, quiet entrance — the name fades in once per
 * session, then gives way to the profile. Tapping anywhere skips it.
 * The inline script in <head> decides before first paint whether to play.
 */
export function Intro() {
  return (
    <div
      className="intro"
      aria-hidden
      onClick={() => {
        document.documentElement.dataset.intro = "skip";
      }}
    >
      <div className="intro-label">
        <span className="intro-name font-wide text-[clamp(1.6rem,7vw,3.2rem)] leading-none font-extrabold tracking-[-0.02em] text-paper/90">
          {profile.givenName} {profile.familyName}
        </span>
        <span className="intro-role mt-3 text-[clamp(0.85rem,2.4vw,1.05rem)] font-light tracking-[0.04em] text-paper/60">
          {profile.headline}
        </span>
      </div>
    </div>
  );
}

/** Runs before first paint: picks the motion mode and whether the intro plays. */
export const headScript = `(function(){try{var d=document.documentElement;var r=matchMedia('(prefers-reduced-motion: reduce)').matches;d.dataset.motion=r?'reduce':'full';var s=sessionStorage.getItem('tapfolio-intro');d.dataset.intro=(r||s)?'skip':'play';if(!r&&!s)sessionStorage.setItem('tapfolio-intro','1')}catch(e){}})();`;
