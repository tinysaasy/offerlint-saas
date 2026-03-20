"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { browserSupabase } from "../../lib/supabase-browser";

type Row = { id: string; score: number; verdict: string; headline: string; created_at: string };

export default function AppDashboard() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (!browserSupabase) return setLoading(false);
      const { data } = await browserSupabase.auth.getSession();
      if (!data.session) return router.replace("/auth");

      const { data: list } = await browserSupabase
        .from("analyses")
        .select("id,score,verdict,headline,created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      setRows((list || []) as Row[]);
      setLoading(false);
    })();
  }, [router]);

  const logout = async () => {
    await browserSupabase?.auth.signOut();
    router.push("/auth");
  };

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "42px 20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0 }}>OfferLint Console</h1>
          <p style={{ opacity: 0.7, margin: 0 }}>Linear-style operator view.</p>
        </div>
        <button onClick={logout} style={{ ...btn, padding: "8px 12px" }}>Logout</button>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <section style={{ border: "1px solid #243252", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#0f1628", textAlign: "left" }}>
                <th style={th}>Score</th><th style={th}>Verdict</th><th style={th}>Headline</th><th style={th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid #1f2b46" }}>
                  <td style={td}>{r.score}</td>
                  <td style={td}>{r.verdict}</td>
                  <td style={td}>{r.headline}</td>
                  <td style={td}>{new Date(r.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}

const th: React.CSSProperties = { padding: "12px 14px", fontWeight: 600, fontSize: 13, color: "#aebaf0" };
const td: React.CSSProperties = { padding: "12px 14px", fontSize: 14 };
const btn: React.CSSProperties = { background: "#6f86ff", color: "white", border: 0, borderRadius: 10, cursor: "pointer" };
