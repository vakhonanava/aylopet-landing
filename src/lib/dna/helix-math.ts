/** B-DNA style: ~10.5 base pairs per full turn */
export const BP_PER_TURN = 10.5;
export const TWIST_PER_RUNG = (Math.PI * 2) / BP_PER_TURN;

export const BASE_PAIRS = [
  ["A", "T"],
  ["G", "C"],
  ["T", "A"],
  ["C", "G"],
] as const;

export interface HelixNode {
  index: number;
  x1: number;
  y: number;
  z1: number;
  x2: number;
  z2: number;
  letter1: string;
  letter2: string;
  pair: string;
  digital: boolean;
}

export interface ProjectedNode extends HelixNode {
  px1: number;
  py1: number;
  ps1: number;
  px2: number;
  py2: number;
  ps2: number;
  depth: number;
}

export interface ProjectedPoint {
  px: number;
  py: number;
  ps: number;
  depth: number;
}

export interface HelixConfig {
  rungs: number;
  radius: number;
  spacing: number;
  /** Radians added per rung along helix axis */
  twist: number;
  digitalStart: number;
}

export const DEFAULT_HELIX: HelixConfig = {
  rungs: 84,
  radius: 90,
  spacing: 9.2,
  twist: TWIST_PER_RUNG,
  digitalStart: 0.55,
};

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Smoothstep ease · soft in / soft out */
export function smoothstep(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

/** Critically-damped-ish exponential approach for scroll / camera smoothing */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

export function buildHelixNodes(
  config: HelixConfig,
  rotation: number,
  verticalOffset: number,
): HelixNode[] {
  const nodes: HelixNode[] = [];
  const totalHeight = config.rungs * config.spacing;
  const yCenter = totalHeight / 2;

  for (let i = 0; i < config.rungs; i++) {
    const angle = i * config.twist + rotation;
    const y = i * config.spacing - yCenter + verticalOffset;
    const x1 = Math.cos(angle) * config.radius;
    const z1 = Math.sin(angle) * config.radius;
    const x2 = Math.cos(angle + Math.PI) * config.radius;
    const z2 = Math.sin(angle + Math.PI) * config.radius;
    const t = i / config.rungs;
    const [letter1, letter2] = BASE_PAIRS[i % BASE_PAIRS.length];

    nodes.push({
      index: i,
      x1,
      y,
      z1,
      x2,
      z2,
      letter1,
      letter2,
      pair: `${letter1}–${letter2}`,
      digital: t >= config.digitalStart,
    });
  }

  return nodes;
}

/**
 * Dense backbone samples between rungs for tube-like ribbon curves.
 * `subdivisions` = points inserted between each adjacent rung pair.
 */
export function buildDenseBackbone(
  config: HelixConfig,
  strand: 1 | 2,
  rotation: number,
  verticalOffset: number,
  subdivisions = 3,
): { x: number; y: number; z: number }[] {
  const points: { x: number; y: number; z: number }[] = [];
  const totalHeight = config.rungs * config.spacing;
  const yCenter = totalHeight / 2;
  const phase = strand === 1 ? 0 : Math.PI;
  const steps = (config.rungs - 1) * (subdivisions + 1) + 1;

  for (let s = 0; s < steps; s++) {
    const i = s / (subdivisions + 1);
    const angle = i * config.twist + rotation + phase;
    const y = i * config.spacing - yCenter + verticalOffset;
    points.push({
      x: Math.cos(angle) * config.radius,
      y,
      z: Math.sin(angle) * config.radius,
    });
  }

  return points;
}

function rotate3d(
  x: number,
  y: number,
  z: number,
  tiltX: number,
  tiltY: number,
) {
  const cosX = Math.cos(tiltX);
  const sinX = Math.sin(tiltX);
  const cosY = Math.cos(tiltY);
  const sinY = Math.sin(tiltY);
  const x1 = x * cosY - z * sinY;
  const z1 = x * sinY + z * cosY;
  const y1 = y * cosX - z1 * sinX;
  const z2 = y * sinX + z1 * cosX;
  return { x: x1, y: y1, z: z2 };
}

export function projectPoint(
  x: number,
  y: number,
  z: number,
  width: number,
  height: number,
  cameraZ: number,
  fov: number,
  tiltX: number,
  tiltY: number,
): ProjectedPoint {
  const cx = width / 2;
  const cy = height / 2;
  const r = rotate3d(x, y, z, tiltX, tiltY);
  const scale = fov / (fov + r.z + cameraZ);
  return {
    px: cx + r.x * scale,
    py: cy + r.y * scale,
    ps: scale,
    depth: r.z,
  };
}

export function projectHelix(
  nodes: HelixNode[],
  width: number,
  height: number,
  cameraZ: number,
  fov: number,
  tiltX: number,
  tiltY: number,
): ProjectedNode[] {
  return nodes
    .map((node) => {
      const p1 = projectPoint(
        node.x1,
        node.y,
        node.z1,
        width,
        height,
        cameraZ,
        fov,
        tiltX,
        tiltY,
      );
      const p2 = projectPoint(
        node.x2,
        node.y,
        node.z2,
        width,
        height,
        cameraZ,
        fov,
        tiltX,
        tiltY,
      );

      return {
        ...node,
        px1: p1.px,
        py1: p1.py,
        ps1: p1.ps,
        px2: p2.px,
        py2: p2.py,
        ps2: p2.ps,
        depth: (p1.depth + p2.depth) / 2,
      };
    })
    .sort((a, b) => a.depth - b.depth);
}

export function projectBackbone(
  nodes: HelixNode[],
  strand: 1 | 2,
  width: number,
  height: number,
  cameraZ: number,
  fov: number,
  tiltX: number,
  tiltY: number,
): ProjectedPoint[] {
  return nodes.map((node) => {
    const x = strand === 1 ? node.x1 : node.x2;
    const z = strand === 1 ? node.z1 : node.z2;
    return projectPoint(x, node.y, z, width, height, cameraZ, fov, tiltX, tiltY);
  });
}

export function projectPoints(
  points: { x: number; y: number; z: number }[],
  width: number,
  height: number,
  cameraZ: number,
  fov: number,
  tiltX: number,
  tiltY: number,
): ProjectedPoint[] {
  return points.map((pt) =>
    projectPoint(pt.x, pt.y, pt.z, width, height, cameraZ, fov, tiltX, tiltY),
  );
}
