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
