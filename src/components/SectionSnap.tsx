"use client";

import { useEffect } from "react";

const COOLDOWN_MS = 750;
const WHEEL_THRESHOLD = 1;
const TOUCH_THRESHOLD = 40;

export default function SectionSnap() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 900px)").matches) return;

    const getSections = () =>
      Array.from(document.querySelectorAll<HTMLElement>("section.sec"));

    const currentIndex = (sections: HTMLElement[]) => {
      const y = window.scrollY + window.innerHeight * 0.5;
      let best = 0;
      let bestDist = Infinity;
      sections.forEach((s, i) => {
        const center = s.offsetTop + s.offsetHeight * 0.5;
        const d = Math.abs(center - y);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      return best;
    };

    let locked = false;
    const goTo = (index: number) => {
      const sections = getSections();
      if (!sections.length) return;
      const clamped = Math.max(0, Math.min(sections.length - 1, index));
      const target = sections[clamped];
      locked = true;
      window.scrollTo({ top: target.offsetTop, behavior: "smooth" });
      window.setTimeout(() => {
        locked = false;
      }, COOLDOWN_MS);
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      e.preventDefault();
      if (locked) return;
      const sections = getSections();
      const idx = currentIndex(sections);
      goTo(idx + (e.deltaY > 0 ? 1 : -1));
    };

    const onKey = (e: KeyboardEvent) => {
      const isDown =
        e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ";
      const isUp = e.key === "ArrowUp" || e.key === "PageUp";
      const isHome = e.key === "Home";
      const isEnd = e.key === "End";
      if (!isDown && !isUp && !isHome && !isEnd) return;
      e.preventDefault();
      if (locked) return;
      const sections = getSections();
      if (isHome) return goTo(0);
      if (isEnd) return goTo(sections.length - 1);
      const idx = currentIndex(sections);
      goTo(idx + (isDown ? 1 : -1));
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0]?.clientY ?? 0;
      const delta = touchStartY - endY;
      if (Math.abs(delta) < TOUCH_THRESHOLD) return;
      if (locked) return;
      const sections = getSections();
      const idx = currentIndex(sections);
      goTo(idx + (delta > 0 ? 1 : -1));
    };

    const onAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const el = document.querySelector<HTMLElement>(hash);
      if (!el) return;
      e.preventDefault();
      const sections = getSections();
      const idx = sections.indexOf(el);
      if (idx >= 0) goTo(idx);
      else {
        locked = true;
        window.scrollTo({ top: el.offsetTop, behavior: "smooth" });
        window.setTimeout(() => {
          locked = false;
        }, COOLDOWN_MS);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("click", onAnchorClick);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("click", onAnchorClick);
    };
  }, []);

  return null;
}
