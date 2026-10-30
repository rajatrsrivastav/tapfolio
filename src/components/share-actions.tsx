"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, ContactIcon, CopyIcon, DocumentIcon, ShareIcon } from "@/components/icons";

type ShareData = { url: string; title: string; text: string };
type Notice = { tone: "ok" | "info"; message: string } | null;

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    // Older Android WebViews and non-secure origins have no async clipboard.
    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    }
    field.remove();
    return copied;
  }
}

function useShare({ url, title, text }: ShareData) {
  const [notice, setNotice] = useState<Notice>(null);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function show(next: NonNullable<Notice>) {
    setNotice(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setNotice(null);
      setCopied(false);
    }, 2600);
  }

  async function copyLink() {
    if (await copyText(url)) {
      setCopied(true);
      show({ tone: "ok", message: "Profile link copied" });
    } else {
      show({ tone: "info", message: `Copy this link: ${url}` });
    }
  }

  async function share() {
    const data = { title, text, url };
    if (typeof navigator.share === "function" && (!navigator.canShare || navigator.canShare(data))) {
      try {
        await navigator.share(data);
        return;
      } catch (error) {
        // The visitor closed the share sheet: nothing to report.
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    await copyLink();
  }

  return { notice, copied, share, copyLink };
}

function Toast({ notice, placement }: { notice: Notice; placement: "above" | "below" }) {
  return (
    <div
      aria-live="polite"
      className={`pointer-events-none absolute inset-x-0 z-10 flex justify-center ${
        placement === "above" ? "bottom-full mb-3" : "top-full mt-3"
      }`}
    >
      {notice && (
        <p
          className={`toast-enter max-w-full rounded-lg border px-3.5 py-2 text-sm break-all shadow-lg shadow-black/40 ${
            notice.tone === "ok"
              ? "border-mint/40 bg-[#132a26] text-mint"
              : "pointer-events-auto border-rule bg-panel text-paper select-all"
          }`}
        >
          {notice.message}
        </p>
      )}
    </div>
  );
}

const ghost =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 text-[15px] font-medium text-paper transition-colors duration-150 hover:bg-white/[0.12] active:bg-white/[0.16]";

/** Floating action dock: always within thumb reach, from the first frame. */
export function Dock({
  share: data,
  resume,
  contactHref,
}: {
  share: ShareData;
  resume: { href: string; label: string } | null;
  contactHref: string;
}) {
  const { notice, share } = useShare(data);
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:pb-5">
      <div className="relative mx-auto flex max-w-[34rem] gap-2 rounded-[20px] border border-white/10 bg-[#0a1122]/75 p-2 shadow-[0_20px_60px_-10px_rgb(0_0_0/0.7)] backdrop-blur-xl">
        {resume ? (
          <a
            href={resume.href}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-field px-4 text-[15px] font-semibold whitespace-nowrap text-abyss transition-colors duration-150 hover:bg-[#c4b9ff] active:bg-field-deep"
          >
            <DocumentIcon />
            {resume.label}
          </a>
        ) : null}
        <a href={contactHref} className={`${ghost} whitespace-nowrap`}>
          <ContactIcon />
          <span className="max-[359px]:sr-only">Save contact</span>
        </a>
        <button type="button" onClick={share} className={`${ghost} w-12 shrink-0 px-0`} aria-label="Share profile">
          <ShareIcon />
        </button>
        <Toast notice={notice} placement="above" />
      </div>
    </div>
  );
}

/** Copy-link button for the top bar. */
export function CopyLinkButton({ share: data }: { share: ShareData }) {
  const { notice, copied, copyLink } = useShare(data);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy profile link"
        title="Copy profile link"
        className="grid size-11 place-items-center rounded-xl border border-white/12 bg-white/[0.04] text-paper backdrop-blur-md transition-colors hover:bg-white/[0.1]"
      >
        {copied ? <CheckIcon className="text-mint" /> : <CopyIcon />}
      </button>
      <div className="absolute top-full right-0 w-56">
        <Toast notice={notice} placement="below" />
      </div>
    </div>
  );
}
