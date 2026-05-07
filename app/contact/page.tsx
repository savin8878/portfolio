import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"
import { SketchPageHeader } from "@/components/sketch-page-header"
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
  return fields
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
          <SketchPageHeader
            kicker="Get In Touch"
            handwritten="— drop a line —"
            title="Let's Build Something Great"
            highlight="Great"
            description="Have a project in mind? Fill out the form below and I will get back to you within 24 hours to discuss how we can work together."
          />
        )}

        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-3">
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
