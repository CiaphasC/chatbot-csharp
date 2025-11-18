-- ===================================================================
-- SCRIPT COMPLETO DE SETUP PARA SUPABASE
-- Proyecto: chatbot-csharp
-- Ejecuta este script en: SQL Editor de Supabase
-- ===================================================================

-- PASO 1: Crear tipos y tablas
-- ===================================================================

-- Tipos
CREATE TYPE user_role AS ENUM ('admin', 'client');
CREATE TYPE user_status AS ENUM ('pending', 'active', 'rejected');

-- Tabla de perfiles (enlaza con auth.users)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'client',
  status user_status NOT NULL DEFAULT 'pending',
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT email_gmail_only CHECK (email ILIKE '%@gmail.com')
);

-- Función para updated_at automático
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Trigger para profiles
CREATE TRIGGER profiles_set_updated
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Tabla de servicios
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  duration_minutes int NOT NULL CHECK (duration_minutes > 0),
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Tabla de citas
CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  start_at timestamptz NOT NULL,
  end_at timestamptz GENERATED ALWAYS AS (start_at + make_interval(mins => (SELECT duration_minutes FROM public.services s WHERE s.id = service_id))) STORED,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Índice para consultas
CREATE INDEX idx_appointments_service_start ON public.appointments (service_id, start_at);

-- Evitar solapes de citas
CREATE EXTENSION IF NOT EXISTS btree_gist;
ALTER TABLE public.appointments
  ADD CONSTRAINT no_overlap_per_service EXCLUDE USING gist (
    service_id WITH =,
    tstzrange(start_at, end_at, '[)') WITH &&
  );

-- Tabla de mensajes del chatbot
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  sender text NOT NULL CHECK (sender IN ('user','assistant','system')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Tabla de respuestas del bot
CREATE TABLE public.bot_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intent text NOT NULL,
  reply text NOT NULL,
  keywords text[] NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ===================================================================
-- PASO 2: Habilitar Row Level Security (RLS)
-- ===================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_responses ENABLE ROW LEVEL SECURITY;

-- ===================================================================
-- PASO 3: Políticas de Seguridad
-- ===================================================================

-- Políticas: PROFILES
CREATE POLICY "Profiles: owners can read/update self" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Profiles: users can update self" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles: admins can manage all" ON public.profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Políticas: SERVICES
CREATE POLICY "Services: public read" ON public.services
  FOR SELECT USING (true);

CREATE POLICY "Services: admin write" ON public.services
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Políticas: APPOINTMENTS
CREATE POLICY "Appointments: clients read own" ON public.appointments
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Appointments: clients create own" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Appointments: admin full access" ON public.appointments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Políticas: CHAT_MESSAGES
CREATE POLICY "Chat: users read own" ON public.chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Chat: users insert own" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Chat: admin read all" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Políticas: BOT_RESPONSES
CREATE POLICY "bot_responses_public_read" ON public.bot_responses
  FOR SELECT USING (true);

CREATE POLICY "bot_responses_admin_write" ON public.bot_responses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ===================================================================
-- PASO 4: Crear Usuario Administrador
-- ===================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  uid uuid := '11111111-1111-1111-1111-111111111111';
BEGIN
  -- Crear usuario en auth.users
  INSERT INTO auth.users (
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
  VALUES (
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
  ON CONFLICT (email) DO NOTHING;

  -- Crear perfil de admin
  INSERT INTO public.profiles (id, full_name, email, role, status)
  VALUES (uid, 'Administrador', 'admin@gmail.com', 'admin', 'active')
  ON CONFLICT (id) DO NOTHING;
END $$;

-- ===================================================================
-- PASO 5: Insertar Servicios de Ejemplo
-- ===================================================================

INSERT INTO public.services (name, duration_minutes, description)
VALUES
  ('Consulta General', 30, 'Consulta médica general con revisión completa'),
  ('Limpieza Dental', 45, 'Limpieza dental profesional'),
  ('Corte de Cabello', 30, 'Corte profesional con estilizado'),
  ('Masaje Relajante', 60, 'Masaje terapéutico de relajación'),
  ('Asesoría Legal', 60, 'Consulta legal personalizada')
ON CONFLICT DO NOTHING;

-- ===================================================================
-- PASO 6: Insertar Respuestas del Bot
-- ===================================================================

INSERT INTO public.bot_responses (intent, reply, keywords)
VALUES
  ('citas_info', 'Puedo ayudarte a ver o agendar una cita. Indica servicio, fecha y hora que prefieres.', ARRAY['cita','agendar','agenda','disponible']),
  ('servicios_info', 'Los servicios disponibles incluyen Consulta General, Limpieza Dental, Corte de Cabello, Masaje Relajante y Asesoría Legal. ¿Cuál necesitas?', ARRAY['servicio','servicios','consulta']),
  ('saludo', '¡Hola! Soy tu asistente. Pregúntame por citas, servicios y te ayudaré.', ARRAY['hola','buenas','saludo','hey']),
  ('confirmacion_cita', 'Tu cita se confirma al completar la disponibilidad. Si ya la agendaste, te llegará correo. ¿Fecha y servicio?', ARRAY['confirmar','confirmación','confirmada']),
  ('cancelacion_cita', 'Para cancelar una cita, indica la fecha y el servicio o comunícate con el admin.', ARRAY['cancelar','cancelación','cancela','anular']),
  ('reagendar_cita', 'Para reagendar, dime fecha/hora actual y la nueva preferida. Verifico disponibilidad.', ARRAY['reagendar','cambiar hora','mover cita']),
  ('horarios', 'Los horarios habituales son de 09:00 a 17:00. Verifico disponibilidad según servicio.', ARRAY['horario','horarios','hora']),
  ('precios', 'Los precios dependen del servicio. ¿Cuál servicio te interesa?', ARRAY['precio','coste','costo','tarifa']),
  ('ubicacion', 'Estamos en la ubicación registrada en tu cuenta. ¿Necesitas la dirección?', ARRAY['ubicación','direccion','dirección','donde están']),
  ('soporte', 'Si necesitas ayuda humana, puedo escalar a un administrador. ¿Qué problema tienes?', ARRAY['soporte','ayuda','problema','error']),
  ('fallback', 'No encontré coincidencias en mi base. ¿Puedes dar más detalles sobre cita o servicio?', ARRAY['?'])
ON CONFLICT DO NOTHING;

-- ===================================================================
-- FIN DEL SCRIPT
-- ===================================================================

-- Verificación
DO $$
BEGIN
  RAISE NOTICE '✅ Base de datos configurada exitosamente!';
  RAISE NOTICE '📧 Admin: admin@gmail.com / admin12345';
  RAISE NOTICE '🗄️ Tablas creadas: profiles, services, appointments, chat_messages, bot_responses';
  RAISE NOTICE '🔐 Políticas RLS aplicadas';
END $$;
