import React, { useEffect, useState } from "react";
import { TEXTS } from "../lib/data";
import { ArrowLeft, ChevronRight, Play } from "lucide-react";

export default function Gallery({ lang }: any) {
  const [celebrities, setCelebrities] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/celebrities');
        const data = res.ok ? await res.json() : [];
        setCelebrities(data || []);
      } catch (e) {
        setCelebrities([]);
      }
    })();
  }, []);

  return (
    <section
      id="gallery"
      className="py-20 bg-[#1a0b2e] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-serif text-amber-100 mb-2">
              {TEXTS.gallery_title[lang]}
            </h2>
            <div className="w-20 h-1 bg-amber-500" />
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 border border-purple-700 rounded-full flex items-center justify-center text-purple-300 hover:border-amber-500 hover:text-amber-500 transition-colors">
              <ArrowLeft size={16} />
            </button>
            <button className="w-10 h-10 border border-purple-700 rounded-full flex items-center justify-center text-purple-300 hover:border-amber-500 hover:text-amber-500 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {celebrities.map((celeb) => (
            <div
              key={celeb.id}
              className="group relative aspect-[3/4] overflow-hidden rounded-xl cursor-pointer">
              <img
                src={celeb.image}
                alt={celeb.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-90 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b2e] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
              {celeb.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100 duration-300">
                  <div className="w-12 h-12 rounded-full bg-amber-500/90 flex items-center justify-center text-[#1a0b2e] shadow-[0_0_20px_rgba(212,175,55,0.6)] animate-pulse">
                    <Play size={20} />
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 left-0 w-full p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-amber-500 text-xs tracking-widest uppercase mb-1">
                  {celeb.type === "video" ? "Video" : "Photo"}
                </p>
                <h3 className="text-white font-serif text-lg">{celeb.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
