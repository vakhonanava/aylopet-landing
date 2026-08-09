/**
 * Minimal QR Code encoder — byte mode, error correction level M, versions 1–6.
 *
 * Scoped deliberately: an SOS profile URL is ~35 characters and version 6 holds
 * 108 data codewords, so capping there keeps the version-information block
 * (only required from version 7) and the multi-size block tables out of the
 * implementation entirely. Every version in range uses uniformly sized ECC
 * blocks, which is why `interleave` can stay a plain transpose.
 *
 * Reference: ISO/IEC 18004. Field arithmetic is GF(2^8) with primitive
 * polynomial 0x11D.
 */

export interface QrMatrix {
  size: number;
  /** Row-major; `true` is a dark module. */
  modules: boolean[][];
  version: number;
}

/** Per version (index 0 = version 1), for error correction level M. */
const TOTAL_CODEWORDS = [26, 44, 70, 100, 134, 172];
const EC_CODEWORDS_PER_BLOCK = [10, 16, 26, 18, 24, 16];
const BLOCK_COUNT = [1, 1, 1, 2, 2, 4];

/** Alignment pattern centre for versions 2–6 (version 1 has none). */
const ALIGNMENT_CENTRE = [0, 18, 22, 26, 30, 34];

const MAX_VERSION = 6;
const EC_LEVEL_BITS = 0b00; // level M

// ---------------------------------------------------------------------------
// GF(2^8)
// ---------------------------------------------------------------------------

const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);

{
  let x = 1;
  for (let i = 0; i < 255; i += 1) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i += 1) GF_EXP[i] = GF_EXP[i - 255];
}

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

/** Product of (x - α^i) for i in [0, degree). */
function generatorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i += 1) {
    const next = new Uint8Array(poly.length + 1);
    for (let j = 0; j < poly.length; j += 1) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], GF_EXP[i]);
    }
    poly = next;
  }
  return poly;
}

function errorCorrection(data: Uint8Array, ecLength: number): Uint8Array {
  const generator = generatorPoly(ecLength);
  const buffer = new Uint8Array(data.length + ecLength);
  buffer.set(data);

  for (let i = 0; i < data.length; i += 1) {
    const factor = buffer[i];
    if (factor === 0) continue;
    for (let j = 0; j < generator.length; j += 1) {
      buffer[i + j] ^= gfMul(generator[j], factor);
    }
  }

  return buffer.slice(data.length);
}

// ---------------------------------------------------------------------------
// Data encoding
// ---------------------------------------------------------------------------

function dataCodewordCount(version: number): number {
  const index = version - 1;
  return (
    TOTAL_CODEWORDS[index] - EC_CODEWORDS_PER_BLOCK[index] * BLOCK_COUNT[index]
  );
}

function chooseVersion(byteLength: number): number {
  for (let version = 1; version <= MAX_VERSION; version += 1) {
    // 4-bit mode indicator + 8-bit character count (versions 1–9).
    const available = dataCodewordCount(version) - 2;
    if (byteLength <= available) return version;
  }
  throw new Error(
    `QR payload too long: ${byteLength} bytes exceeds version ${MAX_VERSION} capacity`,
  );
}

function encodeData(bytes: Uint8Array, version: number): Uint8Array {
  const capacity = dataCodewordCount(version);
  const bits: number[] = [];

  const push = (value: number, length: number) => {
    for (let i = length - 1; i >= 0; i -= 1) bits.push((value >> i) & 1);
  };

  push(0b0100, 4); // byte mode
  push(bytes.length, 8); // character count, versions 1–9
  for (const byte of bytes) push(byte, 8);

  const capacityBits = capacity * 8;
  // Terminator: up to four zeroes, truncated if the stream is already full.
  push(0, Math.min(4, capacityBits - bits.length));
  while (bits.length % 8 !== 0) bits.push(0);

  const codewords = new Uint8Array(capacity);
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j += 1) byte = (byte << 1) | bits[i + j];
    codewords[i / 8] = byte;
  }

  // Alternating pad bytes fill the remainder.
  const PAD = [0xec, 0x11];
  for (let i = bits.length / 8, p = 0; i < capacity; i += 1, p += 1) {
    codewords[i] = PAD[p % 2];
  }

  return codewords;
}

/** Split into equal blocks, add ECC, then interleave data and ECC streams. */
function interleave(codewords: Uint8Array, version: number): Uint8Array {
  const index = version - 1;
  const blockCount = BLOCK_COUNT[index];
  const ecLength = EC_CODEWORDS_PER_BLOCK[index];
  const blockLength = codewords.length / blockCount;

  const dataBlocks: Uint8Array[] = [];
  const ecBlocks: Uint8Array[] = [];
  for (let i = 0; i < blockCount; i += 1) {
    const block = codewords.slice(i * blockLength, (i + 1) * blockLength);
    dataBlocks.push(block);
    ecBlocks.push(errorCorrection(block, ecLength));
  }

  const result = new Uint8Array(TOTAL_CODEWORDS[index]);
  let cursor = 0;
  for (let i = 0; i < blockLength; i += 1) {
    for (const block of dataBlocks) result[cursor++] = block[i];
  }
  for (let i = 0; i < ecLength; i += 1) {
    for (const block of ecBlocks) result[cursor++] = block[i];
  }
  return result;
}

// ---------------------------------------------------------------------------
// Module placement
// ---------------------------------------------------------------------------

interface Canvas {
  size: number;
  modules: boolean[][];
  reserved: boolean[][];
}

function createCanvas(version: number): Canvas {
  const size = 21 + (version - 1) * 4;
  return {
    size,
    modules: Array.from({ length: size }, () => new Array<boolean>(size).fill(false)),
    reserved: Array.from({ length: size }, () => new Array<boolean>(size).fill(false)),
  };
}

function reserve(canvas: Canvas, row: number, col: number, height: number, width: number) {
  for (let r = row; r < row + height; r += 1) {
    for (let c = col; c < col + width; c += 1) {
      if (r >= 0 && r < canvas.size && c >= 0 && c < canvas.size) {
        canvas.reserved[r][c] = true;
      }
    }
  }
}

function drawFinder(canvas: Canvas, row: number, col: number) {
  for (let r = -1; r <= 7; r += 1) {
    for (let c = -1; c <= 7; c += 1) {
      const y = row + r;
      const x = col + c;
      if (y < 0 || y >= canvas.size || x < 0 || x >= canvas.size) continue;
      const inRing = r >= 0 && r <= 6 && c >= 0 && c <= 6;
      const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
      const isCore = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      canvas.modules[y][x] = inRing && (isBorder || isCore);
    }
  }
}

function drawAlignment(canvas: Canvas, centre: number) {
  for (let r = -2; r <= 2; r += 1) {
    for (let c = -2; c <= 2; c += 1) {
      const outer = Math.max(Math.abs(r), Math.abs(c));
      canvas.modules[centre + r][centre + c] = outer !== 1;
    }
  }
  reserve(canvas, centre - 2, centre - 2, 5, 5);
}

function drawFunctionPatterns(canvas: Canvas, version: number) {
  const { size } = canvas;

  drawFinder(canvas, 0, 0);
  drawFinder(canvas, 0, size - 7);
  drawFinder(canvas, size - 7, 0);

  // Finder + separator + format-information areas, reserved as three corners.
  reserve(canvas, 0, 0, 9, 9);
  reserve(canvas, 0, size - 8, 9, 8);
  reserve(canvas, size - 8, 0, 8, 9);

  // Timing patterns.
  for (let i = 8; i < size - 8; i += 1) {
    const dark = i % 2 === 0;
    canvas.modules[6][i] = dark;
    canvas.modules[i][6] = dark;
    canvas.reserved[6][i] = true;
    canvas.reserved[i][6] = true;
  }

  if (version >= 2) drawAlignment(canvas, ALIGNMENT_CENTRE[version - 1]);

  // Dark module — always set, always reserved.
  canvas.modules[size - 8][8] = true;
}

function placeData(canvas: Canvas, codewords: Uint8Array) {
  const totalBits = codewords.length * 8;
  const bitAt = (index: number) =>
    index < totalBits
      ? ((codewords[index >> 3] >> (7 - (index & 7))) & 1) === 1
      : false;

  let bitIndex = 0;
  let upward = true;

  for (let right = canvas.size - 1; right >= 1; right -= 2) {
    // Column 6 is the vertical timing pattern — the pair shifts left past it.
    if (right === 6) right = 5;

    for (let step = 0; step < canvas.size; step += 1) {
      const row = upward ? canvas.size - 1 - step : step;
      for (let offset = 0; offset < 2; offset += 1) {
        const col = right - offset;
        if (canvas.reserved[row][col]) continue;
        canvas.modules[row][col] = bitAt(bitIndex);
        bitIndex += 1;
      }
    }
    upward = !upward;
  }
}

// ---------------------------------------------------------------------------
// Masking
// ---------------------------------------------------------------------------

const MASKS: ((row: number, col: number) => boolean)[] = [
  (r, c) => (r + c) % 2 === 0,
  (r) => r % 2 === 0,
  (_, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
];

function applyMask(canvas: Canvas, mask: number) {
  const test = MASKS[mask];
  for (let r = 0; r < canvas.size; r += 1) {
    for (let c = 0; c < canvas.size; c += 1) {
      if (canvas.reserved[r][c]) continue;
      if (test(r, c)) canvas.modules[r][c] = !canvas.modules[r][c];
    }
  }
}

/** The finder-like sequence that rule 3 penalises, in both orientations. */
const RULE3 = [true, false, true, true, true, false, true, false, false, false, false];

function matchesRule3(line: boolean[], start: number): boolean {
  const forward = RULE3.every((value, i) => line[start + i] === value);
  const backward = RULE3.every(
    (value, i) => line[start + RULE3.length - 1 - i] === value,
  );
  return forward || backward;
}

function penalty(canvas: Canvas): number {
  const { size, modules } = canvas;
  let score = 0;

  const lines: boolean[][] = [];
  for (let r = 0; r < size; r += 1) lines.push(modules[r]);
  for (let c = 0; c < size; c += 1) {
    lines.push(modules.map((row) => row[c]));
  }

  // Rule 1 — runs of five or more.
  for (const line of lines) {
    let run = 1;
    for (let i = 1; i < line.length; i += 1) {
      if (line[i] === line[i - 1]) {
        run += 1;
      } else {
        if (run >= 5) score += 3 + (run - 5);
        run = 1;
      }
    }
    if (run >= 5) score += 3 + (run - 5);
  }

  // Rule 2 — 2×2 blocks of one colour.
  for (let r = 0; r < size - 1; r += 1) {
    for (let c = 0; c < size - 1; c += 1) {
      const value = modules[r][c];
      if (
        modules[r][c + 1] === value &&
        modules[r + 1][c] === value &&
        modules[r + 1][c + 1] === value
      ) {
        score += 3;
      }
    }
  }

  // Rule 3 — finder-like patterns.
  for (const line of lines) {
    for (let i = 0; i + RULE3.length <= line.length; i += 1) {
      if (matchesRule3(line, i)) score += 40;
    }
  }

  // Rule 4 — deviation from an even dark/light split.
  let dark = 0;
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) if (modules[r][c]) dark += 1;
  }
  const percent = (dark * 100) / (size * size);
  score += Math.floor(Math.abs(percent - 50) / 5) * 10;

  return score;
}

// ---------------------------------------------------------------------------
// Format information
// ---------------------------------------------------------------------------

function formatBits(mask: number): number {
  const data = (EC_LEVEL_BITS << 3) | mask;
  let remainder = data;
  for (let i = 0; i < 10; i += 1) {
    remainder = (remainder << 1) ^ (((remainder >> 9) & 1) * 0x537);
  }
  return (((data << 10) | remainder) ^ 0x5412) & 0x7fff;
}

function drawFormat(canvas: Canvas, mask: number) {
  const bits = formatBits(mask);
  const bit = (i: number) => ((bits >> i) & 1) === 1;
  const { size } = canvas;

  for (let i = 0; i <= 5; i += 1) canvas.modules[i][8] = bit(i);
  canvas.modules[7][8] = bit(6);
  canvas.modules[8][8] = bit(7);
  canvas.modules[8][7] = bit(8);
  for (let i = 9; i < 15; i += 1) canvas.modules[8][14 - i] = bit(i);

  for (let i = 0; i < 8; i += 1) canvas.modules[8][size - 1 - i] = bit(i);
  for (let i = 8; i < 15; i += 1) canvas.modules[size - 15 + i][8] = bit(i);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Encodes `text` (UTF-8) into a QR matrix, trying all eight mask patterns and
 * keeping the one with the lowest penalty, as the specification requires.
 */
export function encodeQr(text: string): QrMatrix {
  const bytes = new TextEncoder().encode(text);
  const version = chooseVersion(bytes.length);
  const codewords = interleave(encodeData(bytes, version), version);

  let best: Canvas | null = null;
  let bestScore = Number.POSITIVE_INFINITY;

  for (let mask = 0; mask < MASKS.length; mask += 1) {
    const canvas = createCanvas(version);
    drawFunctionPatterns(canvas, version);
    placeData(canvas, codewords);
    applyMask(canvas, mask);
    drawFormat(canvas, mask);

    const score = penalty(canvas);
    if (score < bestScore) {
      bestScore = score;
      best = canvas;
    }
  }

  const chosen = best as Canvas;
  return { size: chosen.size, modules: chosen.modules, version };
}

/**
 * Renders a matrix as a single SVG path `d` attribute — one path for the whole
 * code keeps the DOM to a single node instead of ~1,700 rects.
 */
export function qrPathData(matrix: QrMatrix): string {
  const parts: string[] = [];
  for (let r = 0; r < matrix.size; r += 1) {
    for (let c = 0; c < matrix.size; c += 1) {
      if (matrix.modules[r][c]) parts.push(`M${c} ${r}h1v1h-1z`);
    }
  }
  return parts.join("");
}
