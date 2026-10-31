import { profile } from "@/content/profile";

/**
 * The opening sequence, once per browser session. A loading line types what
 * Rajat builds, then his name; the camera pushes into the cursor, which lands
 * as the edge of the card in the hero, and the card turns into place.
 *
 * It runs from an inline script as the page is parsed, not after hydration,
 * so it starts at first paint on every device and covers the time the page's
 * JavaScript takes to load instead of adding to it. The script only changes
 * attributes and styles of this markup, which hydration leaves alone.
 *
 * The inline script in <head> decides before first paint whether it plays
 * (never with reduced motion). If the sequence never runs, CSS fades the
 * overlay out on its own. Any tap, key or scroll skips it.
 */
export function Intro() {
  const config = JSON.stringify({ words: profile.loadingWords, name: profile.name }).replace(/</g, "\\u003c");

  return (
    <>
      <div className="intro" suppressHydrationWarning>
        <div aria-hidden className="intro-base" />
        <div aria-hidden className="intro-sky" />
        <div aria-hidden className="intro-stage">
          <div className="intro-line font-mono" suppressHydrationWarning>
            <span className="intro-prefix">Loading</span>
            <span className="intro-box" suppressHydrationWarning>
              <span className="intro-corner" data-corner="tl" />
              <span className="intro-corner" data-corner="tr" />
              <span className="intro-corner" data-corner="bl" />
              <span className="intro-corner" data-corner="br" />
              {/* Text goes in data-text (shown with ::before), so typing never changes the DOM tree */}
              <span className="intro-word" suppressHydrationWarning />
              <span className="intro-caret" />
              <span className="intro-word intro-ghost" suppressHydrationWarning />
            </span>
          </div>
        </div>
        <span aria-hidden className="intro-flight" suppressHydrationWarning />
        <button type="button" className="intro-skip font-mono">
          Skip intro
        </button>
      </div>
      <script dangerouslySetInnerHTML={{ __html: `(${introScript.toString()})(${config})` }} />
    </>
  );
}

/**
 * The sequence. It is inlined with toString(), so it must not use anything
 * from outside its own body.
 */
function introScript({ words, name }: { words: string[]; name: string }) {
  const html = document.documentElement;
  const root = document.querySelector<HTMLElement>(".intro");
  if (!root || html.dataset.intro !== "play") return;

  const pick = (selector: string) => root.querySelector<HTMLElement>(selector)!;
  const line = pick(".intro-line");
  const box = pick(".intro-box");
  const word = pick(".intro-word");
  const ghost = pick(".intro-ghost");
  const caret = pick(".intro-caret");
  const flight = pick(".intro-flight");

  let ended = false;
  let frame = 0;
  const timers: number[] = [];

  const phase = (value: string) => {
    html.dataset.intro = value;
  };
  // Every wait goes through here, so ending the intro stops the sequence.
  const sleep = (ms: number) =>
    new Promise<void>((resolve) => {
      if (!ended) timers.push(window.setTimeout(resolve, ms));
    });
  const smoothstep = (t: number) => {
    const x = Math.min(1, Math.max(0, t));
    return x * x * (3 - 2 * x);
  };

  async function type(text: string, speed: number) {
    // The brackets open to the finished word first; the letters follow.
    ghost.dataset.text = text;
    box.style.setProperty("--w", `${ghost.getBoundingClientRect().width}px`);
    root!.dataset.typing = "";
    await sleep(90);
    for (let i = 1; i <= text.length; i++) {
      word.dataset.text = text.slice(0, i);
      await sleep(text[i - 1] === " " ? speed * 2 : speed);
    }
    delete root!.dataset.typing;
  }

  async function erase() {
    const text = word.dataset.text ?? "";
    root!.dataset.typing = "";
    box.style.removeProperty("--w");
    for (let i = text.length - 1; i >= 0; i--) {
      word.dataset.text = text.slice(0, i);
      await sleep(20);
    }
    delete root!.dataset.typing;
    await sleep(120);
  }

  /** Where the cursor lands: the hero card's centre, at the card's height. */
  function target() {
    const rect = document.querySelector(".film .card-frame")?.getBoundingClientRect();
    if (rect && rect.height > 0 && rect.top >= 0 && rect.bottom <= innerHeight) {
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, height: rect.height * 0.97 };
    }
    return { x: innerWidth / 2, y: innerHeight / 2, height: Math.min(innerHeight * 0.3, 260) };
  }

  /**
   * The camera push. The line scales about the cursor, slowly and then fast,
   * until the letters fly past; the cursor travels with it but stops growing
   * at the card's height, so it ends as the card seen edge-on.
   */
  function push() {
    return new Promise<void>((resolve) => {
      const from = caret.getBoundingClientRect();
      const bounds = line.getBoundingClientRect();
      const fx = from.left + from.width / 2;
      const fy = from.top + from.height / 2;
      const to = target();
      const dx = to.x - fx;
      const dy = to.y - fy;
      const reach = to.height / from.height;
      const depth = Math.max(reach * 2.6, 36);
      const duration = 1250;

      line.style.transformOrigin = `${fx - bounds.left}px ${fy - bounds.top}px`;
      Object.assign(flight.style, {
        left: `${from.left}px`,
        top: `${from.top}px`,
        width: `${from.width}px`,
        height: `${from.height}px`,
      });
      phase("zoom");

      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // Exponential scale reads as a steady dolly; the power holds it back at first.
        const scale = Math.pow(depth, Math.pow(t, 2.2));
        const move = smoothstep(t / 0.85);
        const shift = `translate(${dx * move}px, ${dy * move}px)`;
        line.style.transform = `${shift} scale(${scale})`;
        line.style.opacity = `${1 - smoothstep((t - 0.6) / 0.34)}`;
        flight.style.transform = `${shift} scaleY(${Math.min(scale, reach)})`;
        if (t < 1) frame = requestAnimationFrame(tick);
        else resolve();
      };
      frame = requestAnimationFrame(tick);
    });
  }

  function end(skipped: boolean) {
    if (ended) return;
    ended = true;
    timers.forEach(clearTimeout);
    cancelAnimationFrame(frame);
    removeEventListener("keydown", onKey);
    removeEventListener("wheel", skip);
    removeEventListener("touchmove", skip);
    if (skipped) root!.dataset.skipped = "";
    phase("reveal");
    setTimeout(() => phase("done"), skipped ? 600 : 1500);
  }

  function skip() {
    end(true);
  }

  function onKey(event: KeyboardEvent) {
    if (!["Tab", "Shift", "Alt", "Control", "Meta"].includes(event.key)) skip();
  }

  async function play() {
    // Brackets are sized by measuring the type, so load the face first (briefly).
    const font = `500 12px ${getComputedStyle(word).fontFamily}`;
    await Promise.race([document.fonts.load(font).catch(() => {}), sleep(700)]);
    await sleep(160);
    for (const item of words) {
      await type(item, 50);
      await sleep(340);
      await erase();
    }
    await type(name, 40);
    await sleep(420);
    await push();
    end(false);
  }

  addEventListener("keydown", onKey);
  addEventListener("wheel", skip, { passive: true });
  addEventListener("touchmove", skip, { passive: true });
  root.addEventListener("click", skip);
  phase("run");
  play().catch(skip);
}

/** Runs before first paint: picks the motion mode and whether the intro plays. */
export const headScript = `(function(){try{var d=document.documentElement;var r=matchMedia('(prefers-reduced-motion: reduce)').matches;d.dataset.motion=r?'reduce':'full';var s=sessionStorage.getItem('tapfolio-intro');d.dataset.intro=(r||s||location.hash)?'skip':'play';if(!r&&!s)sessionStorage.setItem('tapfolio-intro','1')}catch(e){}})();`;
