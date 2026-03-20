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
    const parsed = schema.parse(await req.json());
    const result = analyzeOffer(parsed);

    let persisted = false;
    if (supabaseEnabled && supabase) {
      const { error } = await supabase.from("analyses").insert({
        email: parsed.email || null,
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
      persisted = !error;
    }

    return Response.json({ result, persisted }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Analyze failed", detail: String(error) }, { status: 500 });
  }
}
