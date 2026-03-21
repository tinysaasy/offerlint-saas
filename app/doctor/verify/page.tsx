"use client";

import { useState } from "react";

export default function DoctorVerifyPage() {
  const [memberId, setMemberId] = useState("");
  const [result, setResult] = useState("Aucune vérification.");

  const verify = async () => {
    if (!memberId.trim()) return;
    setResult(`Membre ${memberId} — vérification en cours (hook API branché au sprint backend).`);
  };

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: 24 }}>
      <h1>Vérification médecin partenaire</h1>
      <p style={{ opacity: .8 }}>Entrer l’identifiant membre pour confirmer statut et droits.</p>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={memberId} onChange={e => setMemberId(e.target.value)} placeholder="ID membre" style={input} />
        <button onClick={verify} style={btn}>Vérifier</button>
      </div>
      <p style={{ marginTop: 12, opacity: .9 }}>{result}</p>
    </main>
  );
}

const input: React.CSSProperties = { flex: 1, background: "#0f162a", color: "#eaf0ff", border: "1px solid #243252", borderRadius: 10, padding: "10px 12px" };
const btn: React.CSSProperties = { background: "#6f86ff", color: "#fff", border: 0, borderRadius: 10, padding: "10px 12px" };
