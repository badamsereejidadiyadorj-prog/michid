import React from "react";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

export default function SocialSidebar() {
  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-4 p-4 bg-purple-950/50 backdrop-blur-sm rounded-r-2xl border-y border-r border-amber-500/20 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      <a
        href="#"
        className="text-purple-300 hover:text-amber-400 hover:scale-110 transition-all duration-300">
        <Facebook size={20} />
      </a>
      <a
        href="#"
        className="text-purple-300 hover:text-amber-400 hover:scale-110 transition-all duration-300">
        <Instagram size={20} />
      </a>
      <a
        href="#"
        className="text-purple-300 hover:text-amber-400 hover:scale-110 transition-all duration-300">
        <Twitter size={20} />
      </a>
      <div className="w-8 h-[1px] bg-purple-600 mx-auto my-2" />
      <a
        href="mailto:info@michid.mn"
        className="text-purple-300 hover:text-amber-400 hover:scale-110 transition-all duration-300">
        <Mail size={20} />
      </a>
    </div>
  );
}
