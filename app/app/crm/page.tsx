"use client";

import { useEffect, useState } from "react";
import { browserSupabase } from "../../../lib/supabase-browser";

type Contact = {
  id: string;
  full_name: string;
  company: string | null;
  relationship_tier: "core_5" | "circle_15" | "network_50" | "extended_150";
  warmth_score: number;
  last_contact_at: string | null;
};

type Task = { id: string; title: string; due_at: string | null; status: string; contact_id: string | null };

export default function CRMPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [tier, setTier] = useState<Contact["relationship_tier"]>("network_50");
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedContact, setSelectedContact] = useState("");

  const load = async () => {
    const { data } = await browserSupabase!.auth.getSession();
    const uid = data.session?.user.id;
    if (!uid) return;

    const [c, t] = await Promise.all([
      browserSupabase!.from("crm_contacts").select("*").eq("user_id", uid).order("warmth_score", { ascending: false }),
      browserSupabase!.from("crm_tasks").select("*").eq("user_id", uid).order("created_at", { ascending: false }).limit(20),
    ]);

    setContacts((c.data || []) as Contact[]);
    setTasks((t.data || []) as Task[]);
  };

  useEffect(() => { load(); }, []);

  const addContact = async () => {
    const { data } = await browserSupabase!.auth.getSession();
    const uid = data.session?.user.id;
    if (!uid || !name.trim()) return;

    await browserSupabase!.from("crm_contacts").insert({
      user_id: uid,
      full_name: name.trim(),
      company: company.trim() || null,
      relationship_tier: tier,
      warmth_score: tier === "core_5" ? 95 : tier === "circle_15" ? 80 : tier === "network_50" ? 60 : 40,
    });

    setName("");
    setCompany("");
    load();
  };

  const addTask = async () => {
    const { data } = await browserSupabase!.auth.getSession();
    const uid = data.session?.user.id;
    if (!uid || !taskTitle.trim()) return;

    await browserSupabase!.from("crm_tasks").insert({
      user_id: uid,
      title: taskTitle.trim(),
      contact_id: selectedContact || null,
      status: "todo",
    });

    setTaskTitle("");
    load();
  };

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <h1 style={{ margin: 0 }}>Relationship CRM (Dunbar Method)</h1>
      <p style={{ opacity: .78, marginTop: -6 }}>Organise tes relations en cercles 5/15/50/150 + actions de suivi.</p>

      <section style={{ ...card, display: "grid", gap: 10 }}>
        <h3 style={{ margin: 0 }}>Ajouter un contact</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 8 }}>
          <input style={input} placeholder="Nom" value={name} onChange={e => setName(e.target.value)} />
          <input style={input} placeholder="Entreprise" value={company} onChange={e => setCompany(e.target.value)} />
          <select style={input} value={tier} onChange={e => setTier(e.target.value as Contact["relationship_tier"])}>
            <option value="core_5">Core 5</option>
            <option value="circle_15">Circle 15</option>
            <option value="network_50">Network 50</option>
            <option value="extended_150">Extended 150</option>
          </select>
          <button style={btn} onClick={addContact}>Créer</button>
        </div>
      </section>

      <section style={{ ...card, display: "grid", gap: 10 }}>
        <h3 style={{ margin: 0 }}>Créer une tâche relationnelle</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 8 }}>
          <input style={input} placeholder="Ex: Follow-up partenariat" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} />
          <select style={input} value={selectedContact} onChange={e => setSelectedContact(e.target.value)}>
            <option value="">Sans contact</option>
            {contacts.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
          </select>
          <button style={btn} onClick={addTask}>Ajouter tâche</button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 10 }}>
        <section style={card}>
          <h3>Contacts</h3>
          <div style={{ display: "grid", gap: 8 }}>
            {contacts.map(c => (
              <div key={c.id} style={{ border: "1px solid #223155", borderRadius: 10, padding: 10 }}>
                <strong>{c.full_name}</strong> {c.company ? `· ${c.company}` : ""}
                <div style={{ opacity: .72, fontSize: 13 }}>{labelTier(c.relationship_tier)} · Warmth {c.warmth_score}</div>
              </div>
            ))}
            {!contacts.length && <p style={{ opacity: .7 }}>Aucun contact.</p>}
          </div>
        </section>

        <section style={card}>
          <h3>Tâches relationnelles</h3>
          <div style={{ display: "grid", gap: 8 }}>
            {tasks.map(t => (
              <div key={t.id} style={{ border: "1px solid #223155", borderRadius: 10, padding: 10 }}>
                <strong>{t.title}</strong>
                <div style={{ opacity: .72, fontSize: 13 }}>{t.status}</div>
              </div>
            ))}
            {!tasks.length && <p style={{ opacity: .7 }}>Aucune tâche.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

function labelTier(t: Contact["relationship_tier"]) {
  if (t === "core_5") return "Core 5";
  if (t === "circle_15") return "Circle 15";
  if (t === "network_50") return "Network 50";
  return "Extended 150";
}

const card: React.CSSProperties = { border: "1px solid #223155", borderRadius: 14, padding: 14, background: "#0a1223" };
const input: React.CSSProperties = { background: "#0f162a", color: "#eaf0ff", border: "1px solid #243252", borderRadius: 10, padding: "10px 12px" };
const btn: React.CSSProperties = { background: "#6f86ff", color: "#fff", border: 0, borderRadius: 10, padding: "10px 12px", cursor: "pointer" };
