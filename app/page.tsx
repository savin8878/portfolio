import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CinematicHero } from "@/components/sections/cinematic-hero"
import { ClientsSection } from "@/components/sections/clients-section"
import { MetricsSection } from "@/components/sections/metrics-section"
import { ScrollProjectsSection } from "@/components/sections/scroll-projects-section"
import { PhilosophySection } from "@/components/sections/philosophy-section"
import { TechStackSection } from "@/components/sections/tech-stack-section"
import { ProcessSection } from "@/components/sections/process-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { BlogPreviewSection } from "@/components/sections/blog-preview-section"
import { CtaSection } from "@/components/sections/cta-section"
import { CustomBlocksRenderer } from "@/components/custom-blocks-renderer"
import { SectionReveal } from "@/components/section-reveal"
import { SectionRail } from "@/components/section-rail"
import { SECTION_META } from "@/lib/section-meta"
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
  getPageSectionOrder,
} from "@/lib/data"

// Default section order if none saved in DB
const DEFAULT_ORDER = [
  "hero", "clients", "metrics", "featured_projects", "philosophy",
  "tech_stack", "process", "testimonials", "blog_preview", "cta",
]

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
    sectionOrder,
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
    getPageSectionOrder("home"),
  ])

  const show = (section: string) => vis[section] !== false

  // Use DB order if available, otherwise default
  const order = sectionOrder.length > 0 ? sectionOrder : DEFAULT_ORDER

  // Map section IDs to their rendered components
  const sectionComponents: Record<string, React.ReactNode> = {
    hero: show("hero") ? (
      <CinematicHero
        key="hero"
        developerName={siteSettings?.developer_name || "Alex Chen"}
        professionalTitle={siteSettings?.professional_title || "Full-Stack Product Engineer"}
        tagline={siteSettings?.tagline || "I build scalable SaaS platforms, AI tools, and high-performance web applications."}
        primaryCtaText={heroSection?.primary_cta_text || "View Case Studies"}
        primaryCtaUrl={heroSection?.primary_cta_url || "/projects"}
        secondaryCtaText={heroSection?.secondary_cta_text || "Start a Project"}
        secondaryCtaUrl={heroSection?.secondary_cta_url || "/contact"}
        socialLinks={socialLinks}
        content={pageContent.hero}
      />
    ) : null,

    clients: show("clients") && clients.length > 0 ? (
      <ClientsSection key="clients" clients={clients} content={pageContent.clients} />
    ) : null,

    metrics: show("metrics") && metrics.length > 0 ? (
      <MetricsSection key="metrics" metrics={metrics} />
    ) : null,

    featured_projects: show("featured_projects") && projects.length > 0 ? (
      <ScrollProjectsSection key="featured_projects" projects={projects} content={pageContent.featured_projects} />
    ) : null,

    philosophy: show("philosophy") && philosophy.length > 0 ? (
      <PhilosophySection key="philosophy" items={philosophy} />
    ) : null,

    tech_stack: show("tech_stack") && techStack.length > 0 ? (
      <TechStackSection key="tech_stack" techStack={techStack} />
    ) : null,

    process: show("process") && processSteps.length > 0 ? (
      <ProcessSection key="process" steps={processSteps} content={pageContent.process} />
    ) : null,

    testimonials: show("testimonials") && testimonials.length > 0 ? (
      <TestimonialsSection key="testimonials" testimonials={testimonials} content={pageContent.testimonials} />
    ) : null,

    blog_preview: show("blog_preview") && blogPosts.length > 0 ? (
      <BlogPreviewSection key="blog_preview" posts={blogPosts} content={pageContent.blog_preview} />
    ) : null,

    cta: show("cta") ? (
      <CtaSection key="cta" content={pageContent.cta} />
    ) : null,
  }

  // Sections that actually render, in order — drives BOTH the reveal wrappers
  // and the section rail so they can never drift apart.
  const visibleIds = order.filter(
    (id) => sectionComponents[id] != null && SECTION_META[id],
  )
  const railItems = visibleIds.map((id) => ({
    anchorId: SECTION_META[id].anchorId,
    label: SECTION_META[id].label,
  }))

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      <SectionRail items={railItems} />

      <main className="relative">
        <CustomBlocksRenderer page="home" />
        {visibleIds.map((id, index) => (
          <SectionReveal
            key={id}
            anchorId={SECTION_META[id].anchorId}
            sticky={SECTION_META[id].sticky}
            isHero={id === "hero"}
            thin={id === "clients"}
            sketchSeed={index}
          >
            {sectionComponents[id]}
          </SectionReveal>
        ))}
      </main>

      <Footer />
    </div>
  )
}
