export type Project = {
  title: string;
  description: string;
  tech: string[];
  demoUrl?: string;
  codeUrl?: string;
  live?: boolean;
};

export const projects: Project[] = [
  {
    title: "Token Craft",
    description:
      "A WebApp SaaS to create smart contracts with multi-chain support. Deploy Tokens & NFTs across EVM and Solana — no code required.",
    tech: [
      "Next.js",
      "TypeScript",
      "Solidity",
      "Solana",
      "Rust",
      "Web3",
    ],
    demoUrl: "https://token-craft-rust.vercel.app",
    live: true,
  },
  {
    title: "Neon Portfolio",
    description:
      "A dark, cinematic portfolio with portal intro, scroll-driven 3D core, and dimensional transitions. The page you're inside right now.",
    tech: ["Next.js", "TypeScript", "Three.js", "Tailwind"],
    demoUrl: "https://dieferomanoski.dev",
    codeUrl: "https://github.com/dieferomanoski/portifolio",
    live: true,
  },
];
