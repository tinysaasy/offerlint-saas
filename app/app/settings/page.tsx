"use client";

import { useEffect, useState } from "react";
import { browserSupabase } from "../../../lib/supabase-browser";

export default function SettingsPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await browserSupabase!.auth.getSession();
      setEmail(data.session?.user.email || "");
    })();
  }, []);

  return (
    <div style={{ display: "grid", gap: 12, maxWidth: 720 }}>
      <h2 style={{ margin: 0 }}>Settings</h2>
      <section style={card}>
        <h3 style={{ marginTop: 0 }}>Profile</h3>
        <p style={{ opacity: .8 }}>Email: {email || "-"}</p>
      </section>
      <section style={card}>
        <h3 style={{ marginTop: 0 }}>Product defaults</h3>
        <p style={{ opacity: .8 }}>Tone presets and scoring calibrations coming next.</p>
      </section>
    </div>
  );
}

const card: React.CSSProperties = { border: "1px solid #223155", borderRadius: 14, padding: 14, background: "#0a1223" };
