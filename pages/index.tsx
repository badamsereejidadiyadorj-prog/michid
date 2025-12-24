import Nav from "../components/Nav";
import SocialSidebar from "../components/SocialSidebar";
import Hero from "../components/Hero";
import Collection from "../components/Collection";
import Gallery from "../components/Gallery";
import SiteFooter from "../components/SiteFooter";
import { useState } from "react";
import About from "../components/About";
import Clients from "../components/Clients";

export default function Home() {
  const [lang, setLang] = useState("mn");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeUsage, setActiveUsage] = useState<string | null>(null);

  const handleSubmenu = (usage: string) => {
    setActiveCategory(null);
    setActiveUsage(usage);
    document
      .getElementById("collection")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#1a0b2e] text-[#F5F5DC] selection:bg-amber-500/30 selection:text-amber-200">
      <Nav
        lang={lang}
        setLang={setLang}
        setActiveCategory={setActiveCategory}
        setActiveUsage={setActiveUsage}
        onSubmenu={handleSubmenu}
      />
      <SocialSidebar />
      <Hero lang={lang} />
      <Collection
        lang={lang}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        activeUsage={activeUsage}
        setActiveUsage={setActiveUsage}
      />
      <Gallery lang={lang} />
      <About lang={lang} />
      <Clients lang={lang} />
      <SiteFooter lang={lang} />
    </div>
  );
}
