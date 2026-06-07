import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink, Github, Calendar } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CtaSection } from "@/components/sections/cta-section"
import { Reveal, Stagger, StaggerItem, Parallax, TiltCard } from "@/components/anim"
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

  const metrics = project.results_metrics
    ? Object.entries(project.results_metrics)
    : []

  // Build the case-study chapters so we can render with editorial index numbers.
  const chapters = [
    project.problem_statement && {
      key: "challenge",
      label: "The Challenge",
      body: project.problem_statement,
    },
    project.solution && {
      key: "solution",
      label: "The Solution",
      body: project.solution,
    },
    project.full_description && {
      key: "details",
      label: "Project Details",
      body: project.full_description,
    },
  ].filter(Boolean) as { key: string; label: string; body: string }[]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/50 pb-20 pt-28 sm:pt-32">
          {/* layered ambient glows for depth */}
          <Parallax
            speed={55}
            className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full opacity-70 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(255,122,24,0.12), transparent 70%)" }}
          >
            <span />
          </Parallax>
          <Parallax
            speed={-45}
            className="pointer-events-none absolute -right-24 -bottom-16 h-112 w-md rounded-full opacity-50 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(255,122,24,0.08), transparent 70%)" }}
          >
            <span />
          </Parallax>

          {/* oversized ghost initial drifting behind the content */}
          <Parallax
            speed={-30}
            className="pointer-events-none absolute right-4 top-10 z-0 select-none lg:right-16"
          >
            <span className="font-mono text-[18rem] leading-none tracking-tighter text-muted-foreground/5 sm:text-[24rem]">
              {project.title.charAt(0)}
            </span>
          </Parallax>

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal from="left" distance={24}>
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-accent"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Projects
              </Link>
            </Reveal>

            <div className="mt-12 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Project Info */}
              <div>
                <Reveal from="top" delay={0.05}>
                  <span className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-accent">
                    <span className="h-px w-8 bg-accent/60" />
                    Case Study
                  </span>
                </Reveal>

                <Reveal from="left" delay={0.1}>
                  <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-foreground sm:text-5xl md:text-6xl">
                    {project.title}
                  </h1>
                </Reveal>

                <Reveal from="bottom" delay={0.18}>
                  <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                    {project.short_description}
                  </p>
                </Reveal>

                {/* Actions */}
                <Reveal from="bottom" delay={0.26}>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
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
                </Reveal>

                <Reveal from="left" delay={0.32}>
                  <div className="mt-8 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground/70">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(project.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </Reveal>
              </div>

              {/* Project Image */}
              <Reveal from="right" delay={0.15}>
                <TiltCard className="relative">
                  <div className="relative aspect-video overflow-hidden rounded-2xl border border-border/60 bg-muted">
                    <div className="absolute inset-0 bg-linear-to-br from-accent/25 via-accent/10 to-transparent" />
                    <div
                      className="pointer-events-none absolute inset-0 opacity-60"
                      style={{ background: "radial-gradient(60% 80% at 30% 20%, rgba(255,122,24,0.15), transparent 70%)" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-8xl font-semibold tracking-tighter text-accent/30">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Tech Stack + Metrics */}
        <section className="relative overflow-hidden border-b border-border/50 py-24 sm:py-32">
          <Parallax
            speed={40}
            className="pointer-events-none absolute right-0 top-12 h-80 w-80 rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(255,122,24,0.07), transparent 70%)" }}
          >
            <span />
          </Parallax>

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
              {/* Tech stack */}
              {project.tech_stack && project.tech_stack.length > 0 && (
                <div>
                  <Reveal from="left">
                    <span className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-accent">
                      <span className="h-px w-8 bg-accent/60" />
                      Stack
                    </span>
                    <h2 className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl">
                      Technologies <span className="text-gradient-static">Used</span>
                    </h2>
                  </Reveal>

                  <Stagger className="mt-8 flex flex-wrap gap-3" stagger={0.08}>
                    {project.tech_stack.map((tech, i) => (
                      <StaggerItem
                        key={tech}
                        from={i % 2 ? "right" : "left"}
                        distance={28}
                      >
                        <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/40 px-4 py-1.5 text-sm font-mono text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground">
                          {tech}
                        </span>
                      </StaggerItem>
                    ))}
                  </Stagger>
                </div>
              )}

              {/* Metrics */}
              {metrics.length > 0 && (
                <div>
                  <Reveal from="right">
                    <span className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-accent">
                      <span className="h-px w-8 bg-accent/60" />
                      Impact
                    </span>
                    <h2 className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl">
                      Results &amp; <span className="text-gradient-static">Metrics</span>
                    </h2>
                  </Reveal>

                  <Stagger className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/50 bg-border/40">
                    {metrics.map(([key, value], i) => (
                      <StaggerItem
                        key={key}
                        from={i % 2 ? "bottom" : "zoom"}
                        className="bg-background"
                      >
                        <div className="h-full p-6">
                          <div className="text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
                            {value}
                          </div>
                          <div className="mt-2 text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
                            {key.replace(/_/g, " ")}
                          </div>
                        </div>
                      </StaggerItem>
                    ))}
                  </Stagger>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Case Study Content */}
        {chapters.length > 0 && (
          <section className="relative overflow-hidden border-b border-border/50 py-24 sm:py-32">
            <Parallax
              speed={-35}
              className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full opacity-40 blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(255,122,24,0.06), transparent 70%)" }}
            >
              <span />
            </Parallax>

            <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col">
                {chapters.map((chapter, i) => (
                  <div
                    key={chapter.key}
                    className="border-b border-border/50 py-14 first:pt-0 last:border-b-0 last:pb-0"
                  >
                    <div className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-12">
                      <Parallax speed={i % 2 ? 18 : -18}>
                        <span className="block font-mono text-5xl tabular-nums tracking-tighter text-muted-foreground/30 sm:text-6xl">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </Parallax>

                      <div>
                        <Reveal from={i % 2 ? "right" : "left"}>
                          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl">
                            {chapter.label}
                          </h2>
                        </Reveal>
                        <Reveal from="bottom" delay={0.1}>
                          <p className="mt-5 whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
                            {chapter.body}
                          </p>
                        </Reveal>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <CtaSection />
      </main>

      <Footer />
    </div>
  )
}
