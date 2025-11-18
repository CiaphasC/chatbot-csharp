# 🚀 Guía de Deploy con Supabase CLI

## 📦 Instalación de Supabase CLI

### Windows (PowerShell)
```powershell
# Usando Scoop
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# O usando npm
npm install -g supabase
```

### Verificar instalación
```bash
supabase --version
```

---

## 🔐 Login a Supabase

```bash
supabase login
```

Esto abrirá tu navegador para autenticarte.

---

## 🔗 Conectar al Proyecto Remoto

```bash
# Conectar al proyecto existente
supabase link --project-ref bpyrbjlbbuwyajpihunl
```

Te pedirá la contraseña de la base de datos que creaste: `82eZO8YjmrWKJHtj`

---

## 📤 Subir las Migraciones

```bash
# Ver el estado actual
supabase db remote status

# Subir todas las migraciones al proyecto remoto
supabase db push
```

Esto ejecutará automáticamente todos los archivos en `supabase/migrations/` en orden.

---

## ✅ Verificar que todo funcionó

```bash
# Ver el estado de las migraciones
supabase migration list
```

---

## 🔄 Comandos Útiles

### Ver diferencias entre local y remoto
```bash
supabase db diff
```

### Crear una nueva migración
```bash
supabase migration new nombre_de_la_migracion
```

### Resetear la base de datos local
```bash
supabase db reset
```

### Ejecutar una migración específica
```bash
supabase migration up
```

---

## 📊 Acceso a la Base de Datos

### Abrir Supabase Studio localmente
```bash
supabase start
```

Esto inicia un entorno local completo en http://localhost:54323

### Ver logs
```bash
supabase logs
```

---

## 🎯 Comandos Rápidos - Deployment Completo

```bash
# 1. Login
supabase login

# 2. Conectar al proyecto
supabase link --project-ref bpyrbjlbbuwyajpihunl

# 3. Subir migraciones
supabase db push

# 4. Verificar
supabase migration list
```

---

## 📝 Notas Importantes

- ✅ Tu proyecto ID: `bpyrbjlbbuwyajpihunl`
- ✅ URL: `https://bpyrbjlbbuwyajpihunl.supabase.co`
- ✅ Password DB: `82eZO8YjmrWKJHtj`
- ✅ Las migraciones se ejecutan en orden por timestamp
- ✅ Una vez subidas, las migraciones no se pueden editar (solo agregar nuevas)

---

## 🐛 Troubleshooting

### Error: "Project not found"
```bash
supabase projects list
```

### Error: "Migration already applied"
Las migraciones ya están en el servidor, todo está bien.

### Ver el SQL que se ejecutará
```bash
supabase db diff --use-migra
```

---

## 🔑 Obtener las Keys del Proyecto

Después de subir las migraciones:

1. Ve a https://supabase.com/dashboard/project/bpyrbjlbbuwyajpihunl/settings/api
2. Copia:
   - **URL**: https://bpyrbjlbbuwyajpihunl.supabase.co ✅ (ya lo tienes)
   - **anon public**: ✅ (ya lo tienes)
   - **service_role**: Necesitas esto para el backend

---

¡Listo para deployar! 🚀
