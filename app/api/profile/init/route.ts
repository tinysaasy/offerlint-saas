import { z } from "zod";
import { supabase, supabaseEnabled } from "../../../../lib/supabase";

const schema = z.object({
  role: z.enum(["member", "doctor", "affiliate", "sponsor"]),
  full_name: z.string().min(2).optional(),
  locale: z.enum(["fr", "en"]).default("fr"),
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

    const { error } = await supabase.from("profiles").upsert({
      id: userData.user.id,
      role: parsed.role,
      full_name: parsed.full_name || null,
      locale: parsed.locale,
    });

    if (error) throw error;
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: "Profile init failed", detail: String(error) }, { status: 500 });
  }
}
