import Link from "next/link";

export default function Header() {
  return (
    <header style={{ background: "#1a0b2e", padding: 12, color: "#F5F5DC" }}>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <h1 style={{ fontFamily: "Cinzel, serif", margin: 0 }}>MICHID</h1>
        <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/">Home</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
