"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { browserSupabase } from "../../lib/supabase-browser";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (!browserSupabase) return;
      const { data } = await browserSupabase.auth.getSession();
      if (data.session) router.replace("/app");
    })();
  }, [router]);

  const submit = async () => {
    if (!browserSupabase) return setMsg("Supabase auth not configured.");
    setMsg("Working...");

    const fn = mode === "signup" ? browserSupabase.auth.signUp : browserSupabase.auth.signInWithPassword;
    const { error } = await fn({ email, password });

    if (error) return setMsg(error.message);
    setMsg(mode === "signup" ? "Account created. Check your inbox if email confirmation is enabled." : "Logged in.");
    router.push("/app");
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#060a12" }}>
      <section style={{ width: 420, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: 24 }}>
        <h1 style={{ marginTop: 0 }}>OfferLint Auth</h1>
        <p style={{ opacity: 0.75, marginTop: -8 }}>Clean signup/login flow for SaaS users.</p>
        <div style={{ display: "grid", gap: 10 }}>
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={input} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={input} />
          <button onClick={submit} style={btn}>{mode === "signup" ? "Create account" : "Login"}</button>
          <button onClick={() => setMode(mode === "signup" ? "login" : "signup")} style={ghost}>
            Switch to {mode === "signup" ? "login" : "signup"}
          </button>
          {msg ? <p style={{ opacity: 0.85, fontSize: 14 }}>{msg}</p> : null}
        </div>
      </section>
    </main>
  );
}

const input: React.CSSProperties = { background: "#0f1626", color: "#eaf0ff", border: "1px solid #283654", borderRadius: 12, padding: "11px 12px" };
const btn: React.CSSProperties = { background: "linear-gradient(180deg,#8ca1ff,#6d84f8)", color: "white", border: 0, borderRadius: 12, padding: "11px 12px", cursor: "pointer", fontWeight: 600 };
const ghost: React.CSSProperties = { background: "transparent", color: "#b6c3f7", border: "1px solid #283654", borderRadius: 12, padding: "11px 12px", cursor: "pointer" };
