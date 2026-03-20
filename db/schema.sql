-- Enable email/password auth in Supabase dashboard.
-- This schema stores app data only.

create table if not exists analyses (
  id uuid primary key default gen_random_uuid(),
  email text,
  headline text not null,
  audience text not null,
  offer text not null,
  proof text,
  cta text,
  score int not null,
  verdict text not null,
  issues jsonb not null,
  rewrite jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  note text,
  source text,
  created_at timestamptz not null default now()
);

alter table analyses enable row level security;
alter table waitlist enable row level security;

-- Authenticated app users can read analyses in dashboard.
drop policy if exists "analyses_select_auth" on analyses;
create policy "analyses_select_auth" on analyses for select to authenticated using (true);

-- Prevent direct client writes; server routes use service role.
drop policy if exists "analyses_insert_none" on analyses;
create policy "analyses_insert_none" on analyses for insert to anon, authenticated with check (false);

drop policy if exists "waitlist_insert_none" on waitlist;
create policy "waitlist_insert_none" on waitlist for insert to anon, authenticated with check (false);
