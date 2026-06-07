"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, Mail, ArrowRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal, Stagger, StaggerItem, Parallax, TiltCard } from "@/components/anim"

interface AboutHeroProps {
  name: string
  title: string
  bio: string
  location: string
  email: string
  profileImage?: string | null
  resumeUrl?: string | null
  availabilityStatus?: string
  content?: Record<string, unknown>
}

const stats = [
  { value: "50+", label: "Projects shipped" },
  { value: "8+", label: "Years of experience" },
  { value: "30+", label: "Happy clients" },
]

export function AboutHero({
  name,
  title,
  bio,
  location,
  email,
  profileImage,
  resumeUrl,
  availabilityStatus,
  content,
}: AboutHeroProps) {
  const experienceText =
    (content?.experience_text as string) ||
    "With over 8 years of experience, I've helped startups and enterprises build products that scale. My approach combines deep technical expertise with a strong focus on business outcomes — every line of code should contribute to measurable impact."
  const personalText =
    (content?.personal_text as string) ||
    "When I'm not coding, you'll find me exploring new technologies, contributing to open source, or mentoring aspiring developers. I believe in continuous learning and sharing knowledge with the community."

  const parts = name.trim().split(/\s+/)
  const lead = parts.length > 1 ? parts.slice(0, -1).join(" ") : ""
  const tail = parts.length > 1 ? parts[parts.length - 1] : name

  return (
    <section className="relative overflow-hidden border-b border-border/50 pb-20 pt-28 sm:pt-32">
      {/* top glow drifts up (negative) — background layer */}
      <Parallax
        speed={-50}
        className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-60"
      >
        <div
          className="h-full w-full"
          style={{ background: "radial-gradient(50% 100% at 50% 0%, rgba(255,122,24,0.08), transparent 70%)" }}
        />
      </Parallax>

      {/* oversized ghost initial drifts down (positive) — opposite-direction depth */}
      <Parallax
        speed={52}
        className="pointer-events-none absolute -right-8 top-20 -z-10 select-none sm:right-0"
      >
        <span className="font-mono text-[11rem] font-black leading-none tracking-tighter text-muted-foreground/5 sm:text-[18rem]">
          {name.charAt(0).toUpperCase()}
        </span>
      </Parallax>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* copy */}
          <div>
            <Reveal from="top" className="flex items-center gap-3">
              <span className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-accent">
                <span className="h-px w-8 bg-accent/60" />
                About
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                {availabilityStatus || "Available for projects"}
              </span>
            </Reveal>

            <Reveal
              from="left"
              delay={0.05}
              className="mt-6 text-5xl font-semibold leading-[0.92] tracking-[-0.04em] text-foreground sm:text-6xl md:text-7xl"
            >
              <h1>
                {lead && <span className="block text-foreground/60">{lead}</span>}
                <span className="text-gradient-static">{tail}</span>
              </h1>
            </Reveal>

            <Reveal from="bottom" delay={0.12} className="mt-5 text-xl font-medium text-foreground/80">
              <p>{title}</p>
            </Reveal>
            <Reveal from="bottom" delay={0.18} className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              <p>{bio}</p>
            </Reveal>

            <Reveal from="bottom" delay={0.24} className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-12 rounded-full px-6">
                <a href={resumeUrl || "/resume.pdf"} download>
                  <Download className="mr-2 h-4 w-4" />
                  Download résumé
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="group h-12 rounded-full border-border/60 px-6 hover:border-accent/50">
                <Link href="/contact">
                  Let&apos;s talk
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </Reveal>

            <Reveal from="bottom" delay={0.3} className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-accent" /> {location}</span>
              <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-accent" /> {email}</span>
            </Reveal>
          </div>

          {/* portrait — arrives from the right, with a parallax glow behind it */}
          <Reveal from="right" delay={0.1} className="relative mx-auto w-full max-w-sm">
            <Parallax speed={36} className="absolute -inset-6 -z-10">
              <div className="h-full w-full rounded-4xl bg-linear-to-br from-accent/25 via-accent-3/10 to-transparent blur-2xl" />
            </Parallax>
            <TiltCard className="relative aspect-4/5 w-full overflow-hidden rounded-4xl border border-border/60 bg-card">
              {profileImage ? (
                <Image src={profileImage} alt={name} fill className="object-cover" priority sizes="400px" />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-linear-to-br from-accent/15 via-card to-accent-3/10">
                  <span className="select-none text-[11rem] font-black leading-none text-foreground/10">{name.charAt(0)}</span>
                </div>
              )}
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/60 to-transparent" />
            </TiltCard>
          </Reveal>
        </div>

        {/* stats — editorial, alternating zoom / bottom */}
        <Stagger className="mt-16 grid grid-cols-3 border-t border-border/50 pt-10 md:divide-x md:divide-border/50">
          {stats.map((s, i) => (
            <StaggerItem
              key={s.label}
              from={i % 2 ? "bottom" : "zoom"}
              className="px-2 md:px-8 md:first:pl-0"
            >
              <div className="text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">{s.value}</div>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </StaggerItem>
          ))}
        </Stagger>

        {/* story — editorial two columns sliding in from opposite sides */}
        <Stagger className="mt-16 grid gap-10 border-t border-border/50 pt-12 md:grid-cols-2 md:gap-16">
          <StaggerItem from="left">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-accent">The story so far</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{experienceText}</p>
          </StaggerItem>
          <StaggerItem from="right">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-accent">Beyond code</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{personalText}</p>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  )
}
