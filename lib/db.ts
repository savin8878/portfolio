import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.DATABASE_URL!)

// Type definitions for database tables
export interface ThemeSettings {
  id: number
  primary_color: string
  secondary_color: string
  accent_color: string
  background_color: string
  foreground_color: string
  muted_color: string
  border_radius: string
  font_heading: string
  font_body: string
  dark_mode: boolean
  updated_at: Date
}

export interface SiteSettings {
  id: number
  site_name: string
  site_description: string
  developer_name: string
  professional_title: string
  tagline: string
  profile_image: string | null
  resume_url: string | null
  email: string
  phone: string | null
  location: string
  availability_status: string
  meta_title: string
  meta_description: string
  og_image: string | null
  updated_at: Date
}

export interface SocialLink {
  id: number
  platform: string
  url: string
  icon: string
  display_order: number
  is_active: boolean
}

export interface HeroSection {
  id: number
  headline: string
  subheadline: string
  primary_cta_text: string
  primary_cta_url: string
  secondary_cta_text: string
  secondary_cta_url: string
  background_type: string
  background_value: string | null
  is_active: boolean
}

export interface ClientLogo {
  id: number
  name: string
  logo_url: string | null
  website_url: string | null
  display_order: number
  is_active: boolean
}

export interface ImpactMetric {
  id: number
  label: string
  value: string
  suffix: string
  icon: string
  display_order: number
  is_active: boolean
}

export interface ProjectCategory {
  id: number
  name: string
  slug: string
  description: string | null
  display_order: number
  is_active: boolean
}

export interface Project {
  id: number
  title: string
  slug: string
  short_description: string
  full_description: string
  problem_statement: string
  solution: string
  tech_stack: string[]
  featured_image: string | null
  gallery_images: string[] | null
  live_url: string | null
  github_url: string | null
  category_id: number | null
  is_featured: boolean
  is_published: boolean
  display_order: number
  results_metrics: Record<string, string> | null
  created_at: Date
  updated_at: Date
}

export interface TechStackItem {
  id: number
  name: string
  icon: string
  category: string
  proficiency_level: number
  years_experience: number
  display_order: number
  is_active: boolean
}

export interface Experience {
  id: number
  company_name: string
  company_logo: string | null
  job_title: string
  location: string
  start_date: Date
  end_date: Date | null
  is_current: boolean
  description: string
  achievements: string[]
  tech_used: string[]
  display_order: number
  is_active: boolean
}

export interface Service {
  id: number
  title: string
  slug: string
  short_description: string
  full_description: string
  icon: string
  features: string[]
  price_range: string
  delivery_time: string
  is_featured: boolean
  display_order: number
  is_active: boolean
}

export interface Testimonial {
  id: number
  client_name: string
  client_title: string
  client_company: string
  client_image: string | null
  testimonial_text: string
  rating: number
  project_id: number | null
  is_featured: boolean
  display_order: number
  is_active: boolean
}

export interface BlogCategory {
  id: number
  name: string
  slug: string
  description: string | null
  display_order: number
  is_active: boolean
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string | null
  category_id: number | null
  tags: string[]
  reading_time: number
  is_featured: boolean
  is_published: boolean
  published_at: Date | null
  meta_title: string
  meta_description: string
  view_count: number
  created_at: Date
  updated_at: Date
  category?: BlogCategory
}

export interface ProcessStep {
  id: number
  title: string
  description: string
  icon: string
  display_order: number
  is_active: boolean
}

export interface PhilosophyItem {
  id: number
  title: string
  description: string
  icon: string
  display_order: number
  is_active: boolean
}

export interface ContactSubmission {
  id: number
  name: string
  email: string
  company: string | null
  project_type: string | null
  budget_range: string | null
  timeline: string | null
  message: string
  status: string
  notes: string | null
  created_at: Date
  updated_at: Date
}

export interface Education {
  id: number
  institution: string
  degree: string
  field_of_study: string | null
  start_date: Date | null
  end_date: Date | null
  description: string | null
  achievements: string[] | null
  display_order: number
  is_active: boolean
}

export interface Certification {
  id: number
  name: string
  issuer: string
  issue_date: Date | null
  expiry_date: Date | null
  credential_id: string | null
  credential_url: string | null
  display_order: number
  is_active: boolean
}

export interface SectionContent {
  id: number
  page: string
  section: string
  content: Record<string, unknown>
  updated_at: Date
}

export interface SectionVisibility {
  id: number
  page: string
  section: string
  is_visible: boolean
  display_order: number
  updated_at: Date
}
