import React, { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "../../components/Nav";
import { supabase } from "../../lib/supabaseClient";

export default function AdminIndex() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [newCat, setNewCat] = useState("");

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
    if (user) {
      fetchCategories();
      fetchOrders();
    }
  }, [user]);

  const signIn = async () => {
    setLoading(true);
    try {
      const res = await supabase.auth.signInWithPassword({ email, password });
      if (res.error) throw res.error;
    } catch (err: any) {
      alert(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  async function fetchCategories() {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data || []);
    } catch (err) {
      console.warn("fetchCategories failed", err);
    }
  }

  async function fetchOrders() {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.warn("fetchOrders failed", err);
    }
  }

  async function addCategory() {
    if (!newCat) return;
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newCat.toLowerCase().replace(/\s+/g, "-"),
          title_key: newCat,
          image: null,
        }),
      });
      if (!res.ok) throw new Error("Insert failed");
      setNewCat("");
      await fetchCategories();
    } catch (err) {
      alert("Insert failed (ensure table exists and env vars set)");
      console.error(err);
    }
  }

  async function initSampleData() {
    try {
      // Create sample categories via server API
      await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: "men", title_key: "Men", image: null }),
      });
      await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: "women", title_key: "Women", image: null }),
      });
      // Create a sample order via server API
      await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: "+97699112233",
          address: "Ulaanbaatar",
          items: [],
          total: 1200000,
        }),
      });
      await fetchCategories();
      await fetchOrders();
      alert("Sample data init attempted. Check Supabase table rows.");
    } catch (err) {
      alert("Init failed — check Supabase config and table creation.");
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0518] text-[#F5F5DC]">
      <Nav lang={"mn"} setLang={() => {}} onSubmenu={() => {}} />

      <main className="container mx-auto min-h-screen pt-20 px-6 py-20 relative">
        {!user && (
          <div className="absolute inset-0 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center">
            <div className="bg-[#140824]  p-8 rounded-lg w-full max-w-md border border-purple-800">
              <h2 className="text-xl font-serif text-amber-300 mb-4">
                Admin Login
              </h2>
              <input
                className="w-full mb-2 p-2 bg-[#12041a] border border-purple-700 rounded"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                className="w-full mb-2 p-2 bg-[#12041a] border border-purple-700 rounded"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={signIn}
                  className="px-4 py-2 bg-amber-500 rounded"
                  disabled={loading}>
                  Sign in
                </button>
              </div>
              <p className="text-xs text-purple-300 mt-3">
                Only the seeded admin can sign in here.
              </p>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-serif text-amber-400 mb-6">
          Admin Dashboard
        </h1>
        {user ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/admin/products"
              className="block p-6 bg-[#140824] rounded-lg border border-purple-800 hover:border-amber-500 transition-colors">
              Products
            </Link>
            <Link
              href="/admin/categories"
              className="block p-6 bg-[#140824] rounded-lg border border-purple-800 hover:border-amber-500 transition-colors">
              Categories
            </Link>
            <Link
              href="/admin/usages"
              className="block p-6 bg-[#140824] rounded-lg border border-purple-800 hover:border-amber-500 transition-colors">
              Usages
            </Link>
            <button
              onClick={signOut}
              className="mt-6 px-4 py-2 bg-red-600 rounded col-span-full">
              Sign out
            </button>
          </div>
        ) : (
          <div className="text-purple-300">
            Please sign in to manage the site.
          </div>
        )}

        {user && (
          <div style={{ maxWidth: 1100, margin: "24px auto", padding: 20 }}>
            <section style={{ marginTop: 16 }}>
              <h3>Categories</h3>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  placeholder="New category name"
                />
                <button onClick={addCategory}>Add</button>
                <button onClick={initSampleData}>
                  Supabase: Init Sample Data
                </button>
              </div>
              <ul>
                {categories.map((c) => (
                  <li key={c.id}>
                    {c.id} — {c.name || c.title}
                  </li>
                ))}
              </ul>
            </section>

            <section style={{ marginTop: 24 }}>
              <h3>Orders</h3>
              <button onClick={fetchOrders}>Refresh Orders</button>
              <ul>
                {orders.map((o) => (
                  <li key={o.id}>
                    {o.id} — {o.status} — total: {o.total}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
