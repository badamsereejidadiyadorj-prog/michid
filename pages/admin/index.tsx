import React, { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "../../components/Nav";
import AdminSidebar from "../../components/AdminSidebar";
import { supabase } from "../../lib/supabaseClient";

export default function AdminIndex() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [newCat, setNewCat] = useState("");
  const [orderStats, setOrderStats] = useState<{
    totalOrders: number;
    totalRevenue: number;
    lastOrder: any | null;
    last7Days: number[];
  }>({ totalOrders: 0, totalRevenue: 0, lastOrder: null, last7Days: [] });

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

  useEffect(() => {
    if (!orders || orders.length === 0) {
      setOrderStats({
        totalOrders: 0,
        totalRevenue: 0,
        lastOrder: null,
        last7Days: [],
      });
      return;
    }
    // compute totals and last 7 days counts
    const now = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });

    const counts = days.map((day) => {
      const next = new Date(day);
      next.setDate(day.getDate() + 1);
      return orders.filter((o) => {
        if (!o.created_at) return false;
        const t = new Date(o.created_at);
        return t >= day && t < next;
      }).length;
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    // find last order by created_at or id
    const sorted = [...orders].sort((a, b) => {
      const da = a.created_at ? new Date(a.created_at).getTime() : 0;
      const db = b.created_at ? new Date(b.created_at).getTime() : 0;
      return db - da;
    });
    const lastOrder = sorted[0] ?? null;
    setOrderStats({ totalOrders, totalRevenue, lastOrder, last7Days: counts });
  }, [orders]);

  function render7DayBars(counts: number[]) {
    if (!counts || counts.length === 0) return null;
    const max = Math.max(...counts, 1);
    const w = 140;
    const h = 40;
    const bw = w / counts.length;
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {counts.map((c, i) => {
          const barH = (c / max) * (h - 6);
          const x = i * bw + 2;
          const y = h - barH - 2;
          const fill = c === 0 ? "#3b3054" : "#f59e0b";
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={bw - 4}
              height={barH}
              rx={2}
              fill={fill}
            />
          );
        })}
      </svg>
    );
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

      <main className="container mx-auto min-h-screen pt-20 px-6 py-20 relative grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <AdminSidebar />
        </div>

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
        <div className="md:col-span-3">
          <h1 className="text-3xl font-serif text-amber-400 mb-6">
            Админ самбар
          </h1>

          {user && (
            <div style={{ maxWidth: 1100, margin: "24px auto", padding: 20 }}>
              <section style={{ marginBottom: 18 }}>
                <h3>Дашбоард</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <div className="p-4 bg-[#140824] rounded-lg border border-purple-800">
                    <div className="text-sm text-purple-300">Нийт захиалга</div>
                    <div className="text-2xl font-serif text-amber-300">
                      {orderStats.totalOrders}
                    </div>
                  </div>
                  <div className="p-4 bg-[#140824] rounded-lg border border-purple-800">
                    <div className="text-sm text-purple-300">Нийт орлого</div>
                    <div className="text-2xl font-serif text-amber-300">
                      {(orderStats.totalRevenue || 0).toLocaleString()} ₮
                    </div>
                  </div>
                  <div className="p-4 bg-[#140824] rounded-lg border border-purple-800 flex items-center justify-between">
                    <div>
                      <div className="text-sm text-purple-300">
                        Сүүлд орсон захиалга
                      </div>
                      <div className="text-lg font-serif text-amber-300">
                        {orderStats.lastOrder?.id ?? "-"}
                      </div>
                    </div>
                    <div>{render7DayBars(orderStats.last7Days)}</div>
                  </div>
                </div>
              </section>

              <section style={{ marginTop: 8, marginBottom: 12 }}>
                <h3>Сүүлд захиалсан бүтээгдэхүүн</h3>
                <div className="p-4 bg-[#140824] rounded-lg border border-purple-800 mt-2">
                  {orderStats.lastOrder ? (
                    <div>
                      <div className="text-sm text-purple-300">
                        Захиалга: {orderStats.lastOrder.id}
                      </div>
                      <div className="text-sm text-purple-300">
                        Хаяг: {orderStats.lastOrder.address || "-"}
                      </div>
                      <div className="mt-3">
                        <strong className="text-amber-300">Бараанууд:</strong>
                        <ul className="mt-2">
                          {JSON.parse(orderStats.lastOrder.items) &&
                          JSON.parse(orderStats.lastOrder.items).length > 0 ? (
                            JSON.parse(orderStats.lastOrder.items).map(
                              (it: any, idx: number) => (
                                <li key={idx} className="text-purple-200">
                                  {it.name ||
                                    it.title ||
                                    it.product_id ||
                                    "(нэргүй)"}{" "}
                                  — {it.qty ?? it.quantity ?? 1} —{" "}
                                  {it.price
                                    ? `${it.price.toLocaleString()} ₮`
                                    : "-"}
                                </li>
                              )
                            )
                          ) : (
                            <li className="text-purple-200">
                              Бараа мэдээлэл байхгүй
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-purple-300">
                      Сүүлд захиалга олдсонгүй
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
