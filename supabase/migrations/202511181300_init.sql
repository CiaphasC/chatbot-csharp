-- Tipos
create type user_role as enum ('admin', 'client');
create type user_status as enum ('pending', 'active', 'rejected');

-- Tabla de perfiles (enlaza con auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role user_role not null default 'client',
  status user_status not null default 'pending',
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Disparador de updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_set_updated
before update on public.profiles
for each row execute procedure public.set_updated_at();

-- Tabla de servicios
create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  duration_minutes int not null check (duration_minutes > 0),
  description text,
  created_at timestamptz not null default now()
);

-- Tabla de citas (sin empleado asignado)
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete restrict,
  start_at timestamptz not null,
  end_at timestamptz not null,
  status text not null default 'pending',
  notes text,
  created_at timestamptz not null default now()
);

-- Índice para consultas por servicio y fecha
create index idx_appointments_service_start on public.appointments (service_id, start_at);

-- Exclusion constraint para evitar solapes por servicio
create extension if not exists btree_gist;
alter table public.appointments
  add constraint no_overlap_per_service exclude using gist (
    service_id with =,
    tstzrange(start_at, end_at, '[)') with &&
  );

-- Tabla de mensajes del chatbot
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  sender text not null check (sender in ('user','assistant','system')),
  content text not null,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.appointments enable row level security;
alter table public.chat_messages enable row level security;

-- Políticas: perfiles
create policy "Profiles: owners can read/update self" on public.profiles
  for select using (auth.uid() = id);

create policy "Profiles: users can update self" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Profiles: admins can manage all" on public.profiles
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Políticas: services (lectura pública, escritura admin)
create policy "Services: public read" on public.services
  for select using (true);
create policy "Services: admin write" on public.services
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Políticas: appointments
-- clientes: ver/crear solo las suyas
create policy "Appointments: clients read own" on public.appointments
  for select using (auth.uid() = client_id);
create policy "Appointments: clients create own" on public.appointments
  for insert with check (auth.uid() = client_id);

-- admin: full
create policy "Appointments: admin full access" on public.appointments
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Políticas: chat_messages
create policy "Chat: users read own" on public.chat_messages
  for select using (auth.uid() = user_id);
create policy "Chat: users insert own" on public.chat_messages
  for insert with check (auth.uid() = user_id);
create policy "Chat: admin read all" on public.chat_messages
  for select using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Restricción: solo emails gmail en profiles
alter table public.profiles
  add constraint email_gmail_only check (email ilike '%@gmail.com');
