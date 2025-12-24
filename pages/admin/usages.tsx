import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import { supabase } from "../../lib/supabaseClient";

export default function AdminUsages() {
  const [items, setItems] = useState<string[]>([]);
  const [value, setValue] = useState("");
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
      } catch (e) {
        setItems(["ceremonial", "everyday", "winter"]);
      }
    })();
  }, []);

  const add = async () => {
    if (!value) return;
    try {
      await fetch("/api/admin/usages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: value, label: value }),
      });
      setItems((s) => [...s, value]);
      setValue("");
    } catch (e) {}
  };
  const remove = async (v: string) => {
    try {
      await fetch("/api/admin/usages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: v }),
      });
      setItems((s) => s.filter((x) => x !== v));
    } catch (e) {}
  };
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

  return (
    <div className="min-h-screen bg-[#0f0518] text-[#F5F5DC]">
      <Nav lang={"mn"} setLang={() => {}} onSubmenu={() => {}} />
      <main className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-serif text-amber-400 mb-4">
          Manage Usages
        </h2>
        <div className="flex gap-2 mb-6">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="usage key"
            className="px-3 py-2 bg-[#12041a] border border-purple-700 rounded w-full"
          />
          <button onClick={add} className="px-4 py-2 bg-amber-500 rounded">
            Add
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {items.map((i) => (
            <div
              key={i}
              className="p-4 bg-[#140824] rounded border border-purple-800 flex justify-between items-center">
              <div className="font-serif text-amber-200">{i}</div>
              <button onClick={() => remove(i)} className="text-red-400">
                Delete
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
