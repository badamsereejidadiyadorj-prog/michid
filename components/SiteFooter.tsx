import React from "react";
import { TEXTS } from "../lib/data";

export default function SiteFooter({ lang }: any) {
  return (
    <footer className="bg-[#0f0518] border-t border-purple-900/50 py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border border-amber-500 rotate-45 flex items-center justify-center">
            <div className="w-3 h-3 bg-amber-500 -rotate-45" />
          </div>
          <span className="text-lg font-serif font-bold tracking-[0.2em] text-purple-400">
            MICHID
          </span>
        </div>
        <div className="text-purple-400/60 text-sm">
          {TEXTS.footer_text[lang]}
        </div>
        <div className="flex gap-6 lg:hidden">icons could go here </div>
      </div>
    </footer>
  );
}
