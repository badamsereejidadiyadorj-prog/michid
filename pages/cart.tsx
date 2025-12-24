import React, { useState } from "react";
import Nav from "../components/Nav";
import { useCart } from "../components/CartContext";

function fmtPrice(n: number) {
  // assume tugrik integer
  return `₮${n.toLocaleString()}`;
}

export default function CartPage() {
  const { items, remove, updateQty, clear, total } = useCart();
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [lang, setLang] = useState<string>("mn");
  const [submitted, setSubmitted] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const labels: any = {
    mn: {
      title: "Сагс",
      phone: "Утасны дугаар",
      address: "Хаяг",
      submit: "Захиалга илгээх",
      clear: "Цэвэрлэх",
      bank: "Дансаа дугаар",
      summary: "Нийт үнэ",
    },
    en: {
      title: "Cart",
      phone: "Phone number",
      address: "Address",
      submit: "Place order",
      clear: "Clear",
      bank: "Bank account",
      summary: "Total",
    },
  };

  async function submitOrder() {
    if (!phone || !address) {
      alert("Please provide phone and address");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, address, items, total: total() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Order failed");
      setSubmitted(data);
      clear();
    } catch (err: any) {
      alert(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0518] text-[#F5F5DC]">
      <Nav
        lang={lang}
        setLang={(l: string) => setLang(l)}
        onSubmenu={() => {}}
      />
      <main className="container pt-20 md:pt-40 mx-auto px-6 py-12">
        <h1 className="text-3xl mb-6">{labels[lang].title}</h1>

        {items.length === 0 && !submitted && (
          <div className="text-purple-300">Your cart is empty.</div>
        )}

        {items.map((it) => (
          <div
            key={String(it.id)}
            className="flex items-center gap-4 mb-4 bg-[#140824] p-4 rounded">
            {it.image && (
              <img
                src={it.image}
                alt={it.title}
                className="w-20 h-20 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <div className="font-serif">{it.title}</div>
              <div className="text-sm text-purple-300">
                {fmtPrice(it.price)}
              </div>
            </div>
            <div>
              <input
                type="number"
                min={1}
                value={it.quantity}
                onChange={(e) => updateQty(it.id, Number(e.target.value))}
                className="w-20 p-1 rounded bg-[#12041a] border border-purple-700"
              />
              <button
                onClick={() => remove(it.id)}
                className="ml-2 text-red-500">
                Remove
              </button>
            </div>
          </div>
        ))}

        <div className="mt-4">
          <div className="mb-2">
            {labels[lang].summary}: <strong>{fmtPrice(total())}</strong>
          </div>
          <input
            placeholder={labels[lang].phone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full mb-2 p-2 bg-[#12041a] border border-purple-700 rounded"
          />
          <input
            placeholder={labels[lang].address}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full mb-2 p-2 bg-[#12041a] border border-purple-700 rounded"
          />
          <div className="flex gap-2">
            <button
              onClick={submitOrder}
              disabled={loading || items.length === 0}
              className="px-4 py-2 bg-amber-500 rounded">
              {labels[lang].submit}
            </button>
            <button
              onClick={() => clear()}
              className="px-4 py-2 bg-gray-700 rounded">
              {labels[lang].clear}
            </button>
          </div>
        </div>

        {submitted && (
          <div className="mt-6 bg-[#140824] p-4 rounded border border-purple-800">
            <h3 className="font-serif text-amber-300">{labels[lang].bank}:</h3>
            <div className="mb-2 text-purple-200">
              Төрийн банк: 1234567890 (sample)
            </div>
            <div>
              {labels[lang].summary}:{" "}
              <strong>{fmtPrice(submitted.total || total())}</strong>
            </div>
            <div className="text-sm text-purple-300 mt-2">
              Your order id: {submitted.id}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
