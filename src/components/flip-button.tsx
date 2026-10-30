"use client";

import { useState } from "react";

/** Turns the finale card over by hand, on top of the scroll-driven flip. */
export function FlipButton() {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={flipped}
      onClick={(event) => {
        const scene = event.currentTarget.closest<HTMLElement>(".finale");
        const next = !flipped;
        if (scene) {
          if (next) scene.dataset.flipped = "";
          else delete scene.dataset.flipped;
        }
        setFlipped(next);
      }}
      className="hud inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-[10.5px] text-paper/90 transition-colors hover:bg-white/[0.07]"
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
        <path d="M4 12a8 8 0 0 1 13.7-5.6L20 9M20 4v5h-5M20 12a8 8 0 0 1-13.7 5.6L4 15M4 20v-5h5" />
      </svg>
      Turn over
    </button>
  );
}
