"use client";

import { useEffect } from "react";

export default function RevealOnScroll() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = parseInt(el.dataset.delay || "0", 10) * 80;
          window.setTimeout(() => el.classList.add("in"), delay);
          obs.unobserve(el);
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return null;
}
