"use client";

export default function AffiliateFR() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Programme Affilié</h1>
      <p style={{ opacity: .82 }}>Rejoignez le programme et recevez des commissions sur les membres parrainés.</p>
      <div style={{ display: "grid", gap: 8 }}>
        <input placeholder="Prénom" style={input} />
        <input placeholder="Nom" style={input} />
        <input placeholder="Email" style={input} />
        <input placeholder="Téléphone" style={input} />
        <input placeholder="Ville" style={input} />
        <button style={btn}>Soumettre ma candidature</button>
      </div>
    </main>
  );
}
const input: React.CSSProperties = { background: "#0f162a", color: "#eaf0ff", border: "1px solid #243252", borderRadius: 10, padding: "10px 12px" };
const btn: React.CSSProperties = { background: "#6f86ff", color: "#fff", border: 0, borderRadius: 10, padding: "10px 12px" };
