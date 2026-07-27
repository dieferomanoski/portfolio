import ProjectCarousel from "@/components/ProjectCarousel";

export default function ProjectsSection() {
  return (
    <section className="sec" id="projects">
      <div className="dim-badge" data-reveal>
        <div className="dim-dot" />
        Dimension 01 · Recent Work
      </div>
      <span className="s-label">Featured Projects</span>
      <h2 className="s-title">What I&apos;ve Built</h2>
      <p className="s-sub">
        Products, private prototypes, and research builds — one reel. Swipe or
        use the arrows to explore.
      </p>
      <ProjectCarousel />
    </section>
  );
}
