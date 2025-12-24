import React, { useEffect, useState } from "react";
import { TEXTS } from "../lib/data";

export default function Clients({ lang = "mn" }: any) {
  const getText = (k: string) => TEXTS[k]?.[lang] || k;
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/clients");
        const data = res.ok ? await res.json() : [];
        setClients(data || []);
      } catch (e) {
        setClients([]);
      }
    })();
  }, []);

  return (
    <section
      id="clients"
      className="py-12 bg-[#1a0b2e] border-t border-purple-900/30 overflow-hidden relative">
      <div className="container mx-auto px-6 mb-8 text-center">
        <h3 className="text-sm font-serif text-purple-300 uppercase tracking-[0.2em]">
          {getText("clients_title")}
        </h3>
      </div>

      <div className="relative w-full overflow-hidden flex">
        <div className="flex animate-scroll whitespace-nowrap gap-16 min-w-full items-center">
          {[...clients, ...clients].map((client: any, idx: number) => (
            <div key={idx} className="flex-shrink-0 group cursor-pointer">
              <span className="text-2xl md:text-3xl font-serif text-purple-800 group-hover:text-amber-500/80 transition-colors duration-500 select-none font-bold">
                {client.name}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-[#1a0b2e] to-transparent z-10"></div>
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[#1a0b2e] to-transparent z-10"></div>
      </div>
    </section>
  );
}
