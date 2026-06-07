"use client"

import Image from "next/image"
import { Briefcase, GraduationCap, Award } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Experience, Education, Certification } from "@/lib/db"
import { Reveal, Stagger, StaggerItem, Parallax, TiltCard } from "@/components/anim"

interface ExperienceTimelineProps {
  experiences: Experience[]
  education: Education[]
  certifications: Certification[]
  content?: Record<string, unknown>
}

function formatDate(date: Date | null): string {
  if (!date) return "Present"
  return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

function TimelineItem({ exp, index }: { exp: Experience; index: number }) {
  return (
    <StaggerItem
      from={index % 2 ? "right" : "left"}
      className="group relative pb-12 last:pb-0"
    >
      <div className="absolute -left-[2.65rem] top-1 grid h-7 w-7 place-items-center rounded-full border border-border bg-background font-mono text-[10px] font-semibold tabular-nums text-muted-foreground transition-colors duration-500 group-hover:border-accent group-hover:text-accent sm:-left-[3.65rem]">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          {exp.company_logo ? (
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-border/50 bg-muted">
              <Image src={exp.company_logo} alt={exp.company_name} fill className="object-contain p-1" sizes="36px" />
            </div>
          ) : null}
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent md:text-2xl">
              {exp.job_title}
            </h3>
            <p className="text-sm font-medium text-accent">{exp.company_name}</p>
          </div>
        </div>
        <div className="text-right font-mono text-xs text-muted-foreground">
          <p className="tabular-nums">
            {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}
          </p>
          <p className="mt-0.5">{exp.location}</p>
        </div>
      </div>

      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{exp.description}</p>

      {exp.achievements && exp.achievements.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {exp.achievements.map((a) => (
            <li key={a} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {a}
            </li>
          ))}
        </ul>
      )}

      {exp.tech_used && exp.tech_used.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
          {exp.tech_used.map((tech) => (
            <span key={tech} className="font-mono text-xs text-muted-foreground/60">{tech}</span>
          ))}
        </div>
      )}
    </StaggerItem>
  )
}

export function ExperienceTimeline({ experiences, education, certifications, content }: ExperienceTimelineProps) {
  return (
    <section className="relative overflow-hidden border-t border-border/50 py-24 sm:py-32">
      {/* background glow drifts up, ghost count drifts down — layered depth */}
      <Parallax
        speed={-44}
        className="pointer-events-none absolute -left-24 top-1/3 -z-10 h-[28rem] w-[28rem] opacity-50"
      >
        <div
          className="h-full w-full rounded-full blur-3xl"
          style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(255,122,24,0.07), transparent 70%)" }}
        />
      </Parallax>

      <Parallax
        speed={40}
        className="pointer-events-none absolute right-0 top-12 -z-10 select-none"
      >
        <span className="font-mono text-[9rem] font-black leading-none tracking-tighter text-muted-foreground/5 sm:text-[14rem]">
          {String(experiences.length).padStart(2, "0")}
        </span>
      </Parallax>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* header group — eyebrow drops from top, heading slides from left */}
        <div className="mb-14">
          <Reveal from="top">
            <span className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-accent">
              <span className="h-px w-8 bg-accent/60" />
              {(content?.label as string) || "Career Journey"}
            </span>
          </Reveal>
          <Reveal from="left" delay={0.08}>
            <h2 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-foreground sm:text-5xl md:text-6xl">
              {(content?.title as string) || "Experience &"}{" "}
              <span className="text-gradient-static">{(content?.title_highlight as string) || "background."}</span>
            </h2>
          </Reveal>
        </div>

        <Tabs defaultValue="experience" className="w-full">
          <Reveal from="zoom" delay={0.1}>
            <TabsList className="mb-14 inline-flex h-12 rounded-full border border-border/50 bg-card p-1">
              <TabsTrigger value="experience" className="gap-2 rounded-full px-6 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <Briefcase className="h-4 w-4" /> <span className="hidden sm:inline">Experience</span>
              </TabsTrigger>
              <TabsTrigger value="education" className="gap-2 rounded-full px-6 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <GraduationCap className="h-4 w-4" /> <span className="hidden sm:inline">Education</span>
              </TabsTrigger>
              <TabsTrigger value="certifications" className="gap-2 rounded-full px-6 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <Award className="h-4 w-4" /> <span className="hidden sm:inline">Certifications</span>
              </TabsTrigger>
            </TabsList>
          </Reveal>

          {/* Experience */}
          <TabsContent value="experience">
            <div className="grid items-start gap-16 lg:grid-cols-[1fr_340px]">
              <Stagger stagger={0.09} className="relative ml-10 border-l border-border/50 pl-10 sm:ml-14 sm:pl-14">
                {experiences.map((exp, i) => (
                  <TimelineItem key={exp.id} exp={exp} index={i} />
                ))}
              </Stagger>

              {/* sticky side panel — slides from right, drifts against the page (negative parallax), 3D tilt */}
              <Reveal from="right" delay={0.15} className="hidden lg:sticky lg:top-28 lg:block">
                <Parallax speed={-28}>
                  <TiltCard className="rounded-3xl border border-border/60 bg-card/40 p-8 backdrop-blur-sm">
                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-accent">
                      {(content?.panel_label as string) || "At a glance"}
                    </p>
                    <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-foreground">
                      {(content?.panel_title as string) || "Career highlights"}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {(content?.panel_description as string) ||
                        "Years of building products that scale, leading teams, and turning complex problems into elegant solutions."}
                    </p>
                    <div className="mt-7 flex flex-col gap-3">
                      {((content?.panel_items as string[]) || [
                        "8+ years in full-stack development",
                        "Startup to enterprise scale",
                        "Team leadership & mentoring",
                        "Product-driven engineering",
                      ]).map((item) => (
                        <div key={item} className="flex items-center gap-3 text-sm text-foreground">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </TiltCard>
                </Parallax>
              </Reveal>
            </div>
          </TabsContent>

          {/* Education */}
          <TabsContent value="education">
            {education.length > 0 ? (
              <Stagger stagger={0.08} className="max-w-3xl border-t border-border/50">
                {education.map((edu, i) => (
                  <StaggerItem key={edu.id} from={i % 2 ? "right" : "left"}>
                    <div className="group flex items-start justify-between gap-6 border-b border-border/50 py-7">
                      <div className="flex items-start gap-4">
                        <GraduationCap className="mt-1 h-5 w-5 shrink-0 text-accent" />
                        <div>
                          <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-accent">{edu.degree}</h3>
                          <p className="text-sm font-medium text-accent">{edu.institution}</p>
                          {edu.field_of_study && <p className="mt-1 text-sm text-muted-foreground">{edu.field_of_study}</p>}
                        </div>
                      </div>
                      <p className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                        {formatDate(edu.start_date)} — {formatDate(edu.end_date)}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            ) : (
              <p className="py-16 text-center text-muted-foreground">Education details coming soon.</p>
            )}
          </TabsContent>

          {/* Certifications */}
          <TabsContent value="certifications">
            {certifications.length > 0 ? (
              <Stagger stagger={0.08} className="max-w-3xl border-t border-border/50">
                {certifications.map((cert, i) => (
                  <StaggerItem key={cert.id} from={i % 2 ? "right" : "left"}>
                    <div className="group flex items-start justify-between gap-6 border-b border-border/50 py-7">
                      <div className="flex items-start gap-4">
                        <Award className="mt-1 h-5 w-5 shrink-0 text-accent" />
                        <div>
                          <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-accent">{cert.name}</h3>
                          <p className="text-sm font-medium text-accent">{cert.issuer}</p>
                        </div>
                      </div>
                      <p className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                        {formatDate(cert.issue_date)}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            ) : (
              <p className="py-16 text-center text-muted-foreground">Certifications coming soon.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
