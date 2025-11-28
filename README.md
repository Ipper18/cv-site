# CV Site

Personal CV/portfolio built with Next.js (App Router), Tailwind CSS, and Prisma. It exposes two entry points:

- `/cv` - read-only CV view rendered from the database (falls back to bundled seed data only when the database is empty).
- `/cv-admin` - password-protected admin area with forms for all CV entities.
- Images are served from `public/images` (picked from dropdowns in `/cv-admin`, no external URLs required).

## Tech Stack

- Next.js 16 App Router + React 19
- Tailwind CSS v4 for styling
- Prisma ORM targeting SQLite locally (schema stays Postgres-compatible)
- Simple session auth with username/password + HTTP-only cookie
- Dockerfile ready for Coolify (`npm run start` on port 3000)

## Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Create `.env`**
   ```bash
   cp .env.example .env
   ```
   Populate:
   - `DATABASE_URL` – defaults to `file:./prisma/dev.db` for SQLite.
   - `ADMIN_USERNAME` and `ADMIN_PASSWORD` – required for seeding & login.
   - `SESSION_TTL_HOURS` – optional (defaults to 24 hours).
3. **Prepare the database**
   ```bash
   npx prisma migrate dev --name init     # creates SQLite db + schema
   npm run prisma:seed                    # seeds preview CV data + admin user
   ```
4. **Run the app**
   ```bash
   npm run dev
   ```
   - `/cv` shows the public CV.
   - `/cv-admin` prompts for the seeded credentials.
   - Drop your photos/screens into `public/images` so they appear in the admin dropdowns.

## Admin Credentials

`npm run prisma:seed` creates/updates the admin user with the credentials defined in `.env`. Re-run the seed command whenever you want to rotate the password during development.

## Prisma & Databases

- The schema is authored against SQLite for a frictionless local DX.
- It only uses types/features compatible with Postgres. To deploy on Postgres (e.g., inside Coolify):
  1. Set `DATABASE_URL` to your Postgres connection string.
  2. Update `datasource db { provider = "postgresql" }` inside `prisma/schema.prisma`.
  3. Run `npm run prisma:migrate` (or `prisma migrate deploy`) in the deployment environment before starting the server.

Helpful commands:
```
npm run prisma:generate   # regenerate Prisma client
npm run prisma:push       # push schema without migrations (dev only)
npm run prisma:seed       # seed preview data + admin user
```

## Docker / Coolify

The included `Dockerfile` performs a multi-stage build:
1. Install dependencies with `npm ci`.
2. Build the Next.js project and prune dev dependencies.
3. Copy the production artifacts into a slim Node.js 20 runtime and start with `npm run start` on port `3000`.

In Coolify, provide at least the following environment variables:
- `DATABASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `SESSION_TTL_HOURS` (optional)

Run `npx prisma migrate deploy && npm run prisma:seed` as part of your deployment workflow to ensure the database schema and starter content exist before the app starts.

## Auth & Sessions

- Login happens entirely server-side via a server action.
- Sessions live in the `Session` table; `SESSION_TTL_HOURS` controls expiration.
- Logout clears the record and the HTTP-only cookie.

## Images

- All photos (profile + project galerie) must live in `public/images`. Add files to that folder and select them in `/cv-admin` from dropdown lists.
- Existing external URLs will show as “(missing)” until you add the file; pick a local file and save to update.

## Project Structure Highlights

```
prisma/              Prisma schema + seed script
src/app/cv           Public CV route
src/app/cv-admin     Admin dashboard + login + actions
src/lib              Prisma client, auth helpers, seed data, utils
src/components       Reusable client/server components
Dockerfile           Multi-stage build for Coolify
```

## Next Steps

- Update the preview content from `/cv-admin` once real data is available.
- Configure Coolify to run database migrations + seeding before starting the container.
- Replace SQLite with Postgres in production following the steps above.

## UI Highlights
- Responsive two-column CV layout with sticky profile card, soft gray palette, and teal accent interactions.
- Project cards open a URL-driven drawer (`/cv?project=slug`) with long description, tech tags, links, and gallery images.
- Hover microinteractions (scale + shadow) and fade-in sections provide subtle motion without heavy libraries.
- Sticky language toggle with circular flags (PL/EN) and per-locale date formatting (PL uses Polish month names).
- Floating scroll-to-top button available on every page.

## Admin Panel
- Tabbed dashboard covering Personal Info, Education, Skills, Experience, and Projects.
- Projects tab manages slugs, descriptions, tech stack, plus nested link/image tables with ordering controls.
- All changes invalidate `/cv` instantly; credentials stay sourced from env vars only.
- Image fields are dropdowns populated from `public/images`, making deploys self-contained (Coolify-friendly).
