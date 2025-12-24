import React, { useEffect, useState } from "react";
import { ChevronDown, Menu, X, Globe } from "lucide-react";
import { TEXTS } from "../lib/data";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Nav({
  lang,
  setLang,
  setActiveCategory,
  setActiveUsage,
  setSelectedProduct,
  handleSubMenuClick,
  onSubmenu,
}: any) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [usages, setUsages] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/usages");
        if (res.ok) {
          const data = await res.json();
          setUsages(data || []);
        }
      } catch (err) {
        setUsages([]);
      }
    })();
  }, []);
  const toggleLang = () => {
    if (!setLang) return;
    if (lang === "mn") setLang("en");
    else setLang("mn");
  };

  console.log(usages);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#1a0b2e]/90 backdrop-blur-lg shadow-2xl py-4"
          : "bg-transparent py-8"
      }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <div
            className="flex items-center gap-2 z-50 cursor-pointer"
            onClick={() => {
              setActiveCategory?.(null);
              setActiveUsage?.(null);
              setSelectedProduct?.(null);
              window.scrollTo(0, 0);
            }}>
            <div className="w-10 h-10 border-2 border-amber-500 rotate-45 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-600 -rotate-45" />
            </div>
            <span className="text-2xl font-serif font-bold tracking-[0.2em] text-amber-400 ml-3 drop-shadow-lg">
              MICHID
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6 text-xs xl:text-sm uppercase tracking-widest text-purple-200">
          <a
            href="#home"
            onClick={() => {
              setActiveCategory?.(null);
              setActiveUsage?.(null);
            }}
            className="hover:text-amber-400 transition-colors">
            {TEXTS.nav_home[lang]}
          </a>

          {/* Collection Dropdown */}
          <div className="group relative">
            <a
              href="#collection"
              className="hover:text-amber-400 transition-colors py-4 flex items-center gap-1">
              {TEXTS.nav_collection[lang]}{" "}
              <ChevronDown
                size={12}
                className="opacity-70 group-hover:rotate-180 transition-transform"
              />
            </a>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-[#1a0b2e]/95 backdrop-blur-md border border-amber-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              {usages.length === 0 ? (
                <>
                  <button
                    onClick={() => handleSubMenuClick?.("ceremonial")}
                    className="w-full text-left px-6 py-3 hover:bg-purple-900/50 hover:text-amber-400 transition-colors border-b border-purple-800/50 last:border-0">
                    {TEXTS.submenu_ceremonial[lang]}
                  </button>
                  <button
                    onClick={() => handleSubMenuClick?.("everyday")}
                    className="w-full text-left px-6 py-3 hover:bg-purple-900/50 hover:text-amber-400 transition-colors border-b border-purple-800/50 last:border-0">
                    {TEXTS.submenu_everyday[lang]}
                  </button>
                  <button
                    onClick={() => handleSubMenuClick?.("winter")}
                    className="w-full text-left px-6 py-3 hover:bg-purple-900/50 hover:text-amber-400 transition-colors">
                    {TEXTS.submenu_winter[lang]}
                  </button>
                </>
              ) : (
                usages.map((u) => (
                  <button
                    key={u.key}
                    onClick={() => {
                      const k = u.key;
                      setActiveCategory?.(null);
                      setActiveUsage?.(k);
                      const cb = handleSubMenuClick || onSubmenu;
                      if (cb) cb(k);
                      else
                        router.push(`/products?usage=${encodeURIComponent(k)}`);
                    }}
                    className="w-full text-left px-6 py-3 hover:bg-purple-900/50 hover:text-amber-400 transition-colors border-b border-purple-800/50 last:border-0">
                    {u.label || u.key}
                  </button>
                ))
              )}
            </div>
          </div>

          <a href="#gallery" className="hover:text-amber-400 transition-colors">
            {TEXTS.nav_gallery[lang]}
          </a>
          <a href="#clients" className="hover:text-amber-400 transition-colors">
            {TEXTS.nav_clients[lang]}
          </a>
          <a href="#about" className="hover:text-amber-400 transition-colors">
            {TEXTS.nav_about[lang]}
          </a>
          <a href="#contact" className="hover:text-amber-400 transition-colors">
            {TEXTS.nav_contact[lang]}
          </a>

          <button
            onClick={toggleLang}
            className="flex items-center gap-2 border border-amber-500/30 px-3 py-1.5 rounded-full hover:bg-amber-500/10 transition-colors ml-4">
            <Globe size={14} className="text-amber-500" />
            <span className="font-bold text-amber-500">
              {lang.toUpperCase()}
            </span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden z-50 text-amber-400"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#1a0b2e] z-40 flex flex-col items-center justify-center gap-8 text-xl font-serif">
          <a
            href="#home"
            onClick={() => {
              setMobileMenuOpen(false);
              setActiveCategory?.(null);
              setActiveUsage?.(null);
            }}>
            {TEXTS.nav_home[lang]}
          </a>
          <a href="#collection" onClick={() => setMobileMenuOpen(false)}>
            {TEXTS.nav_collection[lang]}
          </a>
          {/* Mobile Submenu Items */}
          <div className="flex flex-col gap-4 items-center text-sm text-purple-300">
            {usages.length === 0 ? (
              <>
                <button
                  onClick={() => {
                    handleSubMenuClick?.("ceremonial");
                    setMobileMenuOpen(false);
                  }}>
                  - {TEXTS.submenu_ceremonial[lang]} -
                </button>
                <button
                  onClick={() => {
                    handleSubMenuClick?.("everyday");
                    setMobileMenuOpen(false);
                  }}>
                  - {TEXTS.submenu_everyday[lang]} -
                </button>
                <button
                  onClick={() => {
                    handleSubMenuClick?.("winter");
                    setMobileMenuOpen(false);
                  }}>
                  - {TEXTS.submenu_winter[lang]} -
                </button>
              </>
            ) : (
              usages.map((u) => (
                <button
                  key={u.key}
                  onClick={() => {
                    const k = u.key;
                    setActiveCategory?.(null);
                    setActiveUsage?.(k);
                    const cb = handleSubMenuClick || onSubmenu;
                    if (cb) cb(k);
                    else
                      router.push(`/products?usage=${encodeURIComponent(k)}`);
                    setMobileMenuOpen(false);
                  }}>
                  - {u.label || u.key} -
                </button>
              ))
            )}
          </div>
          <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>
            {TEXTS.nav_gallery[lang]}
          </a>
          <a href="#clients" onClick={() => setMobileMenuOpen(false)}>
            {TEXTS.nav_clients[lang]}
          </a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)}>
            {TEXTS.nav_about[lang]}
          </a>
          <button
            onClick={toggleLang}
            className="text-amber-500 flex items-center gap-2">
            <Globe size={20} /> {lang.toUpperCase()}
          </button>
        </div>
      )}
    </nav>
  );
}
