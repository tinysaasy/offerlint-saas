-- Vita Santé Club MVP schema (Phase 1)

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('member','doctor','affiliate','sponsor','admin')),
  full_name text,
  locale text not null default 'fr',
  created_at timestamptz not null default now()
);

create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name_fr text not null,
  name_en text not null,
  monthly_price_usd numeric(10,2) not null,
  credits_monthly int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  plan_id uuid references plans(id),
  member_number text unique,
  status text not null default 'pending' check (status in ('pending','active','suspended','cancelled')),
  credits_balance int not null default 0,
  country text,
  is_diaspora boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists doctors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  full_name text not null,
  city text,
  specialty text,
  partner_status text not null default 'pending' check (partner_status in ('pending','active','inactive')),
  created_at timestamptz not null default now()
);

create table if not exists member_cards (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  card_number text unique not null,
  qr_token text unique not null,
  valid_until date,
  storage_path text,
  created_at timestamptz not null default now()
);

create table if not exists affiliations (
  id uuid primary key default gen_random_uuid(),
  affiliate_user_id uuid references auth.users(id) on delete set null,
  sponsor_user_id uuid references auth.users(id) on delete set null,
  member_id uuid not null references members(id) on delete cascade,
  commission_rate numeric(5,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  stripe_payment_intent_id text unique,
  amount_usd numeric(10,2) not null,
  currency text not null default 'usd',
  status text not null default 'pending' check (status in ('pending','succeeded','failed','refunded')),
  created_at timestamptz not null default now()
);

create table if not exists enrollment_intakes (
  id uuid primary key default gen_random_uuid(),
  flow_type text not null check (flow_type in ('standard','diaspora')),
  plan_code text not null,
  payer_full_name text,
  payer_email text,
  beneficiary_full_name text not null,
  beneficiary_email text not null,
  beneficiary_phone text not null,
  beneficiary_address text not null,
  beneficiary_country text not null default 'HT',
  nif text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

create table if not exists enrollment_dependents (
  id uuid primary key default gen_random_uuid(),
  intake_id uuid not null references enrollment_intakes(id) on delete cascade,
  full_name text not null,
  relationship text not null,
  date_of_birth date,
  created_at timestamptz not null default now()
);

create table if not exists doctor_visits (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  service_type text not null check (service_type in ('general','specialist','lab')),
  note text,
  visited_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- RLS
alter table profiles enable row level security;
alter table members enable row level security;
alter table doctors enable row level security;
alter table member_cards enable row level security;
alter table affiliations enable row level security;
alter table payments enable row level security;
alter table plans enable row level security;
alter table enrollment_intakes enable row level security;
alter table enrollment_dependents enable row level security;
alter table doctor_visits enable row level security;

-- Profile self read
create policy if not exists profiles_select_self on profiles for select to authenticated using (id = auth.uid());

-- Members self read
create policy if not exists members_select_self on members for select to authenticated using (user_id = auth.uid());

-- Doctors self read
create policy if not exists doctors_select_self on doctors for select to authenticated using (user_id = auth.uid());

-- Plans readable by authenticated
create policy if not exists plans_select_all on plans for select to authenticated using (true);

-- Intakes are server-written for now.
drop policy if exists enrollment_intakes_none on enrollment_intakes;
create policy enrollment_intakes_none on enrollment_intakes for all to anon, authenticated using (false) with check (false);

drop policy if exists enrollment_dependents_none on enrollment_dependents;
create policy enrollment_dependents_none on enrollment_dependents for all to anon, authenticated using (false) with check (false);

drop policy if exists doctor_visits_none on doctor_visits;
create policy doctor_visits_none on doctor_visits for all to anon, authenticated using (false) with check (false);

-- Admin/service writes are handled server-side (service role).
