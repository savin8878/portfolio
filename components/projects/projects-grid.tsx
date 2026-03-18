"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Github, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Project, ProjectCategory } from "@/lib/db"

interface ProjectsGridProps {
  projects: Project[]
  categories: ProjectCategory[]
}

export function ProjectsGrid({ projects, categories }: ProjectsGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all")

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category_id === parseInt(activeCategory))

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <Button
          variant={activeCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory("all")}
        >
          All Projects
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={
              activeCategory === category.id.toString() ? "default" : "outline"
            }
            size="sm"
            onClick={() => setActiveCategory(category.id.toString())}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Projects Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProjects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-accent/50 hover:shadow-lg transition-all"
            >
              {/* Image */}
              <div className="aspect-video bg-muted relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl font-bold text-accent/20">
                    {project.title.charAt(0)}
                  </span>
                </div>
                {project.is_featured && (
                  <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                    Featured
                  </Badge>
                )}
              </div>

              <div className="flex flex-col flex-1 p-6">
                <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                  <Link href={`/projects/${project.slug}`}>
                    {project.title}
                    <span className="absolute inset-0" />
                  </Link>
                </h3>

                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {project.short_description}
                </p>

                {/* Tech Stack */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech_stack?.slice(0, 4).map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="text-xs font-medium"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* Metrics */}
                {project.results_metrics && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(project.results_metrics)
                        .slice(0, 2)
                        .map(([key, value]) => (
                          <div key={key}>
                            <span className="font-semibold text-foreground">
                              {value}
                            </span>
                            <span className="text-muted-foreground ml-1 capitalize text-xs">
                              {key.replace(/_/g, " ")}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div className="flex gap-4">
                    {project.live_url && (
                      <Link
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-10 inline-flex items-center text-sm font-medium text-accent hover:underline"
                      >
                        <ExternalLink className="mr-1 h-3.5 w-3.5" />
                        Demo
                      </Link>
                    )}
                    {project.github_url && (
                      <Link
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-10 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
                      >
                        <Github className="mr-1 h-3.5 w-3.5" />
                        Code
                      </Link>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No projects found in this category.
          </p>
        </div>
      )}
    </div>
  )
}
