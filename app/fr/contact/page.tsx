"use client";

import { useState } from "react";

export default function ContactFR() {
  const [ok, setOk] = useState(false);
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: 24 }}>
      <h1>Contact</h1>
      <div style={{ display: "grid", gap: 8 }}>
        <input placeholder="Nom" style={input} />
        <input placeholder="Email" style={input} />
        <input placeholder="Objet" style={input} />
        <textarea placeholder="Message" style={{ ...input, minHeight: 140 }} />
        <button style={btn} onClick={() => setOk(true)}>Envoyer</button>
        {ok && <p>Message envoyé. Confirmation email sera activée avec Resend base.</p>}
      </div>
    </main>
  );
}

const input: React.CSSProperties = { background: "#0f162a", color: "#eaf0ff", border: "1px solid #243252", borderRadius: 10, padding: "10px 12px" };
const btn: React.CSSProperties = { background: "#6f86ff", color: "#fff", border: 0, borderRadius: 10, padding: "10px 12px" };
