-- Semilla de administrador inicial
-- Cambia el correo/clave si lo deseas antes de aplicar la migración.
-- Clave temporal: Admin123!

-- Asegurar pgcrypto para crypt()
create extension if not exists pgcrypto;

do $$
declare
  uid uuid := '11111111-1111-1111-1111-111111111111';
begin
  -- Crea el usuario en auth.users si no existe
  insert into auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
  )
  values (
    uid,
    '00000000-0000-0000-0000-000000000000',
    'admin@gmail.com',
    crypt('admin12345', gen_salt('bf')),
    now(),
    now(),
    jsonb_build_object('provider','email','providers',array['email']),
    jsonb_build_object('full_name','Administrador'),
    'authenticated',
    'authenticated'
  )
  on conflict (email) do nothing;

  -- Crea el perfil ligado con rol admin y estado activo
  insert into public.profiles (id, full_name, email, role, status)
  values (uid, 'Administrador', 'admin@gmail.com', 'admin', 'active')
  on conflict (id) do nothing;
end $$;
