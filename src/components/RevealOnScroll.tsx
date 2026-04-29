"use client";

import { useEffect } from "react";

export default function RevealOnScroll() {
  useEffect(() => {
    const timers = new WeakMap<Element, number>();
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const existing = timers.get(el);
          if (existing) {
            window.clearTimeout(existing);
            timers.delete(el);
          }
          if (entry.isIntersecting) {
            const delay = parseInt(el.dataset.delay || "0", 10) * 80;
            const t = window.setTimeout(() => el.classList.add("in"), delay);
            timers.set(el, t);
          } else {
            el.classList.remove("in");
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return null;
}
