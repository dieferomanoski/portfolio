"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function PortalIntro() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const active = mounted && !hidden;

  useEffect(() => {
    if (!active) return;
    const overlay = overlayRef.current;
    const canvas = canvasRef.current;
    const text = textRef.current;
    const flash = flashRef.current;
    const skip = skipRef.current;
    if (!overlay || !canvas || !text || !flash || !skip) return;

    document.body.style.overflow = "hidden";

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x020a06, 1);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020a06, 0.02);
    const camera = new THREE.PerspectiveCamera(
      72,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.z = 8;

    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 36; i++) {
      const geo = new THREE.TorusGeometry(
        2.2 + Math.sin(i * 0.45) * 0.4,
        0.018,
        8,
        90
      );
      const col = i % 3 === 0 ? 0x6ee7b7 : i % 3 === 1 ? 0x34d399 : 0x059669;
      const mat = new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: 0.5 + Math.random() * 0.3,
      });
      const r = new THREE.Mesh(geo, mat);
      r.position.z = -i * 3.2;
      r.rotation.x = Math.sin(i * 0.6) * 0.18;
      r.rotation.y = Math.cos(i * 0.4) * 0.12;
      scene.add(r);
      rings.push(r);
    }

    const tkGeo = new THREE.TorusKnotGeometry(1.1, 0.34, 200, 22, 2, 3);
    const tkMat = new THREE.MeshBasicMaterial({
      color: 0x6ee7b7,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    const tk = new THREE.Mesh(tkGeo, tkMat);
    tk.position.z = -110;
    scene.add(tk);

    const slGeo = new THREE.BufferGeometry();
    const slPos = new Float32Array(300 * 6);
    for (let i = 0; i < 300; i++) {
      const ang = Math.random() * Math.PI * 2;
      const r = 0.2 + Math.random() * 2;
      const x = Math.cos(ang) * r,
        y = Math.sin(ang) * r;
      const z1 = -Math.random() * 110;
      const z2 = z1 + 1 + Math.random() * 3;
      slPos[i * 6] = x;
      slPos[i * 6 + 1] = y;
      slPos[i * 6 + 2] = z1;
      slPos[i * 6 + 3] = x;
      slPos[i * 6 + 4] = y;
      slPos[i * 6 + 5] = z2;
    }
    slGeo.setAttribute("position", new THREE.BufferAttribute(slPos, 3));
    const slMat = new THREE.LineBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0,
    });
    scene.add(new THREE.LineSegments(slGeo, slMat));

    const partGeo = new THREE.BufferGeometry();
    const partArr = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      partArr[i * 3] = (Math.random() - 0.5) * 8;
      partArr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      partArr[i * 3 + 2] = -Math.random() * 115;
    }
    partGeo.setAttribute("position", new THREE.BufferAttribute(partArr, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0x6ee7b7,
      size: 0.035,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(partGeo, partMat));

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    let done = false;
    let t0: number | null = null;
    let rafId = 0;

    const finish = () => {
      if (done) return;
      done = true;
      overlay.style.transition = "opacity .9s ease";
      overlay.style.opacity = "0";
      document.body.style.overflow = "";
      window.setTimeout(() => {
        setHidden(true);
      }, 1000);
    };

    const skipTimer = window.setTimeout(() => {
      if (skip) skip.style.opacity = "1";
    }, 1200);

    const onSkip = () => finish();
    skip.addEventListener("click", onSkip);

    const tick = (now: number) => {
      if (done) return;
      if (t0 === null) t0 = now;
      const e = now - t0;
      if (e < 700) text.style.opacity = (e / 700).toFixed(3);
      if (e >= 900 && e <= 4200) {
        const ft = (e - 900) / 3300;
        const ez = easeInOutCubic(ft);
        camera.position.z = 8 - ez * 112;
        slMat.opacity = Math.min(ft * 4, 0.85);
        partMat.opacity = Math.min(ft * 3, 0.6);
        tkMat.opacity = Math.max(0, (ft - 0.4) / 0.6) * 0.9;
        tk.rotation.x += 0.02;
        tk.rotation.y += 0.025;
        if (ft > 0.25) {
          const tf = (ft - 0.25) / 0.75;
          text.style.opacity = (1 - tf).toFixed(3);
          text.style.transform = `scale(${(1 + tf * 0.6).toFixed(3)})`;
        }
        rings.forEach((r) => {
          const d = Math.abs(camera.position.z - r.position.z);
          (r.material as THREE.MeshBasicMaterial).opacity =
            d < 3.5 ? 0.55 + (1 - d / 3.5) * 1.6 : 0.3;
          r.rotation.z += 0.003;
        });
      }
      if (e >= 4000 && e < 4300) {
        const ft = (e - 4000) / 300;
        flash.style.opacity = (
          ft < 0.4 ? ft / 0.4 : 1 - (ft - 0.4) / 0.6
        ).toFixed(3);
      }
      if (e >= 4300) {
        const ft = Math.min((e - 4300) / 1100, 1);
        overlay.style.opacity = (1 - ft).toFixed(3);
      }
      renderer.render(scene, camera);
      if (e < 5600) {
        rafId = requestAnimationFrame(tick);
      } else {
        finish();
      }
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(skipTimer);
      window.removeEventListener("resize", onResize);
      skip.removeEventListener("click", onSkip);
      document.body.style.overflow = "";
      rings.forEach((r) => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      tkGeo.dispose();
      tkMat.dispose();
      slGeo.dispose();
      slMat.dispose();
      partGeo.dispose();
      partMat.dispose();
      renderer.dispose();
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "#020a06",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
      <div
        ref={textRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Space Grotesk', sans-serif",
          textAlign: "center",
          lineHeight: 1.08,
          pointerEvents: "none",
          zIndex: 3,
          opacity: 0,
          transition: "opacity .8s ease, transform 1.4s ease",
        }}
      >
        <div
          style={{
            fontSize: "clamp(2rem,6vw,5rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#e3f2e9",
          }}
        >
          DIEFERSON
        </div>
        <div
          style={{
            fontSize: "clamp(2rem,6vw,5rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            background: "linear-gradient(120deg,#6ee7b7,#34d399,#059669)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ROMANOSKI
        </div>
        <div
          style={{
            marginTop: "1.25rem",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.68rem",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            color: "#5a7a68",
          }}
        >
          Full-Stack Software Engineer
        </div>
      </div>
      <div
        ref={flashRef}
        style={{
          position: "absolute",
          inset: 0,
          background: "#6ee7b7",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 4,
        }}
      />
      <button
        ref={skipRef}
        type="button"
        style={{
          position: "absolute",
          bottom: "2rem",
          right: "2rem",
          zIndex: 5,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.6rem",
          textTransform: "uppercase",
          letterSpacing: "0.22em",
          color: "#3d5a4b",
          cursor: "pointer",
          padding: "0.5rem 1rem",
          border: "1px solid rgba(52,211,153,0.3)",
          borderRadius: "6px",
          opacity: 0,
          transition: "color 0.2s, opacity 0.4s",
          background: "transparent",
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = "#6ee7b7")}
        onMouseOut={(e) => (e.currentTarget.style.color = "#3d5a4b")}
      >
        Skip
      </button>
    </div>
  );
}
