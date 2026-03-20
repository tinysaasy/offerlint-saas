"use client";

import { useState } from "react";
import { browserSupabase } from "../../../lib/supabase-browser";

type Result = { score: number; verdict: string; issues: string[]; rewrite: { headline: string; cta: string } };

export default function AnalyzePage() {
  const [form, setForm] = useState({ headline: "", audience: "", offer: "", proof: "", cta: "" });
  const [result, setResult] = useState<Result | null>(null);
  const [msg, setMsg] = useState("");

  const submit = async () => {
    const { data } = await browserSupabase!.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return setMsg("Please login again.");

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    const dataRes = await res.json();
    if (!res.ok) return setMsg(dataRes.error || "Analyze failed");
    setResult(dataRes.result);
    setMsg("Saved in your workspace.");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
      <section style={card}>
        <h2>Analyzer</h2>
        <div style={{ display: "grid", gap: 9 }}>
          {[["headline", "Headline"], ["audience", "Audience"], ["offer", "Offer"], ["proof", "Proof"], ["cta", "CTA"]].map(([k, l]) => (
            <input key={k} placeholder={l} value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} style={input} />
          ))}
          <button onClick={submit} style={btn}>Run analysis</button>
          {msg && <p style={{ opacity: .8 }}>{msg}</p>}
        </div>
      </section>
      <section style={card}>
        <h3>Output</h3>
        {!result ? <p style={{ opacity: .7 }}>No result yet.</p> : (
          <>
            <p><b>{result.score}/100</b> — {result.verdict}</p>
            <ul>{result.issues.map((x, i) => <li key={i}>{x}</li>)}</ul>
            <p><b>Rewrite headline:</b> {result.rewrite.headline}</p>
            <p><b>Rewrite CTA:</b> {result.rewrite.cta}</p>
          </>
        )}
      </section>
    </div>
  );
}

const card: React.CSSProperties = { border: "1px solid #223155", borderRadius: 14, padding: 14, background: "#0a1223" };
const input: React.CSSProperties = { background: "#0f162a", color: "#eaf0ff", border: "1px solid #243252", borderRadius: 10, padding: "10px 12px" };
const btn: React.CSSProperties = { background: "#6f86ff", color: "#fff", border: 0, borderRadius: 10, padding: "10px 12px", cursor: "pointer" };
