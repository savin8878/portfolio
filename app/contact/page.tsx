import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ContactForm, type FormField } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"
import { PageHeader } from "@/components/page-header"
import { Parallax } from "@/components/anim"
import { sql } from "@/lib/db"
import { getPageVisibility } from "@/lib/data"

export const metadata: Metadata = {
  title: "Contact - Akash Vishwakarma",
  description:
    "Get in touch to discuss your project. I help startups and enterprises build scalable software solutions.",
}

export const dynamic = "force-dynamic"

async function getFormFields() {
  const fields = await sql`
    SELECT * FROM contact_form_fields WHERE is_active = true ORDER BY display_order ASC
  `
  // Hide pricing / budget-style fields — this is a personal portfolio for job
  // applications, not a freelance-for-hire quote form. Filtered here so the
  // field never renders regardless of what's stored in the DB / form builder.
  const isPricingField = (f: Record<string, unknown>) => {
    const hay = `${f.field_name ?? ""} ${f.field_label ?? ""}`.toLowerCase()
    return /budget|pric|cost|quote|rate|\$/.test(hay)
  }
  return fields.filter((f) => !isPricingField(f as Record<string, unknown>)) as FormField[]
}

export default async function ContactPage() {
  const [fields, vis] = await Promise.all([
    getFormFields(),
    getPageVisibility("contact"),
  ])

  const show = (section: string) => vis[section] !== false

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {show("hero") && (
          <PageHeader
            eyebrow="Get In Touch"
            title="Let's Build Something"
            highlight="Great"
            description="Have a project in mind? Fill out the form below and I will get back to you within 24 hours to discuss how we can work together."
          />
        )}

        <section className="relative overflow-hidden border-t border-border/50 py-24 sm:py-32">
          {/* layered ambient glows for depth */}
          <Parallax
            speed={50}
            className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full opacity-60 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(255,122,24,0.10), transparent 70%)" }}
          >
            <span />
          </Parallax>
          <Parallax
            speed={-40}
            className="pointer-events-none absolute -right-24 bottom-0 h-112 w-md rounded-full opacity-50 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(255,122,24,0.07), transparent 70%)" }}
          >
            <span />
          </Parallax>

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
              {show("form") && (
                <div className="lg:col-span-2">
                  <ContactForm fields={fields} />
                </div>
              )}
              {show("info") && (
                <div>
                  <ContactInfo />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
