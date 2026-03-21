import { z } from "zod";
import { supabase, supabaseEnabled } from "../../../../lib/supabase";

const schema = z.object({
  member_number: z.string().min(3),
  service_type: z.enum(["general", "specialist", "lab"]),
  note: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    if (!supabaseEnabled || !supabase) return Response.json({ error: "Supabase not configured" }, { status: 500 });

    const body = schema.parse(await req.json());

    const memberRes = await supabase.from("members").select("id,credits_balance,status").eq("member_number", body.member_number).maybeSingle();
    if (!memberRes.data) return Response.json({ error: "Membre introuvable" }, { status: 404 });
    if (memberRes.data.status !== "active") return Response.json({ error: "Membre inactif" }, { status: 400 });
    if ((memberRes.data.credits_balance || 0) <= 0) return Response.json({ error: "Crédits insuffisants" }, { status: 400 });

    const next = (memberRes.data.credits_balance || 0) - 1;

    const upd = await supabase.from("members").update({ credits_balance: next }).eq("id", memberRes.data.id).eq("credits_balance", memberRes.data.credits_balance).select("credits_balance").single();
    if (upd.error) return Response.json({ error: "Conflit de décrémentation, réessayer" }, { status: 409 });

    await supabase.from("doctor_visits").insert({
      member_id: memberRes.data.id,
      service_type: body.service_type,
      note: body.note || null,
    });

    return Response.json({ ok: true, remainingCredits: next });
  } catch (error) {
    return Response.json({ error: "Visit recording failed", detail: String(error) }, { status: 500 });
  }
}
