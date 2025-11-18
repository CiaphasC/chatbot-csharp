# 🚀 GUÍA RÁPIDA DE DEPLOYMENT - 3 PASOS

## ✅ CHECKLIST DE DEPLOYMENT

### 📍 PASO 1: SUPABASE (Base de Datos) 
**Tiempo estimado: 10 minutos**

1. Ve a https://supabase.com
2. Click en "Start your project" / "New Project"
3. Crea un nuevo proyecto:
   - Nombre: `chatbot-app` (o el que quieras)
   - Database Password: Crea una contraseña segura (guárdala!)
   - Region: Elige la más cercana a ti
4. Espera 2-3 minutos a que se cree el proyecto
5. Ve a **SQL Editor** (icono </> en la barra lateral)
6. Click en "New query"
7. Copia TODO el contenido del archivo `supabase/schema.sql` y pégalo
8. Click en "Run" (botón verde abajo a la derecha)
9. Ve a **Settings** → **API** (icono de engranaje)
10. Copia estos 3 valores importantes:

```
URL del proyecto:
https://xxxxxxxxxxxxx.supabase.co

anon public key:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...

service_role key (¡NO LA EXPONGAS!):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...
```

✅ **SUPABASE LISTO**

---

### 📍 PASO 2: RENDER (Backend C#)
**Tiempo estimado: 15 minutos**

1. Ve a https://render.com
2. Click en "Get Started" / "Sign Up"
3. Conecta tu cuenta de GitHub
4. En el Dashboard, click en **New** → **Web Service**
5. Busca y selecciona tu repositorio: `chatbot-csharp`
6. Click en "Connect"
7. Configura el servicio:

```
Name: chatbot-api
Region: Oregon (US West) o el más cercano a ti
Branch: main
Root Directory: backend/ChatBot.Api
Runtime: Docker
Instance Type: Free
```

8. Expande "Advanced" y agrega las **Environment Variables**:

```
Variable                       | Value
-------------------------------|----------------------------------------
SUPABASE_URL                   | Pega el URL de Supabase del paso 1
SUPABASE_SERVICE_ROLE_KEY      | Pega el service_role key del paso 1
ASPNETCORE_ENVIRONMENT         | Production
```

9. Click en **Create Web Service**
10. Espera 5-10 minutos a que se despliegue (verás logs en tiempo real)
11. Cuando veas "Build succeeded" y "Deploy live", copia la URL:

```
URL del API:
https://chatbot-api-xxxx.onrender.com
```

✅ **BACKEND LISTO**

---

### 📍 PASO 3: VERCEL (Frontend Next.js)
**Tiempo estimado: 10 minutos**

1. Ve a https://vercel.com
2. Click en "Sign Up" 
3. Selecciona "Continue with GitHub"
4. Autoriza Vercel para acceder a tu GitHub
5. En el Dashboard, click en **Add New...** → **Project**
6. Busca y selecciona `chatbot-csharp`
7. Click en **Import**
8. Configura el proyecto:

```
Framework Preset: Next.js (se detecta automáticamente)
Root Directory: ./ (dejar por defecto)
Build Command: npm run build (se detecta automáticamente)
Output Directory: .next (se detecta automáticamente)
Install Command: npm install (se detecta automáticamente)
```

9. Expande **Environment Variables** y agrega:

```
Variable                          | Value
----------------------------------|----------------------------------------
NEXT_PUBLIC_SUPABASE_URL          | Pega el URL de Supabase del paso 1
NEXT_PUBLIC_SUPABASE_ANON_KEY     | Pega el anon public key del paso 1
NEXT_PUBLIC_API_URL               | Pega el URL del API de Render del paso 2
```

10. Click en **Deploy**
11. Espera 2-3 minutos a que se despliegue
12. Cuando veas "Congratulations!", tu app está lista:

```
URL de tu aplicación:
https://chatbot-csharp-xxxx.vercel.app
```

✅ **FRONTEND LISTO**

---

## 🎉 ¡DEPLOYMENT COMPLETO!

Tu aplicación está ahora en producción con:
- ✅ Base de datos en Supabase
- ✅ Backend API en Render
- ✅ Frontend en Vercel

### 🧪 Prueba tu aplicación

1. Abre la URL de Vercel en tu navegador
2. Click en "Sign Up" para crear una cuenta
3. Registra un usuario nuevo
4. Inicia sesión
5. Prueba crear una cita
6. Prueba el chatbot

---

## 📊 MONITOREO Y LOGS

### Ver logs del backend (Render)
1. Ve a https://dashboard.render.com
2. Click en tu servicio "chatbot-api"
3. Click en "Logs" (parte superior)

### Ver logs del frontend (Vercel)
1. Ve a https://vercel.com/dashboard
2. Click en tu proyecto
3. Click en la última deployment
4. Click en "Runtime Logs"

### Ver datos en Supabase
1. Ve a https://supabase.com/dashboard
2. Click en tu proyecto
3. Click en "Table Editor" para ver los datos

---

## 🐛 SOLUCIÓN DE PROBLEMAS COMUNES

### Error: "Failed to fetch" en el frontend
- Revisa que NEXT_PUBLIC_API_URL esté correcto en Vercel
- Verifica que el backend esté funcionando (URL de Render)

### Error: "Invalid JWT" o "Unauthorized"
- Verifica que las keys de Supabase sean correctas
- Asegúrate de usar `anon` key en el frontend
- Asegúrate de usar `service_role` key en el backend

### Error: "CORS policy" en el navegador
- El backend ya tiene CORS configurado
- Verifica que el dominio de Vercel esté permitido

### El backend no despliega en Render
- Revisa los logs de build en Render
- Verifica que el Dockerfile esté en `backend/ChatBot.Api/`
- Asegúrate de que Root Directory sea `backend/ChatBot.Api`

---

## 🔄 ACTUALIZAR LA APLICACIÓN

Cuando hagas cambios en el código:

1. Haz commit de tus cambios:
```bash
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

2. **Vercel** se actualizará automáticamente (1-2 minutos)
3. **Render** se actualizará automáticamente (5-10 minutos)

---

## 💡 TIPS

- Los deploys gratuitos de Render se duermen después de 15 minutos de inactividad
- La primera request después de inactividad puede tardar 30-60 segundos
- Vercel tiene límites de 100GB de bandwidth al mes en el plan gratuito
- Supabase tiene límite de 500MB de DB en el plan gratuito

---

## 📞 ¿NECESITAS AYUDA?

- Logs de Render: https://dashboard.render.com
- Logs de Vercel: https://vercel.com/dashboard
- Supabase Dashboard: https://supabase.com/dashboard
- Documentación completa: Ver `DEPLOYMENT.md`

---

**¡Buena suerte! 🚀**
