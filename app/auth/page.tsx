"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { browserSupabase } from "../../lib/supabase-browser";

type Role = "member" | "doctor" | "affiliate" | "sponsor";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [role, setRole] = useState<Role>("member");
  const [fullName, setFullName] = useState("");
  const [locale, setLocale] = useState<"fr" | "en">("fr");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (!browserSupabase) return;
      const { data } = await browserSupabase.auth.getSession();
      if (data.session) router.replace("/dashboard");
    })();
  }, [router]);

  const login = async () => {
    if (!browserSupabase) return setMsg("Supabase auth not configured.");
    setBusy(true);
    const { error } = await browserSupabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setMsg(error.message);
    router.push("/dashboard");
  };

  const signup = async () => {
    if (!browserSupabase) return setMsg("Supabase auth not configured.");
    setBusy(true);
    setMsg("Création du compte...");

    const { error, data } = await browserSupabase.auth.signUp({ email, password });
    if (error) {
      setBusy(false);
      return setMsg(error.message);
    }

    const session = data.session || (await browserSupabase.auth.getSession()).data.session;
    if (!session) {
      setBusy(false);
      return setMsg("Compte créé. Vérifie ton email pour finaliser la connexion.");
    }

    const res = await fetch("/api/profile/init", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ role, full_name: fullName, locale }),
    });

    const payload = await res.json();
    setBusy(false);
    if (!res.ok) return setMsg(payload.error || "Initialisation profil échouée.");
    router.push("/dashboard");
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "radial-gradient(circle at 20% 0%, #1b2850, #050912 55%)" }}>
      <section style={{ width: 460, maxWidth: "92vw", borderRadius: 20, border: "1px solid rgba(255,255,255,.14)", background: "rgba(9,14,28,.8)", padding: 24, backdropFilter: "blur(8px)" }}>
        <h1 style={{ marginTop: 0, marginBottom: 6 }}>Vita Santé Auth</h1>
        <p style={{ opacity: .75, marginTop: 0 }}>Connexion propre par rôle (member / doctor / affiliate / sponsor)</p>

        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <button onClick={() => setMode("signup")} style={mode === "signup" ? btn : ghost}>Sign up</button>
          <button onClick={() => setMode("login")} style={mode === "login" ? btn : ghost}>Login</button>
        </div>

        <div style={{ display: "grid", gap: 9 }}>
          {mode === "signup" && (
            <>
              <input placeholder="Nom complet" value={fullName} onChange={(e) => setFullName(e.target.value)} style={input} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <select value={role} onChange={(e) => setRole(e.target.value as Role)} style={input}>
                  <option value="member">Membre</option>
                  <option value="doctor">Médecin</option>
                  <option value="affiliate">Affilié</option>
                  <option value="sponsor">Sponsor</option>
                </select>
                <select value={locale} onChange={(e) => setLocale(e.target.value as "fr" | "en")} style={input}>
                  <option value="fr">FR</option>
                  <option value="en">EN</option>
                </select>
              </div>
            </>
          )}
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={input} />
          <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} style={input} />
          {mode === "signup" ? (
            <button onClick={signup} disabled={busy} style={btn}>{busy ? "Création..." : "Créer mon compte"}</button>
          ) : (
            <button onClick={login} disabled={busy} style={btn}>{busy ? "Connexion..." : "Se connecter"}</button>
          )}
          {msg ? <p style={{ margin: 0, fontSize: 13, opacity: .9 }}>{msg}</p> : null}
        </div>
      </section>
    </main>
  );
}

const input: React.CSSProperties = { background: "#0e162d", color: "#eaf0ff", border: "1px solid #2a3b67", borderRadius: 12, padding: "11px 12px" };
const btn: React.CSSProperties = { background: "linear-gradient(180deg,#88a0ff,#6d84f8)", color: "white", border: 0, borderRadius: 12, padding: "11px 12px", cursor: "pointer", fontWeight: 600 };
const ghost: React.CSSProperties = { background: "transparent", color: "#c7d4ff", border: "1px solid #2a3b67", borderRadius: 12, padding: "10px 12px", cursor: "pointer", flex: 1 };
