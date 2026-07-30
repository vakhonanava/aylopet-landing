import type { SVGProps } from "react";

/** Shared blob silhouette used across icons; distinct icons vary fill/scale/decoration. */
const BLOB_ROUND =
  "M159,124 Q148,148 124,160 Q100,172 77,160 Q53,147 42,124 Q30,100 43,78 Q55,55 78,41 Q100,26 124,40 Q147,53 159,77 Q170,100 159,124 Z";
const BLOB_STEAK =
  "M160,121 Q142,142 121,162 Q100,182 77,164 Q54,146 40,123 Q25,100 43,81 Q61,61 81,38 Q100,15 122,36 Q144,56 161,78 Q178,100 160,121 Z";
const BLOB_BREAST =
  "M159,127 Q153,153 127,172 Q100,190 72,174 Q43,157 42,129 Q40,100 54,84 Q68,68 84,57 Q100,45 118,55 Q135,65 150,83 Q165,100 159,127 Z";
const BLOB_BROCCOLI =
  "M156,115 Q140,129 132,150 Q123,171 104,159 Q85,146 61,146 Q37,146 43,123 Q48,100 44,79 Q40,57 63,55 Q85,53 104,41 Q123,28 132,49 Q141,70 157,85 Q172,100 156,115 Z";

const BORDER = "var(--bone-alabaster)";

type IconProps = SVGProps<SVGSVGElement>;

/** Flat mascot-style steak icon: red blob, cream outline, curved marbling lines. */
export function SteakIcon({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} {...rest}>
      <path d={BLOB_STEAK} fill="#c0392b" stroke={BORDER} strokeWidth={11} strokeLinejoin="round" />
      <path
        d="M62,70 C80,90 70,110 88,132"
        fill="none"
        stroke="#f6e9de"
        strokeWidth={7}
        strokeLinecap="round"
        opacity={0.75}
      />
      <path
        d="M98,55 C118,80 104,108 128,138"
        fill="none"
        stroke="#f6e9de"
        strokeWidth={7}
        strokeLinecap="round"
        opacity={0.6}
      />
      <ellipse cx="128" cy="70" rx="16" ry="10" fill="#e8b6a4" opacity={0.55} />
    </svg>
  );
}

/** Flat mascot-style chicken breast icon: pale tan blob, cream outline. */
export function ChickenBreastIcon({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} {...rest}>
      <path d={BLOB_BREAST} fill="#f0c9a0" stroke={BORDER} strokeWidth={11} strokeLinejoin="round" />
      <path
        d="M75,80 C90,102 82,124 96,150"
        fill="none"
        stroke="#d99f6c"
        strokeWidth={6}
        strokeLinecap="round"
        opacity={0.6}
      />
      <path
        d="M112,72 C126,96 116,118 132,146"
        fill="none"
        stroke="#d99f6c"
        strokeWidth={6}
        strokeLinecap="round"
        opacity={0.5}
      />
      <ellipse cx="122" cy="90" rx="18" ry="11" fill="#fbe6cf" opacity={0.7} />
    </svg>
  );
}

/** Flat mascot-style broccoli icon: bumpy green floret head + stem, cream outline. */
export function BroccoliIcon({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} {...rest}>
      <rect x="80" y="128" width="40" height="52" rx="16" fill="#d8e6c8" stroke={BORDER} strokeWidth={10} />
      <path d={BLOB_BROCCOLI} fill="#4f8a5b" stroke={BORDER} strokeWidth={11} strokeLinejoin="round" />
      <circle cx="82" cy="86" r="7" fill="#3c6e47" opacity={0.6} />
      <circle cx="112" cy="70" r="7" fill="#3c6e47" opacity={0.6} />
      <circle cx="128" cy="100" r="7" fill="#3c6e47" opacity={0.55} />
      <circle cx="96" cy="112" r="6" fill="#6ba377" opacity={0.6} />
    </svg>
  );
}

/** Flat mascot-style salmon fillet icon: pink-orange blob, cream outline, belly stripe. */
export function SalmonIcon({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} {...rest}>
      <g transform="translate(100 100) scale(1.3 0.82) translate(-100 -100)">
        <path d={BLOB_ROUND} fill="#e8875a" stroke={BORDER} strokeWidth={9} strokeLinejoin="round" />
      </g>
      <path
        d="M52,88 C78,102 118,102 150,86"
        fill="none"
        stroke="#fbe6d8"
        strokeWidth={9}
        strokeLinecap="round"
        opacity={0.65}
      />
      <path
        d="M58,118 C86,130 122,130 146,116"
        fill="none"
        stroke="#c85f38"
        strokeWidth={6}
        strokeLinecap="round"
        opacity={0.4}
      />
    </svg>
  );
}

/** Flat mascot-style sweet potato icon: elongated orange-brown blob, cream outline, speckles. */
export function SweetPotatoIcon({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} {...rest}>
      <g transform="translate(100 100) scale(1.32 0.78) translate(-100 -100)">
        <path d={BLOB_STEAK} fill="#c97a3d" stroke={BORDER} strokeWidth={9} strokeLinejoin="round" />
      </g>
      <ellipse cx="78" cy="92" rx="7" ry="5" fill="#9a5825" opacity={0.55} />
      <ellipse cx="118" cy="112" rx="6" ry="4" fill="#9a5825" opacity={0.5} />
      <ellipse cx="100" cy="76" rx="20" ry="10" fill="#e8a869" opacity={0.5} />
    </svg>
  );
}

/** Flat mascot-style apple icon: round red blob, cream outline, stem + leaf. */
export function AppleIcon({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} {...rest}>
      <path d={BLOB_ROUND} fill="#b83227" stroke={BORDER} strokeWidth={11} strokeLinejoin="round" />
      <ellipse cx="122" cy="80" rx="18" ry="12" fill="#e08a75" opacity={0.55} />
      <rect x="94" y="24" width="10" height="22" rx="4" fill="#6b4a3a" />
      <path
        d="M104,32 C122,24 136,34 132,48 C122,50 108,44 104,32 Z"
        fill="#5f9e6f"
      />
    </svg>
  );
}
