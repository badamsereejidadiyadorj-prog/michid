import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import AdminSidebar from "../../components/AdminSidebar";
import { supabase } from "../../lib/supabaseClient";

export default function AdminOrders() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

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
    if (user) fetchOrders();
  }, [user]);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.warn(err);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f0518] text-[#F5F5DC]">
        <Nav lang={"mn"} setLang={() => {}} onSubmenu={() => {}} />
        <main className="container mx-auto px-6 py-20 text-center">
          <div className="bg-[#140824] p-8 rounded border border-purple-800 inline-block">
            Захиалгыг үзэхийн тулд /admin-аар нэвтэрнэ үү.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0518] text-[#F5F5DC]">
      <Nav lang={"mn"} setLang={() => {}} onSubmenu={() => {}} />
      <main className="container pt-20 mx-auto px-6 py-12 grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <AdminSidebar />
        </div>
        <section className="md:col-span-3">
          <h1 className="text-3xl font-serif text-amber-400 mb-6">
            Захиалгууд
          </h1>
          <div className="space-y-4">
            {orders.map((o) => (
              <div
                key={o.id}
                className="bg-[#140824] p-4 rounded border border-purple-800">
                <div className="flex justify-between">
                  <div>
                    <div className="font-serif">Захиалга: {o.id}</div>
                    <div className="text-sm text-purple-300">
                      Утас: {o.phone}
                    </div>
                    <div className="text-sm text-purple-300">
                      Хаяг: {o.address}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-300">
                      Нийт: ₮{Number(o.total).toLocaleString()}
                    </div>
                    <div className="text-xs text-purple-400">
                      Төлөв: {o.status}
                    </div>
                  </div>
                </div>
                <details className="mt-2 text-sm text-purple-200">
                  <summary>Бараа</summary>
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(o.items, null, 2)}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
