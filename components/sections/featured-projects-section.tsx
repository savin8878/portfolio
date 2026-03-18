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
  "from-violet-600 via-purple-600 to-blue-700",
  "from-emerald-500 via-teal-500 to-cyan-600",
  "from-amber-500 via-orange-500 to-rose-500",
  "from-rose-500 via-pink-600 to-purple-700",
  "from-sky-500 via-blue-600 to-indigo-700",
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
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={isFeatured ? "md:col-span-2" : ""}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group relative flex flex-col h-full rounded-2xl border border-border/50 bg-card overflow-hidden hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500"
      >
        {/* Visual panel */}
        <div className={`relative overflow-hidden ${isFeatured ? "h-64" : "h-48"} bg-muted`}>
          {project.featured_image ? (
            <Image
              src={project.featured_image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={isFeatured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-85`} />
          )}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 0)",
              backgroundSize: "18px 18px",
            }}
          />
          {!project.featured_image && (
            <div
              className="absolute -right-2 -bottom-4 font-black text-white/[0.08] leading-none select-none pointer-events-none"
              style={{ fontSize: isFeatured ? "11rem" : "8rem" }}
            >
              {project.title.charAt(0)}
            </div>
          )}
          <div className="absolute top-4 left-5 text-[11px] font-bold text-white/50 tracking-widest">
            {String(index + 1).padStart(2, "0")}
          </div>
          <motion.div
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
          >
            <ArrowUpRight className="h-4 w-4 text-white" />
          </motion.div>
          {isFeatured && (
            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white/80 text-sm leading-relaxed line-clamp-2">
                {project.short_description}
              </p>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-6">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors duration-300 leading-snug">
              {project.title}
            </h3>
            {project.is_featured && (
              <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                Featured
              </span>
            )}
          </div>

          {!isFeatured && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
              {project.short_description}
            </p>
          )}

          <div className="flex flex-wrap gap-1.5 mt-auto">
            {project.tech_stack?.slice(0, isFeatured ? 5 : 3).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-[11px] px-2 py-0.5 bg-muted/60 border border-border/40 hover:bg-accent/10 hover:text-accent transition-colors">
                {tech}
              </Badge>
            ))}
            {project.tech_stack && project.tech_stack.length > (isFeatured ? 5 : 3) && (
              <Badge variant="secondary" className="text-[11px] px-2 py-0.5 bg-muted/60 border border-border/40">
                +{project.tech_stack.length - (isFeatured ? 5 : 3)}
              </Badge>
            )}
          </div>

          {project.results_metrics && (
            <div className="mt-4 pt-4 border-t border-border/40 grid grid-cols-2 gap-3">
              {Object.entries(project.results_metrics).slice(0, 2).map(([key, val]) => (
                <div key={key}>
                  <p className="text-xl font-black text-foreground leading-none">{val}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 capitalize">{key.replace(/_/g, " ")}</p>
                </div>
              ))}
            </div>
          )}

          {(project.live_url || project.github_url) && (
            <div className="mt-4 flex gap-4 relative z-10">
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:opacity-70 transition-opacity">
                  <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
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
  const title = (content?.title as string) || "Case Studies &"
  const titleHighlight = (content?.title_highlight as string) || "Projects"

  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={ref} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="h-px w-8 bg-accent" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">{label}</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-tight"
            >
              {title}<br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, hsl(var(--accent)), #818cf8)" }}>
                {titleHighlight}
              </span>
            </motion.h2>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}>
            <Button asChild variant="outline" className="group gap-2 border-border/60 hover:border-accent/50 shrink-0">
              <Link href="/projects">
                View All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
