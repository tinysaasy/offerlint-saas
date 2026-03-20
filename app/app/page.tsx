"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { browserSupabase } from "../../lib/supabase-browser";

type Row = { id: string; score: number; verdict: string; headline: string; created_at: string };

export default function Dashboard() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    (async () => {
      if (!browserSupabase) return;
      const { data } = await browserSupabase.auth.getSession();
      const uid = data.session?.user.id;
      if (!uid) return;
      const { data: list } = await browserSupabase
        .from("analyses")
        .select("id,score,verdict,headline,created_at")
        .eq("user_id", uid)
        .order("created_at", { ascending: false })
        .limit(12);
      setRows((list || []) as Row[]);
    })();
  }, []);

  const avg = rows.length ? Math.round(rows.reduce((a, r) => a + r.score, 0) / rows.length) : 0;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>Dashboard</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 12 }}>
        <Card title="Analyses" value={String(rows.length)} />
        <Card title="Avg Score" value={`${avg}`} />
        <Card title="Win Focus" value={rows.filter(r => r.score >= 80).length.toString()} />
      </div>
      <section style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Recent analyses</h3>
          <Link href="/app/analyze" style={{ color: "#bcd0ff" }}>New analysis</Link>
        </div>
        <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
          {rows.map(r => (
            <div key={r.id} style={{ border: "1px solid #223155", borderRadius: 10, padding: 10 }}>
              <strong>{r.score}/100</strong> · {r.verdict} · {r.headline}
            </div>
          ))}
          {!rows.length && <p style={{ opacity: .75 }}>No analyses yet.</p>}
        </div>
      </section>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return <div style={card}><div style={{ opacity: .75, fontSize: 13 }}>{title}</div><div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div></div>;
}

const card: React.CSSProperties = { border: "1px solid #223155", borderRadius: 14, padding: 14, background: "#0a1223" };
