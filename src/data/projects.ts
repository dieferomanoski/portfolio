export type Project = {
  /** Used for the screenshot folder: /public/projects/<slug>/ */
  slug: string;
  title: string;
  description: string;
  tech: string[];
  /** Screenshot paths under /public, e.g. "/projects/noma/companion-drawer.png". First image is the slide visual; empty = styled placeholder. */
  images: string[];
  status: string;
  private?: boolean;
  live?: boolean;
  demoUrl?: string;
  codeUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "aura-studio",
    title: "AURA Studio",
    description:
      "Portfolio site for AURA Studio, an AI motion design studio — dark, editorial and scroll-driven. Every animation is a hand-written 2D canvas piece rather than a video: a scrubbing hero terrain, a typewriter brief, a torus that morphs into the portfolio grid, and per-card motion loops.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Motion", "Canvas"],
    images: ["/projects/aura-studio/hero.png"],
    status: "Studio site",
    live: true,
    demoUrl: "https://aurastudio.productions",
  },
  {
    slug: "noma",
    title: "Noma",
    description:
      "AI travel companion built around one continuous 3D world: a rotating globe dives seamlessly into street-level city maps, with Noma — the companion character above — walking the map beside you and opening real place details on tap instead of jumping screens.",
    tech: ["Three.js", "MapLibre GL", "React Three Fiber", "Framer Motion", "Remotion"],
    images: ["/projects/noma/character-sheet.png"],
    status: "Interactive prototype",
    private: true,
  },
  {
    slug: "manga-reader",
    title: "Manga Reader",
    description:
      "Manga reading app with offline caching, a paywall, and a companion API that pulls MangaDex's public catalog — falling back to a resilient scraper with anti-bot handling when the primary source is unavailable.",
    tech: ["Flutter", "GetX", "Node.js", "Puppeteer", "Hive"],
    images: [],
    status: "Shipped app",
    private: true,
  },
  {
    slug: "mission-control",
    title: "Mission Control",
    description:
      "Live visualization layer for AI coding agents: a custom WebSocket server tails Claude Code session logs and renders every active agent as an animated sprite walking around an office in real time, synced to an Obsidian knowledge vault.",
    tech: ["Next.js", "WebSocket", "chokidar", "Canvas", "Playwright"],
    images: ["/projects/mission-control/dashboard.png"],
    status: "Internal tool",
    live: true,
  },
  {
    slug: "rocky-chartmind",
    title: "Rocky + ChartMind",
    description:
      "Multi-agent trading research system: a six-layer architecture with specialist sub-agents (engineer, scholar, architect, analyst) dispatched by a central orchestrator, a live Electron console, and ChartMind — a custom MCP server giving Claude direct programmatic control over TradingView charts, Pine Script, and paper trades via Chrome DevTools Protocol.",
    tech: ["Electron", "React", "LangGraph", "FastAPI", "PostgreSQL", "MCP", "Python"],
    images: [],
    status: "Active system",
    private: true,
  },
  {
    slug: "helm",
    title: "HELM",
    description:
      "Local-first desktop OS for running AI coding agents across any CLI tool — git-worktree isolation, evidence bundles instead of log dumps, and a hard rule that nothing reaches a real remote without a human approval gate.",
    tech: ["Tauri", "Rust", "React", "TypeScript", "SQLite"],
    images: [],
    status: "Early build",
    private: true,
  },
  {
    slug: "truco",
    title: "Truco",
    description:
      "Multiplayer card game with a real Solana wallet integration — live balance checks and on-chain transaction building sit alongside the socket.io-driven lobby, table, and rules flow.",
    tech: ["React", "Solana Web3.js", "Wallet Adapter", "Socket.io", "Zustand"],
    images: [],
    status: "Prototype",
    private: true,
  },
  {
    slug: "yugi",
    title: "Yugi",
    description:
      "Trading-card marketplace concept: collection, marketplace, and arena views built on a wagmi-connected wallet layer.",
    tech: ["Next.js", "wagmi", "ethers.js", "shadcn/ui"],
    images: [],
    status: "Concept build",
    private: true,
  },
  {
    slug: "tokencraft",
    title: "TokenCraft",
    description:
      "No-code token deployment SaaS — landing page, pricing, dashboard, and usage-limit tracking are fully built; on-chain contract deployment is the next milestone.",
    tech: ["Next.js", "Drizzle ORM", "wagmi", "viem", "Web3Modal"],
    images: [],
    status: "Product shell in progress",
    private: true,
  },
  {
    slug: "pizza-ordering",
    title: "Pizza Ordering Site",
    description:
      "Ordering site for a real, operating pizzeria: a guided flavor → size → extras → confirm flow that hands off a formatted order straight into WhatsApp, no payment gateway required.",
    tech: ["Next.js", "Framer Motion", "Zustand", "Tailwind"],
    images: [],
    status: "Live for a real business",
    live: true,
  },
  {
    slug: "plmkt",
    title: "PLMKT",
    description:
      "Polymarket trading bot for 5-minute crypto prediction markets: Monte Carlo simulation and multi-signal analysis feed a fee-adjusted, fractional-Kelly execution model, with every trade written back into a self-improving Obsidian knowledge base the bot consults on its next decision.",
    tech: ["Python", "asyncio", "NumPy/SciPy", "Polymarket CLOB", "Obsidian"],
    images: [],
    status: "Built, pre-live",
    private: true,
  },
  {
    slug: "polymarket-dashboard-bot",
    title: "Polymarket Dashboard Bot",
    description:
      "Multi-strategy Polymarket bot — flash-crash detection, market making, arbitrage — run through a live Streamlit dashboard with three operating modes (alert, bounded, autonomous) and instant config edits with no restart.",
    tech: ["Python", "Streamlit", "Polymarket CLOB"],
    images: [],
    status: "Built, pre-live",
    private: true,
  },
  {
    slug: "polymarket-copy-bot",
    title: "Wallet Copy-Trading Bot",
    description:
      "Watches a target wallet on Polymarket in real time over WebSocket and mirrors every trade proportionally to a budget, sizing positions by the target's own conviction and tracking profit and loss in plain English as markets resolve.",
    tech: ["TypeScript", "WebSocket", "Polymarket CLOB"],
    images: [],
    status: "Built, pre-live",
    private: true,
  },
];
