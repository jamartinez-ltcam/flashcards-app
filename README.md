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
- **Prisma 7** como ORM, con PostgreSQL (Neon)
- **Auth.js (NextAuth v5)** con proveedor de credenciales (usuario/contraseña) y contraseñas cifradas con bcrypt
- **Tailwind CSS 4**
- **Recharts** para el gráfico de evolución

## Desarrollo local

Necesita un `.env` con la connection string de Postgres (Neon) y un secreto de Auth.js:

```
DATABASE_URL="postgresql://...":
AUTH_SECRET="..."
```

```bash
npm install
npx prisma migrate dev   # aplica las migraciones a la base de datos
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
src/lib/db.ts                Cliente Prisma (Postgres vía @prisma/adapter-pg)
src/lib/dal.ts                Comprobación de sesión/rol (requireUser, requireParent)
src/lib/queries.ts           Lecturas: progreso por asignatura/tema, cola de estudio, histórico
src/lib/actions/study.ts     Mutaciones de estudio: marcar ficha, resetear ficha, resetear sabidas
src/lib/actions/admin.ts     Mutaciones de administración: CRUD de asignaturas/temas/fichas/usuarios
src/app/login                Página de login
src/app/(app)                Rutas protegidas: dashboard, asignaturas, estudio, progreso, admin
```

## Desplegar en producción (Vercel + Neon Postgres)

1. **Base de datos**: proyecto Postgres gratuito en [Neon](https://neon.tech); copia su connection string.

2. **Migraciones y seed** contra la base de producción:

   ```bash
   DATABASE_URL="postgresql://...tu-connection-string..." npx prisma migrate deploy
   DATABASE_URL="postgresql://...tu-connection-string..." npx prisma db seed
   ```

3. **En Vercel**, importa este repositorio y configura las variables de entorno (imprescindible, el build falla sin ellas):
   - `DATABASE_URL` → la connection string de Neon
   - `AUTH_SECRET` → genera una con `openssl rand -base64 32` (no reutilices la de desarrollo)

4. Despliega. Cambia la contraseña del usuario `papa` inmediatamente después desde Administración → Usuarios.
