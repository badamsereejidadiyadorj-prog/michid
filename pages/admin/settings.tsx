import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import AdminSidebar from "../../components/AdminSidebar";
import { supabase } from "../../lib/supabaseClient";

export default function AdminSettings() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [hero, setHero] = useState<any>({
    title_mn: "",
    title_en: "",
    subtitle_mn: "",
    subtitle_en: "",
    image: null,
  });
  const [socials, setSocials] = useState<any[]>([]);

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
    if (!user) return;
    (async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (!res.ok) return;
        const data = await res.json();
        setHero(
          data.hero || {
            title_mn: "",
            title_en: "",
            subtitle_mn: "",
            subtitle_en: "",
            image: null,
          }
        );
        setSocials(data.socials || []);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, [user]);

  /* ================= FILE UPLOAD ================= */
  function fileToBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function uploadImage(file: File) {
    const dataUrl = await fileToBase64(file);
    const [, base64] = dataUrl.split(",");
    const path = `settings/${Date.now()}_${file.name.replace(
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
    if (!res.ok) throw new Error(result.error || "Upload failed");
    return result.path || result.publicUrl;
  }

  /* ================= SAVE ================= */
  async function saveAll() {
    setLoading(true);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "hero", value: hero }),
      });
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "socials", value: socials }),
      });
      alert("Settings хадгалагдлаа");
    } catch (err: any) {
      alert(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  /* ================= NO AUTH ================= */
  if (!user)
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

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#0f0518] text-[#F5F5DC]">
      <Nav lang={"mn"} setLang={() => {}} onSubmenu={() => {}} />
      <main className="container pt-20 mx-auto px-6 py-12 grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <AdminSidebar />
        </div>
        <div className="md:col-span-3 space-y-6">
          <h2 className="text-2xl font-serif text-amber-400 mb-4">
            Сайтын тохиргоо
          </h2>

          {/* Hero Section */}
          <section className="bg-[#140824] p-4 rounded border border-purple-800">
            <h3 className="font-semibold mb-2">Hero гарчиг</h3>
            <input
              className="w-full mb-2 p-2 bg-[#12041a] border border-purple-700 rounded"
              placeholder="Гарчиг (MN)"
              value={hero.title_mn || ""}
              onChange={(e) => setHero({ ...hero, title_mn: e.target.value })}
            />
            <input
              className="w-full mb-2 p-2 bg-[#12041a] border border-purple-700 rounded"
              placeholder="Гарчиг (EN)"
              value={hero.title_en || ""}
              onChange={(e) => setHero({ ...hero, title_en: e.target.value })}
            />
            <input
              className="w-full mb-2 p-2 bg-[#12041a] border border-purple-700 rounded"
              placeholder="Дэд гарчиг (MN)"
              value={hero.subtitle_mn || ""}
              onChange={(e) =>
                setHero({ ...hero, subtitle_mn: e.target.value })
              }
            />
            <input
              className="w-full mb-2 p-2 bg-[#12041a] border border-purple-700 rounded"
              placeholder="Дэд гарчиг (EN)"
              value={hero.subtitle_en || ""}
              onChange={(e) =>
                setHero({ ...hero, subtitle_en: e.target.value })
              }
            />
            <div className="mb-2">
              <label className="text-sm text-purple-300 block mb-1">
                Hero зураг
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  try {
                    const path = await uploadImage(f);
                    setHero((h: any) => ({ ...h, image: path }));
                  } catch (err: any) {
                    alert(err.message || String(err));
                  }
                }}
              />
              {hero.image && (
                <div className="mt-2">
                  <span className="text-xs text-purple-300">Preview:</span>
                  <img
                    src={hero.image}
                    alt="Hero"
                    className="w-32 h-20 object-cover rounded border border-purple-700 mt-1"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Socials Section */}
          <section className="bg-[#140824] p-4 rounded border border-purple-800">
            <h3 className="font-semibold mb-2">Нийгмийн холбоосууд</h3>
            {socials.map((s, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 items-center mb-2">
                <input
                  className="p-2 bg-[#12041a] border border-purple-700 rounded"
                  placeholder="Нэр"
                  value={s.name || ""}
                  onChange={(e) => {
                    const copy = [...socials];
                    copy[i].name = e.target.value;
                    setSocials(copy);
                  }}
                />
                <input
                  className="p-2 bg-[#12041a] border border-purple-700 rounded"
                  placeholder="URL"
                  value={s.url || ""}
                  onChange={(e) => {
                    const copy = [...socials];
                    copy[i].url = e.target.value;
                    setSocials(copy);
                  }}
                />
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      const path = await uploadImage(f);
                      const copy = [...socials];
                      copy[i].icon = path;
                      setSocials(copy);
                    }}
                  />
                  {s.icon && (
                    <img
                      src={s.icon}
                      alt="Icon"
                      className="w-10 h-10 object-cover rounded border border-purple-700 mt-1"
                    />
                  )}
                </div>
                <button
                  onClick={() =>
                    setSocials((socs) => socs.filter((_, idx) => idx !== i))
                  }
                  className="text-red-400 px-2 py-1 border border-red-400 rounded text-sm">
                  Устгах
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setSocials((s) => [...s, { name: "", url: "", icon: null }])
              }
              className="px-3 py-1 bg-amber-500 rounded text-sm mt-2">
              Холбоос нэмэх
            </button>
          </section>

          {/* Save Button */}
          <div className="flex gap-2">
            <button
              onClick={saveAll}
              disabled={loading}
              className="px-4 py-2 bg-amber-500 rounded">
              {loading ? "Хадгалж байна..." : "Хадгалах"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
