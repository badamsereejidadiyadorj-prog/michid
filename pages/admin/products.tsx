import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import AdminSidebar from "../../components/AdminSidebar";
import { supabase } from "../../lib/supabaseClient";

export default function AdminProducts() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    price: "",
    categoryId: "",
    usage: "ceremonial",
    image: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  /* ================= AUTH ================= */
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
    })();
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => listener?.subscription.unsubscribe();
  }, []);

  /* ================= FETCH ================= */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/products");
        setProducts((await res.json()) || []);
      } catch {
        setProducts([]);
      }
      try {
        const res2 = await fetch("/api/admin/categories");
        const cats = (await res2.json()) || [];
        setCategories(cats);
        setForm((f: any) => ({ ...f, categoryId: cats?.[0]?.id || "" }));
      } catch {
        setCategories([]);
      }
    })();
  }, []);

  /* ================= ADD / UPDATE ================= */
  const save = async () => {
    if (!form.title || !form.price) return;

    if (editing) {
      setProducts((s) =>
        s.map((p) => (p.id === editing.id ? { ...editing, ...form } : p))
      );
    } else {
      const newP = { ...form, id: Date.now() };
      setProducts((s) => [newP, ...s]);
    }

    await fetch("/api/admin/products", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { ...editing, ...form } : form),
    });

    setForm({
      title: "",
      description: "",
      price: "",
      categoryId: categories[0]?.id || "",
      usage: "ceremonial",
      image: "",
    });
    setEditing(null);
    setShowModal(false);
  };

  const remove = async (id: any) => {
    if (!confirm("Энэ бүтээгдэхүүнийг устгах уу?")) return;
    setProducts((s) => s.filter((p) => p.id !== id));
    await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  };

  /* ================= FILE UPLOAD ================= */
  function fileToBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const uploadFile = async (file: File) => {
    try {
      const dataUrl = await fileToBase64(file);
      const [, base64] = dataUrl.split(",");
      const path = `products/${Date.now()}_${file.name.replace(
        /[^a-zA-Z0-9_.-]/g,
        "_"
      )}`;
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bucket: "public",
          path,
          base64,
          contentType: file.type,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || "Upload failed");
      setForm((f: any) => ({ ...f, image: result.path || result.publicUrl }));
    } catch (err: any) {
      alert(err.message || String(err));
    }
  };

  /* ================= NO AUTH ================= */
  if (!user)
    return (
      <div className="min-h-screen bg-[#0f0518] text-[#F5F5DC]">
        <Nav lang="mn" setLang={() => {}} onSubmenu={() => {}} />
        <div className="pt-32 text-center">
          <div className="inline-block p-6 bg-[#140824] border border-purple-800 rounded">
            Админ эрхээр нэвтэрнэ үү
          </div>
        </div>
      </div>
    );

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#0f0518] text-[#F5F5DC]">
      <Nav lang="mn" setLang={() => {}} onSubmenu={() => {}} />
      <main className="container mx-auto px-6 pt-24 grid md:grid-cols-4 gap-6">
        <AdminSidebar />

        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif text-amber-400">
              Бүтээгдэхүүн удирдах
            </h2>
            <button
              onClick={() => {
                setForm({
                  title: "",
                  description: "",
                  price: "",
                  categoryId: categories[0]?.id || "",
                  usage: "ceremonial",
                  image: "",
                });
                setEditing(null);
                setShowModal(true);
              }}
              className="px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-400">
              + Шинэ бүтээгдэхүүн
            </button>
          </div>

          {/* PRODUCT TABLE */}
          <div className="overflow-x-auto bg-[#140824] border border-purple-800 rounded">
            <table className="w-full text-sm">
              <thead className="bg-[#1a0b2e] text-purple-300">
                <tr>
                  <th className="p-3 text-left">Гарчиг</th>
                  <th className="p-3 text-left">Үнэ</th>
                  <th className="p-3 text-left">Ангилал</th>
                  <th className="p-3 text-left">Ашиглалт</th>
                  <th className="p-3 text-left">Зураг</th>
                  <th className="p-3 text-right">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-purple-800 hover:bg-[#1a0b2e] transition">
                    <td className="p-3">{p.title}</td>
                    <td className="p-3">{p.price}</td>
                    <td className="p-3">{p.category_id || p.categoryId}</td>
                    <td className="p-3">{p.usage}</td>
                    <td className="p-3">
                      {p.image && (
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-12 h-12 object-cover rounded border border-purple-700"
                        />
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditing(p);
                          setForm({ ...p });
                          setShowModal(true);
                        }}
                        className="px-3 py-1 text-xs border border-amber-400 text-amber-300 rounded">
                        Засах
                      </button>
                      <button
                        onClick={() => remove(p.id)}
                        className="px-3 py-1 text-xs border border-red-500 text-red-400 rounded">
                        Устгах
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#140824] w-full max-w-md p-6 border border-purple-800 rounded">
            <h3 className="text-xl font-serif text-amber-400 mb-4">
              {editing ? "Бүтээгдэхүүн засах" : "Шинэ бүтээгдэхүүн"}
            </h3>

            <input
              className="w-full mb-2 p-2 bg-[#12041a] border border-purple-700 rounded"
              placeholder="Гарчиг"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <input
              className="w-full mb-2 p-2 bg-[#12041a] border border-purple-700 rounded"
              placeholder="Үнэ"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full mb-2 p-2 bg-[#12041a] border border-purple-700 rounded">
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title_key || c.id}
                </option>
              ))}
            </select>
            <select
              value={form.usage}
              onChange={(e) => setForm({ ...form, usage: e.target.value })}
              className="w-full mb-2 p-2 bg-[#12041a] border border-purple-700 rounded">
              <option value="ceremonial">Ариун ёслолын</option>
              <option value="everyday">Өдөр тутмын</option>
              <option value="winter">Өвлийн</option>
            </select>
            <textarea
              className="w-full mb-2 p-2 bg-[#12041a] border border-purple-700 rounded"
              placeholder="Тайлбар"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <div className="mb-2">
              <label className="text-sm text-purple-300 block mb-1">
                Зураг оруулах
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadFile(f);
                }}
              />
              {form.image && (
                <div className="text-xs text-purple-300 mt-2">
                  Preview:{" "}
                  <img
                    src={form.image}
                    className="w-16 h-16 object-cover rounded border border-purple-700 mt-1"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-purple-600 rounded text-purple-300">
                Болих
              </button>
              <button
                onClick={save}
                className="px-4 py-2 bg-amber-500 text-black rounded">
                Хадгалах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
