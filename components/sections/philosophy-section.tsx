"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Building2, Code2, BarChart3, Zap } from "lucide-react"
import type { PhilosophyItem } from "@/lib/db"
import { FadeIn, GlowCard, RevealText } from "@/components/scroll-animations"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  building: Building2,
  code: Code2,
  "chart-bar": BarChart3,
  zap: Zap,
}

interface PhilosophySectionProps {
  items: PhilosophyItem[]
}

export function PhilosophySection({ items }: PhilosophySectionProps) {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Animated Background */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </motion.div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold uppercase tracking-wider mb-4"
            >
              How I Work
            </motion.span>
            <RevealText className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
              Engineering Philosophy
            </RevealText>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The principles that guide every project I take on, ensuring
              consistent quality and results.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon] || Code2
            return (
              <FadeIn key={item.id} delay={index * 0.1}>
                <GlowCard className="group h-full relative p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-accent/40 transition-all duration-500">
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: index * 0.1,
                    }}
                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent mb-6 group-hover:from-accent group-hover:to-accent/80 group-hover:text-accent-foreground transition-all duration-500"
                  >
                    <Icon className="h-7 w-7" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>

                  {/* Hover indicator */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-purple-500 rounded-b-2xl"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </GlowCard>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
