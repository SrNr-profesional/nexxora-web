-- ============================================================
-- Nexxora — Panel administrativo interno (CRM + gestión comercial)
-- Migración del esquema. Ejecutar UNA VEZ en el SQL Editor de Supabase.
-- No modifica ni depende de cambios en la tabla "contacts" existente
-- (el formulario público sigue funcionando exactamente igual).
-- ============================================================

create extension if not exists "pgcrypto";
create extension if not exists pg_trgm;

-- ------------------------------------------------------------
-- profiles: una fila por usuario de Supabase Auth (Nara, Juli, y
-- futuros roles). Se completa sola vía trigger al crear el usuario
-- en Authentication > Users; después hay que actualizar el nombre.
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  avatar_color text not null default '#22d3ee',
  role text not null default 'socio'
    check (role in ('socio', 'vendedor', 'sdr', 'soporte', 'developer', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- lost_reasons: catálogo de motivos de pérdida
-- ------------------------------------------------------------
create table if not exists public.lost_reasons (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  sort_order int not null default 0
);

insert into public.lost_reasons (label, sort_order) values
  ('Muy caro', 1),
  ('Ya tiene sistema', 2),
  ('No lo necesita', 3),
  ('Sin presupuesto', 4),
  ('No respondió', 5),
  ('Eligió competencia', 6),
  ('Falta funcionalidad', 7),
  ('Decisión pospuesta', 8),
  ('No hablamos con decisor', 9),
  ('Otro', 10)
on conflict (label) do nothing;

-- ------------------------------------------------------------
-- companies: prospectos y clientes unificados (un solo pipeline)
-- ------------------------------------------------------------
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  name text not null,
  legal_name text,
  industry text not null default 'gastronomia'
    check (industry in ('gastronomia', 'logistica', 'retail', 'hoteleria', 'inmobiliaria', 'distribuidora', 'otro')),
  subcategory text,

  address text,
  city text,
  province text,
  maps_url text,
  website text,
  instagram text,
  facebook text,
  email text,
  phone text,
  whatsapp text,

  employees_estimate text,
  branches_count text,
  size_estimate text,
  notes text,

  status text not null default 'nuevo'
    check (status in (
      'nuevo', 'contactar', 'contactado', 'visita_agendada', 'visitado',
      'interesado', 'demo', 'propuesta', 'negociacion', 'cliente', 'perdido'
    )),
  priority text not null default 'B' check (priority in ('A', 'B', 'C')),

  pain_points text[] not null default '{}',

  score int not null default 0,
  probability int not null default 0,

  mrr_potential numeric(12, 2) not null default 0,
  mrr_actual numeric(12, 2) not null default 0,
  setup_fee_actual numeric(12, 2) not null default 0,

  next_action_type text check (next_action_type in
    ('llamar', 'whatsapp', 'visitar', 'reunion', 'demo', 'enviar_propuesta', 'follow_up', 'cobrar', 'implementar', 'otro')),
  next_action_date date,
  next_action_time time,
  next_action_comment text,
  next_action_assigned_to uuid references public.profiles(id) on delete set null,

  lost_reason_id uuid references public.lost_reasons(id) on delete set null,
  lost_comment text,

  source text,
  source_contact_id uuid references public.contacts(id) on delete set null,

  assigned_to uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,

  client_since date,
  next_renewal_date date,

  archived boolean not null default false,
  is_demo boolean not null default false
);

create index if not exists companies_status_idx on public.companies(status);
create index if not exists companies_industry_idx on public.companies(industry);
create index if not exists companies_assigned_idx on public.companies(assigned_to);
create index if not exists companies_archived_idx on public.companies(archived);
create index if not exists companies_priority_idx on public.companies(priority);
create index if not exists companies_name_trgm_idx on public.companies using gin (name gin_trgm_ops);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists companies_set_updated_at on public.companies;
create trigger companies_set_updated_at
  before update on public.companies
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- people: contactos de cada empresa
-- ------------------------------------------------------------
create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  first_name text not null,
  last_name text,
  position text not null default 'otro'
    check (position in ('dueño', 'socio', 'encargado', 'administrador', 'otro')),
  phone text,
  whatsapp text,
  email text,
  best_contact_time text,
  decision_level text not null default 'usuario'
    check (decision_level in ('decide', 'influye', 'usuario', 'no_decide')),
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists people_company_idx on public.people(company_id);

-- ------------------------------------------------------------
-- activities: timeline unificado por empresa
-- ------------------------------------------------------------
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  type text not null check (type in (
    'nota', 'llamada', 'whatsapp', 'visita', 'reunion', 'demo',
    'cambio_estado', 'propuesta_enviada', 'cierre', 'tarea_completada'
  )),
  content text not null,
  metadata jsonb not null default '{}',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists activities_company_idx on public.activities(company_id, created_at desc);

-- ------------------------------------------------------------
-- tasks: tareas asignables entre socios
-- ------------------------------------------------------------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  company_id uuid references public.companies(id) on delete set null,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  priority text not null default 'B' check (priority in ('A', 'B', 'C')),
  due_date date,
  due_time time,
  status text not null default 'pendiente'
    check (status in ('pendiente', 'en_progreso', 'completada', 'cancelada')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists tasks_assigned_idx on public.tasks(assigned_to, status);
create index if not exists tasks_due_idx on public.tasks(due_date);
create index if not exists tasks_company_idx on public.tasks(company_id);

-- ------------------------------------------------------------
-- proposals: propuestas comerciales
-- ------------------------------------------------------------
create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  plan_name text not null,
  setup_fee numeric(12, 2) not null default 0,
  monthly_fee numeric(12, 2) not null default 0,
  currency text not null default 'ARS',
  services text[] not null default '{}',
  sent_date date,
  expiry_date date,
  assigned_to uuid references public.profiles(id) on delete set null,
  status text not null default 'borrador'
    check (status in ('borrador', 'enviada', 'vista', 'negociacion', 'aceptada', 'rechazada')),
  created_at timestamptz not null default now()
);

create index if not exists proposals_company_idx on public.proposals(company_id);
create index if not exists proposals_status_idx on public.proposals(status);

-- ------------------------------------------------------------
-- goals: metas de equipo o por persona, por métrica y período
-- ------------------------------------------------------------
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade, -- null = meta de equipo
  period_month date not null, -- primer día del mes, ej. 2026-08-01
  metric text not null check (metric in (
    'clientes', 'mrr', 'visitas', 'demos', 'propuestas', 'prospectos', 'contactos', 'duenos_contactados'
  )),
  target numeric(12, 2) not null,
  created_at timestamptz not null default now(),
  unique (profile_id, period_month, metric)
);

-- ------------------------------------------------------------
-- implementation_items: checklist de onboarding por cliente
-- ------------------------------------------------------------
create table if not exists public.implementation_items (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  label text not null,
  done boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists implementation_items_company_idx on public.implementation_items(company_id);

-- ------------------------------------------------------------
-- feature_requests: funcionalidades pedidas por prospectos/clientes
-- ------------------------------------------------------------
create table if not exists public.feature_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  feature text not null,
  created_at timestamptz not null default now()
);

create index if not exists feature_requests_feature_idx on public.feature_requests(feature);

-- ------------------------------------------------------------
-- notifications: avisos internos entre socios
-- ------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  type text not null default 'tarea_asignada',
  content text not null,
  related_company_id uuid references public.companies(id) on delete set null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_profile_idx on public.notifications(profile_id, read);

-- ------------------------------------------------------------
-- RLS: mismo patrón que "contacts" — se activa sin políticas.
-- Solo el service role key (usado del lado del servidor, nunca en
-- el navegador) puede leer/escribir. El acceso real lo controla
-- el middleware de Next.js verificando la sesión de Supabase Auth.
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.people enable row level security;
alter table public.activities enable row level security;
alter table public.tasks enable row level security;
alter table public.proposals enable row level security;
alter table public.goals enable row level security;
alter table public.implementation_items enable row level security;
alter table public.feature_requests enable row level security;
alter table public.lost_reasons enable row level security;
alter table public.notifications enable row level security;

comment on table public.companies is 'Prospectos y clientes de Nexxora (CRM interno). No confundir con "contacts" (formulario público).';
