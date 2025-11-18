# Chatbot Full Stack - Next.js + C# + Supabase

Sistema de gestión de citas con chatbot inteligente.

## 🚀 Quick Start - Deploy Completo

**Lee el archivo [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones detalladas paso a paso.**

### Resumen rápido:

1. **Supabase** (Base de datos en la nube)
   - Crea proyecto en [supabase.com](https://supabase.com)
   - Ejecuta el SQL para crear tablas (ver DEPLOYMENT.md)
   - Copia URL y keys

2. **Render** (Backend C#)
   - Conecta tu repo de GitHub
   - Root Directory: `backend/ChatBot.Api`
   - Runtime: Docker
   - Configura variables de entorno

3. **Vercel** (Frontend Next.js)
   - Conecta tu repo de GitHub
   - Configura variables de entorno
   - Deploy automático

## 📋 Variables de Entorno Necesarias

### Para Vercel (Frontend):
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
NEXT_PUBLIC_API_URL=https://tu-api.onrender.com
```

### Para Render (Backend):
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
ASPNETCORE_ENVIRONMENT=Production
```

## 🛠️ Desarrollo Local

```bash
# 1. Clonar repositorio
git clone https://github.com/CiaphasC/chatbot-csharp.git
cd chatbot-csharp

# 2. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus valores de Supabase

# 3. Instalar dependencias
npm install

# 4. Correr backend (terminal 1)
cd backend/ChatBot.Api
dotnet run

# 5. Correr frontend (terminal 2)
npm run dev
```

## 📚 Tecnologías

- **Frontend**: Next.js 15, React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: .NET 9, C#, Minimal APIs
- **Base de datos**: Supabase (PostgreSQL)
- **Deploy**: Vercel + Render + Supabase

## 📖 Documentación

- [Guía Completa de Deploy](./DEPLOYMENT.md) - **⭐ EMPIEZA AQUÍ**
- [Backend README](./backend/ChatBot.Api/README.md)

## 🏗️ Estructura del Proyecto

```
├── app/                    # Next.js App Router
├── components/            # Componentes React
├── lib/                   # Utilidades
├── backend/ChatBot.Api/   # Backend C# API
└── DEPLOYMENT.md          # 📘 Guía de deploy completa
```

---

**¿Listo para deployar?** → Lee [DEPLOYMENT.md](./DEPLOYMENT.md) 🚀
