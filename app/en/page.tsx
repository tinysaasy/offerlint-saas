import Link from "next/link";

export default function HomeEN() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 60px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <strong>Vita Santé Club</strong>
        <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/fr">FR</Link>
          <Link href="/en/plans">Plans</Link>
          <Link href="/en/network">Network</Link>
          <Link href="/en/affiliate">Affiliate</Link>
          <Link href="/en/about">About</Link>
          <Link href="/en/contact">Contact</Link>
          <Link href="/auth">Login</Link>
        </nav>
      </header>
      <h1>Integrated healthcare coverage for Haiti & Diaspora</h1>
      <p style={{ opacity: .82 }}>Digital enrollment, secure member portal, instant doctor verification.</p>
    </main>
  );
}
