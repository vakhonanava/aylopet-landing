/**
 * Renders the static brand images referenced by the SEO metadata:
 *
 *   public/og-image.png  1200x630  — og:image / twitter:image
 *   public/logo.png       512x512  — Schema.org Organization.logo
 *
 * Uses the satori + resvg renderer that ships inside Next (`next/og`), so no
 * extra dependency and identical output on every machine.
 *
 *   node scripts/brand/generate.mjs
 *
 * The card is intentionally Latin-only: the bundled Geist font has no Georgian
 * glyphs. Add an OFL Georgian face (e.g. Noto Sans Georgian) to this folder and
 * pass it in `fonts` below if the Georgian wordmark should appear on the card.
 */
import { readFile, writeFile } from "node:fs/promises";
import { createElement as h } from "react";
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";

const root = new URL("../../", import.meta.url);
const geist = await readFile(
  new URL("node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf", root),
);
const fonts = [{ name: "Geist", data: geist, weight: 400, style: "normal" }];

const CREAM = "#FBF9F6";
const GREEN = "#3a5a40";
const ACCENT = "#6b8f71";

const logoSvg = await readFile(new URL("logo.svg", import.meta.url), "utf8");
const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;

async function render(element, { width, height }, outPath) {
  const response = new ImageResponse(element, { width, height, fonts });
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(new URL(outPath, root), buffer);
  console.log(`wrote ${outPath} (${width}x${height}, ${buffer.length} bytes)`);
}

const ogCard = h(
  "div",
  {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      background: GREEN,
      padding: "72px 88px",
      fontFamily: "Geist",
      color: CREAM,
    },
  },
  h(
    "div",
    { style: { display: "flex", alignItems: "center", gap: 28 } },
    h("img", { src: logoDataUri, width: 88, height: 88 }),
    h("div", { style: { fontSize: 46, letterSpacing: 1 } }, "Aylopet"),
  ),
  h(
    "div",
    { style: { display: "flex", flexDirection: "column", gap: 18 } },
    h(
      "div",
      { style: { fontSize: 78, lineHeight: 1.1, letterSpacing: -1 } },
      "AI & DNA Pet Health Tech",
    ),
    h(
      "div",
      { style: { fontSize: 34, color: "#cdd9cf" } },
      "Longer, healthier lives for our four-legged friends",
    ),
  ),
  h(
    "div",
    { style: { display: "flex", flexDirection: "column", gap: 20 } },
    h("div", { style: { width: 64, height: 4, background: ACCENT } }),
    h(
      "div",
      { style: { fontSize: 28, letterSpacing: 3, color: "#a8c0ad" } },
      "AYLOPET.COM",
    ),
  ),
);

const logoImage = h(
  "div",
  {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      background: GREEN,
    },
  },
  h("img", { src: logoDataUri, width: 512, height: 512 }),
);

await render(ogCard, { width: 1200, height: 630 }, "public/og-image.png");
await render(logoImage, { width: 512, height: 512 }, "public/logo.png");
