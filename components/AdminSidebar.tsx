import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

export default function AdminSidebar() {
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    if (typeof window !== "undefined") window.location.href = "/admin";
  };

  return (
    <aside className="h-full flex flex-col justify-center">
      <nav className="space-y-2 w-full rounded border bg-[#140824] p-4 border-purple-800">
        <div className="font-serif text-amber-300 text-lg mb-2">Админ</div>
        <Link href="/admin" className="block p-2 rounded hover:bg-purple-800">
          Самбар
        </Link>
        <Link
          href="/admin/products"
          className="block p-2 rounded hover:bg-purple-800">
          Бүтээгдэхүүн
        </Link>
        <Link
          href="/admin/categories"
          className="block p-2 rounded hover:bg-purple-800">
          Ангилалууд
        </Link>
        <Link
          href="/admin/usages"
          className="block p-2 rounded hover:bg-purple-800">
          Ашиглалт
        </Link>
        <Link
          href="/admin/celebrities"
          className="block p-2 rounded hover:bg-purple-800">
          Алдартнууд
        </Link>
        <Link
          href="/admin/orders"
          className="block p-2 rounded hover:bg-purple-800">
          Захиалгууд
        </Link>
        <Link
          href="/admin/settings"
          className="block p-2 rounded hover:bg-purple-800">
          Тохиргоо
        </Link>

        <button
          onClick={signOut}
          className="w-full mt-4 px-3 py-2 bg-red-600 rounded text-sm">
          Гарах
        </button>
      </nav>
    </aside>
  );
}
