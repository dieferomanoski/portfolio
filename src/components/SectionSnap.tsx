"use client";

import { useEffect } from "react";

const SNAP_DURATION_MS = 1100;
const COOLDOWN_PAD_MS = 120;
const WHEEL_THRESHOLD = 1;
const TOUCH_THRESHOLD = 40;
const EDGE_TOLERANCE = 4;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

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

    type EdgeState = {
      isTall: boolean;
      atTop: boolean;
      atBottom: boolean;
    };

    const edgeState = (section: HTMLElement): EdgeState => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const viewTop = window.scrollY;
      const viewBottom = viewTop + window.innerHeight;
      const isTall = section.offsetHeight > window.innerHeight + EDGE_TOLERANCE;
      const atTop = viewTop <= sectionTop + EDGE_TOLERANCE;
      const atBottom = viewBottom >= sectionBottom - EDGE_TOLERANCE;
      return { isTall, atTop, atBottom };
    };

    let locked = false;
    let activeScrollRaf = 0;
    let lockTimer = 0;

    const easedScrollTo = (top: number, duration = SNAP_DURATION_MS) => {
      if (activeScrollRaf) cancelAnimationFrame(activeScrollRaf);
      if (lockTimer) window.clearTimeout(lockTimer);
      const start = window.scrollY;
      const distance = top - start;
      if (Math.abs(distance) < 1) {
        locked = false;
        return;
      }
      const t0 = performance.now();
      locked = true;
      const step = (now: number) => {
        const t = Math.min((now - t0) / duration, 1);
        const eased = easeInOutCubic(t);
        window.scrollTo(0, start + distance * eased);
        if (t < 1) {
          activeScrollRaf = requestAnimationFrame(step);
        } else {
          activeScrollRaf = 0;
          lockTimer = window.setTimeout(() => {
            locked = false;
          }, COOLDOWN_PAD_MS);
        }
      };
      activeScrollRaf = requestAnimationFrame(step);
    };

    const goTo = (index: number) => {
      const sections = getSections();
      if (!sections.length) return;
      const clamped = Math.max(0, Math.min(sections.length - 1, index));
      const target = sections[clamped];
      easedScrollTo(target.offsetTop);
    };

    const handleDirection = (direction: 1 | -1) => {
      if (locked) return;
      const sections = getSections();
      const idx = currentIndex(sections);
      const section = sections[idx];
      if (!section) return;
      const { isTall, atTop, atBottom } = edgeState(section);

      if (isTall) {
        if (direction === 1 && !atBottom) {
          easedScrollTo(window.scrollY + window.innerHeight * 0.85, 700);
          return;
        }
        if (direction === -1 && !atTop) {
          easedScrollTo(window.scrollY - window.innerHeight * 0.85, 700);
          return;
        }
      }
      goTo(idx + direction);
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      const sections = getSections();
      const idx = currentIndex(sections);
      const section = sections[idx];
      if (section) {
        const { isTall, atTop, atBottom } = edgeState(section);
        const direction = e.deltaY > 0 ? 1 : -1;
        // Inside a tall section away from the edge: let the native scroll happen.
        if (
          isTall &&
          ((direction === 1 && !atBottom) || (direction === -1 && !atTop))
        ) {
          return;
        }
      }
      e.preventDefault();
      handleDirection(e.deltaY > 0 ? 1 : -1);
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
      handleDirection(isDown ? 1 : -1);
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0]?.clientY ?? 0;
      const delta = touchStartY - endY;
      if (Math.abs(delta) < TOUCH_THRESHOLD) return;
      handleDirection(delta > 0 ? 1 : -1);
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
      else easedScrollTo(el.offsetTop);
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
      if (activeScrollRaf) cancelAnimationFrame(activeScrollRaf);
      if (lockTimer) window.clearTimeout(lockTimer);
    };
  }, []);

  return null;
}
