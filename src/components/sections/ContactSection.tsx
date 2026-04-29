import { siteConfig } from "@/config/site";

export default function ContactSection() {
  return (
    <section className="sec" id="contact">
      <div className="dim-badge" data-reveal>
        <div className="dim-dot" />
        Dimension 03 · Final Destination
      </div>
      <h2 className="ct-title" data-reveal>
        Let&apos;s Build
        <br />
        <span className="ct-grad">Something Amazing</span>
      </h2>
      <p className="s-sub" style={{ marginTop: "0.6rem" }}>
        Whether you have a project or just want to talk — I&apos;m always open.
      </p>

      <div className="ct-cards">
        <a
          href={`mailto:${siteConfig.email}`}
          className="ct-card"
          data-reveal
          data-delay="1"
        >
          <div className="ct-icon">
            <svg viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </div>
          <div>
            <div className="ct-info-label">Email</div>
            <div className="ct-info-val">{siteConfig.email}</div>
          </div>
        </a>
        <a
          href={siteConfig.socials.github}
          target="_blank"
          rel="noreferrer"
          className="ct-card"
          data-reveal
          data-delay="2"
        >
          <div className="ct-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.57v-2.23c-3.34.73-4.03-1.41-4.03-1.41-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.11-3.17 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.25 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.69.82.57C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </div>
          <div>
            <div className="ct-info-label">GitHub</div>
            <div className="ct-info-val">github.com/dieferomanoski</div>
          </div>
        </a>
        <a
          href={siteConfig.socials.linkedin}
          target="_blank"
          rel="noreferrer"
          className="ct-card"
          data-reveal
          data-delay="3"
        >
          <div className="ct-icon">
            <svg viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </div>
          <div>
            <div className="ct-info-label">LinkedIn</div>
            <div className="ct-info-val">linkedin.com/in/dieferomanoski</div>
          </div>
        </a>
      </div>

      <div className="ct-cta-wrap" data-reveal>
        <div className="ct-cta">
          <a href={`mailto:${siteConfig.email}`} className="btn-p">
            ✉ Send Email
          </a>
          <a
            href={siteConfig.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="btn-g"
          >
            LinkedIn
          </a>
        </div>
      </div>
      <div className="footer">
        © 2026 Dieferson Romanoski · Crafted with passion and caffeine
      </div>
    </section>
  );
}
