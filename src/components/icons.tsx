import type { SVGProps } from "react";
import type { LinkKind } from "@/content/profile";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 20,
  height: 20,
  "aria-hidden": true,
  focusable: false,
} as const;

// Brand marks: Simple Icons (CC0) and Bootstrap Icons (MIT).
const brandPaths: Partial<Record<LinkKind, { viewBox: string; d: string }>> = {
  github: {
    viewBox: "0 0 24 24",
    d: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
  linkedin: {
    viewBox: "0 0 16 16",
    d: "M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z",
  },
  x: {
    viewBox: "0 0 24 24",
    d: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  },
  telegram: {
    viewBox: "0 0 24 24",
    d: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
  },
};

function Stroke({ children, ...props }: IconProps) {
  return (
    <svg
      {...base}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export function LinkIcon({ kind, ...props }: IconProps & { kind: LinkKind }) {
  const brand = brandPaths[kind];
  if (brand) {
    return (
      <svg {...base} viewBox={brand.viewBox} fill="currentColor" {...props}>
        <path d={brand.d} />
      </svg>
    );
  }
  if (kind === "email") return <MailIcon {...props} />;
  return <GlobeIcon {...props} />;
}

export const GlobeIcon = (props: IconProps) => (
  <Stroke {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.7 3.75 5.7 3.75 9s-1.25 6.3-3.75 9c-2.5-2.7-3.75-5.7-3.75-9S9.5 5.7 12 3Z" />
  </Stroke>
);

export const MailIcon = (props: IconProps) => (
  <Stroke {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </Stroke>
);

export const DocumentIcon = (props: IconProps) => (
  <Stroke {...props}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h4" />
  </Stroke>
);

export const DownloadIcon = (props: IconProps) => (
  <Stroke {...props}>
    <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" />
  </Stroke>
);

export const ContactIcon = (props: IconProps) => (
  <Stroke {...props}>
    <circle cx="10" cy="8.5" r="3.5" />
    <path d="M3.5 19.5c.8-3.3 3.4-5 6.5-5s5.7 1.7 6.5 5M18.5 8v6M15.5 11h6" />
  </Stroke>
);

export const ShareIcon = (props: IconProps) => (
  <Stroke {...props}>
    <path d="M12 15V3.5m0 0L8 7.5m4-4 4 4" />
    <path d="M8 11H6.5A1.5 1.5 0 0 0 5 12.5v6A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-6a1.5 1.5 0 0 0-1.5-1.5H16" />
  </Stroke>
);

export const CopyIcon = (props: IconProps) => (
  <Stroke {...props}>
    <rect x="8.5" y="8.5" width="12" height="12" rx="2" />
    <path d="M15.5 5.5v-1a1.5 1.5 0 0 0-1.5-1.5H5a1.5 1.5 0 0 0-1.5 1.5V14A1.5 1.5 0 0 0 5 15.5h1" />
  </Stroke>
);

export const CheckIcon = (props: IconProps) => (
  <Stroke {...props}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Stroke>
);

/** Arrow pointing up and out: marks links that leave this site. */
export const ExternalIcon = (props: IconProps) => (
  <Stroke width={14} height={14} {...props}>
    <path d="M8 16 16 8m0 0H9.5M16 8v6.5" />
  </Stroke>
);

export const PinIcon = (props: IconProps) => (
  <Stroke {...props}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.25" />
  </Stroke>
);
