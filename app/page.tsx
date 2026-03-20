"use client";

import Link from "next/link";
import { useState } from "react";

type Result = { score: number; verdict: string; issues: string[]; rewrite: { headline: string; cta: string } };

export default function Home() {
  const [form, setForm] = useState({ headline: "", audience: "", offer: "", proof: "", cta: "", email: "" });
  const [result, setResult] = useState<Result | null>(null);

  const submit = async () => {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setResult(data.result);
  };

  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 20px 50px" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <strong style={{ fontSize: 18 }}>OfferLint</strong>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/auth" style={ghost}>Sign up</Link>
          <Link href="/app" style={btn}>Dashboard</Link>
        </div>
      </nav>

      <section style={{
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 24,
        padding: 24,
        background: "radial-gradient(circle at 0% 0%, #1a2440, #0a101f 60%)"
      }}>
        <h1 style={{ fontSize: 52, margin: "0 0 8px" }}>Audit your offer like a top-tier SaaS operator.</h1>
        <p style={{ opacity: 0.82, fontSize: 17, maxWidth: 700 }}>
          Apple-clean UX. Linear-fast feedback. Paste your positioning, get a conversion score + concrete rewrites.
        </p>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16, marginTop: 18 }}>
        <div style={card}>
          <h3>Instant Analysis</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {[["headline", "Headline"], ["audience", "Audience"], ["offer", "Offer"], ["proof", "Proof"], ["cta", "CTA"], ["email", "Email (optional)"]].map(([k, l]) => (
              <input key={k} placeholder={l} value={(form as any)[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} style={input} />
            ))}
            <button onClick={submit} style={btn}>Analyze now</button>
          </div>
        </div>

        <div style={card}>
          <h3>Result</h3>
          {!result ? (
            <p style={{ opacity: 0.7 }}>Your score and rewrites appear here.</p>
          ) : (
            <>
              <p><b>{result.score}/100</b> — {result.verdict}</p>
              <ul>{result.issues.map((x, i) => <li key={i}>{x}</li>)}</ul>
              <p><b>New headline:</b> {result.rewrite.headline}</p>
              <p><b>New CTA:</b> {result.rewrite.cta}</p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

const card: React.CSSProperties = { border: "1px solid #23304f", borderRadius: 16, padding: 16, background: "#0a1223" };
const input: React.CSSProperties = { background: "#0f162a", color: "#eaf0ff", border: "1px solid #243252", borderRadius: 10, padding: "10px 12px" };
const btn: React.CSSProperties = { background: "linear-gradient(180deg,#8ca1ff,#6d84f8)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 12px", textDecoration: "none", display: "inline-block" };
const ghost: React.CSSProperties = { border: "1px solid #2b3d64", borderRadius: 10, padding: "9px 12px", color: "#c4d0ff", textDecoration: "none" };
