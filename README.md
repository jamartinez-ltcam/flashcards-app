# 📚 Flashcards

App de flashcards multiusuario para estudiar inglés, historia u otras asignaturas. Pensada para uso familiar: cada persona tiene su propio usuario y su propio progreso sobre las mismas fichas.

## Funcionalidades

- Multiusuario con login (usuario/contraseña). Roles **Administrador** (gestiona contenido y usuarios) y **Hija/o** (solo estudia).
- Áreas de conocimiento (asignaturas) con temas dentro de cada una.
- Modo estudio: ficha con pregunta/respuesta (toca para voltear), botones "Lo sé" / "Aún no". Las fichas falladas vuelven a aparecer en la misma sesión.
- Progreso por usuario y tema: contador de sabidas/repasando/nuevas, gráfico de evolución de los últimos 14 días.
- Reset de una ficha individual o de todas las sabidas de un tema (para repasar de nuevo).
- Panel de administración: crear/eliminar asignaturas, temas y fichas; crear usuarios y cambiar contraseñas.

## Stack técnico

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Prisma 7** como ORM, con SQLite en desarrollo local y PostgreSQL en producción
- **Auth.js (NextAuth v5)** con proveedor de credenciales (usuario/contraseña) y contraseñas cifradas con bcrypt
- **Tailwind CSS 4**
- **Recharts** para el gráfico de evolución

## Desarrollo local

No requiere Docker ni instalar Postgres: usa un fichero SQLite local.

```bash
npm install
npx prisma migrate dev   # crea prisma/dev.db (ya ejecutado en este proyecto)
npx prisma db seed       # crea el usuario admin y datos de ejemplo de Inglés
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Usuario de administrador por defecto

El seed crea:

- **Usuario:** `papa`
- **Contraseña:** `cambiar123`

Cambia esta contraseña cuanto antes desde **Administración → Usuarios**, y crea ahí las cuentas de tus hijas.

## Estructura del proyecto

```
prisma/schema.prisma        Modelo de datos (User, Subject, Topic, Flashcard, CardProgress, ReviewLog)
prisma/seed.ts               Datos de ejemplo (admin + Inglés/Vocabulario básico)
src/auth.ts                  Configuración de Auth.js (Credentials + JWT)
src/lib/db.ts                Cliente Prisma (elige adapter SQLite o Postgres según DATABASE_URL)
src/lib/dal.ts                Comprobación de sesión/rol (requireUser, requireParent)
src/lib/queries.ts           Lecturas: progreso por asignatura/tema, cola de estudio, histórico
src/lib/actions/study.ts     Mutaciones de estudio: marcar ficha, resetear ficha, resetear sabidas
src/lib/actions/admin.ts     Mutaciones de administración: CRUD de asignaturas/temas/fichas/usuarios
src/app/login                Página de login
src/app/(app)                Rutas protegidas: dashboard, asignaturas, estudio, progreso, admin
```

## Desplegar en producción (Vercel + Neon Postgres)

El proyecto está preparado para producción con Postgres, pero en desarrollo usa SQLite para no requerir instalar nada. Pasos para pasar a producción:

1. **Crea una base de datos Postgres gratuita en [Neon](https://neon.tech)** (u otro proveedor Postgres) y copia su connection string.

2. **Cambia el proveedor del datasource** en `prisma/schema.prisma`:

   ```prisma
   datasource db {
     provider = "postgresql"
   }
   ```

3. **Borra las migraciones de SQLite y crea las de Postgres** (son incompatibles entre motores):

   ```bash
   rm -rf prisma/migrations
   DATABASE_URL="postgresql://...tu-connection-string..." npx prisma migrate dev --name init
   ```

4. **En Vercel**, crea el proyecto a partir de este repositorio y configura las variables de entorno:
   - `DATABASE_URL` → la connection string de Neon
   - `AUTH_SECRET` → genera una nueva con `npx auth secret` (no reutilices la de desarrollo)

5. Despliega. En el primer deploy, ejecuta el seed contra la base de producción si quieres los datos de ejemplo:

   ```bash
   DATABASE_URL="postgresql://...tu-connection-string..." npx prisma db seed
   ```

   Cambia la contraseña del usuario `papa` inmediatamente después desde Administración.

El código de `src/lib/db.ts` ya detecta si `DATABASE_URL` es Postgres o SQLite y usa el driver adapter correcto, así que no hace falta tocar nada más.
