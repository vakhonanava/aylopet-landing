"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface FruitBowl3DProps {
  className?: string;
  /** Slow continuous rotation of the whole still-life. */
  autoRotate?: boolean;
  /** Pointer parallax tilt (desktop only). */
  interactive?: boolean;
}

/** Brand-safe still-life palette · forest, terracotta, bone. No neon. */
const PALETTE = {
  appleTop: 0xf3c98a,
  appleBottom: 0x9c3d2c,
  appleRim: 0xdf6a41,
  stem: 0x6b4a3a,
  leafA: 0x4a7c59,
  leafB: 0x6b9b6e,
  berry: 0x6b4a5c,
  berryHighlight: 0x9a6b7d,
  peel: 0xdf6a41,
  peelDark: 0xc1502e,
  ambient: 0xfdf3e4,
  key: 0xfff4e0,
  rim: 0xdf6a41,
  fill: 0x6b8f71,
} as const;

function damp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

/** Tints geometry vertices from `top` to `bottom` color along local Y · gives fruit skin natural gradient without textures. */
function applyVerticalGradient(
  geometry: THREE.BufferGeometry,
  top: number,
  bottom: number,
): void {
  const pos = geometry.attributes.position as THREE.BufferAttribute;
  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox!;
  const minY = bbox.min.y;
  const range = Math.max(0.0001, bbox.max.y - minY);
  const colors = new Float32Array(pos.count * 3);
  const c1 = new THREE.Color(top);
  const c2 = new THREE.Color(bottom);
  const mixed = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const t = (y - minY) / range;
    mixed.copy(c1).lerp(c2, t);
    colors[i * 3] = mixed.r;
    colors[i * 3 + 1] = mixed.g;
    colors[i * 3 + 2] = mixed.b;
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
}

/** Procedural citrus cross-section · peel ring, pith, flesh wedges · baked onto a canvas texture. */
function createCitrusTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  ctx.fillStyle = "#df6a41";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fbf3e6";
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.93, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f3a15c";
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.86, 0, Math.PI * 2);
  ctx.fill();

  const segments = 11;
  ctx.strokeStyle = "rgba(255,247,235,0.55)";
  ctx.lineWidth = size * 0.012;
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * r * 0.86, cy + Math.sin(angle) * r * 0.86);
    ctx.stroke();
  }

  ctx.fillStyle = "#fbf3e6";
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.07, 0, Math.PI * 2);
  ctx.fill();

  const grad = ctx.createRadialGradient(cx, cy, r * 0.25, cx, cy, r);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, "rgba(120,50,10,0.16)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createLeafGeometry(length: number, width: number): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(width, length * 0.34, 0, length);
  shape.quadraticCurveTo(-width, length * 0.34, 0, 0);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.015,
    bevelEnabled: false,
  });
  geo.computeVertexNormals();
  return geo;
}

interface FloatEntry {
  group: THREE.Group;
  baseY: number;
  phase: number;
  amp: number;
  spin: number;
}

interface RockEntry {
  group: THREE.Group;
  phase: number;
  amp: number;
  speed: number;
}

export function FruitBowl3D({
  className = "",
  autoRotate = true,
  interactive = true,
}: FruitBowl3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile =
      window.matchMedia("(max-width: 768px)").matches || navigator.maxTouchPoints > 1;
    const sphereSeg = isMobile ? 20 : 32;
    const cylinderSeg = isMobile ? 28 : 48;
    const berryDetail = isMobile ? 0 : 1;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: true,
      powerPreference: isMobile ? "low-power" : "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 20);
    camera.position.set(0, 1.05, 3.05);
    camera.lookAt(0, -0.05, 0);

    const clusterGroup = new THREE.Group();
    scene.add(clusterGroup);

    const disposables: { dispose: () => void }[] = [];
    const floaters: FloatEntry[] = [];
    const rockers: RockEntry[] = [];

    const addFloater = (
      group: THREE.Group,
      baseY: number,
      phase: number,
      amp: number,
      spin: number,
    ) => {
      group.position.y = baseY;
      floaters.push({ group, baseY, phase, amp, spin });
    };

    // --- Apple ------------------------------------------------------------
    const appleGroup = new THREE.Group();
    appleGroup.position.set(-0.62, 0, 0.08);
    appleGroup.rotation.z = 0.06;

    const appleGeo = new THREE.SphereGeometry(0.46, sphereSeg, sphereSeg);
    appleGeo.scale(1, 0.94, 1);
    const posAttr = appleGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      if (y > 0.36) {
        const pull = (y - 0.36) * 0.5;
        posAttr.setY(i, y - pull);
      }
    }
    appleGeo.computeVertexNormals();
    applyVerticalGradient(appleGeo, PALETTE.appleTop, PALETTE.appleBottom);
    const appleMat = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      roughness: 0.32,
      metalness: 0.04,
      clearcoat: 0.55,
      clearcoatRoughness: 0.28,
    });
    const appleMesh = new THREE.Mesh(appleGeo, appleMat);
    appleGroup.add(appleMesh);
    disposables.push(appleGeo, appleMat);

    const stemGeo = new THREE.CylinderGeometry(0.02, 0.026, 0.16, 8);
    const stemMat = new THREE.MeshStandardMaterial({ color: PALETTE.stem, roughness: 0.7 });
    const stemMesh = new THREE.Mesh(stemGeo, stemMat);
    stemMesh.position.set(0.02, 0.42, 0);
    stemMesh.rotation.z = -0.18;
    appleGroup.add(stemMesh);
    disposables.push(stemGeo, stemMat);

    const appleLeafGeo = createLeafGeometry(0.26, 0.11);
    const appleLeafMat = new THREE.MeshStandardMaterial({
      color: PALETTE.leafA,
      roughness: 0.55,
      side: THREE.DoubleSide,
    });
    const appleLeafMesh = new THREE.Mesh(appleLeafGeo, appleLeafMat);
    appleLeafMesh.position.set(0.1, 0.46, 0.01);
    appleLeafMesh.rotation.set(Math.PI / 2.4, 0.3, 0.7);
    appleGroup.add(appleLeafMesh);
    disposables.push(appleLeafGeo, appleLeafMat);

    clusterGroup.add(appleGroup);
    addFloater(appleGroup, 0.02, 0, 0.045, 0.12);

    // --- Citrus slices -----------------------------------------------------
    const citrusTexture = createCitrusTexture();
    disposables.push(citrusTexture);
    const fleshMat = new THREE.MeshPhysicalMaterial({
      map: citrusTexture,
      roughness: 0.4,
      clearcoat: 0.3,
    });
    const peelMat = new THREE.MeshStandardMaterial({
      color: PALETTE.peel,
      roughness: 0.5,
    });

    function makeCitrusSlice(radius: number, thickness: number): THREE.Group {
      const group = new THREE.Group();
      const geo = new THREE.CylinderGeometry(radius, radius, thickness, cylinderSeg, 1, false);
      const mesh = new THREE.Mesh(geo, [peelMat, fleshMat, fleshMat]);
      group.add(mesh);
      disposables.push(geo);
      return group;
    }
    disposables.push(fleshMat, peelMat);

    const sliceA = makeCitrusSlice(0.42, 0.09);
    sliceA.position.set(0.42, -0.02, 0.32);
    sliceA.rotation.set(1.15, 0.3, -0.22);
    clusterGroup.add(sliceA);
    addFloater(sliceA, -0.02, 1.4, 0.05, -0.1);
    rockers.push({ group: sliceA, phase: 0, amp: 0.32, speed: 0.55 });

    const sliceB = makeCitrusSlice(0.3, 0.07);
    sliceB.position.set(0.18, 0.24, -0.38);
    sliceB.rotation.set(1.3, -0.2, 0.35);
    clusterGroup.add(sliceB);
    addFloater(sliceB, 0.24, 2.8, 0.04, 0.16);
    rockers.push({ group: sliceB, phase: 2.1, amp: 0.24, speed: 0.42 });

    // --- Blueberry cluster ---------------------------------------------
    const berryGroup = new THREE.Group();
    berryGroup.position.set(0.62, -0.22, -0.05);
    const berryGeo = new THREE.IcosahedronGeometry(0.085, berryDetail);
    const berryMat = new THREE.MeshPhysicalMaterial({
      color: PALETTE.berry,
      roughness: 0.28,
      clearcoat: 0.75,
      clearcoatRoughness: 0.2,
    });
    disposables.push(berryGeo, berryMat);
    const berryOffsets: [number, number, number][] = [
      [0, 0, 0],
      [0.14, 0.05, 0.07],
      [-0.1, 0.08, -0.06],
      [0.04, 0.14, -0.11],
      [-0.08, -0.06, 0.1],
    ];
    for (const [ox, oy, oz] of berryOffsets) {
      const m = new THREE.Mesh(berryGeo, berryMat);
      m.position.set(ox, oy, oz);
      m.scale.setScalar(0.85 + Math.random() * 0.3);
      berryGroup.add(m);
    }
    clusterGroup.add(berryGroup);
    addFloater(berryGroup, -0.22, 4.2, 0.05, 0.2);

    // --- Garnish leaves ----------------------------------------------------
    const garnishLeafGeo = createLeafGeometry(0.32, 0.13);
    const garnishLeafMat = new THREE.MeshStandardMaterial({
      color: PALETTE.leafB,
      roughness: 0.55,
      side: THREE.DoubleSide,
    });
    disposables.push(garnishLeafGeo, garnishLeafMat);

    const leaf1 = new THREE.Mesh(garnishLeafGeo, garnishLeafMat);
    leaf1.position.set(-0.28, -0.36, 0.42);
    leaf1.rotation.set(1.5, 0.4, -0.5);
    leaf1.scale.setScalar(1.1);
    clusterGroup.add(leaf1);

    const leaf2 = new THREE.Mesh(garnishLeafGeo, garnishLeafMat);
    leaf2.position.set(0.58, 0.14, 0.48);
    leaf2.rotation.set(1.4, -0.6, 0.9);
    leaf2.scale.setScalar(0.85);
    clusterGroup.add(leaf2);

    // --- Lighting · warm bone key, terracotta rim, sage fill ---------------
    scene.add(new THREE.AmbientLight(PALETTE.ambient, 0.75));
    const key = new THREE.DirectionalLight(PALETTE.key, 1.35);
    key.position.set(2.2, 3.4, 3.2);
    scene.add(key);
    const rimLight = new THREE.PointLight(PALETTE.rim, 1.1, 10);
    rimLight.position.set(-2.2, 0.8, -1.6);
    scene.add(rimLight);
    const fillLight = new THREE.PointLight(PALETTE.fill, 0.55, 10);
    fillLight.position.set(1.8, -1.6, 2.2);
    scene.add(fillLight);

    // --- Resize ------------------------------------------------------------
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

    // --- Pointer parallax ----------------------------------------------
    const mouse = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const canInteract = interactive && !isMobile;
    if (canInteract) window.addEventListener("mousemove", onMove, { passive: true });

    let smoothX = 0;
    let smoothY = 0;
    let disposed = false;
    let frameId = 0;
    let lastTime: number | null = null;

    const renderFrame = (timestamp: number) => {
      if (disposed) return;
      const last = lastTime ?? timestamp;
      const dt = Math.min(0.05, Math.max(0.001, (timestamp - last) / 1000));
      lastTime = timestamp;
      const t = timestamp * 0.001;

      if (!reduced) {
        if (autoRotate) clusterGroup.rotation.y = t * 0.16;

        smoothX = damp(smoothX, mouse.x, 4, dt);
        smoothY = damp(smoothY, mouse.y, 4, dt);
        clusterGroup.rotation.x = smoothY * 0.12;
        camera.position.x = damp(camera.position.x, smoothX * 0.3, 6, dt);

        for (const f of floaters) {
          f.group.position.y = f.baseY + Math.sin(t * 0.7 + f.phase) * f.amp;
          f.group.rotation.y += f.spin * dt;
        }
        // Slice reveal · gentle rock so the cut face catches the key light
        rockers.forEach((r, i) => {
          const base = i === 0 ? -0.22 : 0.35;
          r.group.rotation.x = 1.15 + Math.sin(t * r.speed + r.phase) * r.amp * 0.35;
          r.group.rotation.z = base + Math.sin(t * r.speed * 0.8 + r.phase) * r.amp;
        });

        // Light catch · rim light drifts through a slow arc
        rimLight.position.x = -2.2 + Math.sin(t * 0.25) * 0.6;
        rimLight.position.y = 0.8 + Math.cos(t * 0.2) * 0.4;
        rimLight.intensity = 0.9 + Math.sin(t * 0.6) * 0.35;
      }

      renderer.render(scene, camera);
    };

    if (reduced) {
      clusterGroup.rotation.y = 0.35;
      renderFrame(0);
    } else {
      const loop = (ts: number) => {
        renderFrame(ts);
        frameId = requestAnimationFrame(loop);
      };
      frameId = requestAnimationFrame(loop);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      ro.disconnect();
      if (canInteract) window.removeEventListener("mousemove", onMove);
      for (const d of disposables) d.dispose();
      renderer.dispose();
    };
  }, [autoRotate, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`h-full w-full touch-none ${className}`}
      aria-hidden
    />
  );
}
