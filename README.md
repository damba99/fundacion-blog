# Fundación Noticias — MVP Blog de Noticias

Blog de noticias con panel de administración, construido con Next.js (App Router + API routes) y SQLite vía Prisma. Pensado para desplegarse en un hosting administrado tipo Node.js (deploy desde GitHub, sin acceso SSH ni configuración de servidor).

## Stack

- **Next.js** (App Router, TypeScript) — frontend y backend (API routes) en un solo proyecto
- **Prisma + SQLite** — persistencia simple para el MVP, con posibilidad de migrar a PostgreSQL cambiando el `provider` y el `DATABASE_URL`
- **Tiptap** — editor de texto enriquecido (negrita, cursiva, subrayado, listas, títulos, enlaces)
- **Tailwind CSS v4** — estilos, con tokens de diseño (colores/tipografía) centralizados en `src/app/globals.css`
- **JWT + cookie httpOnly** — sesión de admin (sin NextAuth, innecesario para 1-2 admins)
- **Zod** — validación de inputs en las API routes

## Setup local

```bash
npm install
cp .env.example .env
npm run db:migrate   # crea la base SQLite y aplica el schema (corre el seed automáticamente)
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) para el sitio público y [http://localhost:3000/admin/login](http://localhost:3000/admin/login) para el panel de administración.

## Variables de entorno

Ver `.env.example`. Las importantes:

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Ruta del archivo SQLite (`file:./prisma/dev.db`) |
| `SEED_ADMIN_USER` / `SEED_ADMIN_PASSWORD` | Credenciales del admin que crea `prisma/seed.ts` |
| `JWT_SECRET` | Secreto para firmar la sesión de admin |

> ⚠️ **El seed crea un admin `admin`/`admin` si no se definen estas variables.** Es exclusivamente para desarrollo. Antes de pasar a producción, definí `SEED_ADMIN_USER`, `SEED_ADMIN_PASSWORD` y `JWT_SECRET` con valores fuertes y únicos como variables de entorno del hosting (nunca hardcodeados en el repo).

## Decisiones técnicas

- **Captura de IP**: `src/lib/ip.ts` lee `x-forwarded-for` (primer valor) con fallback a `x-real-ip`, porque el hosting gestionado coloca la app detrás de un proxy/load balancer.
- **Imágenes**: se guardan en `public/uploads` (filesystem local), aislado en `src/lib/storage.ts`. **Riesgo conocido**: en muchos hostings gestionados el filesystem no persiste entre deploys/redeploys — si eso ocurre en el hosting elegido, las imágenes subidas se pierden al redeployar. Para producción real, considerar migrar `saveImage()` a un storage externo (S3, Cloudinary, etc.) sin tocar el resto del código.
- **Auth de admin**: JWT propio en cookie httpOnly (`src/lib/auth.ts`), sin procesos en background. El proxy de Next.js (`src/proxy.ts`) protege las rutas `/admin/*`; cada API route valida la sesión con `getAdminSession()`.
- **Sin workers ni procesos persistentes**: todo corre dentro del ciclo request/response de Next.js, compatible con hosting que solo ejecuta `npm run build` + `npm start`.

## Estructura

```
prisma/          # schema, migraciones, seed
src/app/          
  (site)/        # vistas públicas (home, noticias, detalle)
  admin/          
    login/        # login (fuera del guard)
    (dashboard)/  # páginas protegidas (métricas, noticias, categorías, comentarios, usuarios)
  api/            # API routes (backend)
src/components/   # public/, admin/, ui/
src/lib/          # prisma, auth, ip, storage, excerpt, slug, validation, metricas
```

## Notas de despliegue

- El build (`npm run build`) requiere que `DATABASE_URL` apunte a una base SQLite accesible en runtime; si el filesystem del hosting no persiste, considerar migrar a PostgreSQL (cambiar `provider` en `prisma/schema.prisma` y el `DATABASE_URL`).
- Correr `npx prisma migrate deploy` (no `migrate dev`) como parte del proceso de deploy para aplicar migraciones en producción.
- El seed de admin (`npm run db:seed`) es idempotente (usa `upsert`), pero solo debería correrse una vez con credenciales reales en producción.
