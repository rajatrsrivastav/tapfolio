# Tapfolio

Rajat Srivastav's NFC developer card. A recruiter taps the card (or scans its QR code) and a fast, mobile-first page opens with his name, the roles he wants, his resume, a one-tap contact card, and verifiable proof of work. No login, no app, no wallet.

## How it works

```
NFC tag / QR code ──> https://card.rajatsrivastav.dev/c  (the same page as /)
                       ├─ View / download resume (PDF in /public/resumes)
                       ├─ Save contact  (/contact.vcf, generated)
                       ├─ Share / copy link (Web Share API, clipboard fallback)
                       ├─ Merged upstream PRs, projects, experience
                       └─ QR code (/qr page, /qr.svg, /qr.png)
```

- **Next.js 16** (App Router, Cache Components), **TypeScript**, **Tailwind CSS 4**. One runtime dependency besides React and Next: `qrcode`.
- Every route is prerendered at build time. The page revalidates hourly only so the Devcon note hides itself after the event.
- No database, CMS, authentication, analytics or tracking.

| Path | What it is |
| --- | --- |
| `src/content/profile.ts` | **All profile data.** The only file you normally edit. |
| `src/lib/site.ts` | Site URL, the permanent card path (`/c`), resume detection |
| `src/lib/vcard.ts`, `src/app/contact.vcf/route.ts` | vCard 3.0 generator (iOS and Android compatible) |
| `src/lib/qr.ts`, `src/app/qr*/` | QR preview page and print-ready SVG/PNG |
| `src/components/film.tsx` | Opening film: hero, exploded stack, beam |
| `src/components/card.tsx` | The 3D card: face, antenna inlay, core, graphite back |
| `src/components/director.tsx` | Scroll engine: writes smoothed progress to CSS variables |
| `src/components/finale.tsx` | Closing shot: the card turns over to show its QR code |
| `src/components/intro.tsx` | "Reading [card] → [stack]" title and the before-paint head script |
| `src/components/sections.tsx` | PR ledger, project panels, background |
| `src/components/share-actions.tsx` | Floating dock (resume, save contact, share) and copy link |
| `src/app/opengraph-image.tsx`, `icon.svg`, `apple-icon.tsx` | Share preview and icons |
| `public/resumes/` | Resume PDFs |

### The cinematic layer

The page plays like a short product film of the card, in the spirit of cred.club/card, without WebGL or video:

1. **Intro** (once per visit, tap to skip): "READING [ CARD ] → [ STACK ]" zooms through the brackets into a line of light, and the card rises into a dawn glow.
2. **Opening film** (pinned, scrubbed by scroll): the card tilts down, separates into its four physical layers, and each layer is labelled with a layer of the stack. The layers close again and a beam fires from the antenna into "merged upstream".
3. **Ledger and projects**: rows slide in, and project panels settle into frame with a parallax screenshot.
4. **Finale**: the card turns over to show a scannable QR code. "Turn over" flips it by hand.

How it is built: each `[data-scene]` section is tall, with a sticky full-screen pin. `director.tsx` measures scroll progress, eases it, and writes it to `--p`. All motion is CSS `transform` and `opacity` derived from `--p` with `clamp()` and smoothstep math in `globals.css`, so the browser stays on the compositor. The mouse tilts the card on desktop, and so does the phone itself on Android.

Name, role, resume and contact are on screen from the first frame. The dock is always within thumb reach.

**Accessibility:** an inline script in `<head>` chooses the mode before first paint. With reduced motion (or without JavaScript) there is no intro, nothing is pinned, and every beat is laid out as a normal, readable page. Reveals move text but never fade it, so contrast holds at every scroll position.

## Local setup

Requires Node.js 20.9 or newer.

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000. Before committing, run all checks (typecheck, lint, production build):

```bash
npm run check
```

## Editing the profile

Everything lives in `src/content/profile.ts`, which documents each field. Values set to `null` are hidden, so nothing fake is ever shown. Search the file for `TODO`.

**Resumes.** Drop PDFs into `public/resumes/` using the file names in `profile.resumes`:

- `rajat-srivastav-web3-resume.pdf`: **missing today.** Add it and it becomes the main "View Web3 resume" button automatically.
- `rajat-srivastav-full-stack-resume.pdf`: present (copied from `fullstack Resume.pdf`).

A resume is shown only if its file exists at build time. To replace one, overwrite the file and redeploy; the NFC card and QR code never change. PDFs are served with `X-Robots-Tag: noindex` and are always revalidated.

**Phone number.** It is deliberately not in the repository. To add it to the downloadable contact card (it is never shown on the page), set `CONTACT_PHONE` in the hosting environment, e.g. `+91 98765 43210`.

**Projects and pull requests.** Edit `profile.projects` and `profile.upstream.pulls`. Project screenshots live in `public/projects/`; set `image: null` to use the compact treatment instead.

**Devcon note.** `profile.event` shows until `showUntil` (7 Nov 2026), then disappears on its own. Set it to `null` to remove it sooner.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | Overrides `profile.siteUrl` (currently `https://card.rajatsrivastav.dev`). Used in the QR code, canonical URLs, share links and vCard. |
| `CONTACT_PHONE` | No | Adds a phone number to the vCard only. |

The permanent address lives in `profile.siteUrl`, so the QR code is correct even in local builds.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. On vercel.com: **Add New → Project**, import the repository. The defaults are correct (Next.js, `npm run build`).
3. Optional: under **Settings → Environment Variables**, add `CONTACT_PHONE` for Production.
4. Deploy.
5. Under **Settings → Domains**, add `card.rajatsrivastav.dev`.
6. At the DNS provider for `rajatsrivastav.dev`, create the record Vercel shows. For a subdomain this is usually a `CNAME` with name `card` and value `cname.vercel-dns.com`. Vercel issues the HTTPS certificate once DNS resolves.
7. Open `https://card.rajatsrivastav.dev/c` on a phone to confirm, then write the tag.

Or from the terminal:

```bash
npx vercel
```

```bash
npx vercel --prod
```

Once the domain is live, set `profile.sourceUrl` to the GitHub repository URL to show a "Source on GitHub" link in the footer.

## The permanent card URL

Write this to the NFC tag and use it for the QR code:

```
https://card.rajatsrivastav.dev/c
```

`/c` renders the profile directly (no redirect, so a tap costs one round trip) and declares `/` as canonical. Pick the domain once: changing it later means rewriting the tag and reprinting the QR code. Everything else (resumes, links, projects) can change at any time without touching the card.

Get the QR code from `https://card.rajatsrivastav.dev/qr`: download the **SVG** for print and the **PNG** (1200 px) for slides or a lock-screen image. Print it at least 2.5 cm wide, black on white, keeping the white border.

## Programming the NFC card (NFC Tools on Android)

1. Deploy first, then open `https://card.rajatsrivastav.dev/c` on the phone to confirm it loads.
2. Open **NFC Tools** → **Write** → **Add a record** → **URL / URI**.
3. Enter the full address, including `https://`, then tap **OK**.
4. Tap **Write** and hold the card flat against the back of the phone until it confirms.
5. Go to **Read** and tap the card again to check the stored URL.
6. Optional: **Other → Lock tag** makes it read-only. **This cannot be undone.** Only do it once the domain is final.

## Testing on iPhone and Android

**Your card is a MIFARE Classic 1K. Expect it to work on many Android phones and not on iPhones.**

- MIFARE Classic is a proprietary NXP format, not an NFC Forum tag type. Android phones with NXP NFC controllers (most Pixels and Samsungs) read it; some phones with other controllers cannot read it at all.
- iPhones read only NFC Forum tags (types 1–5) in the background. They generally ignore MIFARE Classic, so nothing will happen when an iPhone taps your card.
- **Fix:** for reliable iPhone taps, write the same URL to an **NTAG215 or NTAG216** card (inexpensive and readable by every NFC phone). Until then, the QR code is the iPhone path: keep it printed on or next to the card. The page footer shows it too, so you can hold up your own phone.

Checklist before the fair:

1. **Android tap:** NFC on, screen unlocked, tap the centre of the back. The browser should open `/c`.
2. **iPhone tap** (iPhone XS or newer): screen on and unlocked, hold the card near the top edge. A banner should appear; tap it. If nothing appears, that is the MIFARE Classic limitation above.
3. **QR:** scan the printed code with the iPhone camera and an Android camera or Google Lens.
4. **Resume:** "View resume" opens the PDF; the download button saves `Rajat-Srivastav-Full-Stack-Resume.pdf`.
5. **Save contact:** on iPhone (Safari) you should get a "Create New Contact" sheet with photo, email and links. On Android, Chrome downloads `Rajat-Srivastav.vcf`; tap it to import into Contacts.
6. **Share:** opens the native share sheet on phones; on browsers without one it copies the link and says "Profile link copied".
7. Try it on mobile data, not only Wi-Fi, since venue Wi-Fi is often unreliable.

## Still needed

- Web3 / blockchain resume PDF (`public/resumes/rajat-srivastav-web3-resume.pdf`).
- The DNS record for `card.rajatsrivastav.dev` (see "Deploy to Vercel").
- Optional: Telegram link, `CONTACT_PHONE`, `profile.sourceUrl`.
- The hosted full-stack resume PDF itself contains a phone number and college email. Anyone with the link can read it; replace it with a version without the phone number if you prefer.
- "Web3" in the availability line comes from the Devcon brief, not from an existing source. Edit `profile.availability` if it doesn't match.
