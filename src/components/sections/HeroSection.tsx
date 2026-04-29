export default function HeroSection() {
  return (
    <section className="sec" id="hero">
      <span className="hero-tag" data-reveal data-delay="1">
        ◎ Portfolio · 2026
      </span>
      <h1 className="hero-name" data-reveal data-delay="2">
        Dieferson
        <br />
        <span className="hero-name-grad">Romanoski</span>
      </h1>
      <div className="hero-role" data-reveal data-delay="3">
        Full-Stack Software Engineer
      </div>
      <div className="hero-chips" data-reveal data-delay="4">
        <span className="chip">🌍 Worldwide</span>
        <span className="chip">🇧🇷 Brazil</span>
        <span className="chip">CS Bachelor</span>
        <span className="chip">Web3</span>
        <span className="chip">Cybersecurity</span>
      </div>
      <p className="hero-bio" data-reveal data-delay="5">
        Building scalable systems, secure applications, and innovative solutions
        across web, mobile, and blockchain.
      </p>
      <div className="hero-cta" data-reveal data-delay="6">
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
      <div className="scroll-hint" data-reveal data-delay="8">
        <div className="scroll-bar" />
        <span>Scroll to traverse dimensions</span>
      </div>
    </section>
  );
}
