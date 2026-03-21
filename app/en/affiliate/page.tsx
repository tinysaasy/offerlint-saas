"use client";

export default function AffiliateEN() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Affiliate Program</h1>
      <p style={{ opacity: .82 }}>Join the program and earn commissions on referred members.</p>
      <div style={{ display: "grid", gap: 8 }}>
        <input placeholder="First name" style={input} />
        <input placeholder="Last name" style={input} />
        <input placeholder="Email" style={input} />
        <input placeholder="Phone" style={input} />
        <input placeholder="City" style={input} />
        <button style={btn}>Submit application</button>
      </div>
    </main>
  );
}
const input: React.CSSProperties = { background: "#0f162a", color: "#eaf0ff", border: "1px solid #243252", borderRadius: 10, padding: "10px 12px" };
const btn: React.CSSProperties = { background: "#6f86ff", color: "#fff", border: 0, borderRadius: 10, padding: "10px 12px" };
