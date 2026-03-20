"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { browserSupabase } from "../../lib/supabase-browser";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (!browserSupabase) return;
      const { data } = await browserSupabase.auth.getSession();
      if (data.session) router.replace("/app");
    })();
  }, [router]);

  const login = async () => {
    if (!browserSupabase) return setMsg("Supabase auth not configured.");
    setBusy(true);
    setMsg("Authenticating...");
    const { error } = await browserSupabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setMsg(error.message);
    setMsg("Logged in.");
    router.push("/app");
  };

  const signup = async () => {
    if (!browserSupabase) return setMsg("Supabase auth not configured.");
    setBusy(true);
    setMsg("Creating account...");
    const { error, data } = await browserSupabase.auth.signUp({ email, password });

    // If email confirmations are disabled, session is returned immediately.
    if (!error && data.session) {
      setBusy(false);
      setMsg("Account created and logged in.");
      router.push("/app");
      return;
    }

    // Fallback: magic link if confirmation flow is required.
    if (!error && !data.session) {
      const { error: otpError } = await browserSupabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/app` },
      });
      setBusy(false);
      if (otpError) return setMsg(`Signup requires confirmation: ${otpError.message}`);
      return setMsg("Check your email: magic link sent.");
    }

    setBusy(false);
    if (error?.message?.toLowerCase().includes("already")) {
      return login();
    }
    setMsg(error?.message || "Signup failed.");
  };

  const magicLink = async () => {
    if (!browserSupabase) return setMsg("Supabase auth not configured.");
    setBusy(true);
    const { error } = await browserSupabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/app` },
    });
    setBusy(false);
    setMsg(error ? error.message : "Magic link sent. Check inbox.");
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#060a12" }}>
      <section style={{ width: 430, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: 24 }}>
        <h1 style={{ marginTop: 0 }}>OfferLint Auth</h1>
        <p style={{ opacity: 0.75, marginTop: -8 }}>Sign up / login to access the SaaS.</p>
        <div style={{ display: "grid", gap: 10 }}>
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={input} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={input} />
          <button disabled={busy} onClick={signup} style={btn}>Create account</button>
          <button disabled={busy} onClick={login} style={ghost}>Login</button>
          <button disabled={busy} onClick={magicLink} style={ghost}>Send magic link</button>
          {msg ? <p style={{ opacity: 0.85, fontSize: 14 }}>{msg}</p> : null}
        </div>
      </section>
    </main>
  );
}

const input: React.CSSProperties = { background: "#0f1626", color: "#eaf0ff", border: "1px solid #283654", borderRadius: 12, padding: "11px 12px" };
const btn: React.CSSProperties = { background: "linear-gradient(180deg,#8ca1ff,#6d84f8)", color: "white", border: 0, borderRadius: 12, padding: "11px 12px", cursor: "pointer", fontWeight: 600 };
const ghost: React.CSSProperties = { background: "transparent", color: "#b6c3f7", border: "1px solid #283654", borderRadius: 12, padding: "11px 12px", cursor: "pointer" };
