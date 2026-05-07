import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink, Github, Calendar } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CtaSection } from "@/components/sections/cta-section"
import {
  SketchUnderline,
  SketchStar,
  SketchCircle,
  SketchSquiggle,
} from "@/components/sketch-primitives"
import { SketchDoodles } from "@/components/sketch-doodles"
import { getProjectBySlug, getProjects } from "@/lib/data"

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return {
      title: "Project Not Found",
    }
  }

  return {
    title: `${project.title} - Akash Vishwakarma`,
    description: project.short_description,
  }
}

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 border-b border-border overflow-hidden paper-grain">
          <div className="absolute inset-0 notebook-grid opacity-40 -z-10" />
          <SketchSquiggle
            color="oklch(0.55 0.2 250 / 0.3)"
            strokeWidth={2}
            className="absolute top-6 left-0 right-0 h-5"
          />
          <SketchDoodles density="sparse" className="-z-5 opacity-60" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <Link
              href="/projects"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-accent mb-8 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="font-sketch text-lg">back to projects</span>
            </Link>

            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Project Image */}
              <div className="relative">
                <div className="aspect-video rounded-2xl bg-muted overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-accent/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl font-bold text-accent/30">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                </div>
                <SketchCircle
                  color="oklch(0.6 0.2 250 / 0.55)"
                  strokeWidth={2.5}
                  delay={0.8}
                  className="-inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)]"
                />
              </div>

              {/* Project Info */}
              <div>
                <h1 className="relative text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance inline-block">
                  <span className="relative inline-block">
                    {project.title}
                    <SketchUnderline color="oklch(0.6 0.2 250)" strokeWidth={4} delay={0.5} />
                  </span>
                  <SketchStar
                    color="oklch(0.6 0.2 320)"
                    delay={1.0}
                    className="absolute -top-4 -right-6 w-6 h-6 hidden sm:block"
                  />
                </h1>

                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  {project.short_description}
                </p>

                {/* Tech Stack */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack?.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                {project.results_metrics && (
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    {Object.entries(project.results_metrics).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="p-4 rounded-xl bg-muted/50 border border-border"
                        >
                          <div className="text-2xl font-bold text-foreground">
                            {value}
                          </div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {key.replace(/_/g, " ")}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-8 flex flex-wrap gap-4">
                  {project.live_url && (
                    <Button asChild>
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Live Demo
                      </a>
                    </Button>
                  )}
                  {project.github_url && (
                    <Button variant="outline" asChild>
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="mr-2 h-4 w-4" />
                        View Source
                      </a>
                    </Button>
                  )}
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(project.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Case Study Content */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Problem */}
            {project.problem_statement && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  The Challenge
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {project.problem_statement}
                </p>
              </div>
            )}

            {/* Solution */}
            {project.solution && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  The Solution
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {project.solution}
                </p>
              </div>
            )}

            {/* Full Description */}
            {project.full_description && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Project Details
                </h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {project.full_description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <CtaSection />
      </main>

      <Footer />
    </div>
  )
}
