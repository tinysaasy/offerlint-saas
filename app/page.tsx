"use client";

import { useState } from "react";

type Result = { score: number; verdict: string; issues: string[]; rewrite: { headline: string; cta: string } };

export default function Home() {
  const [form, setForm] = useState({ headline: "", audience: "", offer: "", proof: "", cta: "", email: "" });
  const [result, setResult] = useState<Result | null>(null);

  const submit = async () => {
    const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    setResult(data.result);
  };

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "48px 20px" }}>
      <h1 style={{ fontSize: 46, marginBottom: 8 }}>OfferLint</h1>
      <p style={{ opacity: 0.85 }}>Instantly score your offer and get actionable rewrites.</p>

      <div style={{ display: "grid", gap: 10, marginTop: 22 }}>
        {[
          ["headline", "Headline"],
          ["audience", "Audience"],
          ["offer", "Offer"],
          ["proof", "Proof"],
          ["cta", "CTA"],
          ["email", "Email (optional)"]
        ].map(([k, l]) => (
          <input key={k} placeholder={l} value={(form as any)[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} style={inputStyle} />
        ))}
        <button onClick={submit} style={btn}>Analyze</button>
      </div>

      {result && (
        <section style={{ marginTop: 24, border: "1px solid #23304f", padding: 14, borderRadius: 10 }}>
          <h3>Score: {result.score}/100 — {result.verdict}</h3>
          <ul>{result.issues.map((x, i) => <li key={i}>{x}</li>)}</ul>
          <p><b>Suggested headline:</b> {result.rewrite.headline}</p>
          <p><b>Suggested CTA:</b> {result.rewrite.cta}</p>
        </section>
      )}
    </main>
  );
}

const inputStyle: React.CSSProperties = { background: "#0e162a", color: "#eaf0ff", border: "1px solid #243252", borderRadius: 8, padding: "10px 12px" };
const btn: React.CSSProperties = { background: "#7288ff", color: "#fff", border: "none", borderRadius: 8, padding: "10px 12px", cursor: "pointer" };
