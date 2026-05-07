import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProjectsGrid } from "@/components/projects/projects-grid"
import { CtaSection } from "@/components/sections/cta-section"
import { SketchPageHeader } from "@/components/sketch-page-header"
import { getProjects, getProjectCategories, getPageVisibility } from "@/lib/data"

export const metadata: Metadata = {
  title: "Projects - Akash Vishwakarma",
  description:
    "Explore my portfolio of SaaS platforms, AI tools, and web applications built for startups and enterprises.",
}

export default async function ProjectsPage() {
  const [projects, categories, vis] = await Promise.all([
    getProjects(),
    getProjectCategories(),
    getPageVisibility("projects"),
  ])

  const show = (section: string) => vis[section] !== false

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {show("hero") && (
          <SketchPageHeader
            kicker="Portfolio"
            handwritten="— selected work —"
            title="Projects & Case Studies"
            highlight="Case Studies"
            description="A showcase of my work building scalable software solutions for startups and enterprises across various industries."
          />
        )}

        {show("projects_grid") && (
          <section className="pb-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <ProjectsGrid projects={projects} categories={categories} />
            </div>
          </section>
        )}

        {show("cta") && <CtaSection />}
      </main>

      <Footer />
    </div>
  )
}
