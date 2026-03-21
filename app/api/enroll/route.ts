import { z } from "zod";
import { supabase, supabaseEnabled } from "../../../lib/supabase";

const dependent = z.object({
  full_name: z.string().min(2),
  relationship: z.string().min(2),
  date_of_birth: z.string().optional(),
});

const schema = z.object({
  flow_type: z.enum(["standard", "diaspora"]),
  plan_code: z.string().min(2),
  payer_full_name: z.string().min(2).optional(),
  payer_email: z.string().email().optional(),
  beneficiary_full_name: z.string().min(2),
  beneficiary_email: z.string().email(),
  beneficiary_phone: z.string().min(4),
  beneficiary_address: z.string().min(4),
  beneficiary_country: z.string().min(2).default("HT"),
  nif: z.string().optional(),
  dependents: z.array(dependent).default([]),
});

export async function POST(req: Request) {
  try {
    if (!supabaseEnabled || !supabase) {
      return Response.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const body = schema.parse(await req.json());

    const { data: intake, error: iErr } = await supabase
      .from("enrollment_intakes")
      .insert({
        flow_type: body.flow_type,
        plan_code: body.plan_code,
        payer_full_name: body.payer_full_name || null,
        payer_email: body.payer_email || null,
        beneficiary_full_name: body.beneficiary_full_name,
        beneficiary_email: body.beneficiary_email,
        beneficiary_phone: body.beneficiary_phone,
        beneficiary_address: body.beneficiary_address,
        beneficiary_country: body.beneficiary_country,
        nif: body.nif || null,
      })
      .select("id")
      .single();

    if (iErr || !intake) throw iErr || new Error("Intake create failed");

    if (body.dependents.length) {
      const payload = body.dependents.map((d) => ({
        intake_id: intake.id,
        full_name: d.full_name,
        relationship: d.relationship,
        date_of_birth: d.date_of_birth || null,
      }));
      const { error: dErr } = await supabase.from("enrollment_dependents").insert(payload);
      if (dErr) throw dErr;
    }

    return Response.json({ ok: true, intakeId: intake.id }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Enrollment failed", detail: String(error) }, { status: 500 });
  }
}
