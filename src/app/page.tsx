import HeroSection from "@/components/sections/HeroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="sec-divider" />
      <ProjectsSection />
      <div className="sec-divider" />
      <SkillsSection />
      <div className="sec-divider" />
      <ContactSection />
    </>
  );
}
