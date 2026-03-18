import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ServiceCard } from "@/components/services/service-card"
import { PricingSection } from "@/components/services/pricing-section"
import { FaqSection } from "@/components/services/faq-section"
import { CtaSection } from "@/components/sections/cta-section"
import { getServices } from "@/lib/data"

export const metadata: Metadata = {
  title: "Services - Akash Vishwakarma",
  description:
    "Professional software development services including SaaS development, MVP development, technical consulting, and API development.",
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* Hero */}
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground text-balance">
                Build Products That
                <span className="text-accent"> Scale</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                From MVP to enterprise-scale applications, I help startups and
                businesses build high-quality software that drives growth and
                delivers measurable results.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2">
              {services.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          </div>
        </section>

        <PricingSection />

        <FaqSection />

        <CtaSection />
      </main>

      <Footer />
    </div>
  )
}
