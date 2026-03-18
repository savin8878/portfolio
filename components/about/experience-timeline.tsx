"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion"
import { Briefcase, GraduationCap, Award } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Experience, Education, Certification } from "@/lib/db"

interface ExperienceTimelineProps {
  experiences: Experience[]
  education: Education[]
  certifications: Certification[]
  content?: Record<string, unknown>
}

function formatDate(date: Date | null): string {
  if (!date) return "Present"
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })
}

function TimelineCard({
  exp,
  index,
  total,
}: {
  exp: Experience
  index: number
  total: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-6"
    >
      {/* Left: number + line */}
      <div className="flex flex-col items-center shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: index * 0.06 + 0.1, type: "spring", stiffness: 300 }}
          className="w-10 h-10 rounded-full border border-accent/40 bg-accent/5 flex items-center justify-center text-xs font-black text-accent z-10"
        >
          {String(index + 1).padStart(2, "0")}
        </motion.div>
        {index < total - 1 && (
          <div className="w-px flex-1 mt-2 bg-border/40" />
        )}
      </div>

      {/* Right: content */}
      <div className={`pb-10 flex-1 ${index === total - 1 ? "pb-0" : ""}`}>
        <div className="rounded-2xl border border-border/50 bg-card hover:border-accent/30 transition-all duration-300 group overflow-hidden">
          {/* Top accent bar on hover */}
          <div className="h-px w-0 group-hover:w-full bg-gradient-to-r from-transparent via-accent/60 to-transparent transition-all duration-500" />

          <div className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
              <div className="flex items-start gap-3">
                {exp.company_logo ? (
                  <div className="relative w-10 h-10 rounded-xl border border-border/50 overflow-hidden shrink-0 bg-muted">
                    <Image
                      src={exp.company_logo}
                      alt={exp.company_name}
                      fill
                      className="object-contain p-1"
                      sizes="40px"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl border border-border/50 bg-accent/5 flex items-center justify-center shrink-0">
                    <span className="text-xs font-black text-accent">
                      {exp.company_name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-foreground text-base leading-snug group-hover:text-accent transition-colors duration-300">
                    {exp.job_title}
                  </h3>
                  <p className="text-sm font-semibold text-accent mt-0.5">
                    {exp.company_name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground tabular-nums">
                  {formatDate(exp.start_date)} -{" "}
                  {exp.is_current ? (
                    <span className="inline-flex items-center gap-1">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                      </span>
                      Present
                    </span>
                  ) : (
                    formatDate(exp.end_date)
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {exp.location}
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {exp.description}
            </p>

            {exp.achievements && exp.achievements.length > 0 && (
              <div className="flex flex-col gap-2 mb-4">
                {exp.achievements.map((achievement) => (
                  <div
                    key={achievement}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                    {achievement}
                  </div>
                ))}
              </div>
            )}

            {exp.tech_used && exp.tech_used.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/40">
                {exp.tech_used.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="text-[10px] font-semibold tracking-wide"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function ExperienceTimeline({
  experiences,
  education,
  certifications,
  content,
}: ExperienceTimelineProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Animated Background — matching philosophy-section style */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </motion.div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header — left-aligned home page style */}
        <div ref={ref} className="mb-14">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="h-px w-8 bg-accent" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">
              {(content?.label as string) || "Career Journey"}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl font-black tracking-tight text-foreground"
          >
            {(content?.title as string) || "Experience &"}{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, hsl(var(--accent)), #818cf8)" }}
            >
              {(content?.title_highlight as string) || "Background"}
            </span>
          </motion.h2>
        </div>

        {/* Tabs with home-page-styled trigger */}
        <Tabs defaultValue="experience" className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <TabsList className="inline-flex h-12 rounded-full border border-border/50 bg-card p-1 mb-14">
              <TabsTrigger
                value="experience"
                className="gap-2 rounded-full px-6 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Experience</span>
              </TabsTrigger>
              <TabsTrigger
                value="education"
                className="gap-2 rounded-full px-6 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                <GraduationCap className="h-4 w-4" />
                <span className="hidden sm:inline">Education</span>
              </TabsTrigger>
              <TabsTrigger
                value="certifications"
                className="gap-2 rounded-full px-6 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">Certifications</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Experience — timeline matching process-section style */}
          <TabsContent value="experience">
            <div className="grid lg:grid-cols-[1fr_400px] gap-16 items-start">
              <div>
                {experiences.map((exp, i) => (
                  <TimelineCard
                    key={exp.id}
                    exp={exp}
                    index={i}
                    total={experiences.length}
                  />
                ))}
              </div>

              {/* Right panel — summary (matching process-section) */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="lg:sticky lg:top-28 hidden lg:block"
              >
                <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
                  <div className="p-8">
                    <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-4">
                      {(content?.panel_label as string) || "At a Glance"}
                    </p>
                    <h3 className="text-2xl font-black text-foreground leading-snug mb-4">
                      {(content?.panel_title as string) || "Career Highlights"}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm mb-8">
                      {(content?.panel_description as string) ||
                        "Years of building products that scale, leading teams, and turning complex problems into elegant solutions."}
                    </p>
                    <div className="flex flex-col gap-3">
                      {((content?.panel_items as string[]) || [
                        "8+ years in full-stack development",
                        "Startup to enterprise scale",
                        "Team leadership & mentoring",
                        "Product-driven engineering",
                      ]).map((item, i) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -10 }}
                          animate={inView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.4 + i * 0.07 }}
                          className="flex items-center gap-3 text-sm text-foreground"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                          {item}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>

          {/* Education — glow card style matching philosophy cards */}
          <TabsContent value="education">
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
              {education.length > 0 ? (
                education.map((edu, index) => (
                  <motion.div
                    key={edu.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-accent/40 transition-all duration-500 overflow-hidden"
                  >
                    {/* Hover accent bar */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-purple-500 rounded-b-2xl"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />

                    <div className="flex items-start gap-4">
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: index * 0.1 }}
                        className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent group-hover:from-accent group-hover:to-accent/80 group-hover:text-accent-foreground transition-all duration-500 shrink-0"
                      >
                        <GraduationCap className="h-5 w-5" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-foreground group-hover:text-accent transition-colors duration-300">
                          {edu.degree}
                        </h3>
                        <p className="text-sm font-semibold text-accent mt-0.5">
                          {edu.institution}
                        </p>
                        {edu.field_of_study && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {edu.field_of_study}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2 tabular-nums">
                          {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-accent/5 border border-accent/20 flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="h-8 w-8 text-accent/40" />
                  </div>
                  <p className="text-muted-foreground">Education details coming soon.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Certifications — same glow card style */}
          <TabsContent value="certifications">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl">
              {certifications.length > 0 ? (
                certifications.map((cert, index) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-accent/40 transition-all duration-500 overflow-hidden"
                  >
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-purple-500 rounded-b-2xl"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />

                    <div className="flex items-start gap-4">
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: index * 0.1 }}
                        className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent group-hover:from-accent group-hover:to-accent/80 group-hover:text-accent-foreground transition-all duration-500 shrink-0"
                      >
                        <Award className="h-5 w-5" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-foreground group-hover:text-accent transition-colors duration-300">
                          {cert.name}
                        </h3>
                        <p className="text-sm font-semibold text-accent mt-0.5">
                          {cert.issuer}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 tabular-nums">
                          Issued: {formatDate(cert.issue_date)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-accent/5 border border-accent/20 flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-accent/40" />
                  </div>
                  <p className="text-muted-foreground">Certifications coming soon.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
