# Chatbot Full Stack - Next.js + C# + Supabase

Sistema de gestión de citas con chatbot inteligente. Frontend en Next.js, Backend en C# (.NET 9), Base de datos Supabase.

## 🚀 Deploy en Producción

### 1️⃣ Configurar Supabase (Base de Datos)

1. Ve a [supabase.com](https://supabase.com) e inicia sesión
2. Crea un nuevo proyecto
3. Espera a que se cree el proyecto (2-3 minutos)
4. Ve a **Settings** → **API**
5. Copia estos valores:
   - `URL`: Tu URL de proyecto (ej: `https://xxxxx.supabase.co`)
   - `anon public`: Tu clave anon (comienza con `eyJ...`)
   - `service_role`: Tu clave service role (guárdala segura, **no la expongas en el frontend**)

#### Crear las tablas en Supabase

1. Ve a **SQL Editor** en tu proyecto Supabase
2. Ejecuta este SQL para crear las tablas:

```sql
-- Tabla de usuarios (profiles)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de servicios
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de citas
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  service_id UUID REFERENCES services(id) NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de mensajes del chat
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  message TEXT NOT NULL,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
-- Profiles: Los usuarios solo pueden ver y editar su propio perfil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Services: Todos pueden leer, solo admins pueden modificar
CREATE POLICY "Anyone can view active services" ON services
  FOR SELECT USING (is_active = true);

-- Appointments: Los usuarios pueden ver sus propias citas
CREATE POLICY "Users can view own appointments" ON appointments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own appointments" ON appointments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments" ON appointments
  FOR UPDATE USING (auth.uid() = user_id);

-- Chat messages: Los usuarios pueden ver sus propios mensajes
CREATE POLICY "Users can view own messages" ON chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

3. Habilita la autenticación por email:
   - Ve a **Authentication** → **Providers**
   - Habilita **Email**

---

### 2️⃣ Deploy Backend C# en Render

1. Ve a [render.com](https://render.com) e inicia sesión con GitHub
2. Click en **New** → **Web Service**
3. Conecta tu repositorio `chatbot-csharp`
4. Configura el servicio:
   - **Name**: `chatbot-api` (o el nombre que prefieras)
   - **Region**: Oregon (US West) o el más cercano
   - **Branch**: `main`
   - **Root Directory**: `backend/ChatBot.Api`
   - **Runtime**: Docker
   - **Instance Type**: Free
   
5. **Variables de entorno** (en Environment):
   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
   ASPNETCORE_ENVIRONMENT=Production
   ```

6. Click en **Create Web Service**
7. Espera 5-10 minutos a que se despliegue
8. **Copia la URL** que te da Render (ej: `https://chatbot-api.onrender.com`)

---

### 3️⃣ Deploy Frontend Next.js en Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión con GitHub
2. Click en **Add New** → **Project**
3. Importa tu repositorio `chatbot-csharp`
4. Configura el proyecto:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./ ` (raíz del proyecto)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. **Variables de entorno** (Environment Variables):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
   NEXT_PUBLIC_API_URL=https://chatbot-api.onrender.com
   ```

6. Click en **Deploy**
7. Espera 2-3 minutos a que se despliegue
8. **Listo!** Tu app estará en `https://tu-proyecto.vercel.app`

---

## 🛠️ Desarrollo Local

### Requisitos
- Node.js 18+
- .NET 9 SDK
- Una cuenta en Supabase

### Setup

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/CiaphasC/chatbot-csharp.git
   cd chatbot-csharp
   ```

2. **Configura las variables de entorno**
   
   Crea un archivo `.env.local` en la raíz:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

3. **Instala dependencias del frontend**
   ```bash
   npm install
   ```

4. **Corre el backend C#**
   ```bash
   cd backend/ChatBot.Api
   dotnet run
   # El API estará en http://localhost:8080
   ```

5. **Corre el frontend Next.js** (en otra terminal)
   ```bash
   npm run dev
   # La app estará en http://localhost:3000
   ```

---

## 📦 Estructura del Proyecto

```
├── app/                    # Next.js App Router
│   ├── auth/              # Páginas de autenticación
│   └── dashboard/         # Dashboards (admin y usuario)
├── components/            # Componentes React
├── lib/                   # Utilidades y clientes
├── backend/
│   └── ChatBot.Api/       # API en C# (.NET 9)
│       ├── Domain/        # Modelos de dominio
│       ├── Infrastructure/ # Servicios e implementaciones
│       └── Endpoints/     # Endpoints de la API
└── public/               # Assets estáticos
```

---

## 🔐 Variables de Entorno

### Frontend (Next.js)
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública de Supabase | `eyJ...` |
| `NEXT_PUBLIC_API_URL` | URL del backend API | `https://api.onrender.com` |

### Backend (C#)
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `SUPABASE_URL` | URL de tu proyecto Supabase | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave service role de Supabase | `eyJ...` (diferente al anon) |
| `ASPNETCORE_ENVIRONMENT` | Entorno de ejecución | `Production` |

---

## 🚨 Importante

- **NUNCA** expongas `SUPABASE_SERVICE_ROLE_KEY` en el frontend
- Las variables que empiezan con `NEXT_PUBLIC_` son públicas
- El backend usa `service_role` para operaciones admin
- El frontend usa `anon` key para operaciones de usuario

---

## 📚 Tecnologías

- **Frontend**: Next.js 15, React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: .NET 9, C#, Minimal APIs
- **Base de datos**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Deploy**: Vercel (frontend), Render (backend), Supabase (DB)

---

## 📝 Checklist de Deploy

- [ ] Proyecto Supabase creado
- [ ] Tablas creadas en Supabase
- [ ] Variables de entorno configuradas en Render
- [ ] Backend desplegado en Render
- [ ] Variables de entorno configuradas en Vercel
- [ ] Frontend desplegado en Vercel
- [ ] Probado login/registro
- [ ] Probado crear cita
- [ ] Probado chatbot

---

## 🐛 Troubleshooting

**Error: CORS en el API**
- Asegúrate de que el backend tenga configurado CORS para tu dominio de Vercel

**Error: Cannot connect to Supabase**
- Verifica que las URLs y keys sean correctas
- Checa que las tablas existan en Supabase

**Error: 404 en rutas de Next.js**
- Verifica que `vercel.json` esté configurado correctamente

---

## 📧 Soporte

Si tienes problemas, revisa:
1. Los logs en Render (backend)
2. Los logs en Vercel (frontend)
3. La consola del navegador (frontend)
4. Los logs de Supabase

---

¡Buena suerte con tu deploy! 🚀
