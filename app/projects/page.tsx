import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProjectsGrid } from "@/components/projects/projects-grid"
import { CtaSection } from "@/components/sections/cta-section"
import { getProjects, getProjectCategories } from "@/lib/data"

export const metadata: Metadata = {
  title: "Projects - Akash Vishwakarma",
  description:
    "Explore my portfolio of SaaS platforms, AI tools, and web applications built for startups and enterprises.",
}

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([
    getProjects(),
    getProjectCategories(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                Projects & Case Studies
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                A showcase of my work building scalable software solutions for
                startups and enterprises across various industries.
              </p>
            </div>

            <ProjectsGrid projects={projects} categories={categories} />
          </div>
        </section>

        <CtaSection />
      </main>

      <Footer />
    </div>
  )
}
