import React from "react";
import ThreeDCard from "./ThreeDCard";
import { TEXTS } from "../lib/data";
import { ChevronRight } from "lucide-react";

export default function Hero({ lang }: any) {
  const getText = (key: string) => TEXTS[key]?.[lang] ?? key;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(60,20,90,0.4)_0%,rgba(26,11,46,1)_100%)] z-0" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 text-center md:text-left">
          <div className="inline-block px-4 py-1 border border-amber-500/30 rounded-full text-amber-500 text-xs tracking-[0.3em] uppercase mb-4 bg-purple-900/20 backdrop-blur">
            Since 2024
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-purple-200 gold-glow">
            {getText("hero_title")}
          </h1>
          <p className="text-lg md:text-xl text-purple-200/70 font-light max-w-lg mx-auto md:mx-0 border-l-2 border-amber-500 pl-6">
            {getText("hero_subtitle")}
          </p>
          <button
            onClick={() =>
              document
                .getElementById("collection")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="group relative px-8 py-4 bg-transparent border border-amber-500 text-amber-500 uppercase tracking-widest text-sm hover:bg-amber-500 hover:text-[#1a0b2e] transition-all duration-300">
            <span className="flex items-center gap-2">
              {getText("cta_explore")}{" "}
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute -inset-1 bg-amber-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </div>

        {/* 3D Hero Image */}
        <div className="relative flex justify-center items-center">
          <div className="absolute w-[500px] h-[500px] border border-purple-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
          <div className="absolute w-[400px] h-[400px] border border-amber-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

          <ThreeDCard className="w-[300px] h-[450px] md:w-[400px] md:h-[600px] rounded-t-[100px] rounded-b-2xl overflow-hidden shadow-[0_20px_60px_rgba(40,10,70,0.6)] border border-amber-500/20 bg-[#1a0b2e]">
            <img
              src="https://images.unsplash.com/photo-1552874869-5c39ec9288dc?q=80&w=800&auto=format&fit=crop"
              alt="Michid Hero Product"
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500 hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-[#1a0b2e] to-transparent">
              <h3 className="text-2xl font-serif text-amber-100">
                Royal Collection
              </h3>
              <p className="text-amber-500 text-sm">Limited Edition</p>
            </div>
          </ThreeDCard>
        </div>
      </div>
    </section>
  );
}
