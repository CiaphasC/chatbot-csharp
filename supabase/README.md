# Supabase (migraciones y funciones Edge)

Estructura generada para conectar el frontend (Next) y backend (C#) a Supabase.

- `migrations/` contiene SQL para tablas, políticas RLS y tipos.
- `functions/notify-approval/` función Edge (Deno) para enviar correo cuando un admin aprueba a un cliente.

Cómo usar con Supabase CLI:
```bash
supabase db push        # aplica migraciones a tu proyecto remoto
supabase functions serve --env-file ./supabase/.env.local
supabase functions deploy notify-approval
```

Variables recomendadas (.env.local para funciones / despliegue):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` (o proveedor SMTP) y `FROM_EMAIL`
- Admin seed (migración `202511181305_seed_admin.sql`):
  - Usuario: `admin@gmail.com`
  - Clave: `admin12345`
  - Rol: admin, status: active
  Cambia correo/clave en la migración antes de aplicar si lo deseas.
Frontend (Vercel):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL` (tu backend Render)
