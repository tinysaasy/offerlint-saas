"use client";

import { useEffect, useState } from "react";
import { browserSupabase } from "../../../lib/supabase-browser";

type Project = { id: string; name: string; target_score: number; created_at: string };

export default function ProjectsPage() {
  const [name, setName] = useState("");
  const [target, setTarget] = useState(85);
  const [rows, setRows] = useState<Project[]>([]);

  const load = async () => {
    const { data } = await browserSupabase!.auth.getSession();
    const uid = data.session?.user.id;
    if (!uid) return;
    const { data: list } = await browserSupabase!.from("projects").select("*").eq("user_id", uid).order("created_at", { ascending: false });
    setRows((list || []) as Project[]);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    const { data } = await browserSupabase!.auth.getSession();
    const uid = data.session?.user.id;
    if (!uid || !name.trim()) return;
    await browserSupabase!.from("projects").insert({ user_id: uid, name: name.trim(), target_score: target });
    setName("");
    load();
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h2 style={{ margin: 0 }}>Projects</h2>
      <section style={card}>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Project name" style={input} />
          <input type="number" value={target} onChange={e => setTarget(Number(e.target.value || 85))} style={{ ...input, width: 120 }} />
          <button onClick={add} style={btn}>Create</button>
        </div>
      </section>
      <section style={card}>
        {rows.map(r => <div key={r.id} style={{ border: "1px solid #223155", borderRadius: 10, padding: 10, marginBottom: 8 }}>{r.name} · target {r.target_score}</div>)}
        {!rows.length && <p style={{ opacity: .75 }}>No projects yet.</p>}
      </section>
    </div>
  );
}

const card: React.CSSProperties = { border: "1px solid #223155", borderRadius: 14, padding: 14, background: "#0a1223" };
const input: React.CSSProperties = { background: "#0f162a", color: "#eaf0ff", border: "1px solid #243252", borderRadius: 10, padding: "10px 12px", flex: 1 };
const btn: React.CSSProperties = { background: "#6f86ff", color: "#fff", border: 0, borderRadius: 10, padding: "10px 12px", cursor: "pointer" };
