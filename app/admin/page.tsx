"use client";

export default function AdminPage() {
  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <h1>Admin Vita Santé</h1>
      <p style={{ opacity: .8 }}>Console admin: membres, plans, médecins, affiliations, paiements (MVP scope).</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10, marginTop: 12 }}>
        {[
          "Members",
          "Plans",
          "Doctors",
          "Affiliates",
          "Sponsors",
          "Payments",
        ].map((k) => (
          <div key={k} style={{ border: "1px solid #243252", borderRadius: 12, padding: 12, background: "#0b1224" }}>
            <strong>{k}</strong>
          </div>
        ))}
      </div>
    </main>
  );
}
