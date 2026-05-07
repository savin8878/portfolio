import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ServiceCard } from "@/components/services/service-card"
import { PricingSection } from "@/components/services/pricing-section"
import { FaqSection } from "@/components/services/faq-section"
import { CtaSection } from "@/components/sections/cta-section"
import { SketchPageHeader } from "@/components/sketch-page-header"
import { getServices, getPageVisibility } from "@/lib/data"

export const metadata: Metadata = {
  title: "Services - Akash Vishwakarma",
  description:
    "Professional software development services including SaaS development, MVP development, technical consulting, and API development.",
}

export default async function ServicesPage() {
  const [services, vis] = await Promise.all([
    getServices(),
    getPageVisibility("services"),
  ])

  const show = (section: string) => vis[section] !== false

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* Hero */}
        {show("hero") && (
          <SketchPageHeader
            kicker="What I Do"
            handwritten="— let's build it right —"
            title="Build Products That Scale"
            highlight="Scale"
            description="From MVP to enterprise-scale applications, I help startups and businesses build high-quality software that drives growth and delivers measurable results."
          />
        )}

        {/* Services Grid */}
        {show("services_grid") && (
          <section className="py-16 bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-8 md:grid-cols-2">
                {services.map((service, index) => (
                  <ServiceCard key={service.id} service={service} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}

        {show("pricing") && <PricingSection />}

        {show("faq") && <FaqSection />}

        {show("cta") && <CtaSection />}
      </main>

      <Footer />
    </div>
  )
}
