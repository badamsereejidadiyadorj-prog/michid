import React from "react";
import { Star } from "lucide-react";
import ThreeDCard from "./ThreeDCard";
import { TEXTS } from "../lib/data";

export default function About({ lang = "mn" }: any) {
  const getText = (k: string) => TEXTS[k]?.[lang] || k;

  return (
    <section id="about" className="py-20 relative overflow-hidden bg-[#140824]">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-10 mix-blend-overlay"></div>
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
        <div className="order-2 md:order-1">
          <ThreeDCard className="w-full h-[500px] rounded-2xl overflow-hidden border border-amber-500/20 shadow-[0_0_40px_rgba(124,58,237,0.15)]">
            <img
              src="https://images.unsplash.com/photo-1548883354-94bcfe321cbb?q=80&w=800&auto=format&fit=crop"
              alt="Craftsmanship"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
            />
          </ThreeDCard>
        </div>

        <div className="order-1 md:order-2 space-y-6">
          <h2 className="text-4xl font-serif text-amber-100">
            {getText("nav_about")}
          </h2>
          <div className="w-20 h-1 bg-amber-500"></div>
          <p className="text-purple-200/80 leading-relaxed font-light text-lg">
            The Michid brand revives the ancient elegance of the Hunnu Empire.
            Our Deels are not just garments; they are a testament to Mongolian
            heritage, stitched with precision and adorned with patterns that
            tell stories of the night sky and the eternal blue heaven.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="p-4 border border-amber-500/20 bg-purple-900/20 rounded-lg hover:bg-purple-900/30 transition-colors">
              <Star className="text-amber-500 mb-2" />
              <h4 className="font-serif text-amber-100">Premium Silk</h4>
            </div>
            <div className="p-4 border border-amber-500/20 bg-purple-900/20 rounded-lg hover:bg-purple-900/30 transition-colors">
              <Star className="text-amber-500 mb-2" />
              <h4 className="font-serif text-amber-100">Hand Stitched</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
