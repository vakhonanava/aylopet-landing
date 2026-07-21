"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  BP_PER_TURN,
  damp,
  DEFAULT_HELIX,
  smoothstep,
  type HelixConfig,
} from "@/lib/dna/helix-math";

export interface DnaHelix3DProps {
  progress?: number;
  autoRotate?: boolean;
  highlightRatio?: number;
  interactive?: boolean;
  className?: string;
  variant?: "light" | "dark";
  config?: Partial<HelixConfig>;
  /** Continuous downward drift (helix pitches / second). */
  flowSpeed?: number;
}

const UNIT = 0.012;

/** Tech-first clinical palette · cyan / electric on deep void */
const TECH = {
  dark: {
    strandA: 0x5eead4,
    strandB: 0x38bdf8,
    rung: 0x67e8f9,
    node: 0xa5f3fc,
    ping: 0x22d3ee,
    risk: 0xf472b6,
    particle: 0x7dd3fc,
    ambient: 0x0b1c2c,
    key: 0xe0f2fe,
    rim: 0x22d3ee,
    fill: 0x818cf8,
  },
  light: {
    strandA: 0x0d9488,
    strandB: 0x0284c7,
    rung: 0x06b6d4,
    node: 0x0891b2,
    ping: 0x06b6d4,
    risk: 0xdb2777,
    particle: 0x38bdf8,
    ambient: 0xcbd5e1,
    key: 0xffffff,
    rim: 0x06b6d4,
    fill: 0x6366f1,
  },
} as const;

function helixPoint(
  t: number,
  phase: number,
  radius: number,
  spacing: number,
  twist: number,
  yCenter: number,
): THREE.Vector3 {
  const angle = t * twist + phase;
  return new THREE.Vector3(
    Math.cos(angle) * radius * UNIT,
    (t * spacing - yCenter) * UNIT,
    Math.sin(angle) * radius * UNIT,
  );
}

function buildStrandCurve(
  config: HelixConfig,
  phase: number,
  samplesPerRung: number,
  assemble: number,
): THREE.CatmullRomCurve3 {
  const points: THREE.Vector3[] = [];
  const yCenter = (config.rungs * config.spacing) / 2;
  const visibleRungs = Math.max(4, Math.floor(1 + (config.rungs - 1) * assemble));
  const steps = Math.max(8, (visibleRungs - 1) * samplesPerRung + 1);
  for (let s = 0; s < steps; s++) {
    const t = (s / (steps - 1)) * (visibleRungs - 1);
    points.push(
      helixPoint(t, phase, config.radius, config.spacing, config.twist, yCenter),
    );
  }
  return new THREE.CatmullRomCurve3(points, false, "centripetal");
}

function makeGlowMaterial(
  color: number,
  emissive: number,
  emissiveIntensity: number,
  roughness = 0.35,
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness: 0.25,
    emissive: new THREE.Color(emissive),
    emissiveIntensity,
  });
}

export function DnaHelix3D({
  progress = 0,
  autoRotate = false,
  highlightRatio = 0,
  interactive = true,
  className = "",
  variant = "dark",
  config: configOverride,
  flowSpeed,
}: DnaHelix3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(progress);
  const highlightRef = useRef(highlightRatio);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    progressRef.current = progress;
    highlightRef.current = highlightRatio;
  }, [progress, highlightRatio]);

  const config = useMemo<HelixConfig>(
    () => ({ ...DEFAULT_HELIX, ...configOverride }),
    [configOverride],
  );

  const effectiveFlow = flowSpeed ?? (autoRotate ? 0.1 : 0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile =
      window.matchMedia("(max-width: 768px)").matches ||
      navigator.maxTouchPoints > 1;
    const isDark = variant === "dark";
    const palette = TECH[isDark ? "dark" : "light"];

    // Slim tubes so both strands + rungs read as a clear double helix
    const tubeRadius = Math.max(0.028, config.radius * UNIT * 0.072);
    const rungRadius = tubeRadius * 0.55;
    const nodeRadius = tubeRadius * 1.35;
    const tubularSeg = isMobile
      ? Math.min(140, config.rungs * 2)
      : Math.min(260, config.rungs * 4);
    const radialSeg = isMobile ? 6 : 10;
    const samplesPerRung = isMobile ? 2 : 3;
    const particleCount = isMobile ? 80 : 180;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: true,
      powerPreference: isMobile ? "low-power" : "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.4 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 1.25 : 1.05;
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    if (isDark) {
      scene.fog = new THREE.FogExp2(0x041018, 0.045);
    }

    const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 40);
    camera.position.set(0, 0, 4.4);

    const group = new THREE.Group();
    group.rotation.x = 0.32;
    group.rotation.z = -0.28;
    scene.add(group);

    const helixRoot = new THREE.Group();
    group.add(helixRoot);

    const matA = makeGlowMaterial(palette.strandA, palette.strandA, 0.35, 0.4);
    const matB = makeGlowMaterial(palette.strandB, palette.strandB, 0.4, 0.38);
    const matRung = makeGlowMaterial(palette.rung, palette.rung, 0.22, 0.45);
    const matNode = makeGlowMaterial(palette.node, palette.ping, 0.55, 0.3);
    const matPing = makeGlowMaterial(palette.ping, palette.ping, 1.4, 0.2);
    const matRisk = makeGlowMaterial(palette.risk, palette.risk, 1.6, 0.2);

    let lastAssemble = -1;
    let meshA: THREE.Mesh | null = null;
    let meshB: THREE.Mesh | null = null;
    let geoA: THREE.TubeGeometry | null = null;
    let geoB: THREE.TubeGeometry | null = null;

    const rungGroup = new THREE.Group();
    helixRoot.add(rungGroup);
    const nodeGroup = new THREE.Group();
    helixRoot.add(nodeGroup);

    type RungEntry = {
      mesh: THREE.Mesh;
      index: number;
      digital: boolean;
    };
    type NodeEntry = {
      mesh: THREE.Mesh;
      index: number;
      risk: boolean;
      baseScale: number;
    };
    const rungMeshes: RungEntry[] = [];
    const nodeMeshes: NodeEntry[] = [];

    // Build full helix once · assemble via scale + progressive reveal of rungs/nodes
    const curveA = buildStrandCurve(config, 0, samplesPerRung, 1);
    const curveB = buildStrandCurve(config, Math.PI, samplesPerRung, 1);
    geoA = new THREE.TubeGeometry(curveA, tubularSeg, tubeRadius, radialSeg, false);
    geoB = new THREE.TubeGeometry(curveB, tubularSeg, tubeRadius, radialSeg, false);
    meshA = new THREE.Mesh(geoA, matA);
    meshB = new THREE.Mesh(geoB, matB);
    helixRoot.add(meshA, meshB);

    const yCenter = (config.rungs * config.spacing) / 2;
    const rungStep = isMobile ? 2 : 1;
    for (let i = 0; i < config.rungs; i += rungStep) {
      const p1 = helixPoint(i, 0, config.radius, config.spacing, config.twist, yCenter);
      const p2 = helixPoint(i, Math.PI, config.radius, config.spacing, config.twist, yCenter);
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const dir = new THREE.Vector3().subVectors(p2, p1);
      const len = dir.length();
      const digital = i / config.rungs >= config.digitalStart;
      const geo = new THREE.CylinderGeometry(
        rungRadius,
        rungRadius,
        len,
        isMobile ? 5 : 7,
        1,
        false,
      );
      const mesh = new THREE.Mesh(geo, matRung);
      mesh.position.copy(mid);
      mesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir.clone().normalize(),
      );
      rungGroup.add(mesh);
      rungMeshes.push({ mesh, index: i, digital });

      if (i % (isMobile ? 4 : 3) === 0) {
        const risk = i % 11 === 0;
        const nodeGeo = new THREE.SphereGeometry(
          nodeRadius * (risk ? 1.25 : 1),
          isMobile ? 8 : 12,
          isMobile ? 8 : 12,
        );
        const node = new THREE.Mesh(nodeGeo, risk ? matRisk : matNode);
        node.position.copy(p1);
        nodeGroup.add(node);
        nodeMeshes.push({
          mesh: node,
          index: i,
          risk,
          baseScale: risk ? 1.15 : 1,
        });
      }
    }

    const applyAssemble = (assemble: number) => {
      const a = Math.min(1, Math.max(0.12, assemble));
      if (Math.abs(a - lastAssemble) < 0.008) return;
      lastAssemble = a;
      // Grow from bottom · scale Y + fade in upper rungs
      helixRoot.scale.set(1, a, 1);
      helixRoot.position.y = ((1 - a) * config.rungs * config.spacing * UNIT) / 2;
      const visibleUntil = a * config.rungs;
      for (const { mesh, index } of rungMeshes) {
        mesh.visible = index <= visibleUntil + 1;
      }
      for (const { mesh, index } of nodeMeshes) {
        mesh.visible = index <= visibleUntil + 1;
      }
    };

    applyAssemble(0.15);

    // Marker particle field (SNPs)
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);
    const helixH = config.rungs * config.spacing * UNIT;
    for (let i = 0; i < particleCount; i++) {
      const r = (0.9 + Math.random() * 1.6) * config.radius * UNIT;
      const ang = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * helixH * 1.15;
      positions[i * 3] = Math.cos(ang) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(ang) * r;
      phases[i] = Math.random() * Math.PI * 2;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: palette.particle,
      size: isMobile ? 0.028 : 0.022,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    // Lights · clinical / biotech
    scene.add(new THREE.AmbientLight(palette.ambient, isDark ? 0.55 : 0.7));
    const key = new THREE.DirectionalLight(palette.key, isDark ? 1.5 : 1.15);
    key.position.set(2.6, 3.4, 4.8);
    scene.add(key);
    const rim = new THREE.PointLight(palette.rim, isDark ? 2.8 : 1.4, 12);
    rim.position.set(-2.6, 1.2, -3.2);
    scene.add(rim);
    const fill = new THREE.PointLight(palette.fill, isDark ? 1.1 : 0.6, 10);
    fill.position.set(2.4, -2.0, 2.4);
    scene.add(fill);
    const front = new THREE.PointLight(0xffffff, isDark ? 0.45 : 0.3, 8);
    front.position.set(0, 0, 3.6);
    scene.add(front);

    let smoothProgress = progressRef.current;
    let smoothHighlight = highlightRef.current;
    let smoothMouseX = 0;
    let smoothMouseY = 0;
    let flow = 0;
    let lastTime: number | null = null;
    let frameId = 0;
    let disposed = false;
    const pitch = config.spacing * BP_PER_TURN * UNIT;

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth || canvas.clientWidth || 1;
      const h = parent?.clientHeight || canvas.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const onMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      };
    };
    if (interactive) {
      window.addEventListener("mousemove", onMove, { passive: true });
    }

    const renderFrame = (timestamp: number) => {
      if (disposed) return;
      const last = lastTime ?? timestamp;
      const dt = Math.min(0.05, Math.max(0.001, (timestamp - last) / 1000));
      lastTime = timestamp;

      smoothProgress = damp(smoothProgress, progressRef.current, 12, dt);
      smoothHighlight = damp(smoothHighlight, highlightRef.current, 10, dt);
      smoothMouseX = damp(smoothMouseX, mouseRef.current.x, 5, dt);
      smoothMouseY = damp(smoothMouseY, mouseRef.current.y, 5, dt);

      const easedP = smoothstep(smoothProgress);
      applyAssemble(0.18 + easedP * 0.82);

      if (effectiveFlow > 0 && !reduced) {
        flow += effectiveFlow * dt * pitch;
      }
      const flowY = -(((flow % pitch) + pitch) % pitch);

      const idle = autoRotate && !reduced ? timestamp * 0.00018 : 0;
      const spin = easedP * Math.PI * 1.85 + idle;
      group.rotation.y = spin;

      const travel = (0.5 - easedP) * config.rungs * config.spacing * UNIT * 1.05;
      group.position.y = travel + flowY;

      const tiltAmp = interactive ? 1 : 0;
      camera.position.x = smoothMouseX * 0.32 * tiltAmp;
      camera.position.y = -smoothMouseY * 0.2 * tiltAmp + travel * 0.06;
      camera.position.z = 4.35 - easedP * 0.55;
      camera.lookAt(0, travel * 0.12, 0);

      // Scan / highlight sweep along rungs + node pings
      const hi = Math.floor(smoothHighlight * config.rungs);
      const tSec = timestamp * 0.001;
      for (const { mesh, index } of rungMeshes) {
        const near = Math.abs(index - hi) <= 1;
        mesh.material = near && smoothHighlight > 0.04 ? matPing : matRung;
        const pulse = near ? 1 + Math.sin(tSec * 6) * 0.08 : 1;
        mesh.scale.set(pulse, 1, pulse);
      }
      for (const { mesh, index, risk, baseScale } of nodeMeshes) {
        const near = Math.abs(index - hi) <= 2;
        const pingWave = 0.5 + 0.5 * Math.sin(tSec * (risk ? 5.5 : 3.2) + index * 0.35);
        const s = baseScale * (near ? 1.35 + pingWave * 0.35 : 0.85 + pingWave * 0.2);
        mesh.scale.setScalar(s);
        (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = near
          ? 1.8 + pingWave
          : risk
            ? 0.9 + pingWave * 0.6
            : 0.45 + pingWave * 0.25;
      }

      // Orbit particles gently
      const pos = particleGeo.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        const ix = i * 3;
        const y0 = positions[ix + 1];
        pos.array[ix + 1] =
          y0 + Math.sin(tSec * 0.7 + phases[i]) * 0.04 * helixH * 0.08;
      }
      pos.needsUpdate = true;
      particles.rotation.y = tSec * 0.04;
      particleMat.opacity = 0.35 + easedP * 0.45;

      renderer.render(scene, camera);
    };

    if (reduced) {
      applyAssemble(1);
      renderFrame(0);
    } else {
      const loop = (t: number) => {
        renderFrame(t);
        frameId = requestAnimationFrame(loop);
      };
      frameId = requestAnimationFrame(loop);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      ro.disconnect();
      if (interactive) window.removeEventListener("mousemove", onMove);
      geoA?.dispose();
      geoB?.dispose();
      matA.dispose();
      matB.dispose();
      matRung.dispose();
      matNode.dispose();
      matPing.dispose();
      matRisk.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      for (const { mesh } of rungMeshes) mesh.geometry.dispose();
      for (const { mesh } of nodeMeshes) mesh.geometry.dispose();
      renderer.dispose();
    };
  }, [autoRotate, config, effectiveFlow, interactive, variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`h-full w-full touch-none ${className}`}
      aria-hidden
    />
  );
}
