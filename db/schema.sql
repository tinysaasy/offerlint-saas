-- Enable email/password auth in Supabase dashboard.
-- This schema stores app data only.

create table if not exists analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
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

alter table analyses add column if not exists user_id uuid references auth.users(id) on delete cascade;

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target_score int not null default 85,
  created_at timestamptz not null default now()
);

create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  note text,
  source text,
  created_at timestamptz not null default now()
);

create table if not exists crm_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  company text,
  relationship_tier text not null check (relationship_tier in ('core_5','circle_15','network_50','extended_150')),
  warmth_score int not null default 50,
  last_contact_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists crm_interactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  contact_id uuid not null references crm_contacts(id) on delete cascade,
  channel text not null default 'dm',
  summary text,
  happened_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists crm_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  contact_id uuid references crm_contacts(id) on delete set null,
  title text not null,
  due_at timestamptz,
  status text not null default 'todo' check (status in ('todo','doing','done')),
  created_at timestamptz not null default now()
);

alter table analyses enable row level security;
alter table projects enable row level security;
alter table waitlist enable row level security;
alter table crm_contacts enable row level security;
alter table crm_interactions enable row level security;
alter table crm_tasks enable row level security;

-- Per-user data isolation.
drop policy if exists "analyses_select_own" on analyses;
create policy "analyses_select_own" on analyses for select to authenticated using (auth.uid() = user_id);

drop policy if exists "projects_select_own" on projects;
create policy "projects_select_own" on projects for select to authenticated using (auth.uid() = user_id);

drop policy if exists "projects_insert_own" on projects;
create policy "projects_insert_own" on projects for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "projects_update_own" on projects;
create policy "projects_update_own" on projects for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "projects_delete_own" on projects;
create policy "projects_delete_own" on projects for delete to authenticated using (auth.uid() = user_id);

-- CRM policies
drop policy if exists "crm_contacts_select_own" on crm_contacts;
create policy "crm_contacts_select_own" on crm_contacts for select to authenticated using (auth.uid() = user_id);
drop policy if exists "crm_contacts_insert_own" on crm_contacts;
create policy "crm_contacts_insert_own" on crm_contacts for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "crm_contacts_update_own" on crm_contacts;
create policy "crm_contacts_update_own" on crm_contacts for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "crm_contacts_delete_own" on crm_contacts;
create policy "crm_contacts_delete_own" on crm_contacts for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "crm_interactions_select_own" on crm_interactions;
create policy "crm_interactions_select_own" on crm_interactions for select to authenticated using (auth.uid() = user_id);
drop policy if exists "crm_interactions_insert_own" on crm_interactions;
create policy "crm_interactions_insert_own" on crm_interactions for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "crm_interactions_update_own" on crm_interactions;
create policy "crm_interactions_update_own" on crm_interactions for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "crm_interactions_delete_own" on crm_interactions;
create policy "crm_interactions_delete_own" on crm_interactions for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "crm_tasks_select_own" on crm_tasks;
create policy "crm_tasks_select_own" on crm_tasks for select to authenticated using (auth.uid() = user_id);
drop policy if exists "crm_tasks_insert_own" on crm_tasks;
create policy "crm_tasks_insert_own" on crm_tasks for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "crm_tasks_update_own" on crm_tasks;
create policy "crm_tasks_update_own" on crm_tasks for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "crm_tasks_delete_own" on crm_tasks;
create policy "crm_tasks_delete_own" on crm_tasks for delete to authenticated using (auth.uid() = user_id);

-- Prevent direct client writes to analyses/waitlist; server routes use service role.
drop policy if exists "analyses_insert_none" on analyses;
create policy "analyses_insert_none" on analyses for insert to anon, authenticated with check (false);

drop policy if exists "waitlist_insert_none" on waitlist;
create policy "waitlist_insert_none" on waitlist for insert to anon, authenticated with check (false);
