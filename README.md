# Tapfolio

Rajat Srivastav’s personal NFC card and portfolio, built with Next.js, TypeScript, and Tailwind CSS.

## Development

Requires Node.js 20.9 or newer.

```bash
npm ci
npm run dev
```

Profile content is in `src/content/profile.ts`. Images and resume PDFs are in `public/`.

The opening sequence plays once per browser session (open a new tab to see it again) and never with reduced motion. The words it types before the name are `loadingWords` in the same file.

## Production

```bash
npm run check
npm start
```

Deploy using a Next.js hosting provider or a Node.js server. The production build command is `npm run build`.

Optional environment variables:

- `NEXT_PUBLIC_SITE_URL`: public site origin used for canonical URLs, sharing, contact cards, and QR codes. Defaults to `https://card.rajatsrivastav.dev`.
- `CONTACT_PHONE`: phone number included in the downloadable contact card.

The permanent NFC address is `https://card.rajatsrivastav.dev/c`. Download print-ready QR codes at `/qr`. Set the final public domain before printing QR codes or writing NFC tags.
