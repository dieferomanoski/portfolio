"use client";

import { useEffect, useRef } from "react";
import { projects } from "@/data/projects";

export default function ProjectsSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cards = root.querySelectorAll<HTMLDivElement>(".p-card");
    const handlers: Array<() => void> = [];
    cards.forEach((card) => {
      const onMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", `${x * 100}%`);
        card.style.setProperty("--my", `${y * 100}%`);
        card.style.transform = `perspective(800px) rotateX(${
          (y - 0.5) * 8
        }deg) rotateY(${(x - 0.5) * -8}deg) translateZ(4px)`;
      };
      const onLeave = () => {
        card.style.transform =
          "perspective(800px) rotateX(0) rotateY(0) translateZ(0)";
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      handlers.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    });
    return () => handlers.forEach((h) => h());
  }, []);

  return (
    <section className="sec" id="projects" ref={rootRef}>
      <div className="dim-badge" data-reveal>
        <div className="dim-dot" />
        Dimension 01 · Recent Work
      </div>
      <span className="s-label">Featured Projects</span>
      <h2 className="s-title">What I&apos;ve Built</h2>
      <p className="s-sub">
        Products shipped to real users — hover to explore the details.
      </p>

      {projects.map((p, i) => {
        const num = String(i + 1).padStart(2, "0");
        return (
          <div
            key={p.title}
            className="p-card"
            data-reveal
            data-delay={String(i + 1)}
          >
            {p.live && (
              <div className="p-live">
                <div className="p-dot" />
                Live
              </div>
            )}
            <div className="p-num">{num}</div>
            <h3 className="p-name">{p.title}</h3>
            <p className="p-desc">{p.description}</p>
            <div className="tech-stack">
              {p.tech.map((t) => (
                <span key={t} className="t-tag">
                  {t}
                </span>
              ))}
            </div>
            <div className="p-links">
              {p.demoUrl && (
                <a
                  href={p.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-link"
                >
                  ↗ Live Demo
                </a>
              )}
              {p.codeUrl && (
                <a
                  href={p.codeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-link"
                >
                  ⌥ Source
                </a>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
