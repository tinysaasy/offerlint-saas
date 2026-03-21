"use client";

import { useEffect, useState } from "react";
import { browserSupabase } from "../../lib/supabase-browser";

type Member = { id: string; member_number: string; status: string; credits_balance: number; created_at: string };
type Payment = { amount_usd: number; status: string; created_at: string };

export default function MemberPage() {
  const [member, setMember] = useState<Member | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await browserSupabase!.auth.getSession();
      const uid = data.session?.user.id;
      if (!uid) return;

      const m = await browserSupabase!.from("members").select("id,member_number,status,credits_balance,created_at").eq("user_id", uid).maybeSingle();
      if (m.data) setMember(m.data as Member);

      if (m.data?.id) {
        const p = await browserSupabase!.from("payments").select("amount_usd,status,created_at").eq("member_id", (m.data as any).id).order("created_at", { ascending: false }).limit(20);
        setPayments((p.data || []) as Payment[]);
      }
    })();
  }, []);

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>
      <h1>Espace Membre</h1>
      {!member ? <p style={{ opacity: .8 }}>Aucun dossier membre trouvé.</p> : (
        <>
          <section style={card}>
            <p><b>Numéro:</b> {member.member_number || "—"}</p>
            <p><b>Statut:</b> {member.status}</p>
            <p><b>Crédits restants:</b> {member.credits_balance}</p>
          </section>
          <section style={card}>
            <h3>Paiements</h3>
            {payments.map((p, i) => <div key={i}>{new Date(p.created_at).toLocaleDateString()} · ${p.amount_usd} · {p.status}</div>)}
            {!payments.length && <p style={{ opacity: .75 }}>Aucun paiement.</p>}
          </section>
        </>
      )}
    </main>
  );
}

const card: React.CSSProperties = { border: "1px solid #243252", borderRadius: 12, padding: 12, background: "#0b1224", marginBottom: 12 };
