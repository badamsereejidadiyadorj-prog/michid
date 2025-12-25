import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import AdminSidebar from "../../components/AdminSidebar";
import { supabase } from "../../lib/supabaseClient";

export default function AdminUsages() {
  const [items, setItems] = useState<string[]>([]);
  const [value, setValue] = useState("");
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

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
        const res = await fetch("/api/admin/usages");
        if (res.ok) {
          const data = await res.json();
          setItems(data.map((d: any) => d.key));
        } else {
          setItems(["ceremonial", "everyday", "winter"]);
        }
      } catch {
        setItems(["ceremonial", "everyday", "winter"]);
      }
    })();
  }, []);

  /* ================= ADD / UPDATE ================= */
  const save = async () => {
    if (!value.trim()) return;

    if (editing) {
      setItems((s) => s.map((i) => (i === editing ? value : i)));
    } else {
      setItems((s) => [...s, value]);
    }

    await fetch("/api/admin/usages", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: value, label: value }),
    });

    setValue("");
    setEditing(null);
    setShowModal(false);
  };

  /* ================= DELETE ================= */
  const remove = async (v: string) => {
    if (!confirm("Энэ ашиглалтын төрлийг устгах уу?")) return;

    setItems((s) => s.filter((x) => x !== v));

    await fetch("/api/admin/usages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: v }),
    });
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
            <h2 className="text-2xl font-serif text-amber-400">
              Ашиглалтын төрлүүд
            </h2>
            <button
              onClick={() => {
                setValue("");
                setEditing(null);
                setShowModal(true);
              }}
              className="px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-400">
              + Шинэ төрөл
            </button>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto bg-[#140824] border border-purple-800 rounded">
            <table className="w-full text-sm">
              <thead className="bg-[#1a0b2e] text-purple-300">
                <tr>
                  <th className="p-3 text-left">Нэр</th>
                  <th className="p-3 text-right">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr
                    key={i}
                    className="border-t border-purple-800 hover:bg-[#1a0b2e] transition">
                    <td className="p-3 font-serif text-amber-200">{i}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditing(i);
                          setValue(i);
                          setShowModal(true);
                        }}
                        className="px-3 py-1 text-xs border border-amber-400 text-amber-300 rounded">
                        Засах
                      </button>
                      <button
                        onClick={() => remove(i)}
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
              {editing ? "Ашиглалтын төрөл засах" : "Шинэ ашиглалтын төрөл"}
            </h3>

            <label className="text-sm text-purple-300">Нэр</label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full mb-6 px-3 py-2 bg-[#12041a] border border-purple-700 rounded"
              placeholder="Жишээ: Everyday"
            />

            <div className="flex justify-end gap-2">
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
