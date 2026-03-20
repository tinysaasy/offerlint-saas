import { z } from "zod";
import { analyzeOffer } from "../../../lib/analyzer";
import { supabase, supabaseEnabled } from "../../../lib/supabase";

const schema = z.object({
  email: z.string().email().optional().or(z.literal("")),
  headline: z.string().min(1),
  audience: z.string().min(1),
  offer: z.string().min(1),
  proof: z.string().optional(),
  cta: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    if (!supabaseEnabled || !supabase) return Response.json({ error: "Supabase not configured" }, { status: 500 });

    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = schema.parse(await req.json());
    const result = analyzeOffer(parsed);

    const { error } = await supabase.from("analyses").insert({
      user_id: userData.user.id,
      email: parsed.email || userData.user.email || null,
      headline: parsed.headline,
      audience: parsed.audience,
      offer: parsed.offer,
      proof: parsed.proof || null,
      cta: parsed.cta || null,
      score: result.score,
      verdict: result.verdict,
      issues: result.issues,
      rewrite: result.rewrite,
    });

    return Response.json({ result, persisted: !error }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Analyze failed", detail: String(error) }, { status: 500 });
  }
}
