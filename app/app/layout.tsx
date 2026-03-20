"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { browserSupabase } from "../../lib/supabase-browser";

const nav = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/crm", label: "CRM" },
  { href: "/app/analyze", label: "Analyzer" },
  { href: "/app/projects", label: "Projects" },
  { href: "/app/settings", label: "Settings" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState("...");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      if (!browserSupabase) return router.replace("/auth");
      const { data } = await browserSupabase.auth.getSession();
      if (!data.session) return router.replace("/auth");
      setEmail(data.session.user.email || "user");
    })();
  }, [router]);

  const logout = async () => {
    await browserSupabase?.auth.signOut();
    router.push("/auth");
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderBottom: "1px solid #1f2a45", background: "#070d1b" }}>
        <strong>OfferLint</strong>
        <button onClick={() => setOpen(!open)} style={{ background: "#253353", color: "white", border: 0, borderRadius: 8, padding: "8px 10px" }}>Menu</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: open ? "220px 1fr" : "0 1fr", transition: "all .2s ease" }}>
        <aside style={{ borderRight: "1px solid #1f2a45", padding: open ? 14 : 0, background: "#070d1b", overflow: "hidden" }}>
          <nav style={{ display: "grid", gap: 6 }}>
            {nav.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} style={{
                textDecoration: "none",
                color: pathname === n.href ? "#ffffff" : "#aebaf0",
                background: pathname === n.href ? "#24345c" : "transparent",
                border: "1px solid #223155",
                borderColor: pathname === n.href ? "#3b4f82" : "transparent",
                padding: "9px 10px",
                borderRadius: 10,
                fontSize: 14,
              }}>{n.label}</Link>
            ))}
          </nav>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6 }}>{email}</div>
            <button onClick={logout} style={{ width: "100%", background: "#253353", color: "white", border: 0, borderRadius: 10, padding: "9px 10px", cursor: "pointer" }}>Profile / Logout</button>
          </div>
        </aside>
        <main style={{ padding: 16 }}>{children}</main>
      </div>
    </div>
  );
}
