import React, { useState } from "react";
import { Check, Share2, X, Info, Star } from "lucide-react";
import { TEXTS } from "../lib/data";
import { useCart } from "./CartContext";

export default function ProductModal({
  lang,
  selectedProduct,
  setSelectedProduct,
  activeImage,
  setActiveImage,
  relatedProducts,
  handleShare,
  shareFeedback,
}: any) {
  if (!selectedProduct) return null;
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    try {
      const priceRaw = (selectedProduct.price || "").toString();
      const priceNum = Number(priceRaw.replace(/[^0-9]/g, "")) || 0;
      add({
        id: selectedProduct.id,
        title: selectedProduct.title,
        price: priceNum,
        quantity: 1,
        image: selectedProduct.image,
      });
      setAdded(true);
    } catch (e) {
      console.warn("Failed to add to cart", e);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#0f0518]/90 backdrop-blur-sm"
        onClick={() => setSelectedProduct(null)}
      />

      <div className="relative bg-[#1a0b2e] w-full max-w-5xl rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(124,58,237,0.2)] border border-amber-500/20 flex flex-col md:flex-row animate-scale-in max-h-[90vh]">
        <div className="absolute top-4 right-4 z-10 flex gap-3">
          <button
            onClick={handleShare}
            className="p-2 bg-black/20 hover:bg-amber-500 rounded-full text-white transition-all duration-300 relative group"
            title={TEXTS.share[lang]}>
            {shareFeedback ? <Check size={24} /> : <Share2 size={24} />}
            {shareFeedback && (
              <span className="absolute top-full right-0 mt-2 text-xs bg-amber-500 text-[#1a0b2e] px-2 py-1 rounded whitespace-nowrap font-bold animate-fade-in-up">
                {TEXTS.link_copied[lang]}
              </span>
            )}
          </button>
          <button
            onClick={() => setSelectedProduct(null)}
            className="p-2 bg-black/20 hover:bg-amber-500 rounded-full text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="w-full md:w-1/2 min-h-[40vh] md:h-auto relative bg-black group shrink-0">
          <div className="w-full h-full relative overflow-hidden">
            <img
              src={activeImage || selectedProduct.image}
              alt={selectedProduct.title}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b2e] to-transparent opacity-30 md:opacity-0" />
          </div>

          {(selectedProduct.images || [selectedProduct.image]).length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 z-10">
              {(selectedProduct.images || [selectedProduct.image]).map(
                (img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 shadow-lg ${
                      activeImage === img
                        ? "border-amber-500 scale-110 shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                        : "border-white/20 hover:border-white/50 opacity-70 hover:opacity-100"
                    }`}>
                    <img
                      src={img}
                      alt={`Thumbnail ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                )
              )}
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col bg-gradient-to-br from-[#1a0b2e] to-[#2e1065] overflow-y-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-amber-100 mb-2">
            {selectedProduct.title}
          </h2>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-[1px] w-12 bg-amber-500" />
            <span className="text-amber-500 font-serif text-xl">
              {selectedProduct.price}
            </span>
          </div>
          <p className="text-purple-200/80 leading-relaxed mb-8 font-light">
            {selectedProduct.description}
          </p>

          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/20 flex items-start gap-4">
              <div className="p-2 bg-amber-500/10 rounded-full text-amber-500 mt-1">
                <Info size={20} />
              </div>
              <div>
                <h4 className="text-amber-100 font-serif text-sm uppercase tracking-wide mb-1">
                  {TEXTS.details_material[lang]}
                </h4>
                <p className="text-purple-200 text-sm">
                  {selectedProduct.material}
                </p>
              </div>
            </div>
            <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/20 flex items-start gap-4">
              <div className="p-2 bg-amber-500/10 rounded-full text-amber-500 mt-1">
                <Star size={20} />
              </div>
              <div>
                <h4 className="text-amber-100 font-serif text-sm uppercase tracking-wide mb-1">
                  {TEXTS.details_origin[lang]}
                </h4>
                <p className="text-purple-200 text-sm">
                  {selectedProduct.origin}
                </p>
              </div>
            </div>
          </div>

          {selectedProduct.features && (
            <div className="flex flex-wrap gap-2 mb-8">
              {selectedProduct.features.map((feature: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-purple-950 border border-purple-700 rounded-full text-xs text-purple-300">
                  {feature}
                </span>
              ))}
            </div>
          )}

          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mb-8">
              <h4 className="text-amber-500 font-serif text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                {TEXTS.related_products[lang]}{" "}
                <div className="h-px flex-1 bg-purple-800" />
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {relatedProducts.map((rp: any) => (
                  <div
                    key={rp.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(rp);
                      setActiveImage(rp.image);
                      const rightPanel = e.currentTarget.closest(
                        ".overflow-y-auto"
                      ) as HTMLElement;
                      if (rightPanel) rightPanel.scrollTop = 0;
                    }}
                    className="group cursor-pointer">
                    <div className="aspect-[3/4] rounded bg-purple-900/50 overflow-hidden relative border border-purple-500/20 group-hover:border-amber-500/50 transition-all">
                      <img
                        src={rp.image}
                        alt={rp.title}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <p className="text-[10px] md:text-xs text-purple-300 mt-1 truncate group-hover:text-amber-400 font-serif">
                      {rp.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={added}
            className={`mt-auto w-full py-4 ${
              added ? "bg-amber-300/60" : "bg-amber-500 hover:bg-amber-400"
            } text-[#1a0b2e] font-bold uppercase tracking-widest transition-colors shadow-[0_0_20px_rgba(212,175,55,0.3)]`}>
            {added ? "Сагсанд нэмэгдсэн" : "Сагсанд нэмэх"}
          </button>
        </div>
      </div>
    </div>
  );
}
