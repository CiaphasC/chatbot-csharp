# ChatBot API (C# Minimal API, .NET 9)

API mínima en .NET 9 lista para Render (backend) y Vercel (frontend). Incluye:
- Endpoints de clientes, servicios y citas con validación de solape (no reserva si la franja está ocupada).
- Endpoint de chat con proveedor mock, listo para cambiar a un LLM real (OpenAI/Azure, etc.).
- Almacén en memoria; reemplace por repositorios Supabase/Postgres cuando conectes la base de datos.

## Estructura
- `Program.cs`: registro de servicios y mapeo de endpoints.
- `Endpoints/ApiEndpoints.cs`: rutas `/api/*` (clientes, servicios, citas, chat).
- `Infrastructure/*`: store en memoria, servicio de citas (verifica solapes), proveedor de chat mock.
- `Domain/Models/*`: modelos base.
- `Dockerfile`: imagen .NET 9, puerto 8080.

## Variables de entorno sugeridas
- `SUPABASE_URL`: URL de Supabase (cuando migres).
- `SUPABASE_KEY`: Service role key (solo backend).
- `Chat:Provider`, `Chat:ApiKey`, `Chat:Endpoint`: para enrutar a tu proveedor de chat (mock por defecto).

## Desarrollo local
```bash
cd backend/ChatBot.Api
dotnet restore
dotnet run
# http://localhost:8080/health
```

## Despliegue en Render
1. Subir este directorio al repo.
2. Crear Web Service en Render usando Dockerfile, puerto interno 8080.
3. Definir env vars necesarias (SUPABASE_URL, SUPABASE_KEY, etc.).

## Para conectar con tu frontend
- Sustituye las llamadas mock del frontend Next por los endpoints:
  - `POST /api/appointments` (crea cita; si está ocupada, devuelve 400 con mensaje).
  - `GET /api/appointments?date=YYYY-MM-DD` (lista citas de un día).
  - Endpoints principales: `/api/clients`, `/api/services`, `/api/appointments`, `/api/chat`.
  - `POST /api/chat` (chat mock; cambia el proveedor para LLM real).
- Reemplaza el store en memoria (`AppDataStore`) por repos que apunten a Supabase/Postgres y conserva la lógica de solape en `AppointmentService`.
