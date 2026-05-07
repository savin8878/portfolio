"use client"

import Link from "next/link"
import Image from "next/image"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight, ExternalLink, Github, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Project } from "@/lib/db"

const GRADIENTS = [
  "from-violet-600 via-indigo-500 to-blue-600",
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-amber-500 via-orange-500 to-rose-500",
  "from-rose-500 via-pink-500 to-purple-600",
  "from-sky-500 via-blue-500 to-indigo-600",
]

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const isFeatured = index === 0
  const gradient = GRADIENTS[index % GRADIENTS.length]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={isFeatured ? "md:col-span-2" : ""}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group relative flex flex-col h-full rounded-3xl border border-border/60 bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-accent/40 hover:-translate-y-1"
      >
        {/* Top glow on hover */}
        <div className="absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Visual panel */}
        <div className={`relative overflow-hidden ${isFeatured ? "h-72 md:h-80" : "h-52"} bg-muted`}>
          {project.featured_image ? (
            <Image
              src={project.featured_image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes={isFeatured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
            />
          ) : (
            <>
              <div className={`absolute inset-0 bg-linear-to-br ${gradient}`} />
              <div className="absolute inset-0 opacity-30 mix-blend-overlay"
                style={{
                  backgroundImage: "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4), transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.3), transparent 50%)",
                }}
              />
              <div
                className="absolute -right-4 -bottom-8 font-semibold text-white/12 leading-none select-none pointer-events-none tracking-[-0.05em]"
                style={{ fontSize: isFeatured ? "14rem" : "9rem" }}
              >
                {project.title.charAt(0)}
              </div>
            </>
          )}

          {/* Glass corner tag */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-2.5 py-1 rounded-full glass text-[10px] font-mono font-semibold tracking-widest text-white/90">
            <span className="w-1 h-1 rounded-full bg-emerald-400" />
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Hover arrow */}
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass grid place-items-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>

          {isFeatured && (
            <div className="absolute bottom-0 inset-x-0 p-6 bg-linear-to-t from-black/80 via-black/40 to-transparent">
              <p className="text-white/90 text-sm md:text-base leading-relaxed line-clamp-2 max-w-2xl">
                {project.short_description}
              </p>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="text-lg md:text-xl font-semibold tracking-tight text-foreground group-hover:text-accent transition-colors duration-300 leading-snug">
              {project.title}
            </h3>
            {project.is_featured && (
              <span className="shrink-0 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                FEATURED
              </span>
            )}
          </div>

          {!isFeatured && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
              {project.short_description}
            </p>
          )}

          <div className="flex flex-wrap gap-1.5 mt-auto">
            {project.tech_stack?.slice(0, isFeatured ? 6 : 3).map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="text-[11px] px-2 py-0.5 bg-muted/60 border border-border/60 font-normal hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-colors"
              >
                {tech}
              </Badge>
            ))}
            {project.tech_stack && project.tech_stack.length > (isFeatured ? 6 : 3) && (
              <Badge variant="secondary" className="text-[11px] px-2 py-0.5 bg-muted/60 border border-border/60 font-normal">
                +{project.tech_stack.length - (isFeatured ? 6 : 3)}
              </Badge>
            )}
          </div>

          {project.results_metrics && (
            <div className="mt-5 pt-5 border-t border-border/40 grid grid-cols-2 gap-4">
              {Object.entries(project.results_metrics).slice(0, 2).map(([key, val]) => (
                <div key={key}>
                  <p className="text-2xl font-semibold text-gradient-static tracking-tight leading-none">{val}</p>
                  <p className="text-[11px] text-muted-foreground mt-1.5 capitalize">{key.replace(/_/g, " ")}</p>
                </div>
              ))}
            </div>
          )}

          {(project.live_url || project.github_url) && (
            <div className="mt-5 flex gap-4 relative z-10">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:opacity-70 transition-opacity"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-3.5 w-3.5" /> Source
                </a>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

interface FeaturedProjectsSectionProps {
  projects: Project[]
  content?: Record<string, unknown>
}

export function FeaturedProjectsSection({ projects, content }: FeaturedProjectsSectionProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  const label = (content?.label as string) || "Featured Work"
  const title = (content?.title as string) || "Selected"
  const titleHighlight = (content?.title_highlight as string) || "case studies"

  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={ref} className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-medium text-accent mb-5"
            >
              {label}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.05] text-foreground"
            >
              {title} <span className="text-gradient-static">{titleHighlight}.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-lg text-muted-foreground leading-relaxed"
            >
              A few of the products I've been lucky enough to help ship — from scrappy MVPs to scale.
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}>
            <Button
              asChild
              variant="outline"
              className="group gap-2 rounded-full border-border/60 hover:border-accent/50 shrink-0 h-11 px-5"
            >
              <Link href="/projects">
                View all work
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 5).map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
