"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { projects, type Project } from "@/data/projects";

function initials(title: string): string {
  return title
    .split(/\s+/)
    .filter((w) => /[a-z0-9]/i.test(w))
    .map((w) => w[0])
    .slice(0, 3)
    .join("")
    .toUpperCase();
}

function CardShot({ p, priority }: { p: Project; priority?: boolean }) {
  const num = String(projects.indexOf(p) + 1).padStart(2, "0");
  return (
    <div className="pc-shot">
      <div className="pc-shot-media">
        {p.images[0] ? (
          <Image
            src={p.images[0]}
            alt={`${p.title} screenshot`}
            fill
            sizes="(max-width: 900px) 100vw, (max-width: 1400px) 70vw, 900px"
            style={{ objectFit: "cover" }}
            priority={priority}
          />
        ) : (
          <div className="pc-ph" aria-hidden="true">
            <div className="pc-ph-grid" />
            <span className="pc-ph-num">{num}</span>
            <div className="pc-ph-center">
              <span className="pc-ph-initials">{initials(p.title)}</span>
              <span className="pc-ph-label">
                <span className="p-dot" />
                Screenshots incoming
              </span>
            </div>
            <div className="pc-ph-scan" />
          </div>
        )}
      </div>
      <div className="pc-badges">
        <span className="pc-badge solid">{p.status}</span>
        {p.private && <span className="pc-badge ghost">Private</span>}
      </div>
    </div>
  );
}

export default function ProjectCarousel() {
  const [index, setIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const total = projects.length;

  const goTo = useCallback(
    (i: number) => setIndex(((i % total) + total) % total),
    [total]
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const root = rootRef.current;
      if (!root) return;
      const r = root.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else prev();
    }
  };

  const onSlideMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const prevP = projects[(index - 1 + total) % total];
  const activeP = projects[index];
  const nextP = projects[(index + 1) % total];

  return (
    <div className="pc" data-reveal data-delay="1" ref={rootRef}>
      <div
        className="pc-stage"
        ref={trackRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Projects"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {total > 1 && (
          <button
            type="button"
            className="pc-side pc-side-prev"
            aria-label={`Go back to ${prevP.title}`}
            onClick={prev}
          >
            <div className="pc-side-card">
              <CardShot p={prevP} />
            </div>
            <span className="pc-side-gradient" />
            <span className="pc-side-label">
              <span className="pc-side-arrow">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.5 3.5 6 8l4.5 4.5" />
                </svg>
              </span>
              <span className="pc-side-title">{prevP.title}</span>
            </span>
          </button>
        )}

        <article
          className="pc-slide active"
          aria-live="polite"
          key={activeP.slug}
          onMouseMove={onSlideMouseMove}
        >
          <CardShot p={activeP} priority />
          <div className="pc-meta">
            <div className="pc-meta-top">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span className="pc-meta-line" />
              {activeP.live && (
                <span className="p-live">
                  <span className="p-dot" />
                  Live
                </span>
              )}
            </div>
            <h3 className="pc-name">{activeP.title}</h3>
            <p className="pc-desc">{activeP.description}</p>
            <div className="tech-stack pc-tags">
              {activeP.tech.map((t) => (
                <span key={t} className="t-tag">
                  {t}
                </span>
              ))}
            </div>
            {(activeP.demoUrl || activeP.codeUrl) && (
              <div className="p-links pc-links">
                {activeP.demoUrl && (
                  <a
                    href={activeP.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-link"
                  >
                    ↗ Live Demo
                  </a>
                )}
                {activeP.codeUrl && (
                  <a
                    href={activeP.codeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-link"
                  >
                    ⌥ Source
                  </a>
                )}
              </div>
            )}
          </div>
        </article>

        {total > 1 && (
          <button
            type="button"
            className="pc-side pc-side-next"
            aria-label={`Discover next project: ${nextP.title}`}
            onClick={next}
          >
            <div className="pc-side-card">
              <CardShot p={nextP} />
            </div>
            <span className="pc-side-gradient" />
            <span className="pc-side-label">
              <span className="pc-side-title">{nextP.title}</span>
              <span className="pc-side-arrow">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5.5 3.5 10 8l-4.5 4.5" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="pc-nav">
        <span className="pc-count">
          <b>{String(index + 1).padStart(2, "0")}</b> / {String(total).padStart(2, "0")}
        </span>
        <div className="pc-dots">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              className={`pc-dot${i === index ? " active" : ""}`}
              aria-label={`Go to ${p.title}`}
              onClick={() => goTo(i)}
            >
              <span />
            </button>
          ))}
        </div>
        <div className="pc-arrows">
          <button type="button" className="pc-arrow" aria-label="Previous project" onClick={prev}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.5 3.5 6 8l4.5 4.5" />
            </svg>
          </button>
          <button type="button" className="pc-arrow" aria-label="Next project" onClick={next}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5.5 3.5 10 8l-4.5 4.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
