"use client";

import { useEffect } from "react";

const STAGGER_IDS = [
  "htag",
  "hname",
  "hrole",
  "hchips",
  "hbio",
  "hcta",
  "scrollhint",
];

export default function HeroSection() {
  useEffect(() => {
    const timers = STAGGER_IDS.map((id, i) =>
      window.setTimeout(() => {
        document.getElementById(id)?.classList.add("in");
      }, 100 + i * 110)
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  return (
    <section className="sec" id="hero">
      <span className="hero-tag" id="htag">
        ◎ Portfolio · 2026
      </span>
      <h1 className="hero-name" id="hname">
        Dieferson
        <br />
        <span className="hero-name-grad">Romanoski</span>
      </h1>
      <div className="hero-role" id="hrole">
        Full-Stack Software Engineer
      </div>
      <div className="hero-chips" id="hchips">
        <span className="chip">🌍 Worldwide</span>
        <span className="chip">🇧🇷 Brazil</span>
        <span className="chip">CS Bachelor</span>
        <span className="chip">Web3</span>
        <span className="chip">Cybersecurity</span>
      </div>
      <p className="hero-bio" id="hbio">
        Building scalable systems, secure applications, and innovative solutions
        across web, mobile, and blockchain.
      </p>
      <div className="hero-cta" id="hcta">
        <a href="#projects" className="btn-p">
          View Projects
        </a>
        <a href="#contact" className="btn-g">
          Get in Touch
        </a>
        <a
          href="https://github.com/dieferomanoski"
          target="_blank"
          rel="noreferrer"
          className="btn-g"
        >
          GitHub
        </a>
      </div>
      <div className="scroll-hint" id="scrollhint">
        <div className="scroll-bar" />
        <span>Scroll to traverse dimensions</span>
      </div>
    </section>
  );
}
