import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import AdminSidebar from "../../components/AdminSidebar";
import { supabase } from "../../lib/supabaseClient";

const STATUS_LABELS: any = {
  pending: "Хүлээгдэж байна",
  paid: "Төлбөр төлөгдсөн",
  shipped: "Илгээгдсэн",
  delivered: "Хүргэгдсэн",
  cancelled: "Цуцлагдсан",
};

export default function AdminOrders() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

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

  /* ================= STATUS UPDATE ================= */
  async function updateStatus(id: string, status: string) {
    setOrders((s) => s.map((o) => (o.id === id ? { ...o, status } : o)));

    await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  }

  /* ================= NO AUTH ================= */
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f0518] text-[#F5F5DC]">
        <Nav lang="mn" setLang={() => {}} onSubmenu={() => {}} />
        <div className="pt-32 text-center">
          <div className="inline-block p-6 bg-[#140824] border border-purple-800 rounded">
            Захиалга харахын тулд админаар нэвтэрнэ үү
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
          <h1 className="text-3xl font-serif text-amber-400 mb-6">
            Захиалгууд
          </h1>

          {/* TABLE */}
          <div className="overflow-x-auto bg-[#140824] border border-purple-800 rounded">
            <table className="w-full text-sm">
              <thead className="bg-[#1a0b2e] text-purple-300">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Утас</th>
                  <th className="p-3 text-left">Хаяг</th>
                  <th className="p-3 text-left">Нийт</th>
                  <th className="p-3 text-left">Төлөв</th>
                  <th className="p-3 text-right">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-t border-purple-800 hover:bg-[#1a0b2e] transition">
                    <td className="p-3 text-xs text-purple-300">{o.id}</td>
                    <td className="p-3">{o.phone}</td>
                    <td className="p-3 text-xs text-purple-300 truncate max-w-xs">
                      {o.address}
                    </td>
                    <td className="p-3 text-amber-300">
                      ₮{Number(o.total).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className="bg-[#12041a] border border-purple-700 rounded px-2 py-1 text-xs">
                        {Object.keys(STATUS_LABELS).map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="px-3 py-1 text-xs border border-amber-400 text-amber-300 rounded">
                        Дэлгэрэнгүй
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
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#140824] w-full max-w-lg border border-purple-800 rounded p-6">
            <h3 className="text-xl font-serif text-amber-400 mb-4">
              Захиалга #{selectedOrder.id}
            </h3>

            <div className="space-y-2 text-sm">
              <div>
                <span className="text-purple-300">Утас:</span>{" "}
                {selectedOrder.phone}
              </div>
              <div>
                <span className="text-purple-300">Хаяг:</span>{" "}
                {selectedOrder.address}
              </div>
              <div>
                <span className="text-purple-300">Нийт дүн:</span> ₮
                {Number(selectedOrder.total).toLocaleString()}
              </div>
              <div>
                <span className="text-purple-300">Төлөв:</span>{" "}
                {STATUS_LABELS[selectedOrder.status]}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-purple-300 mb-3 font-serif">
                Захиалсан бараанууд
              </div>

              <div className="space-y-3 max-h-64 overflow-auto">
                {selectedOrder &&
                  JSON.parse(selectedOrder.items)?.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 bg-[#12041a] border border-purple-700 rounded">
                      {/* IMAGE */}
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded border border-purple-600"
                      />

                      {/* INFO */}
                      <div className="flex-1">
                        <div className="text-amber-200 font-serif">
                          {item.title}
                        </div>

                        <div className="text-xs text-purple-300 mt-1">
                          Үнэ: ₮{Number(item.price).toLocaleString()}
                        </div>

                        <div className="text-xs text-purple-300">
                          Тоо хэмжээ: {item.quantity}
                        </div>
                      </div>

                      {/* TOTAL */}
                      <div className="text-right text-sm text-amber-400">
                        ₮{Number(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-purple-600 text-purple-300 rounded">
                Хаах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
