import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import AdminSidebar from "../../components/AdminSidebar";
import { supabase } from "../../lib/supabaseClient";

export default function AdminCelebrities() {
  const [user, setUser] = useState<any>(null);
  const [celebs, setCelebs] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCeleb, setEditingCeleb] = useState<any>(null);
  const [fileUploading, setFileUploading] = useState(false);

  /* ================= AUTH ================= */
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

  /* ================= FETCH ================= */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/celebrities");
        if (res.ok) {
          const data = await res.json();
          setCelebs(data || []);
        }
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);

  /* ================= ADD / UPDATE ================= */
  const saveCeleb = async () => {
    if (!name.trim()) return;

    const payload: any = { name: name.trim(), image: imagePath || "", note };

    try {
      if (editingCeleb) {
        // optimistic update
        setCelebs((s) =>
          s.map((c) => (c.id === editingCeleb.id ? { ...c, ...payload } : c))
        );
        await fetch("/api/admin/celebrities", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingCeleb.id, ...payload }),
        });
      } else {
        const res = await fetch("/api/admin/celebrities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          // API returns array (supabase), take first
          const row = Array.isArray(created) ? created[0] : created;
          setCelebs((s) => [...s, row]);
        }
      }
    } catch (e) {
      console.warn(e);
    }

    setShowModal(false);
    setEditingCeleb(null);
    setName("");
    setImagePath(null);
    setNote("");
  };

  /* ================= DELETE ================= */
  const remove = async (id: string) => {
    setCelebs((s) => s.filter((c) => c.id !== id));
    try {
      await fetch("/api/admin/celebrities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (e) {
      console.warn(e);
    }
  };

  /* ================= IMAGE UPLOAD ================= */
  const uploadImage = async (file: File) => {
    setFileUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const [, base64] = String(reader.result).split(",");
      const path = `celebrities/${Date.now()}_${file.name.replace(
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
      if (res.ok) setImagePath(result.publicUrl || result.path);
      else alert("Зураг хуулахад алдаа гарлаа");
      setFileUploading(false);
    };
    reader.readAsDataURL(file);
  };

  /* ================= NO AUTH ================= */
  if (!user) {
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
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#0f0518] text-[#F5F5DC]">
      <Nav lang="mn" setLang={() => {}} onSubmenu={() => {}} />

      <main className="container mx-auto px-6 pt-24 grid md:grid-cols-4 gap-6">
        <AdminSidebar />

        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif text-amber-400">Алдартнууд</h2>
            <button
              onClick={() => {
                setEditingCeleb(null);
                setName("");
                setImagePath(null);
                setNote("");
                setShowModal(true);
              }}
              className="px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-400">
              + Шинэ алдартан
            </button>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto bg-[#140824] border border-purple-800 rounded">
            <table className="w-full text-sm">
              <thead className="bg-[#1a0b2e] text-purple-300">
                <tr>
                  <th className="p-3 text-left">Зураг</th>
                  <th className="p-3 text-left">Нэр</th>
                  <th className="p-3 text-left">Тэмдэглэл</th>
                  <th className="p-3 text-right">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {celebs.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-purple-800 hover:bg-[#1a0b2e]">
                    <td className="p-3">
                      {c.image ? (
                        <img
                          src={c.image}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <span className="text-xs text-purple-400">
                          Зураггүй
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-amber-200 font-serif">{c.name}</td>
                    <td className="p-3 text-xs text-purple-400">
                      {c.note || "-"}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingCeleb(c);
                          setName(c.name || "");
                          setImagePath(c.image || null);
                          setNote(c.note || "");
                          setShowModal(true);
                        }}
                        className="px-3 py-1 text-xs border border-amber-400 text-amber-300 rounded">
                        Засах
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Устгах уу?")) remove(c.id);
                        }}
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
              {editingCeleb ? "Алдартан засах" : "Шинэ алдартан"}
            </h3>

            <label className="text-sm text-purple-300">Нэр</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-3 px-3 py-2 bg-[#12041a] border border-purple-700 rounded"
            />

            <label className="text-sm text-purple-300">Тэмдэглэл</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full mb-3 px-3 py-2 bg-[#12041a] border border-purple-700 rounded"
            />

            <label className="text-sm text-purple-300">Зураг</label>
            <input
              type="file"
              accept="image/*"
              disabled={fileUploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadImage(f);
              }}
              className="mb-3"
            />

            {imagePath && (
              <img
                src={imagePath}
                className="w-24 h-24 object-cover rounded mb-4"
              />
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-purple-600 rounded text-purple-300">
                Болих
              </button>
              <button
                onClick={saveCeleb}
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
