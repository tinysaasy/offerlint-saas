"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { browserSupabase } from "../../lib/supabase-browser";

type Profile = { role: "member" | "doctor" | "affiliate" | "sponsor" | "admin"; full_name?: string | null; locale?: string | null };

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (!browserSupabase) return router.replace("/auth");
      const { data } = await browserSupabase.auth.getSession();
      if (!data.session) return router.replace("/auth");
      setEmail(data.session.user.email || "");
      const { data: p } = await browserSupabase.from("profiles").select("role,full_name,locale").eq("id", data.session.user.id).maybeSingle();
      setProfile((p as Profile) || null);
    })();
  }, [router]);

  const logout = async () => {
    await browserSupabase?.auth.signOut();
    router.push("/auth");
  };

  if (!profile) return <main style={{ padding: 24 }}>Chargement de votre espace SaaS...</main>;

  const links = profile.role === "member"
    ? [{ href: "/member", label: "Espace Membre" }]
    : profile.role === "doctor"
      ? [{ href: "/doctor/portal", label: "Portail Médecin" }]
      : profile.role === "affiliate"
        ? [{ href: "/fr/affiliate", label: "Portail Affilié" }]
        : profile.role === "sponsor"
          ? [{ href: "/admin", label: "Vue Sponsor (temp)" }]
          : [{ href: "/admin", label: "Admin" }];

  return (
    <main style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "260px 1fr", background: "#070d1b" }}>
      <aside style={{ borderRight: "1px solid #1f2a45", padding: 14 }}>
        <h3 style={{ marginTop: 0 }}>Vita Santé SaaS</h3>
        <p style={{ opacity: .75, fontSize: 13 }}>{email}</p>
        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          {links.map((l) => <Link key={l.href} href={l.href} style={nav}>{l.label}</Link>)}
        </div>
        <button onClick={logout} style={{ ...navBtn, marginTop: 14 }}>Logout</button>
      </aside>
      <section style={{ padding: 22 }}>
        <h1 style={{ marginTop: 0 }}>Bienvenue {profile.full_name || ""}</h1>
        <p style={{ opacity: .8 }}>Rôle: <b>{profile.role}</b></p>
        <div style={{ border: "1px solid #223155", borderRadius: 14, padding: 14, background: "#0b1224" }}>
          <p>Interface SaaS active. Les fonctionnalités affichées dépendent strictement de votre rôle.</p>
        </div>
      </section>
    </main>
  );
}

const nav: React.CSSProperties = { textDecoration: "none", color: "#d5e0ff", border: "1px solid #223155", borderRadius: 10, padding: "10px 12px", background: "#111b33" };
const navBtn: React.CSSProperties = { width: "100%", color: "#d5e0ff", border: "1px solid #223155", borderRadius: 10, padding: "10px 12px", background: "#111b33" };
