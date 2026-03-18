"use client"

import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import type { TechStackItem } from "@/lib/db"

interface SkillsOverviewProps {
  techStack: TechStackItem[]
}

const categoryOrder = ["Frontend", "Backend", "Infrastructure", "Tools"]

export function SkillsOverview({ techStack }: SkillsOverviewProps) {
  const groupedTech = techStack.reduce(
    (acc, tech) => {
      if (!acc[tech.category]) {
        acc[tech.category] = []
      }
      acc[tech.category].push(tech)
      return acc
    },
    {} as Record<string, TechStackItem[]>
  )

  const sortedCategories = categoryOrder.filter(
    (category) => groupedTech[category]
  )

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-semibold text-accent uppercase tracking-wider">
            Technical Skills
          </h2>
          <p className="mt-2 text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Skills & Expertise
          </p>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of my technical capabilities built over
            years of hands-on experience.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {sortedCategories.map((category, categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <h3 className="text-lg font-semibold text-foreground mb-6">
                {category}
              </h3>
              <div className="space-y-4">
                {groupedTech[category].map((tech) => (
                  <div key={tech.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {tech.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {tech.years_experience} years
                      </span>
                    </div>
                    <Progress
                      value={tech.proficiency_level * 20}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
