"use client"

import Link from "next/link"
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"
import { ArrowRight, Github, Linkedin, Twitter, Mail, Sparkles } from "lucide-react"
import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import type { SocialLink } from "@/lib/db"

interface HeroSectionProps {
  developerName: string
  professionalTitle: string
  tagline: string
  primaryCtaText: string
  primaryCtaUrl: string
  secondaryCtaText: string
  secondaryCtaUrl: string
  socialLinks?: SocialLink[]
  content?: Record<string, unknown>
}

const socialIcons: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
}

const fallbackSocialLinks = [
  { href: "https://github.com", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  { href: "mailto:hello@alexchen.dev", icon: Mail, label: "Email" },
]

export function HeroSection({
  developerName,
  professionalTitle,
  tagline,
  primaryCtaText,
  primaryCtaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
  socialLinks,
  content,
}: HeroSectionProps) {
  const availabilityText =
    (content?.availability_text as string) || "Available for new projects"

  const sectionRef = useRef<HTMLElement>(null)
  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const smoothX = useSpring(mx, { stiffness: 120, damping: 18 })
  const smoothY = useSpring(my, { stiffness: 120, damping: 18 })
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${smoothX}% ${smoothY}%, oklch(from var(--accent) l c h / 0.18), transparent 60%)`

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const handle = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      mx.set(((e.clientX - rect.left) / rect.width) * 100)
      my.set(((e.clientY - rect.top) / rect.height) * 100)
    }
    el.addEventListener("mousemove", handle)
    return () => el.removeEventListener("mousemove", handle)
  }, [mx, my])

  const nameParts = developerName.trim().split(/\s+/)
  const nameLead = nameParts.slice(0, -1).join(" ")
  const nameTail = nameParts.length > 1 ? nameParts[nameParts.length - 1] : developerName
  const hasLead = nameParts.length > 1

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden aurora grain"
    >
      {/* Layered background — mesh + dot grid + cursor spotlight */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/60" />
        <div className="absolute inset-0 dot-grid mask-fade-radial opacity-70" />
        <motion.div className="absolute inset-0" style={{ background: spotlight }} />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-[15%] left-[8%] w-64 h-64 rounded-full bg-accent opacity-20 blur-3xl blob -z-10" />
      <div className="absolute bottom-[18%] right-[6%] w-80 h-80 rounded-full bg-accent-2 opacity-15 blur-3xl blob -z-10" style={{ animationDelay: "-6s" }} />
      <div className="absolute top-[40%] right-[30%] w-48 h-48 rounded-full bg-accent-3 opacity-15 blur-3xl blob -z-10" style={{ animationDelay: "-12s" }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
        <div className="flex flex-col items-center text-center">

          {/* Availability badge — modern glass pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="group relative inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-foreground/90">{availabilityText}</span>
              <span className="h-3 w-px bg-border" />
              <span className="text-muted-foreground group-hover:text-accent transition-colors">
                v2026 · Spring
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-[-0.04em] leading-[0.95] text-foreground"
          >
            {hasLead && (
              <span className="block text-foreground/70 text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-2 font-medium">
                {nameLead}
              </span>
            )}
            <span className="relative inline-block">
              <span className="text-gradient">{nameTail}</span>
              <span
                className="absolute left-0 right-0 -bottom-2 h-[3px] rounded-full opacity-70"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, oklch(from var(--accent) l c h / 0.9), oklch(from var(--accent-2) l c h / 0.9), transparent)",
                }}
              />
            </span>
          </motion.h1>

          {/* Professional title — clean subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 text-lg sm:text-xl md:text-2xl font-medium text-foreground/80 tracking-tight"
          >
            {professionalTitle}
          </motion.p>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed text-balance"
          >
            {tagline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-12 flex flex-col sm:flex-row items-center gap-3"
          >
            <Button
              asChild
              size="lg"
              className="group relative overflow-hidden rounded-full h-12 px-6 shimmer shadow-lg shadow-accent/20"
            >
              <Link href={primaryCtaUrl}>
                <Sparkles className="mr-2 h-4 w-4 text-accent-foreground/80" />
                <span className="relative z-10">{primaryCtaText}</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full h-12 px-6 bg-background/50 backdrop-blur-sm border-border/70 hover:border-accent/50 hover:bg-accent/5"
            >
              <Link href={secondaryCtaUrl}>{secondaryCtaText}</Link>
            </Button>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-14 flex items-center gap-1"
          >
            {(socialLinks && socialLinks.length > 0
              ? socialLinks.map((link) => ({
                  key: link.id as string | number,
                  href: link.url,
                  label: link.platform,
                  Icon: socialIcons[link.platform.toLowerCase()] || Mail,
                }))
              : fallbackSocialLinks.map((s) => ({
                  key: s.label,
                  href: s.href,
                  label: s.label,
                  Icon: s.icon,
                }))
            ).map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="group relative p-3 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="absolute inset-0 rounded-full bg-accent/10 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300" />
                <link.Icon className="relative h-5 w-5" />
                <span className="sr-only">{link.label}</span>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="h-9 w-5 rounded-full border border-border/80 flex justify-center pt-1.5"
        >
          <span className="h-1.5 w-1 rounded-full bg-accent" />
        </motion.div>
      </motion.div>
    </section>
  )
}
