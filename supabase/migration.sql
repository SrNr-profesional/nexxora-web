-- =========================================================
-- Nexxora — Migración inicial de Supabase
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =========================================================

create extension if not exists "pgcrypto";

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Paso 1: información del negocio
  full_name text not null,
  role text not null,
  restaurant_name text not null,
  city text not null,
  phone text not null,
  email text not null,
  instagram text,
  branches_count text not null,

  -- Paso 2: operación actual
  daily_orders text not null,
  employees_count text not null,
  business_type text not null,
  order_channels text[] not null default '{}',
  current_system text not null,

  -- Paso 3: problemas actuales
  problems text[] not null default '{}',
  main_problem text not null,

  -- Paso 4: funciones deseadas
  desired_features text[] not null default '{}',

  -- Paso 5: prioridad y contacto
  urgency text not null,
  best_contact_time text not null,
  contact_preference text not null,
  extra_comments text,
  accepts_privacy_policy boolean not null default false,

  -- Origen / marketing
  source text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,

  -- Gestión comercial (panel interno)
  status text not null default 'nuevo'
    check (status in (
      'nuevo', 'contactado', 'reunion_agendada', 'propuesta_enviada',
      'negociacion', 'cliente_cerrado', 'no_interesado'
    )),
  internal_notes text,
  next_follow_up_date date
);

create index if not exists contacts_created_at_idx on public.contacts (created_at desc);
create index if not exists contacts_status_idx on public.contacts (status);
create index if not exists contacts_restaurant_name_idx on public.contacts using gin (restaurant_name gin_trgm_ops);

-- Habilita búsqueda por texto parcial (nombre / restaurante / teléfono)
create extension if not exists pg_trgm;

-- Row Level Security: se deniega todo acceso público.
-- Todas las lecturas/escrituras se hacen desde el servidor con la Service Role Key,
-- que bypassea RLS automáticamente. El panel interno y el formulario público
-- NUNCA acceden a Supabase directamente desde el navegador.
alter table public.contacts enable row level security;

-- No se crean policies para "anon" ni "authenticated": por defecto, sin policies,
-- RLS bloquea todo acceso que no sea con la Service Role Key.

comment on table public.contacts is 'Diagnósticos de restaurantes enviados desde la web de Nexxora.';
