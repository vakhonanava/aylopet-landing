"use client";

import { useMemo } from "react";
import { encodeQr, qrPathData } from "@/lib/pet-history/qr";

interface QrCodeProps {
  value: string;
  /** Rendered pixel size of the square. */
  size?: number;
  /** Quiet zone in modules — the spec requires at least 4 for reliable scans. */
  quietZone?: number;
  className?: string;
  title?: string;
}

export function QrCode({
  value,
  size = 160,
  quietZone = 4,
  className,
  title = "SOS QR კოდი",
}: QrCodeProps) {
  const code = useMemo(() => {
    try {
      const matrix = encodeQr(value);
      return { matrix, path: qrPathData(matrix) };
    } catch {
      // Payload past version 6 capacity — callers pass short SOS URLs, so this
      // only trips on misuse. Fail visible rather than crashing the section.
      return null;
    }
  }, [value]);

  if (!code) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border border-dashed border-[#e0ddd6] bg-[#FAFAF8] p-4 text-center text-xs text-slate-400 ${className ?? ""}`}
        style={{ width: size, height: size }}
      >
        QR კოდის გენერაცია ვერ მოხერხდა
      </div>
    );
  }

  const total = code.matrix.size + quietZone * 2;

  return (
    <svg
      viewBox={`0 0 ${total} ${total}`}
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={title}
      shapeRendering="crispEdges"
    >
      <rect width={total} height={total} fill="#ffffff" />
      <g transform={`translate(${quietZone} ${quietZone})`}>
        <path d={code.path} fill="#0d2e27" />
      </g>
    </svg>
  );
}
