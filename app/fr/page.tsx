import Link from "next/link";

export default function HomeFR() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 60px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <strong>Vita Santé Club</strong>
        <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/en">EN</Link>
          <Link href="/fr/plans">Plans</Link>
          <Link href="/fr/network">Réseau</Link>
          <Link href="/fr/affiliate">Affilié</Link>
          <Link href="/fr/about">À propos</Link>
          <Link href="/fr/contact">Contact</Link>
          <Link href="/auth">Connexion</Link>
        </nav>
      </header>
      <h1>Assurance santé intégrée pour Haïti & Diaspora</h1>
      <p style={{ opacity: .82 }}>Inscription digitale, espace membre sécurisé, vérification médecin instantanée.</p>
    </main>
  );
}
