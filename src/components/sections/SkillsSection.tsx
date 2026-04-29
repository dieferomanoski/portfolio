const SKILL_CATEGORIES: { title: string; tags: string[] }[] = [
  {
    title: "Languages",
    tags: ["TypeScript", "JavaScript", "Python", "Dart", "Solidity", "Rust"],
  },
  {
    title: "Frontend",
    tags: ["React", "Next.js", "Angular", "Tailwind", "Flutter", "React Native", "Ionic"],
  },
  {
    title: "Backend",
    tags: ["Node.js", "NestJS", "PostgreSQL", "SQL/NOSQL" ,  "Redis", "GraphQL", "ORMs", "REST"],
  },
  {
    title: "Web3",
    tags: ["Ethereum", "Solana", "ERC-20", "ERC-721", "ERC-1155", "NFT", "DeFi"],
  },
  {
    title: "DevOps",
    tags: ["Docker", "AWS", "Vercel", "CI/CD", "Linux", "GitHub Actions"],
  },
  {
    title: "Architecture",
    tags: ["SOLID", "TDD", "Microservices", "DDD", "Event-Driven", "Serverless", "Monorepo", "Etc..."],
  },
  {
    title: "AI & Automation",
    tags: [
      "Agentic AI",
      "LangChain",
      "MCPs",
      "RAG",
      "Vector DBs",
      "Embeddings",
      "Prompt Engineering",
      "Workflow Automation",
    ],
  },
];

export default function SkillsSection() {
  return (
    <section className="sec" id="skills">
      <div className="dim-badge" data-reveal>
        <div className="dim-dot" />
        Dimension 02 · Technical Stack
      </div>
      <span className="s-label">Skills &amp; Expertise</span>
      <h2 className="s-title">What I Use</h2>
      <p className="s-sub">
        Technologies I rely on to build great products.
      </p>
      <div className="sk-grid">
        {SKILL_CATEGORIES.map((cat, i) => (
          <div
            key={cat.title}
            className="sk-cat"
            data-reveal
            data-delay={String(i + 1)}
          >
            <div className="sk-cat-title">{cat.title}</div>
            <div className="sk-tags">
              {cat.tags.map((t, ti) => (
                <span key={`${t}-${ti}`} className="sk-tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
