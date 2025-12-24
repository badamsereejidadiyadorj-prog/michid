import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import AdminSidebar from "../../components/AdminSidebar";
import { supabase } from "../../lib/supabaseClient";

export default function AdminProducts() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
    })();
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => listener?.subscription.unsubscribe();
  }, []);

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

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data || []);
        } else {
          setProducts([]);
        }
      } catch (e) {
        setProducts([]);
      }

      try {
        const res2 = await fetch("/api/admin/categories");
        if (res2.ok) {
          const cats = await res2.json();
          setCategories(cats || []);
          setForm((f: any) => ({ ...f, categoryId: cats?.[0]?.id || "" }));
        }
      } catch (e) {
        setCategories([]);
      }
    })();
  }, []);

  const add = async () => {
    const newP = {
      // server will assign id if desired; use timestamp for optimistic UI
      id: Date.now(),
      title: form.title,
      description: form.description,
      price: form.price,
      category_id: form.categoryId,
      usage: form.usage,
      image: form.image,
    };
    setProducts((s) => [newP, ...s]);
    setForm({
      title: "",
      description: "",
      price: "",
      categoryId: categories[0]?.id || "",
      usage: "ceremonial",
      image: "",
    });
    try {
      await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newP),
      });
    } catch (e) {}
  };

  const remove = async (id: any) => {
    setProducts((s) => s.filter((p) => p.id !== id));
    try {
      await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (e) {}
  };

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
      // store returned path (server storage path)
      setForm((f: any) => ({ ...f, image: result.path || result.publicUrl }));
    } catch (err: any) {
      alert(err.message || String(err));
    }
  };
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f0518] text-[#F5F5DC]">
        <Nav lang={"mn"} setLang={() => {}} onSubmenu={() => {}} />
        <main className="container mx-auto px-6 py-20 text-center">
          <div className="bg-[#140824] p-8 rounded border border-purple-800 inline-block">
            Энэ хуудас руу хандахын тулд /admin-аар нэвтэрнэ үү.
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#0f0518] text-[#F5F5DC]">
      <Nav lang={"mn"} setLang={() => {}} onSubmenu={() => {}} />
      <main className="container  pt-20 mx-auto px-6 py-12 grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <AdminSidebar />
        </div>
        <div className="md:col-span-3">
          <h2 className="text-2xl font-serif text-amber-400 mb-4">
            Бүтээгдэхүүн удирдах
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-[#140824] rounded border border-purple-800">
              <h3 className="font-semibold mb-3">Шинэ бүтээгдэхүүн</h3>
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
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
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
                    Хуулагдсан: {form.image}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={add}
                  className="px-4 py-2 bg-amber-500 rounded">
                  Бүтээгдэхүүн нэмэх
                </button>
              </div>
            </div>

            <div className="p-4 bg-[#140824] rounded border border-purple-800 overflow-auto max-h-[420px]">
              <h3 className="font-semibold mb-3">Одоо байгаа</h3>
              <div className="space-y-3">
                {products.map((p: any) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center p-2 bg-[#12041a] rounded">
                    <div>
                      <div className="font-serif text-amber-200">{p.title}</div>
                      <div className="text-xs text-purple-300">
                        {p.price} • {p.category_id || p.categoryId}
                      </div>
                    </div>
                    <button
                      onClick={() => remove(p.id)}
                      className="text-red-400 text-sm">
                      Устгах
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
