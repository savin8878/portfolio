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
  ])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
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
        />

        {clients.length > 0 && <ClientsSection clients={clients} />}

        {metrics.length > 0 && <MetricsSection metrics={metrics} />}

        {projects.length > 0 && <FeaturedProjectsSection projects={projects} />}

        {philosophy.length > 0 && <PhilosophySection items={philosophy} />}

        {techStack.length > 0 && <TechStackSection techStack={techStack} />}

        {processSteps.length > 0 && <ProcessSection steps={processSteps} />}

        {testimonials.length > 0 && (
          <TestimonialsSection testimonials={testimonials} />
        )}

        {blogPosts.length > 0 && <BlogPreviewSection posts={blogPosts} />}

        <CtaSection />
      </main>

      <Footer />
    </div>
  )
}
