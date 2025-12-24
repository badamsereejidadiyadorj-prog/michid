import React, { useEffect, useMemo, useState } from "react";
import { TEXTS } from "../lib/data";
import ThreeDCard from "../components/ThreeDCard";
import ProductModal from "../components/ProductModal";
import Nav from "../components/Nav";
import SiteFooter from "../components/SiteFooter";
import SocialSidebar from "../components/SocialSidebar";
import { useRouter } from "next/router";

export default function ProductsPage() {
  const [lang, setLang] = useState("mn");
  const [category, setCategory] = useState<string | null>(null);
  const [usage, setUsage] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [activeImage, setActiveImage] = useState<string>("");

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/categories"),
        ]);
        const pData = pRes.ok ? await pRes.json() : [];
        const cData = cRes.ok ? await cRes.json() : [];
        setProducts(pData || []);
        setCategories(cData || []);
      } catch (e) {
        setProducts([]);
        setCategories([]);
      }
    })();
  }, []);

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const q = router.query.usage as string | undefined;
    if (q) setUsage(q);
  }, [router.isReady, router.query.usage]);

  // keep URL in sync when usage state changes via UI
  useEffect(() => {
    if (!router.isReady) return;
    const params = new URLSearchParams(window.location.search);
    if (usage) params.set("usage", usage);
    else params.delete("usage");
    const url = `${window.location.pathname}?${params.toString()}`;
    router.replace(url, undefined, { shallow: true });
  }, [usage]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category && (p.categoryId || p.category_id) !== category)
        return false;
      if (usage && p.usage !== usage) return false;
      if (
        query &&
        !(
          (p.title || "").toLowerCase().includes(query.toLowerCase()) ||
          (p.description || "").toLowerCase().includes(query.toLowerCase())
        )
      )
        return false;
      return true;
    });
  }, [products, category, usage, query]);

  const getText = (k: string) => TEXTS[k]?.[lang] || k;

  return (
    <div className="min-h-screen bg-[#1a0b2e] text-[#F5F5DC]">
      <Nav lang={lang} setLang={setLang} onSubmenu={() => {}} />
      <SocialSidebar />

      <main className="container mx-auto px-6 py-20">
        <header className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-serif text-amber-100">Products</h1>
            <p className="text-purple-300 text-sm mt-2">
              Filter by category, usage or search by name.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full md:w-72 px-4 py-2 rounded border border-purple-700 bg-[#12041a] text-purple-200"
            />
            <select
              value={category ?? ""}
              onChange={(e) => setCategory(e.target.value || null)}
              className="px-3 py-2 bg-[#12041a] border border-purple-700 rounded text-purple-200">
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {TEXTS[c.title_key || c.titleKey]?.[lang] ?? c.id}
                </option>
              ))}
            </select>
            <select
              value={usage ?? ""}
              onChange={(e) => setUsage(e.target.value || null)}
              className="px-3 py-2 bg-[#12041a] border border-purple-700 rounded text-purple-200">
              <option value="">All Usages</option>
              <option value="ceremonial">Ceremonial</option>
              <option value="everyday">Everyday</option>
              <option value="winter">Winter</option>
            </select>
            <button
              onClick={() => {
                setCategory(null);
                setUsage(null);
                setQuery("");
              }}
              className="px-3 py-2 bg-purple-800/40 rounded text-sm text-purple-200">
              Reset
            </button>
          </div>
        </header>

        <section>
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-purple-300">
              No products found.
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelected(p);
                    setActiveImage(p.image);
                  }}
                  className="cursor-pointer">
                  <ThreeDCard className="group bg-[#1a0b2e] rounded-xl overflow-hidden border border-purple-900/50 hover:border-amber-500/50 shadow-xl transition-all duration-300">
                    <div className="h-72 overflow-hidden relative">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6 bg-gradient-to-b from-[#1a0b2e] to-[#140824]">
                      <h3 className="text-2xl font-serif text-amber-100 mb-2">
                        {p.title}
                      </h3>
                      <p className="text-purple-300 text-sm mb-4 truncate">
                        {p.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-amber-500 font-bold font-serif">
                          {p.price}
                        </span>
                        <button className="text-purple-300 text-xs uppercase tracking-wider">
                          {getText("view_details")}
                        </button>
                      </div>
                    </div>
                  </ThreeDCard>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter lang={lang} />

      {selected && (
        <ProductModal
          lang={lang}
          selectedProduct={selected}
          setSelectedProduct={setSelected}
          activeImage={activeImage}
          setActiveImage={setActiveImage}
          relatedProducts={products
            .filter(
              (x) =>
                x.categoryId === selected.categoryId && x.id !== selected.id
            )
            .slice(0, 3)}
          handleShare={async () => {
            try {
              await navigator.clipboard.writeText(window.location.href);
            } catch {}
          }}
          shareFeedback={false}
        />
      )}
    </div>
  );
}
