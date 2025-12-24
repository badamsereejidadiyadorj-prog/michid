import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import { supabase } from "../../lib/supabaseClient";

export default function AdminCategories() {
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

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f0518] text-[#F5F5DC]">
        <Nav lang={"mn"} setLang={() => {}} onSubmenu={() => {}} />
        <main className="container mx-auto px-6 py-20 text-center">
          <div className="bg-[#140824] p-8 rounded border border-purple-800 inline-block">
            You must sign in via /admin to access this page.
          </div>
        </main>
      </div>
    );
  }
  const [cats, setCats] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [fileUploading, setFileUploading] = useState(false);
  const [imagePath, setImagePath] = useState<string | null>(null);

  useEffect(() => {
    // fetch from server API
    (async () => {
      try {
        const res = await fetch("/api/admin/categories");
        if (res.ok) {
          const data = await res.json();
          setCats(data || []);
        } else {
          setCats([]);
        }
      } catch (e) {
        setCats([]);
      }
    })();
  }, []);

  const add = async () => {
    if (!title.trim()) return;
    const newCat = {
      id: title.toLowerCase().replace(/\s+/g, "-"),
      titleKey: title,
      image: imagePath || "",
    };
    setCats((s) => [...s, newCat]);
    setTitle("");
    setImagePath(null);
    try {
      await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newCat.id,
          title_key: newCat.titleKey,
          image: newCat.image,
        }),
      });
    } catch (e) {}
  };

  const remove = async (id: string) => {
    setCats((s) => s.filter((c) => c.id !== id));
    try {
      await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-[#0f0518] text-[#F5F5DC]">
      <Nav lang={"mn"} setLang={() => {}} onSubmenu={() => {}} />
      <main className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-serif text-amber-400 mb-4">
          Manage Categories
        </h2>
        <div className="flex gap-2 mb-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Category title"
            className="px-3 py-2 bg-[#12041a] border border-purple-700 rounded w-full"
          />
          <div className="flex flex-col">
            <label className="text-xs text-purple-300">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setFileUploading(true);
                try {
                  const reader = new FileReader();
                  reader.onload = async () => {
                    const dataUrl = String(reader.result);
                    const [, base64] = dataUrl.split(",");
                    const path = `categories/${Date.now()}_${f.name.replace(
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
                        contentType: f.type,
                      }),
                    });
                    const result = await res.json();
                    if (res.ok) {
                      setImagePath(result.path || result.publicUrl);
                    } else {
                      alert(result.error || "Upload failed");
                    }
                  };
                  reader.readAsDataURL(f);
                } catch (err) {
                  console.error(err);
                } finally {
                  setFileUploading(false);
                }
              }}
            />
          </div>
          <button onClick={add} className="px-4 py-2 bg-amber-500 rounded">
            Add
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {cats.map((c: any) => (
            <div
              key={c.id}
              className="p-4 bg-[#140824] rounded border border-purple-800 flex justify-between items-center">
              <div>
                <div className="font-serif text-amber-200">
                  {c.title_key || c.titleKey}
                </div>
                <div className="text-xs text-purple-300">{c.id}</div>
              </div>
              <button
                onClick={() => remove(c.id)}
                className="text-sm text-red-400">
                Delete
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
