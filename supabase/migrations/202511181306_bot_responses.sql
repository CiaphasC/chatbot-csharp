-- Respuestas estáticas para el chatbot (sin IA)
create table if not exists public.bot_responses (
  id uuid primary key default gen_random_uuid(),
  intent text not null,
  reply text not null,
  keywords text[] not null,
  created_at timestamptz not null default now()
);

alter table public.bot_responses enable row level security;

-- Lectura pública (los clientes pueden leer)
create policy "bot_responses_public_read" on public.bot_responses
  for select using (true);

-- Escritura solo admin
create policy "bot_responses_admin_write" on public.bot_responses
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
