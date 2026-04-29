"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const SECTION_COLORS = [
  [0x059669, 0x34d399, 0x6ee7b7, 0xa7f3d0],
  [0x10b981, 0x6ee7b7, 0xa7f3d0, 0xecfccb],
  [0x064e3b, 0x10b981, 0x34d399, 0x6ee7b7],
  [0x6ee7b7, 0xa7f3d0, 0xecfccb, 0xfef3c7],
];
const PARTICLE_COLORS = [0x6ee7b7, 0xa7f3d0, 0x34d399, 0xecfccb];
const FOG_COLORS = [0x020a06, 0x010f08, 0x000c05, 0x041a10];
const DIM_LABELS = [
  "Dimension_00 · Entrance",
  "Dimension_01 · Inner Core",
  "Dimension_02 · Deep Matrix",
  "Dimension_03 · Event Horizon",
];

const KNOT_DIMS = [
  { p: 2, q: 3, col: 0x059669, scale: 1.0, opacity: 0.55 },
  { p: 2, q: 3, col: 0x34d399, scale: 1.04, opacity: 0.35 },
  { p: 3, q: 5, col: 0x6ee7b7, scale: 1.12, opacity: 0.18 },
  { p: 2, q: 7, col: 0xa7f3d0, scale: 1.22, opacity: 0.1 },
];

function lerpColor(c1: number, c2: number, t: number): number {
  const r1 = (c1 >> 16) & 255,
    g1 = (c1 >> 8) & 255,
    b1 = c1 & 255;
  const r2 = (c2 >> 16) & 255,
    g2 = (c2 >> 8) & 255,
    b2 = c2 & 255;
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return (r << 16) | (g << 8) | b;
}

export default function SceneCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dimTagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const dimTagEl = dimTagRef.current;
    if (!canvas || !dimTagEl) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x020a06, 1);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020a06, 0.025);
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.set(0, 0, 5);

    const coreGroup = new THREE.Group();
    coreGroup.position.x = 2.0;
    scene.add(coreGroup);

    const knots: { mesh: THREE.Mesh; baseOpacity: number; baseColor: number }[] =
      [];
    KNOT_DIMS.forEach((d) => {
      const geo = new THREE.TorusKnotGeometry(1.15, 0.32, 240, 24, d.p, d.q);
      const mat = new THREE.MeshBasicMaterial({
        color: d.col,
        wireframe: true,
        transparent: true,
        opacity: d.opacity,
      });
      const m = new THREE.Mesh(geo, mat);
      m.scale.setScalar(d.scale);
      coreGroup.add(m);
      knots.push({ mesh: m, baseOpacity: d.opacity, baseColor: d.col });
    });

    const haloGeo = new THREE.SphereGeometry(2, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.045,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    coreGroup.add(new THREE.Mesh(haloGeo, haloMat));

    // Particle field
    const PCNT = 2200;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(PCNT * 3);
    const pVel = new Float32Array(PCNT * 3);
    for (let i = 0; i < PCNT; i++) {
      const r = Math.random() * 1.5;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pPos[i * 3] = 2.0 + r * Math.sin(ph) * Math.cos(th);
      pPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      pPos[i * 3 + 2] = r * Math.cos(ph);
      const dx = pPos[i * 3] - 2.0,
        dy = pPos[i * 3 + 1],
        dz = pPos[i * 3 + 2];
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
      const sp = 0.0008 + Math.random() * 0.002;
      pVel[i * 3] = (dx / len) * sp + (Math.random() - 0.5) * 0.0006;
      pVel[i * 3 + 1] = (dy / len) * sp + (Math.random() - 0.5) * 0.0006;
      pVel[i * 3 + 2] = (dz / len) * sp + (Math.random() - 0.5) * 0.0006;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x6ee7b7,
      size: 0.038,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const pts = new THREE.Points(pGeo, pMat);
    scene.add(pts);

    // Lights
    const aL = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(aL);
    const l1 = new THREE.PointLight(0x6ee7b7, 3, 15);
    const l2 = new THREE.PointLight(0x059669, 2, 15);
    const l3 = new THREE.PointLight(0x34d399, 1.5, 15);
    scene.add(l1, l2, l3);

    let mxN = 0,
      myN = 0,
      tarX = 0,
      tarY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mxN = (e.clientX / window.innerWidth - 0.5) * 2;
      myN = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    const getRawProgress = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    };
    let smoothProgress = getRawProgress();
    const getProgress = () => smoothProgress;

    let curDim = -1;
    const updateDimension = () => {
      const sp = getProgress();
      const fl = sp * 3;
      const idx = Math.min(Math.floor(fl), 2);
      const t = fl - idx;
      const palA = SECTION_COLORS[idx],
        palB = SECTION_COLORS[Math.min(idx + 1, 3)];
      knots.forEach((k, i) => {
        const c = lerpColor(palA[i], palB[i], t);
        (k.mesh.material as THREE.MeshBasicMaterial).color.setHex(c);
      });
      pMat.color.setHex(
        lerpColor(PARTICLE_COLORS[idx], PARTICLE_COLORS[Math.min(idx + 1, 3)], t)
      );
      const fogColor = lerpColor(
        FOG_COLORS[idx],
        FOG_COLORS[Math.min(idx + 1, 3)],
        t
      );
      (scene.fog as THREE.FogExp2).color.setHex(fogColor);
      renderer.setClearColor(fogColor, 1);

      const newDim = Math.min(Math.round(fl), 3);
      if (newDim !== curDim) {
        curDim = newDim;
        dimTagEl.textContent = DIM_LABELS[newDim];
      }
    };

    let t = 0;
    let rafId = 0;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      t += 0.005;

      tarX += (mxN - tarX) * 0.04;
      tarY += (myN - tarY) * 0.04;

      const target = getRawProgress();
      smoothProgress += (target - smoothProgress) * 0.08;
      const sp = getProgress();

      knots.forEach((k, i) => {
        const speedMul = 1 + sp * 2.5 + i * 0.15;
        k.mesh.rotation.x = t * 0.4 * speedMul + tarY * 0.3;
        k.mesh.rotation.y = t * 0.55 * speedMul + tarX * 0.3;
        k.mesh.rotation.z = t * 0.18 * speedMul * (i % 2 ? 1 : -1);
      });

      const scaleBoost = 1 + Math.pow(sp, 2) * 0.4;
      coreGroup.scale.setScalar(scaleBoost);
      coreGroup.position.x = 2.0 - sp * 1.0;

      const pos = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < PCNT; i++) {
        pos[i * 3] += pVel[i * 3];
        pos[i * 3 + 1] += pVel[i * 3 + 1];
        pos[i * 3 + 2] += pVel[i * 3 + 2];
        const dx = pos[i * 3] - coreGroup.position.x;
        const dy = pos[i * 3 + 1];
        const dz = pos[i * 3 + 2];
        const dist2 = dx * dx + dy * dy + dz * dz;
        if (dist2 > 80) {
          const r = Math.random() * 1.2;
          const th = Math.random() * Math.PI * 2;
          const ph = Math.acos(2 * Math.random() - 1);
          pos[i * 3] = coreGroup.position.x + r * Math.sin(ph) * Math.cos(th);
          pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
          pos[i * 3 + 2] = r * Math.cos(ph);
        }
      }
      pGeo.attributes.position.needsUpdate = true;
      pts.rotation.y = -t * 0.04;

      l1.position.set(
        coreGroup.position.x + Math.cos(t * 0.5) * 3,
        Math.sin(t * 0.4) * 2,
        Math.sin(t * 0.5) * 3
      );
      l2.position.set(
        coreGroup.position.x + Math.cos(t * 0.5 + Math.PI) * 3,
        Math.sin(t * 0.6 + 1) * 2,
        Math.sin(t * 0.5 + Math.PI) * 3
      );
      l3.position.set(
        coreGroup.position.x,
        Math.cos(t * 0.7) * 2.5,
        Math.sin(t * 0.7) * 2.5
      );

      camera.position.x = tarX * 0.25;
      camera.position.y = tarY * 0.18;
      camera.position.z = 5 - sp * 1.5;
      camera.lookAt(coreGroup.position.x * 0.5, 0, 0);

      updateDimension();
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      knots.forEach((k) => {
        k.mesh.geometry.dispose();
        (k.mesh.material as THREE.Material).dispose();
      });
      haloGeo.dispose();
      haloMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <canvas id="scene-canvas" ref={canvasRef} />
      <div id="vignette" />
      <div className="dim-tag" ref={dimTagRef}>
        Dimension_00 · Entrance
      </div>
    </>
  );
}
