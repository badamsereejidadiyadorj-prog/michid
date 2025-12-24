import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav";
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
            You must sign in via /admin to access orders.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0518] text-[#F5F5DC]">
      <Nav lang={"mn"} setLang={() => {}} onSubmenu={() => {}} />
      <main className="container  pt-20 mx-auto px-6 py-12">
        <h1 className="text-3xl font-serif text-amber-400 mb-6">Orders</h1>
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-[#140824] p-4 rounded border border-purple-800">
              <div className="flex justify-between">
                <div>
                  <div className="font-serif">Order: {o.id}</div>
                  <div className="text-sm text-purple-300">
                    Phone: {o.phone}
                  </div>
                  <div className="text-sm text-purple-300">
                    Address: {o.address}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-amber-300">
                    Total: ₮{Number(o.total).toLocaleString()}
                  </div>
                  <div className="text-xs text-purple-400">
                    Status: {o.status}
                  </div>
                </div>
              </div>
              <details className="mt-2 text-sm text-purple-200">
                <summary>Items</summary>
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(o.items, null, 2)}
                </pre>
              </details>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
