import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"
import { sql } from "@/lib/db"

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
  const fields = await getFormFields()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
                Let&apos;s Build Something
                <span className="text-accent"> Great</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Have a project in mind? Fill out the form below and I will get
                back to you within 24 hours to discuss how we can work together.
              </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ContactForm fields={fields} />
              </div>
              <div>
                <ContactInfo />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
