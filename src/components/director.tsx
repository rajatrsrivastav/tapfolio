"use client";

import { useEffect } from "react";

type Live = { el: HTMLElement; from: number; to: number };
type Track = { el: HTMLElement; kind: "scene" | "reveal"; current: number; target: number; live: Live[] };

const SMOOTHING = 0.12; // share of the remaining distance covered each frame
const clamp = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Drives every scroll-scrubbed effect on the page. Each `[data-scene]` gets
 * --p (how far the reader has scrolled through it) and each `[data-reveal]`
 * gets --v (how far it has risen into view). Values ease towards their
 * targets, which gives the film its weight without hijacking the scroll.
 * The pointer, or the phone's tilt on Android, sets --mx and --my.
 *
 * Links that only appear for part of a scene carry `data-live="from to"`
 * (scene progress). Outside that range they are made inert, so a link that
 * has faded out can't be tapped or reached with the keyboard.
 *
 * It does nothing unless the head script chose full motion.
 */
export function Director() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.motion !== "full") return;

    const tracks: Track[] = [
      ...Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"), (el) => ({
        el,
        kind: "scene" as const,
        current: 0,
        target: 0,
        live: Array.from(el.querySelectorAll<HTMLElement>("[data-live]"), (link) => {
          const [from, to] = (link.dataset.live ?? "0 1").split(" ").map(Number);
          return { el: link, from, to };
        }),
      })),
      ...Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"), (el) => ({
        el,
        kind: "reveal" as const,
        current: 0,
        target: 0,
        live: [],
      })),
    ];

    let pointerX = 0;
    let pointerY = 0;
    let tiltX = 0;
    let tiltY = 0;
    let frame = 0;

    function measure() {
      const viewport = window.innerHeight;
      for (const track of tracks) {
        const rect = track.el.getBoundingClientRect();
        if (track.kind === "scene") {
          const distance = rect.height - viewport;
          track.target = distance > 0 ? clamp(-rect.top / distance) : 0;
        } else {
          // 0 when the top edge enters the bottom of the screen, 1 at 40% up.
          track.target = clamp((viewport - rect.top) / (viewport * 0.6));
        }
      }
    }

    function tick() {
      let moving = false;
      for (const track of tracks) {
        const delta = track.target - track.current;
        if (Math.abs(delta) > 0.0004) {
          track.current += delta * SMOOTHING;
          moving = true;
        } else {
          track.current = track.target;
        }
        track.el.style.setProperty(track.kind === "scene" ? "--p" : "--v", track.current.toFixed(4));
        for (const link of track.live) {
          const on = track.current >= link.from && track.current <= link.to;
          if (on !== !link.el.inert) {
            link.el.inert = !on;
            link.el.toggleAttribute("data-on", on);
          }
        }
      }

      const dx = pointerX - tiltX;
      const dy = pointerY - tiltY;
      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
        tiltX += dx * 0.08;
        tiltY += dy * 0.08;
        root.style.setProperty("--mx", tiltX.toFixed(3));
        root.style.setProperty("--my", tiltY.toFixed(3));
        moving = true;
      }

      frame = moving ? requestAnimationFrame(tick) : 0;
    }

    function wake() {
      if (!frame) frame = requestAnimationFrame(tick);
    }

    function onScroll() {
      measure();
      wake();
    }

    function onPointer(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      pointerY = (event.clientY / window.innerHeight) * 2 - 1;
      wake();
    }

    // Android reports orientation without a permission prompt; iOS requires
    // one, so iPhones simply keep the scroll-driven motion.
    function onOrientation(event: DeviceOrientationEvent) {
      if (event.gamma == null || event.beta == null) return;
      pointerX = Math.max(-1, Math.min(1, event.gamma / 30));
      pointerY = Math.max(-1, Math.min(1, (event.beta - 45) / 30));
      wake();
    }

    measure();
    for (const track of tracks) track.current = track.target;
    tick();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("deviceorientation", onOrientation, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onOrientation);
    };
  }, []);

  return null;
}
