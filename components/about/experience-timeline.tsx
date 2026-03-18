"use client"

import { motion } from "framer-motion"
import { Briefcase, GraduationCap, Award } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Experience, Education, Certification } from "@/lib/db"

interface ExperienceTimelineProps {
  experiences: Experience[]
  education: Education[]
  certifications: Certification[]
}

function formatDate(date: Date | null): string {
  if (!date) return "Present"
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })
}

export function ExperienceTimeline({
  experiences,
  education,
  certifications,
}: ExperienceTimelineProps) {
  return (
    <section className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-semibold text-accent uppercase tracking-wider">
            Career Journey
          </h2>
          <p className="mt-2 text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Experience & Background
          </p>
        </motion.div>

        <Tabs defaultValue="experience" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
            <TabsTrigger value="experience" className="gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Experience</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Education</span>
            </TabsTrigger>
            <TabsTrigger value="certifications" className="gap-2">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Certifications</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="experience">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

              <div className="space-y-12">
                {experiences.map((exp, index) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative flex flex-col md:flex-row gap-8 ${
                      index % 2 === 0 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 md:left-1/2 w-3 h-3 bg-accent rounded-full md:-translate-x-1.5 mt-2" />

                    {/* Content */}
                    <div
                      className={`flex-1 ml-6 md:ml-0 ${
                        index % 2 === 0 ? "md:pr-12" : "md:pl-12"
                      }`}
                    >
                      <div className="p-6 rounded-2xl bg-card border border-border">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {exp.job_title}
                            </h3>
                            <p className="text-accent font-medium">
                              {exp.company_name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              {formatDate(exp.start_date)} -{" "}
                              {exp.is_current ? "Present" : formatDate(exp.end_date)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {exp.location}
                            </p>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-4">
                          {exp.description}
                        </p>

                        {exp.achievements && exp.achievements.length > 0 && (
                          <ul className="space-y-2 mb-4">
                            {exp.achievements.map((achievement, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        )}

                        {exp.tech_used && exp.tech_used.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {exp.tech_used.map((tech) => (
                              <Badge
                                key={tech}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block flex-1" />
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="education">
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              {education.length > 0 ? (
                education.map((edu, index) => (
                  <motion.div
                    key={edu.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-card border border-border"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-accent/10 text-accent">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {edu.degree}
                        </h3>
                        <p className="text-accent">{edu.institution}</p>
                        {edu.field_of_study && (
                          <p className="text-sm text-muted-foreground">
                            {edu.field_of_study}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">
                          {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Education details coming soon.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="certifications">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {certifications.length > 0 ? (
                certifications.map((cert, index) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-card border border-border"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-accent/10 text-accent">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {cert.name}
                        </h3>
                        <p className="text-sm text-accent">{cert.issuer}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Issued: {formatDate(cert.issue_date)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12 text-muted-foreground">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Certifications coming soon.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
