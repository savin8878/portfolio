# Codebase Documentation — Akash Portfolio + CMS

## Overview

This is a **full-stack personal portfolio and content management system (CMS)** built with Next.js 15+ App Router. It serves two purposes:

1. **Public-facing portfolio** — showcasing projects, services, blog, and contact
2. **Admin dashboard** — a complete CMS to manage all content

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 (strict mode) |
| UI Library | React 19 + shadcn/ui |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion 11 |
| Smooth Scroll | Lenis |
| Drag & Drop | @dnd-kit |
| Forms | React Hook Form + Zod |
| Database | PostgreSQL via Neon (serverless) |
| Icons | Lucide React |
| Theme | next-themes (dark/light) |
| Charts | Recharts |

---

## Project Structure

```
new-fullstack-akash/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (theme + scroll providers)
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles
│   ├── about/page.tsx          # About page
│   ├── blog/
│   │   ├── page.tsx            # Blog listing
│   │   └── [slug]/page.tsx     # Blog post detail
│   ├── projects/
│   │   ├── page.tsx            # Projects listing
│   │   └── [slug]/page.tsx     # Project detail
│   ├── services/page.tsx       # Services page
│   ├── contact/page.tsx        # Contact page
│   ├── admin/                  # Admin dashboard (all CMS pages)
│   └── api/                    # REST API routes
│       ├── contact/route.ts    # Public contact form handler
│       └── admin/              # Admin CRUD endpoints
├── components/
│   ├── ui/                     # 40+ shadcn/ui base components
│   ├── admin/                  # Admin-specific components
│   ├── sections/               # Homepage section components
│   ├── about/                  # About page components
│   ├── blog/                   # Blog components
│   ├── projects/               # Projects components
│   ├── services/               # Services components
│   ├── contact/                # Contact components
│   └── layout/                 # Header and Footer
├── lib/
│   ├── db.ts                   # DB client + TypeScript type definitions
│   ├── data.ts                 # All data-fetching functions
│   └── utils.ts                # cn() utility for Tailwind class merging
├── hooks/
│   ├── use-mobile.ts           # Mobile detection hook
│   └── use-toast.ts            # Toast notification hook
└── scripts/
    ├── 001-create-tables.sql   # Database schema (22 tables)
    ├── 002-seed-data.sql       # Sample data
    └── create-form-fields-table.sql
```

---

## Public Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero, clients, metrics, projects, blog preview, testimonials |
| `/about` | About | Bio, experience timeline, skills, education, certifications |
| `/projects` | Projects | Filterable grid of portfolio projects |
| `/projects/[slug]` | Project Detail | Full project page with tech stack, metrics, links |
| `/services` | Services | Service cards with features and pricing |
| `/blog` | Blog | Blog posts grid with categories |
| `/blog/[slug]` | Blog Post | Full article with metadata |
| `/contact` | Contact | Dynamic contact form |

---

## Admin Routes

All under `/admin` — a full CMS dashboard.

| Route | Description |
|---|---|
| `/admin` | Dashboard — stats, recent contact submissions |
| `/admin/blog` | Blog posts list |
| `/admin/blog/new` | Create blog post |
| `/admin/blog/[id]/edit` | Edit blog post |
| `/admin/projects` | Projects list |
| `/admin/projects/new` | Create project |
| `/admin/projects/[id]/edit` | Edit project |
| `/admin/services` | Services list |
| `/admin/services/new` | Create service |
| `/admin/services/[id]/edit` | Edit service |
| `/admin/testimonials` | Testimonials list |
| `/admin/testimonials/new` | Create testimonial |
| `/admin/testimonials/[id]/edit` | Edit testimonial |
| `/admin/contacts` | View and manage contact form submissions |
| `/admin/form-builder` | Build custom contact form fields (drag-drop) |
| `/admin/media` | Upload and manage media files |
| `/admin/theme` | Customize site theme (colors, fonts) |
| `/admin/settings` | Site-wide settings (name, description, social links) |

---

## API Endpoints

### Public
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/contact` | Submit contact form — flexible field mapping |

### Admin — Blog
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/blog` | Create blog post |
| PATCH | `/api/admin/blog` | Update blog post |
| DELETE | `/api/admin/blog?id=<id>` | Delete blog post |

### Admin — Projects
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/projects` | Create project |
| PATCH | `/api/admin/projects` | Update project |
| DELETE | `/api/admin/projects?id=<id>` | Delete project |

### Admin — Services
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/services` | Create service |
| PATCH | `/api/admin/services` | Update service |
| DELETE | `/api/admin/services?id=<id>` | Delete service |

### Admin — Testimonials
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/testimonials` | Create testimonial |
| PATCH | `/api/admin/testimonials` | Update testimonial |
| DELETE | `/api/admin/testimonials?id=<id>` | Delete testimonial |

### Admin — Contacts
| Method | Endpoint | Description |
|---|---|---|
| PATCH | `/api/admin/contacts` | Update contact status/notes |
| DELETE | `/api/admin/contacts` | Delete a single submission |
| DELETE | `/api/admin/contacts/bulk` | Bulk delete submissions |

### Admin — Settings & Forms
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/settings` | Get site/theme settings |
| PATCH | `/api/admin/settings` | Update site/theme settings |
| GET | `/api/admin/form-fields` | Get contact form field config |
| POST | `/api/admin/form-fields` | Save contact form field config |

---

## Database Schema (22 Tables)

### Site Configuration

| Table | Purpose |
|---|---|
| `site_settings` | Name, description, developer info, metadata |
| `theme_settings` | Colors, fonts, border radius, dark mode |
| `social_links` | Social media URLs |
| `hero_section` | Homepage hero content |

### Portfolio Content

| Table | Purpose |
|---|---|
| `projects` | Portfolio projects — title, slug, description, tech_stack[], metrics JSONB |
| `project_categories` | Project categories |
| `services` | Services — title, description, features[], pricing, delivery time |
| `blog_posts` | Blog articles — title, slug, content, tags[], reading_time, view_count |
| `blog_categories` | Blog categories |
| `testimonials` | Client testimonials with star rating |

### Homepage Sections

| Table | Purpose |
|---|---|
| `client_logos` | Client company logos and links |
| `impact_metrics` | Stats displayed on homepage (e.g. "50+ projects") |
| `process_steps` | Work process workflow steps |
| `philosophy_items` | Values and philosophy cards |

### Professional Info

| Table | Purpose |
|---|---|
| `tech_stack` | Technology skills with proficiency and years of experience |
| `experiences` | Work history with achievements and tech used |
| `education` | Academic background |
| `certifications` | Professional certifications with credential IDs |

### User Interaction

| Table | Purpose |
|---|---|
| `contact_submissions` | Contact form entries with status tracking |
| `contact_form_fields` | Dynamic form field configuration |
| `media_library` | Uploaded file metadata |
| `admin_users` | Admin accounts (passwords hashed with bcryptjs) |

---

## Key Components

### Admin Components (`components/admin/`)

#### `BlogPostForm` ([components/admin/blog-post-form.tsx](components/admin/blog-post-form.tsx))
Full blog editor with:
- Title, slug (auto-generated), excerpt, featured image
- **Block-based content editor** (`BlockEditor`)
- Live preview toggle
- SEO tab — meta description with character counter + live search preview
- Settings tab — publish/draft toggle, featured toggle
- Word count, character count, reading time estimation

#### `BlockEditor` ([components/admin/block-editor.tsx](components/admin/block-editor.tsx))
A custom rich text editor using content blocks (paragraphs, headings, code, images, etc.).
- `htmlToBlocks()` — parses HTML into block array
- `blocksToHtml()` — serializes blocks back to HTML

#### `ProjectForm` ([components/admin/project-form.tsx](components/admin/project-form.tsx))
Project CRUD form — title, slug, description, problem/solution, tech stack (multi-select), metrics, live URL, GitHub link, category.

#### `ServiceForm` ([components/admin/service-form.tsx](components/admin/service-form.tsx))
Service CRUD — title, description, features list, pricing, delivery time.

#### `FormBuilder` ([components/admin/form-builder.tsx](components/admin/form-builder.tsx))
Drag-and-drop contact form field builder using `@dnd-kit`:
- Field types: text, email, phone, URL, textarea, select, checkbox, date
- Configure: label, placeholder, required, validation, help text, width
- Reorder fields by dragging

#### `ContactsManager` ([components/admin/contacts-manager.tsx](components/admin/contacts-manager.tsx))
Table view of all contact submissions with:
- Filter by status (new, read, responded, archived)
- Bulk delete
- Update status and add internal notes

#### `MediaLibrary` ([components/admin/media-library.tsx](components/admin/media-library.tsx))
File upload and management interface.

#### `ThemeSettingsForm` ([components/admin/theme-settings-form.tsx](components/admin/theme-settings-form.tsx))
Live theme editor — primary/secondary/accent/background colors, heading/body fonts, border radius, dark mode toggle.

#### `SiteSettingsForm` ([components/admin/site-settings-form.tsx](components/admin/site-settings-form.tsx))
Edit site name, description, developer bio, contact email, social links.

---

### Homepage Section Components (`components/sections/`)

| Component | Description |
|---|---|
| `HeroSection` | Main hero — name, title, CTA buttons, availability badge |
| `ClientsSection` | Animated client logo strip |
| `MetricsSection` | Animated counters for key stats |
| `FeaturedProjectsSection` | Grid of featured projects from DB |
| `PhilosophySection` | Work values/philosophy cards |
| `TechStackSection` | Technology skill cards |
| `ProcessSection` | Numbered steps of the work process |
| `TestimonialsSection` | Carousel of client testimonials |
| `BlogPreviewSection` | Latest blog post cards |
| `CtaSection` | "Get in touch" call-to-action |

---

### Layout Components

| Component | Description |
|---|---|
| `Navbar` | Fixed top nav — logo, links, theme toggle, mobile menu |
| `Footer` | Footer with links and copyright |
| `ThemeProvider` | Wraps app for dark/light mode |
| `ScrollProvider` | Lenis smooth scroll initialization |
| `ScrollProgressWrapper` | Reading progress bar at top of page |
| `AnimatedBackground` | Subtle background animations |

---

## Data Layer (`lib/data.ts`)

All data-fetching is done server-side using async functions that query the Neon PostgreSQL database directly.

### Function Groups

```
Site:         getSiteSettings(), getHeroSection(), getSocialLinks()
Metrics:      getImpactMetrics(), getClientLogos()
Projects:     getProjects(), getFeaturedProjects(), getProjectBySlug(), getProjectCategories()
Services:     getServices(), getFeaturedServices(), getServiceBySlug()
Blog:         getBlogPosts(), getFeaturedBlogPosts(), getBlogPostBySlug(), getBlogCategories()
Testimonials: getTestimonials(), getFeaturedTestimonials()
Professional: getExperiences(), getEducation(), getCertifications(), getTechStack()
Homepage:     getProcessSteps(), getPhilosophyItems()
```

These are called directly inside **Server Components** (no useEffect or client-side fetch needed).

---

## Architecture & Data Flow

```
Browser
  ↕
Next.js App Router
  ├── Server Components  →  lib/data.ts  →  Neon PostgreSQL
  ├── Client Components  →  React state + Framer Motion
  └── API Routes         →  lib/db.ts (sql client)  →  Neon PostgreSQL
```

### 3 Main Patterns

**1. Public page rendering (Server Component)**
```
Request → Server Component → data.ts function → SQL query → HTML → Browser
```
All public pages are server-rendered. Data functions run on the server and pass props down.

**2. Admin form CRUD (Client + API Route)**
```
Form input → React state → fetch() to /api/admin/xxx → SQL → redirect
```
Admin forms are Client Components. On submit they call API Routes which execute parameterized SQL.

**3. Contact form submission**
```
ContactForm (client) → POST /api/contact → flexible field mapping → DB insert
```
The contact API dynamically maps incoming field names (e.g. `name`, `full_name`, `your_name`) to a standard DB column.

---

## Notable Features

### Flexible Contact Form
- The `/api/contact` route accepts many different field name conventions and normalizes them into a standard `contact_submissions` row
- The admin `FormBuilder` lets you define custom fields — these are stored in `contact_form_fields` and the `ContactForm` component renders them dynamically

### Blog Block Editor
- Content is stored as HTML in the database
- The `BlockEditor` component converts HTML ↔ blocks for editing
- Supports paragraphs, headings, code blocks, images, lists, quotes

### Reading Time
- Automatically estimated from word count (200 wpm)
- Updated live as content changes

### SEO Preview
- The blog form shows a live Google-style SERP preview of title, URL, and meta description
- Meta description character counter warns when over 160 chars

### Dynamic Theme
- `ThemeSettingsForm` lets the admin change colors and fonts
- Settings saved to `theme_settings` table and applied site-wide

### Drag-Drop Form Builder
- Uses `@dnd-kit` for accessible drag-and-drop
- Admin can add, reorder, and configure contact form fields without code changes

---

## Configuration Files

| File | Purpose |
|---|---|
| `.env` | PostgreSQL connection strings (Neon) |
| `next.config.mjs` | TypeScript error bypass, image unoptimized mode |
| `tsconfig.json` | ES6 target, strict mode, `@/*` path alias |
| `postcss.config.mjs` | Tailwind CSS PostCSS plugin |
| `components.json` | shadcn/ui config (style: new-york, Lucide icons) |

---

## Security Notes

| Issue | Status |
|---|---|
| SQL injection | Protected — all queries use parameterized SQL |
| Password hashing | bcryptjs available for admin_users |
| Admin auth | **Not implemented** — admin routes have no login protection |
| `.env` credentials | Present in file — should be in environment variables only (not committed) |
| API authorization | **Not implemented** — admin API routes are unprotected |

> The most critical missing piece is admin authentication. Anyone who knows the `/admin` URL can access and modify all content.

---

## Getting Started

1. Set up a Neon PostgreSQL database
2. Run `scripts/001-create-tables.sql` to create the schema
3. Run `scripts/002-seed-data.sql` to populate sample data
4. Add your connection string to `.env`
5. Run `pnpm dev` (or `npm run dev`)
6. Visit `http://localhost:3000` for the portfolio
7. Visit `http://localhost:3000/admin` for the CMS
