"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Github, ArrowUpRight, Film, Headphones } from "lucide-react"
import type { Project, ProjectCategory } from "@/lib/db"
import { ProjectExplainer } from "@/components/projects/project-explainer"

interface ProjectsGridProps {
  projects: Project[]
  categories: ProjectCategory[]
}

const GRADIENTS = [
  "from-orange-500 via-rose-500 to-purple-600",
  "from-amber-400 via-orange-500 to-red-600",
  "from-violet-600 via-fuchsia-500 to-rose-500",
  "from-sky-500 via-indigo-500 to-purple-600",
  "from-emerald-500 via-teal-500 to-cyan-500",
]

export function ProjectsGrid({ projects, categories }: ProjectsGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all")

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category_id === parseInt(activeCategory))

  const tabs = [{ id: "all", name: "All Projects" }, ...categories.map((c) => ({ id: c.id.toString(), name: c.name }))]

  return (
    <div>
      {/* Category filter — ember pills with a sliding active glow */}
      <div className="mb-14 flex flex-wrap justify-center gap-2">
        {tabs.map((tab) => {
          const active = activeCategory === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className="relative rounded-full px-4 py-2 text-sm font-medium transition-colors"
              style={{ color: active ? "#1a0a04" : "rgba(245,237,230,0.72)" }}
            >
              {active && (
                <motion.span
                  layoutId="project-tab"
                  className="absolute inset-0 -z-10 rounded-full"
                  style={{ background: "linear-gradient(100deg,#ff4d2e,#ff7a18)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {!active && <span className="absolute inset-0 -z-10 rounded-full border border-border/60" />}
              {tab.name}
            </button>
          )
        })}
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredProjects.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">No projects found in this category.</p>
        </div>
      )}
    </div>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const gradient = GRADIENTS[index % GRADIENTS.length]
  const hasWalkthrough = Boolean(project.explainer_video_url || project.explainer_audio_url)

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_30px_80px_-40px_rgba(255,77,46,0.55)]"
    >
      {/* hairline that lights up on hover */}
      <div className="absolute inset-x-0 -top-px z-10 h-px bg-linear-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Visual */}
      <div className="relative h-48 overflow-hidden bg-muted">
        {project.featured_image ? (
          <Image
            src={project.featured_image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <>
            <div className={`absolute inset-0 bg-linear-to-br ${gradient}`} />
            <div
              className="absolute inset-0 opacity-30 mix-blend-overlay"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 25%, rgba(255,255,255,0.45), transparent 50%), radial-gradient(circle at 80% 75%, rgba(0,0,0,0.35), transparent 50%)",
              }}
            />
            <span className="pointer-events-none absolute -right-3 -bottom-6 select-none text-[8rem] font-semibold leading-none tracking-[-0.05em] text-white/12">
              {project.title.charAt(0)}
            </span>
          </>
        )}

        {/* index */}
        <div className="glass absolute left-4 top-4 flex items-center gap-2 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold tracking-widest text-white/90">
          <span className="h-1 w-1 rounded-full bg-emerald-400" />
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* featured */}
        {project.is_featured && (
          <div className="glass absolute right-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-mono font-semibold tracking-widest text-white/90">
            FEATURED
          </div>
        )}

        {/* walkthrough indicator — signals the card can talk */}
        {hasWalkthrough && (
          <div
            className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg"
            style={{ background: "rgba(26,10,4,0.55)", border: "1px solid rgba(255,122,24,0.4)", backdropFilter: "blur(6px)" }}
          >
            {project.explainer_video_url && <Film className="h-3 w-3" style={{ color: "#ff7a18" }} />}
            {project.explainer_audio_url && <Headphones className="h-3 w-3" style={{ color: "#ff7a18" }} />}
            Walkthrough
          </div>
        )}

        {/* hover arrow */}
        <div className="glass absolute right-4 bottom-4 grid h-9 w-9 translate-y-2 place-items-center rounded-full opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4 text-white" />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent">
          <Link href={`/projects/${project.slug}`}>
            {project.title}
            <span className="absolute inset-0" aria-hidden />
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {project.short_description}
        </p>

        {/* tech */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech_stack?.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border/60 bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground transition-colors group-hover:border-accent/20"
            >
              {tech}
            </span>
          ))}
          {project.tech_stack && project.tech_stack.length > 4 && (
            <span className="rounded-full border border-border/60 bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground">
              +{project.tech_stack.length - 4}
            </span>
          )}
        </div>

        {/* metrics */}
        {project.results_metrics && Object.keys(project.results_metrics).length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border/40 pt-5">
            {Object.entries(project.results_metrics).slice(0, 2).map(([key, val]) => (
              <div key={key}>
                <p className="text-2xl font-semibold leading-none tracking-tight text-gradient-static">{val}</p>
                <p className="mt-1.5 text-[11px] capitalize text-muted-foreground">{key.replace(/_/g, " ")}</p>
              </div>
            ))}
          </div>
        )}

        {/* Media dock — walkthrough is the hero action, links are secondary */}
        <div className="mt-auto space-y-3 border-t border-border/40 pt-5">
          <ProjectExplainer
            title={project.title}
            videoUrl={project.explainer_video_url}
            audioUrl={project.explainer_audio_url}
          />

          {(project.live_url || project.github_url) && (
            <div className="flex flex-wrap items-center gap-4">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="relative z-10 inline-flex items-center gap-1.5 text-xs font-semibold text-accent transition-opacity hover:opacity-70"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="relative z-10 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Github className="h-3.5 w-3.5" /> Source
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  )
}
