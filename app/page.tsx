import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/sections/hero-section"
import { ClientsSection } from "@/components/sections/clients-section"
import { MetricsSection } from "@/components/sections/metrics-section"
import { FeaturedProjectsSection } from "@/components/sections/featured-projects-section"
import { PhilosophySection } from "@/components/sections/philosophy-section"
import { TechStackSection } from "@/components/sections/tech-stack-section"
import { ProcessSection } from "@/components/sections/process-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { BlogPreviewSection } from "@/components/sections/blog-preview-section"
import { CtaSection } from "@/components/sections/cta-section"
import {
  getSiteSettings,
  getHeroSection,
  getClientLogos,
  getImpactMetrics,
  getFeaturedProjects,
  getPhilosophyItems,
  getTechStack,
  getProcessSteps,
  getFeaturedTestimonials,
  getFeaturedBlogPosts,
  getSocialLinks,
  getPageContent,
  getPageVisibility,
} from "@/lib/data"

export default async function HomePage() {
  const [
    siteSettings,
    heroSection,
    clients,
    metrics,
    projects,
    philosophy,
    techStack,
    processSteps,
    testimonials,
    blogPosts,
    socialLinks,
    pageContent,
    vis,
  ] = await Promise.all([
    getSiteSettings(),
    getHeroSection(),
    getClientLogos(),
    getImpactMetrics(),
    getFeaturedProjects(),
    getPhilosophyItems(),
    getTechStack(),
    getProcessSteps(),
    getFeaturedTestimonials(),
    getFeaturedBlogPosts(),
    getSocialLinks(),
    getPageContent("home"),
    getPageVisibility("home"),
  ])

  const show = (section: string) => vis[section] !== false

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {show("hero") && (
          <HeroSection
            developerName={siteSettings?.developer_name || "Alex Chen"}
            professionalTitle={
              siteSettings?.professional_title || "Full-Stack Product Engineer"
            }
            tagline={
              siteSettings?.tagline ||
              "I build scalable SaaS platforms, AI tools, and high-performance web applications."
            }
            primaryCtaText={heroSection?.primary_cta_text || "View Case Studies"}
            primaryCtaUrl={heroSection?.primary_cta_url || "/projects"}
            secondaryCtaText={heroSection?.secondary_cta_text || "Start a Project"}
            secondaryCtaUrl={heroSection?.secondary_cta_url || "/contact"}
            socialLinks={socialLinks}
            content={pageContent.hero}
          />
        )}

        {show("clients") && clients.length > 0 && (
          <ClientsSection clients={clients} content={pageContent.clients} />
        )}

        {show("metrics") && metrics.length > 0 && (
          <MetricsSection metrics={metrics} />
        )}

        {show("featured_projects") && projects.length > 0 && (
          <FeaturedProjectsSection
            projects={projects}
            content={pageContent.featured_projects}
          />
        )}

        {show("philosophy") && philosophy.length > 0 && (
          <PhilosophySection items={philosophy} />
        )}

        {show("tech_stack") && techStack.length > 0 && (
          <TechStackSection techStack={techStack} />
        )}

        {show("process") && processSteps.length > 0 && (
          <ProcessSection steps={processSteps} content={pageContent.process} />
        )}

        {show("testimonials") && testimonials.length > 0 && (
          <TestimonialsSection
            testimonials={testimonials}
            content={pageContent.testimonials}
          />
        )}

        {show("blog_preview") && blogPosts.length > 0 && (
          <BlogPreviewSection posts={blogPosts} content={pageContent.blog_preview} />
        )}

        {show("cta") && <CtaSection content={pageContent.cta} />}
      </main>

      <Footer />
    </div>
  )
}
