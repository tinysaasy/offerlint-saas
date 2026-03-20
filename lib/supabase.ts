import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

export const supabaseEnabled = Boolean(url && key);
export const supabase = supabaseEnabled ? createClient(url as string, key as string, { auth: { persistSession: false } }) : null;
