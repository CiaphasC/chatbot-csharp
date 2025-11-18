-- Semilla de administrador inicial
create extension if not exists pgcrypto;

do $$
declare
  uid uuid := '11111111-1111-1111-1111-111111111111';
  existing_user uuid;
begin
  -- Verificar si el usuario ya existe
  select id into existing_user from auth.users where email = 'admin@gmail.com' limit 1;
  
  if existing_user is null then
    -- Crear el usuario en auth.users
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
    );
  end if;

  -- Crear el perfil ligado con rol admin y estado activo
  insert into public.profiles (id, full_name, email, role, status)
  values (uid, 'Administrador', 'admin@gmail.com', 'admin', 'active')
  on conflict (id) do nothing;
end $$;
