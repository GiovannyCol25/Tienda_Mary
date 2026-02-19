# Tienda Mary

Proyecto Next.js sencillo para gestionar productos (API y frontend) — plantilla personal.

## Resumen
- Stack: Next.js (app router), TypeScript, Prisma, Node.
- Ubicación del código: `src/`.

## Requisitos
- Node 18+ (recomendado)
- pnpm, npm o yarn

## Instalación
1. Instalar dependencias:

```bash
npm install
# o: pnpm install
# o: yarn
```

2. Configurar variables de entorno:

 - Copia `.env.example` a `.env` (si existe) o crea `.env` con las variables necesarias.
 - No subir `.env` a GitHub.

Variables típicas:

- `DATABASE_URL` (Prisma)
- `NEXT_PUBLIC_...` para variables públicas

## Base de datos (Prisma)

 - Esquema en `prisma/schema.prisma`.
 - Crear migraciones / aplicar cambios:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Ejecutar en desarrollo

```bash
npm run dev
# o: pnpm dev
# o: yarn dev
```

## Construir para producción

```bash
npm run build
npm run start
```

## API

Documentación rápida de los endpoints en `docs/API.md`.

Rutas principales:

- `GET /api/productos` — listar productos (parámetros: `query`/`q`, `categoria`, `proveedor`).
- `POST /api/productos` — crear producto (body JSON validado con Zod).
- `GET /api/productos/:id` — obtener producto por id.
- `PATCH /api/productos/:id` — actualizar parcialmente.
- `DELETE /api/productos/:id` — eliminar.

## Buenas prácticas antes de subir

- Asegúrate de que `.gitignore` excluye archivos sensibles (ya actualizado).
- No subir bases de datos locales (`/prisma/dev.db`) ni `.env`.

## Subir a GitHub (comandos sugeridos)

```bash
# inicializar repositorio (si no lo hiciste)
git init
git add .
git commit -m "chore: agregar README y documentación básica"
# añadir remote (reemplaza URL)
git remote add origin https://github.com/tu-usuario/tu-repo.git
git branch -M main
git push -u origin main
```

---

Si quieres, puedo:

- Ejecutar `git status` aquí y mostrar archivos no trackeados.
- Crear el commit y, si me proporcionas la URL remota, añadir `origin` y hacer `git push`.
