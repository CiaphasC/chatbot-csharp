# 📧 Configuración de Edge Function: notify-approval

## ✅ Estado Actual

El edge function `notify-approval` ha sido desplegado exitosamente a Supabase.

**URL del Edge Function:**
```
https://bpyrbjlbbuwyajpihunl.supabase.co/functions/v1/notify-approval
```

---

## 🔑 Variables de Entorno Requeridas

Para que el edge function funcione, necesitas configurar estos secrets:

### 1. RESEND_API_KEY

**Obtener tu API Key de Resend:**

1. Ve a https://resend.com
2. Crea una cuenta gratuita
3. Ve a **API Keys** en el dashboard
4. Crea una nueva API key
5. Copia la key (empieza con `re_...`)

**Configurar en Supabase:**
```bash
supabase secrets set RESEND_API_KEY=re_tu_api_key_aqui
```

### 2. FROM_EMAIL

El email desde el cual se enviarán las notificaciones.

**Para desarrollo/pruebas:**
Puedes usar el dominio de prueba de Resend:
```bash
supabase secrets set FROM_EMAIL=onboarding@resend.dev
```

**Para producción:**
1. Verifica tu dominio en Resend
2. Usa tu email verificado:
```bash
supabase secrets set FROM_EMAIL=noreply@tudominio.com
```

---

## 🚀 Cómo Usar el Edge Function

### Desde el Backend C#

El edge function se invoca automáticamente cuando un admin aprueba a un usuario.

```csharp
// Ejemplo: Llamar al edge function después de aprobar
var client = new HttpClient();
var payload = new { email = "usuario@gmail.com", full_name = "Juan Pérez" };
var response = await client.PostAsJsonAsync(
    "https://bpyrbjlbbuwyajpihunl.supabase.co/functions/v1/notify-approval",
    payload,
    new { Headers = { { "Authorization", $"Bearer {serviceRoleKey}" } } }
);
```

### Probar Manualmente

```bash
curl -X POST \
  https://bpyrbjlbbuwyajpihunl.supabase.co/functions/v1/notify-approval \
  -H "Authorization: Bearer TU_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","full_name":"Test User"}'
```

---

## 📊 Ver Logs del Edge Function

```bash
# Ver logs en tiempo real
supabase functions logs notify-approval

# Ver logs del último deploy
supabase functions logs notify-approval --tail
```

O en el dashboard:
https://supabase.com/dashboard/project/bpyrbjlbbuwyajpihunl/functions/notify-approval/logs

---

## 🔄 Actualizar el Edge Function

Si haces cambios en el código:

```bash
# Redeploy
supabase functions deploy notify-approval

# O con custom import map
supabase functions deploy notify-approval --import-map supabase/functions/import_map.json
```

---

## 📝 Verificar Configuración

```bash
# Ver todos los secrets
supabase secrets list

# Ver el estado del function
supabase functions list
```

---

## 🐛 Troubleshooting

### Error: "RESEND_API_KEY not found"
- Verifica que configuraste el secret: `supabase secrets list`
- Redeploy el function después de configurar: `supabase functions deploy notify-approval`

### Error: "Email inválido o no es Gmail"
- El edge function solo acepta emails @gmail.com
- Modifica la validación en `index.ts` si necesitas otros dominios

### Error: "Error enviando correo"
- Verifica tu API key de Resend
- Verifica que el dominio esté verificado (para emails de producción)
- Revisa los logs: `supabase functions logs notify-approval`

---

## 💡 Plan Gratuito de Resend

- **100 emails/día** gratis
- Perfecto para desarrollo y proyectos pequeños
- Para más emails, considera un plan pago

---

## 📚 Recursos

- [Resend Documentation](https://resend.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Edge Function Logs](https://supabase.com/dashboard/project/bpyrbjlbbuwyajpihunl/functions/notify-approval/logs)

---

**Status: ✅ Desplegado - Pendiente configurar secrets**
