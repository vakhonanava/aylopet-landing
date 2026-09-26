import type { ExampleBreed } from "@/lib/pricing/food";

const EYE = "#2A2522";
const NOSE = "#1F1B19";

function Eyes({ y, spread = 10, r = 3.6 }: { y: number; spread?: number; r?: number }) {
  return (
    <>
      <circle cx={60 - spread} cy={y} r={r} fill={EYE} />
      <circle cx={60 + spread} cy={y} r={r} fill={EYE} />
      <circle cx={61.2 - spread} cy={y - 1.2} r={r * 0.32} fill="#fff" />
      <circle cx={61.2 + spread} cy={y - 1.2} r={r * 0.32} fill="#fff" />
    </>
  );
}

function Mouth({ y }: { y: number }) {
  return (
    <path
      d={`M60 ${y} L60 ${y + 5} M54 ${y + 7} Q60 ${y + 11} 66 ${y + 7}`}
      stroke={NOSE}
      strokeWidth={1.6}
      fill="none"
      strokeLinecap="round"
    />
  );
}

const PORTRAITS: Record<ExampleBreed, React.ReactNode> = {
  "yorkshire-terrier": (
    <>
      <path d="M36 48 Q38 22 47 18 Q54 30 56 42 Z" fill="#B98552" />
      <path d="M41 42 Q42 28 47 25 Q51 33 52 40 Z" fill="#E2B485" />
      <path d="M84 48 Q82 22 73 18 Q66 30 64 42 Z" fill="#B98552" />
      <path d="M79 42 Q78 28 73 25 Q69 33 68 40 Z" fill="#E2B485" />
      <path d="M35 54 Q25 86 37 108 Q50 100 50 72 Z" fill="#6E7A88" />
      <path d="M85 54 Q95 86 83 108 Q70 100 70 72 Z" fill="#6E7A88" />
      <ellipse cx="60" cy="57" rx="25" ry="22" fill="#CE9C62" />
      <path d="M42 66 Q45 100 60 105 Q75 100 78 66 Q60 76 42 66 Z" fill="#DDB27B" />
      <path d="M52 33 L60 37 L52 41 Z M68 33 L60 37 L68 41 Z" fill="#C67B5C" />
      <circle cx="60" cy="37" r="2.2" fill="#A9573B" />
      <Eyes y={56} />
      <ellipse cx="60" cy="67" rx="4.6" ry="3.4" fill={EYE} />
    </>
  ),
  "french-bulldog": (
    <>
      <path d="M30 56 Q14 10 46 24 Q54 32 52 48 Z" fill="#D2A77E" />
      <path d="M34 48 Q24 20 45 30 Q49 36 48 45 Z" fill="#EDC2B2" />
      <path d="M90 56 Q106 10 74 24 Q66 32 68 48 Z" fill="#D2A77E" />
      <path d="M86 48 Q96 20 75 30 Q71 36 72 45 Z" fill="#EDC2B2" />
      <ellipse cx="60" cy="66" rx="31" ry="28" fill="#DDB48B" />
      <path
        d="M52 44 Q60 40 68 44 M50 49 Q60 45 70 49"
        stroke="#C39A72"
        strokeWidth={1.6}
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="60" cy="78" rx="16" ry="12" fill="#4A403A" />
      <ellipse cx="60" cy="72" rx="6" ry="4" fill={NOSE} />
      <Mouth y={76} />
      <Eyes y={61} spread={14} r={4.6} />
    </>
  ),
  labrador: (
    <>
      <ellipse cx="60" cy="52" rx="25" ry="24" fill="#E4C08C" />
      <path d="M38 36 Q20 38 22 70 Q26 84 38 78 Q42 60 44 40 Z" fill="#C8975C" />
      <path d="M82 36 Q100 38 98 70 Q94 84 82 78 Q78 60 76 40 Z" fill="#C8975C" />
      <path d="M44 62 Q44 90 60 92 Q76 90 76 62 Q60 56 44 62 Z" fill="#EDCFA0" />
      <ellipse cx="60" cy="70" rx="6" ry="4.4" fill={EYE} />
      <Mouth y={74} />
      <Eyes y={50} />
    </>
  ),
  "caucasian-shepherd": (
    <>
      {/* Neck ruff · jagged lower half only, so the head doesn't read as a lion's mane. */}
      <path
        d="M103 66 L96.3 73.2 L99.7 82.5 L90.8 86.6 L90.4 96.4 L80.6 96.8 L76.5 105.7 L67.2 102.3 L60 109 L52.8 102.3 L43.5 105.7 L39.4 96.8 L29.6 96.4 L29.2 86.6 L20.3 82.5 L23.7 73.2 L17 66 L60 50 Z"
        fill="#B39673"
        stroke="#B39673"
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <path d="M40 30 Q28 26 27 44 Q34 47 43 40 Z" fill="#7C5F44" />
      <path d="M80 30 Q92 26 93 44 Q86 47 77 40 Z" fill="#7C5F44" />
      <path
        d="M60 26 C78 26 88 38 88 54 C88 60 86 64 84 67 L87 71 L81 71 L82 75 L76 73 C72 76 66 78 60 78 C54 78 48 76 44 73 L38 75 L39 71 L33 71 L36 67 C34 64 32 60 32 54 C32 38 42 26 60 26 Z"
        fill="#CFB38C"
      />
      <path d="M45 58 Q44 90 60 92 Q76 90 75 58 Q60 52 45 58 Z" fill="#6E5745" />
      <ellipse cx="60" cy="68" rx="6" ry="4.4" fill={NOSE} />
      <Mouth y={72} />
      <Eyes y={49} r={3.4} />
    </>
  ),
};

/** Small illustrated head of an example breed, for the price-by-size cards. */
export function BreedPortrait({
  breed,
  size = 72,
  className,
}: {
  breed: ExampleBreed;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <circle cx="60" cy="60" r="60" fill="#EEF2EC" />
      {PORTRAITS[breed]}
    </svg>
  );
}
