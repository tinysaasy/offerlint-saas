"use client";

import { useState } from "react";

export default function DoctorPortalPage() {
  const [memberNumber, setMemberNumber] = useState("");
  const [serviceType, setServiceType] = useState("general");
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");

  const recordVisit = async () => {
    const res = await fetch("/api/doctor/visit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ member_number: memberNumber, service_type: serviceType, note }),
    });
    const data = await res.json();
    setMsg(res.ok ? `Visite enregistrée. Crédits restants: ${data.remainingCredits}` : data.error || "Erreur");
  };

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: 24 }}>
      <h1>Portail Médecin</h1>
      <div style={{ display: "grid", gap: 8 }}>
        <input value={memberNumber} onChange={e => setMemberNumber(e.target.value)} placeholder="VSC-XXXXX" style={input} />
        <select value={serviceType} onChange={e => setServiceType(e.target.value)} style={input}>
          <option value="general">Généraliste</option>
          <option value="specialist">Spécialiste</option>
          <option value="lab">Laboratoire</option>
        </select>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Note visite (non médicale)" style={{ ...input, minHeight: 100 }} />
        <button onClick={recordVisit} style={btn}>Enregistrer visite</button>
      </div>
      {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
    </main>
  );
}

const input: React.CSSProperties = { background: "#0f162a", color: "#eaf0ff", border: "1px solid #243252", borderRadius: 10, padding: "10px 12px" };
const btn: React.CSSProperties = { background: "#6f86ff", color: "#fff", border: 0, borderRadius: 10, padding: "10px 12px" };
