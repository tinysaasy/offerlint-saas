export async function GET(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = process.env.CRON_SECRET;
  if (token && auth !== `Bearer ${token}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const checks = {
    supabaseConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    adminTokenConfigured: Boolean(process.env.ADMIN_API_TOKEN),
    cronSecretConfigured: Boolean(process.env.CRON_SECRET),
    timestamp: new Date().toISOString(),
  };

  const ok = Object.values(checks).every((v) => v === true || typeof v === "string");
  return Response.json({ ok, checks });
}
