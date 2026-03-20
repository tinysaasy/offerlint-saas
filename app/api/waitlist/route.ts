import { z } from "zod";
import { supabase, supabaseEnabled } from "../../../lib/supabase";

const schema = z.object({
  email: z.string().email(),
  note: z.string().optional(),
  source: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const parsed = schema.parse(await req.json());
    let persisted = false;
    if (supabaseEnabled && supabase) {
      const { error } = await supabase.from("waitlist").insert({
        email: parsed.email,
        note: parsed.note || null,
        source: parsed.source || "site",
      });
      persisted = !error;
    }
    return Response.json({ ok: true, persisted }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Waitlist failed", detail: String(error) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = process.env.ADMIN_API_TOKEN;
  if (token && auth !== `Bearer ${token}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseEnabled || !supabase) return Response.json({ rows: [] });
  const { data, error } = await supabase.from("waitlist").select("*").order("created_at", { ascending: false }).limit(100);
  if (error) return Response.json({ error: String(error) }, { status: 500 });
  return Response.json({ rows: data || [] });
}
