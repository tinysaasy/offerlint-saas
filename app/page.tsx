import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 60px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <strong>Vita Santé Club</strong>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link href="/plans">Plans</Link>
          <Link href="/doctors">Médecins</Link>
          <Link href="/auth">Connexion</Link>
        </nav>
      </header>

      <section style={{ border: "1px solid #243252", borderRadius: 20, padding: 24, background: "linear-gradient(180deg,#101a31,#090f1e)" }}>
        <p style={{ opacity: .8 }}>Plateforme santé Haïti & Diaspora</p>
        <h1 style={{ fontSize: 46, lineHeight: 1.05, margin: "8px 0 10px" }}>
          Assurance + Réseau Médical intégré, simple et digital.
        </h1>
        <p style={{ maxWidth: 780, opacity: .88 }}>
          Inscription en ligne, paiement sécurisé, carte membre numérique, vérification rapide par les médecins partenaires,
          et contrôle complet pour l’administration Vita Santé Club.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <Link href="/signup" style={btn}>S’inscrire maintenant</Link>
          <Link href="/doctor/verify" style={ghost}>Vérifier un membre</Link>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginTop: 14 }}>
        {[
          ["Plan Essentiel", "Couverture de base + réseau prioritaire"],
          ["Plan Plus", "Couverture élargie + crédits soins"],
          ["Plan Premium", "Couverture complète + priorité maximale"],
        ].map(([t, d]) => (
          <article key={t} style={card}><h3 style={{ marginTop: 0 }}>{t}</h3><p style={{ opacity: .8 }}>{d}</p><Link href="/plans">Voir détails</Link></article>
        ))}
      </section>
    </main>
  );
}

const card: React.CSSProperties = { border: "1px solid #243252", borderRadius: 14, padding: 14, background: "#0b1224" };
const btn: React.CSSProperties = { background: "#6f86ff", color: "white", textDecoration: "none", borderRadius: 10, padding: "10px 12px" };
const ghost: React.CSSProperties = { border: "1px solid #30426d", color: "#c8d5ff", textDecoration: "none", borderRadius: 10, padding: "10px 12px" };
