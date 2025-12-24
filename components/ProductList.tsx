import React from "react";

const PRODUCTS = [
  { id: 1, title: "Midnight Hunnu", price: "₮1,200,000" },
  { id: 2, title: "Royal Crimson", price: "₮1,500,000" },
  { id: 3, title: "Ivory Elegance", price: "₮1,800,000" },
];

export default function ProductList() {
  return (
    <section style={{ padding: 20 }}>
      <h2 style={{ fontFamily: "Cinzel, serif" }}>Featured</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 12,
        }}>
        {PRODUCTS.map((p) => (
          <div
            key={p.id}
            style={{ background: "#140824", padding: 12, borderRadius: 8 }}>
            <h3 style={{ margin: "8px 0" }}>{p.title}</h3>
            <div style={{ color: "#D4AF37", fontWeight: 700 }}>{p.price}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
