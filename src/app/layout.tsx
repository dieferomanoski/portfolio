import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import SiteCursor from "@/components/SiteCursor";
import SiteNav from "@/components/SiteNav";
import SceneCanvas from "@/components/SceneCanvas";
import PortalIntro from "@/components/PortalIntro";
import RevealOnScroll from "@/components/RevealOnScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: `${siteConfig.name} — Full-Stack Engineer`,
  description: `${siteConfig.role} portfolio.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteCursor />
        <SceneCanvas />
        <SiteNav />
        {children}
        <PortalIntro />
        <RevealOnScroll />
      </body>
    </html>
  );
}
