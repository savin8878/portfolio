"use client"

/**
 * CinematicHero — a full-screen cinematic landing: a full-bleed video
 * introduction fills the hero, with the name, tagline and CTAs overlaid on a
 * readable scrim. Bold fire/ember theme. Drop-in replacement for HeroSection.
 */

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Github, Linkedin, Twitter, Mail, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Magnetic } from "@/components/magnetic"
import { HeroVideo } from "@/components/hero-video"
import { SpeakingIntro } from "@/components/speaking-intro"
import type { SocialLink } from "@/lib/db"

interface CinematicHeroProps {
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
  { href: "mailto:hello@akash.dev", icon: Mail, label: "Email" },
]

export function CinematicHero({
  developerName,
  professionalTitle,
  tagline,
  primaryCtaText,
  primaryCtaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
  socialLinks,
  content,
}: CinematicHeroProps) {
  const availabilityText =
    (content?.availability_text as string) || "Available for new projects"

  const nameParts = developerName.trim().split(/\s+/)
  const firstName = nameParts[0] || developerName

  // The spoken introduction — built from the real résumé content. Overridable
  // via the page content store, but defaults to Akash's story so it speaks even
  // before anything is set in the DB.
  const introLines = (content?.intro_lines as string[]) || [
    `Hi — I'm ${firstName}, a ${professionalTitle.toLowerCase()}.`,
    "For over two years I've built scalable web applications with Next.js, React, TypeScript, and Node.js.",
    "I've shipped AI-powered tools that cut API costs by fifty percent and boosted efficiency by thirty percent.",
    "And I've scaled multilingual platforms to more than two hundred countries across a hundred and ten languages.",
    "Let's build something great together.",
  ]
  const metrics = (content?.metrics as string[]) || [
    "2+ yrs experience",
    "50% lower API costs",
    "+30% efficiency",
    "200+ countries",
    "110+ languages",
  ]

  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden"
      style={{ backgroundColor: "#08070b" }}
    >
      {/* ---------- full-screen video introduction ---------- */}
      <HeroVideo name={developerName} />

      {/* ---------- overlaid content ---------- */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-28 text-center sm:px-6 lg:px-8 lg:text-left">
        <div className="mx-auto max-w-3xl lg:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-7 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-medium"
            style={{
              background: "rgba(255,122,24,0.10)",
              border: "1px solid rgba(255,122,24,0.25)",
              color: "#ffd24a",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: "#34d399" }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "#34d399" }} />
            </span>
            {availabilityText}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-black uppercase leading-[0.88] tracking-tighter"
            style={{ color: "#f5ede6", fontSize: "clamp(3rem, 9vw, 6.5rem)" }}
          >
            <span className="block" style={{ color: "rgba(245,237,230,0.55)", fontSize: "0.42em", letterSpacing: "0.02em" }}>
              {nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : "Hi, I'm"}
            </span>
            <span
              style={{
                backgroundImage: "linear-gradient(100deg,#ff4d2e,#ff7a18 45%,#ffd24a)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {nameParts.length > 1 ? nameParts[nameParts.length - 1] : developerName}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-4 text-sm font-mono uppercase tracking-[0.28em]"
            style={{ color: "#ff9a4a" }}
          >
            {professionalTitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <SpeakingIntro idle={tagline} lines={introLines} metrics={metrics} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row lg:items-start lg:justify-start justify-center"
          >
            <Magnetic strength={0.25}>
              <Button
                asChild
                size="lg"
                className="group h-12 rounded-full px-6 text-sm font-semibold"
                style={{ background: "linear-gradient(100deg,#ff4d2e,#ff7a18)", color: "#1a0a04", border: "none" }}
              >
                <Link href={primaryCtaUrl}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {primaryCtaText}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-full px-6 text-sm font-semibold"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.18)", color: "#f5ede6" }}
              >
                <Link href={secondaryCtaUrl}>{secondaryCtaText}</Link>
              </Button>
            </Magnetic>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-10 flex items-center justify-center gap-1 lg:justify-start"
          >
            {(socialLinks && socialLinks.length > 0
              ? socialLinks.map((l) => ({
                  key: l.id as string | number,
                  href: l.url,
                  label: l.platform,
                  Icon: socialIcons[l.platform.toLowerCase()] || Mail,
                }))
              : fallbackSocialLinks.map((s) => ({ key: s.label, href: s.href, label: s.label, Icon: s.icon }))
            ).map((l) => (
              <Link
                key={l.key}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-full p-3 transition-colors"
                style={{ color: "rgba(245,237,230,0.6)" }}
              >
                <l.Icon className="h-5 w-5 transition-colors group-hover:text-[#ff7a18]" />
                <span className="sr-only">{l.label}</span>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "rgba(245,237,230,0.4)" }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-5 justify-center rounded-full pt-1.5"
          style={{ border: "1px solid rgba(245,237,230,0.25)" }}
        >
          <span className="h-1.5 w-1 rounded-full" style={{ background: "#ff7a18" }} />
        </motion.div>
      </motion.div>
    </section>
  )
}
