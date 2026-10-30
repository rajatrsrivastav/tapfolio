"use client";

/**
 * The opening title. Whether it plays is decided by the inline script in
 * <head> (once per visit, never with reduced motion); tapping skips it.
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
      <div className="hud intro-label text-paper/90">
        <span>Reading</span>
        <span className="intro-brackets">
          <span>Card</span>
          <span>Profile</span>
        </span>
      </div>
      <span className="intro-line" />
    </div>
  );
}

/** Runs before first paint: picks the motion mode and whether the intro plays. */
export const headScript = `(function(){try{var d=document.documentElement;var r=matchMedia('(prefers-reduced-motion: reduce)').matches;d.dataset.motion=r?'reduce':'full';var s=sessionStorage.getItem('tapfolio-intro');d.dataset.intro=(r||s)?'skip':'play';if(!r&&!s)sessionStorage.setItem('tapfolio-intro','1')}catch(e){}})()`;
