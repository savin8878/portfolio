import { sql } from "./db"
import type {
  SiteSettings,
  HeroSection,
  SocialLink,
  ImpactMetric,
  ClientLogo,
  Project,
  ProjectCategory,
  TechStackItem,
  Experience,
  Service,
  Testimonial,
  BlogPost,
  BlogCategory,
  ProcessStep,
  PhilosophyItem,
  Education,
  Certification,
  SectionContent,
  SectionVisibility,
} from "./db"

// Site Settings
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const result = await sql`SELECT * FROM site_settings LIMIT 1`
  return result[0] as SiteSettings | null
}

// Hero Section
export async function getHeroSection(): Promise<HeroSection | null> {
  const result = await sql`SELECT * FROM hero_section WHERE is_active = true LIMIT 1`
  return result[0] as HeroSection | null
}

// Social Links
export async function getSocialLinks(): Promise<SocialLink[]> {
  const result = await sql`SELECT * FROM social_links WHERE is_active = true ORDER BY display_order`
  return result as SocialLink[]
}

// Impact Metrics
export async function getImpactMetrics(): Promise<ImpactMetric[]> {
  const result = await sql`SELECT * FROM impact_metrics WHERE is_active = true ORDER BY display_order`
  return result as ImpactMetric[]
}

// Client Logos
export async function getClientLogos(): Promise<ClientLogo[]> {
  const result = await sql`SELECT * FROM client_logos WHERE is_active = true ORDER BY display_order`
  return result as ClientLogo[]
}

// Projects
export async function getProjects(): Promise<Project[]> {
  const result = await sql`SELECT * FROM projects WHERE is_published = true ORDER BY display_order`
  return result as Project[]
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const result = await sql`SELECT * FROM projects WHERE is_published = true AND is_featured = true ORDER BY display_order LIMIT 6`
  return result as Project[]
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const result = await sql`SELECT * FROM projects WHERE slug = ${slug} AND is_published = true`
  return result[0] as Project | null
}

export async function getProjectCategories(): Promise<ProjectCategory[]> {
  const result = await sql`SELECT * FROM project_categories WHERE is_active = true ORDER BY display_order`
  return result as ProjectCategory[]
}

// Tech Stack
export async function getTechStack(): Promise<TechStackItem[]> {
  const result = await sql`SELECT * FROM tech_stack WHERE is_active = true ORDER BY display_order`
  return result as TechStackItem[]
}

// Experience
export async function getExperiences(): Promise<Experience[]> {
  const result = await sql`SELECT * FROM experiences WHERE is_active = true ORDER BY display_order`
  return result as Experience[]
}

// Education
export async function getEducation(): Promise<Education[]> {
  const result = await sql`SELECT * FROM education WHERE is_active = true ORDER BY display_order`
  return result as Education[]
}

// Certifications
export async function getCertifications(): Promise<Certification[]> {
  const result = await sql`SELECT * FROM certifications WHERE is_active = true ORDER BY display_order`
  return result as Certification[]
}

// Services
export async function getServices(): Promise<Service[]> {
  const result = await sql`SELECT * FROM services WHERE is_active = true ORDER BY display_order`
  return result as Service[]
}

export async function getFeaturedServices(): Promise<Service[]> {
  const result = await sql`SELECT * FROM services WHERE is_active = true AND is_featured = true ORDER BY display_order`
  return result as Service[]
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const result = await sql`SELECT * FROM services WHERE slug = ${slug} AND is_active = true`
  return result[0] as Service | null
}

// Testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  const result = await sql`SELECT * FROM testimonials WHERE is_active = true ORDER BY display_order`
  return result as Testimonial[]
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const result = await sql`SELECT * FROM testimonials WHERE is_active = true AND is_featured = true ORDER BY display_order LIMIT 6`
  return result as Testimonial[]
}

// Blog
export async function getBlogPosts(): Promise<BlogPost[]> {
  const result = await sql`
    SELECT bp.*, bc.name as category_name, bc.slug as category_slug 
    FROM blog_posts bp 
    LEFT JOIN blog_categories bc ON bp.category_id = bc.id 
    WHERE bp.is_published = true 
    ORDER BY bp.published_at DESC
  `
  return result as BlogPost[]
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  const result = await sql`
    SELECT bp.*, bc.name as category_name, bc.slug as category_slug 
    FROM blog_posts bp 
    LEFT JOIN blog_categories bc ON bp.category_id = bc.id 
    WHERE bp.is_published = true AND bp.is_featured = true 
    ORDER BY bp.published_at DESC 
    LIMIT 3
  `
  return result as BlogPost[]
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const result = await sql`
    SELECT bp.*, bc.name as category_name, bc.slug as category_slug 
    FROM blog_posts bp 
    LEFT JOIN blog_categories bc ON bp.category_id = bc.id 
    WHERE bp.slug = ${slug} AND bp.is_published = true
  `
  return result[0] as BlogPost | null
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const result = await sql`SELECT * FROM blog_categories WHERE is_active = true ORDER BY display_order`
  return result as BlogCategory[]
}

// Process Steps
export async function getProcessSteps(): Promise<ProcessStep[]> {
  const result = await sql`SELECT * FROM process_steps WHERE is_active = true ORDER BY display_order`
  return result as ProcessStep[]
}

// Philosophy Items
export async function getPhilosophyItems(): Promise<PhilosophyItem[]> {
  const result = await sql`SELECT * FROM philosophy_items WHERE is_active = true ORDER BY display_order`
  return result as PhilosophyItem[]
}

// Section Content
export async function getSectionContent(
  page: string,
  section: string
): Promise<Record<string, unknown> | null> {
  try {
    const result = await sql`
      SELECT content FROM section_content
      WHERE page = ${page} AND section = ${section}
    `
    return (result[0]?.content as Record<string, unknown>) || null
  } catch {
    return null
  }
}

export async function getPageContent(
  page: string
): Promise<Record<string, Record<string, unknown>>> {
  try {
    const result = await sql`
      SELECT section, content FROM section_content
      WHERE page = ${page}
    `
    const content: Record<string, Record<string, unknown>> = {}
    for (const row of result) {
      content[row.section as string] = row.content as Record<string, unknown>
    }
    return content
  } catch {
    return {}
  }
}

export async function getAllSectionContent(): Promise<SectionContent[]> {
  try {
    const result = await sql`
      SELECT * FROM section_content ORDER BY page, section
    `
    return result as SectionContent[]
  } catch {
    return []
  }
}

// Section Visibility
export async function getPageVisibility(
  page: string
): Promise<Record<string, boolean>> {
  try {
    const result = await sql`
      SELECT section, is_visible FROM section_visibility
      WHERE page = ${page}
      ORDER BY display_order
    `
    const visibility: Record<string, boolean> = {}
    for (const row of result) {
      visibility[row.section as string] = row.is_visible as boolean
    }
    return visibility
  } catch {
    return {}
  }
}

// Section order — returns sections sorted by display_order
export async function getPageSectionOrder(
  page: string
): Promise<string[]> {
  try {
    const result = await sql`
      SELECT section, display_order FROM section_visibility
      WHERE page = ${page}
      ORDER BY display_order ASC
    `
    return result.map((r) => r.section as string)
  } catch {
    return []
  }
}

export async function getAllSectionVisibility(): Promise<SectionVisibility[]> {
  try {
    const result = await sql`
      SELECT * FROM section_visibility ORDER BY page, display_order
    `
    return result as SectionVisibility[]
  } catch {
    return []
  }
}
