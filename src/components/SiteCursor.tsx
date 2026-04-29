"use client";

import { useEffect } from "react";

export default function SiteCursor() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cur = document.getElementById("cur");
    const ring = document.getElementById("cur-ring");
    if (!cur || !ring) return;

    let mxa = 0,
      mya = 0,
      txa = 0,
      tya = 0;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mxa = e.clientX;
      mya = e.clientY;
      cur.style.left = mxa + "px";
      cur.style.top = mya + "px";
    };

    const tick = () => {
      txa += (mxa - txa) * 0.1;
      tya += (mya - tya) * 0.1;
      ring.style.left = txa + "px";
      ring.style.top = tya + "px";
      rafId = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(tick);

    const enter = () => document.body.classList.add("cl");
    const leave = () => document.body.classList.remove("cl");

    const wireUp = () => {
      document.querySelectorAll("a,button").forEach((el) => {
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
      });
    };
    wireUp();
    const reWire = window.setInterval(wireUp, 1500);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMove);
      window.clearInterval(reWire);
      document.querySelectorAll("a,button").forEach((el) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <>
      <div id="cur" />
      <div id="cur-ring" />
    </>
  );
}
