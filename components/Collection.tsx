import React, { useEffect, useState } from "react";
import { TEXTS } from "../lib/data";
import ThreeDCard from "./ThreeDCard";
import { ChevronRight, ArrowLeft, ZoomIn } from "lucide-react";
export default function Collection({
  lang,
  activeCategory,
  setActiveCategory,
  activeUsage,
  setActiveUsage,
  setSelectedProduct,
  setActiveImage,
  handleSubMenuClick,
}: any) {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          fetch("/api/admin/categories"),
          fetch("/api/admin/products"),
        ]);
        const cats = catsRes.ok ? await catsRes.json() : [];
        const prods = prodsRes.ok ? await prodsRes.json() : [];
        setCategories(cats || []);
        setProducts(prods || []);
      } catch (e) {
        setCategories([]);
        setProducts([]);
      }
    })();
  }, []);

  const filteredProducts = activeCategory
    ? products.filter(
        (p: any) =>
          p.category_id === activeCategory || p.categoryId === activeCategory
      )
    : activeUsage
    ? products.filter((p: any) => p.usage === activeUsage)
    : [];

  return (
    <section id="collection" className="py-20 bg-[#140824] relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-amber-100 mb-4">
            {TEXTS.latest_work[lang]}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto" />
        </div>

        {!activeCategory && !activeUsage && (
          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((cat: any) => (
              <div
                key={cat.id}
                onClick={() => setActiveCategory?.(cat.id)}
                className="cursor-pointer">
                <ThreeDCard className="group h-96 relative rounded-2xl overflow-hidden border border-purple-800 hover:border-amber-500/50 shadow-2xl">
                  <img
                    src={cat.image}
                    alt={TEXTS[cat.title_key || cat.titleKey]?.[lang] || cat.id}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b2e]/90 via-transparent to-transparent opacity-90 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 w-full p-8 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-3xl font-serif text-amber-100 mb-2">
                      {TEXTS[cat.title_key || cat.titleKey]?.[lang] || cat.id}
                    </h3>
                    <span className="text-amber-500 text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      {TEXTS.cta_explore[lang]} <ChevronRight size={14} />
                    </span>
                  </div>
                </ThreeDCard>
              </div>
            ))}
          </div>
        )}

        {(activeCategory || activeUsage) && (
          <div className="animate-fade-in-up">
            <button
              onClick={() => {
                setActiveCategory?.(null);
                setActiveUsage?.(null);
              }}
              className="mb-8 flex items-center gap-2 text-purple-300 hover:text-amber-400 uppercase tracking-widest text-sm">
              <ArrowLeft size={18} />
              {TEXTS.back[lang]}
            </button>
            <h3 className="text-2xl font-serif text-white mb-8 border-l-4 border-amber-500 pl-4">
              {activeCategory
                ? TEXTS[
                    categories.find((c) => c.id === activeCategory)?.titleKey
                  ][lang]
                : TEXTS[`submenu_${activeUsage}`][lang]}
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct?.(product);
                    setActiveImage?.(product.image);
                  }}
                  className="cursor-pointer">
                  <ThreeDCard className="group bg-[#1a0b2e] rounded-xl overflow-hidden border border-purple-900/50 hover:border-amber-500/50 shadow-xl transition-all duration-300">
                    <div className="h-96 overflow-hidden relative">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-[#1a0b2e]/80 backdrop-blur text-amber-500 px-3 py-1 rounded-full text-xs border border-amber-500/30 opacity-0 group-hover:opacity-100 transform translate-y-[-10px] group-hover:translate-y-0 transition-all duration-300">
                        <ZoomIn size={14} />
                      </div>
                    </div>
                    <div className="p-6 relative bg-gradient-to-b from-[#1a0b2e] to-[#140824]">
                      <h3 className="text-2xl font-serif text-amber-100 mb-2 group-hover:text-white transition-colors">
                        {product.title}
                      </h3>
                      <div className="w-10 h-[1px] bg-amber-500/50 mb-4 group-hover:w-20 transition-all" />
                      <p className="text-purple-300 text-sm mb-4 font-light truncate">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-amber-500 font-bold font-serif text-lg">
                          {product.price}
                        </span>
                        <button className="text-purple-300 group-hover:text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1 transition-colors">
                          {TEXTS.view_details[lang]} <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </ThreeDCard>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-3 text-center py-20 text-purple-300">
                  No products found in this category.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
