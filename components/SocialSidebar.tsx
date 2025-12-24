import React, { useContext } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Brackets,
  PaintBucket,
  ShoppingBag,
} from "lucide-react";
import CartContext from "./CartContext";

export default function SocialSidebar() {
  const ctx: any = useContext(CartContext) || {};
  const cart = Array.isArray(ctx.items) ? ctx.items : [];
  const totalCount = cart.reduce(
    (s: number, it: any) => s + (it?.quantity ?? 1),
    0
  );

  console.log(cart);

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
      {totalCount > 0 && (
        <a
          href="/cart"
          className="relative text-purple-300 hover:text-amber-400 hover:scale-110 transition-all duration-300">
          <ShoppingBag size={20} />
          {totalCount > 0 && (
            <span className="absolute -right-2 -top-2 bg-amber-500 text-purple-900 text-xs font-bold rounded-full px-2 py-0.5">
              {totalCount}
            </span>
          )}
        </a>
      )}
    </div>
  );
}
