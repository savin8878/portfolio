# Technical Documentation — new-fullstack-akash (updated 2026-03-19)

## 1. System Overview
Full-stack personal portfolio plus lightweight CMS. Public pages are server-rendered with Next.js App Router; admin tools are client-heavy and talk to API routes that persist to a Neon-hosted PostgreSQL database.

## 2. Tech Stack
- Runtime: Next.js 16.1 (App Router) on Node 18+/20, React 19, TypeScript 5.7 (strict, noEmit).
- Styling/UI: Tailwind CSS v4, shadcn/ui (Radix primitives), Lucide icons, Lenis smooth scroll, Framer Motion, Recharts for charts.
- Forms/validation: react-hook-form, zod (available), @dnd-kit for drag/drop builders.
- Data: PostgreSQL (Neon serverless) via `@neondatabase/serverless`.
- Theming: next-themes (light/dark), dynamic palette persisted in DB.

## 3. Architecture
```
Browser
  ├─ Public pages (Server Components)
  │    └─ lib/data.ts → PostgreSQL (SSR; no client fetch)
  ├─ Admin UI (Client Components)
  │    └─ fetch() → /api/admin/* → PostgreSQL
  └─ Contact form
       └─ POST /api/contact → PostgreSQL
```

## 4. Directory Map
- `app/` — App Router routes. Public: `/`, `/about`, `/projects`, `/projects/[slug]`, `/services`, `/blog`, `/blog/[slug]`, `/contact`. Admin: `/admin` dashboard plus CRUD sub-routes; API routes under `app/api`.
- `components/` — Shared UI. `components/admin/*` (forms, builders, dashboard widgets), `components/sections/*` (homepage blocks), `components/ui/*` (shadcn primitives), layout pieces (`navbar`, `footer`, `theme-provider`, `scroll-provider`, `animated-background`).
- `lib/` — `db.ts` (Neon client + TS table types), `data.ts` (server-side queries), `utils.ts` (slug + className helpers), `icon-map.ts` (maps string names to Lucide icons).
- `hooks/` — `use-mobile`, `use-toast`.
- `scripts/` — SQL schema and seed files (`001-create-tables.sql`, `002-seed-data.sql`, `003-create-section-content.sql`, `004-create-section-visibility.sql`, `create-form-fields-table.sql`).
- `styles/` — Tailwind globals, tokens.

## 5. Data & Content Model (PostgreSQL)
24 tables provisioned by the SQL scripts:
- Site/theme: `site_settings`, `theme_settings`, `social_links`, `hero_section`.
- Portfolio: `project_categories`, `projects`, `services`, `testimonials`, `media_library`.
- Blog: `blog_categories`, `blog_posts`.
- Professional profile: `tech_stack`, `experiences`, `education`, `certifications`.
- Homepage UX: `client_logos`, `impact_metrics`, `process_steps`, `philosophy_items`.
- Interaction & admin: `contact_submissions`, `contact_form_fields`, `admin_users`.
- CMS structure: `section_content` (JSON per page/section), `section_visibility` (boolean toggles).

### Content/visibility controls
- `section_content` stores JSON blobs keyed by `page` + `section`. Seed covers hero/CTA copy for home and about pages. Admin Content Manager edits this via `/admin/content` → `app/api/admin/content`.
- `section_visibility` toggles sections per page; managed by `/admin/visibility` → `app/api/admin/visibility`.
- `contact_form_fields` powers the drag/drop Form Builder; POST replaces all rows.

## 6. Data Access Layer (`lib/data.ts`)
Server-only helpers that the pages import directly (no client fetch). Key groups:
- Site meta: `getSiteSettings`, `getHeroSection`, `getSocialLinks`.
- Home widgets: `getClientLogos`, `getImpactMetrics`, `getProcessSteps`, `getPhilosophyItems`.
- Portfolio: `getProjects`, `getFeaturedProjects`, `getProjectBySlug`, `getProjectCategories`.
- Services: `getServices`, `getFeaturedServices`, `getServiceBySlug`.
- Blog: `getBlogPosts`, `getFeaturedBlogPosts`, `getBlogPostBySlug`, `getBlogCategories`.
- Social proof: `getTestimonials`, `getFeaturedTestimonials`.
- Profile: `getTechStack`, `getExperiences`, `getEducation`, `getCertifications`.
- CMS utilities: `getSectionContent`, `getPageContent`, `getAllSectionContent`, `getPageVisibility`, `getAllSectionVisibility`.

## 7. API Surface (Next.js Route Handlers)
- Public
  - `POST /api/contact` — flexible field mapping → `contact_submissions`.
- Admin (no auth implemented)
  - Blog: `POST|PATCH /api/admin/blog`, `DELETE /api/admin/blog?id=...`.
  - Projects: `POST|PATCH /api/admin/projects`, `DELETE /api/admin/projects?id=...`.
  - Services: `POST|PATCH /api/admin/services`, `DELETE /api/admin/services?id=...` (auto-slug with `generateSlug`).
  - Testimonials: `POST|PATCH /api/admin/testimonials`, `DELETE /api/admin/testimonials?id=...`.
  - Contacts: `PATCH /api/admin/contacts`, `DELETE /api/admin/contacts`, bulk `PATCH|DELETE /api/admin/contacts/bulk`.
  - Settings: `POST /api/admin/settings` (upsert row id=1).
  - Form Builder: `GET|POST /api/admin/form-fields` (replace-all save).
  - Section content: `GET|POST|DELETE /api/admin/content`.
  - Visibility toggles: `GET|POST|PATCH /api/admin/visibility`.

## 8. Public UI Modules (selected)
- Home (`app/page.tsx`): hero, clients marquee, metrics counters, featured projects grid, philosophy cards, tech stack, process timeline, testimonials carousel, blog preview, CTA; visibility per section via `section_visibility`.
- About (`app/about/page.tsx`): biography hero, experience timeline, skills grid, CTA.
- Projects (`app/projects`): filterable list; `app/projects/[slug]` renders detail from `projects` table.
- Services (`app/services/page.tsx`): service cards with features/pricing; CTA.
- Blog (`app/blog` + `[slug]`): list and post detail (HTML stored content).
- Contact (`app/contact/page.tsx`): dynamic form built from `contact_form_fields`.

## 9. CMS/Admin Modules
- `AdminSidebar` + `AdminHeader` frame all `/admin/*` routes.
- Dashboard (`app/admin/page.tsx`): stats from DB + recent inquiries.
- BlogPostForm (`components/admin/blog-post-form.tsx`): block editor, word/character counts, SEO preview, publish/feature toggles.
- ProjectForm: CRUD for portfolio items incl. metrics JSON, tech stack multi-select.
- ServiceForm: CRUD with features list, pricing, ordering, featured flag.
- TestimonialForm: rating + project linkage.
- ContactsManager: table with status filters, bulk actions, notes.
- FormBuilder: drag/drop builder backed by `contact_form_fields`.
- MediaLibrary: placeholder upload manager (DB table exists).
- SiteSettingsForm: developer identity, contact info, social URLs.
- ThemeSettingsForm: palette, radius, fonts, dark mode.
- ContentManager: structured JSON editor for `section_content` with per-page schemas.
- VisibilityManager: batch toggles for `section_visibility`.

## 10. Styling, Animation, UX
- Tailwind v4 with `globals.css` for tokens; `utils.ts` exposes `cn`.
- Smooth scrolling via Lenis (`scroll-provider`), background flair via `animated-background`.
- Framer Motion and custom `scroll-animations` for fades/slides.
- Recharts is available for data viz (used in admin analytics hooks).

## 11. Configuration & Conventions
- Env: `DATABASE_URL` required (Neon connection string) in `.env`.
- `next.config.mjs`: TypeScript build errors are ignored; remote images allowed from any host.
- `tsconfig.json`: strict enabled; path alias `@/*`.
- Paths in imports use alias from project root.

## 12. Setup & Local Development
1) Install deps: `pnpm install` (lockfile present) or `npm install`.
2) Provision Postgres (Neon recommended) and set `DATABASE_URL` in `.env`.
3) Apply schema: run SQL files in order  
   - `scripts/001-create-tables.sql`  
   - `scripts/create-form-fields-table.sql`  
   - `scripts/003-create-section-content.sql`  
   - `scripts/004-create-section-visibility.sql`
4) Seed sample data: `scripts/002-seed-data.sql` (optional but populates UI).
5) Start dev server: `pnpm dev` → http://localhost:3000 (public), http://localhost:3000/admin (CMS).

## 13. Deployment Notes
- Works on Vercel/Next serverless with Neon; `@neondatabase/serverless` uses fetch-based driver (no TCP).
- Image optimization is disabled for external hosts; remotePatterns allow any HTTPS host.
- Ensure the build env mirrors `.env` (DATABASE_URL). Avoid checking `.env` into VCS.

## 14. Security Posture (current)
- **No authentication/authorization** on `/admin/*` pages or `/api/admin/*` routes.
- API rate limiting, CSRF protection, and input validation are minimal (basic required fields only).
- TypeScript build errors ignored in production config; could hide runtime issues.
- `.env` present in repo root; keep out of VCS and use environment secrets in deployment.

## 15. Known Gaps / Next Steps
1) Add auth (NextAuth.js or custom JWT/session) gating admin UI and API routes.
2) Harden APIs: schema validation (zod), rate limiting, CSRF tokens for mutations.
3) Improve media handling (storage, presigned uploads, mime/size validation).
4) Add tests (unit for lib/data, integration for APIs, Playwright for critical flows).
5) Enable TypeScript build checks (`ignoreBuildErrors: false`) and linting in CI.
6) Migrations: convert SQL files into versioned migrations (Prisma/Migrate or Drizzle).
