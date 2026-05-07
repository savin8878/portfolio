"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  MapPin,
  Mail,
  Calendar,
  ArrowRight,
  Download,
  Sparkles,
  Code2,
  Layers,
  Rocket,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  SketchUnderline,
  SketchCircle,
  SketchStar,
  SketchSquiggle,
} from "@/components/sketch-primitives"
import { SketchDoodles } from "@/components/sketch-doodles"

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

const floatingStats = [
  { icon: Code2, value: "50+", label: "Projects" },
  { icon: Layers, value: "8+", label: "Years" },
  { icon: Rocket, value: "30+", label: "Clients" },
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
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])
  const textY = useTransform(scrollYProgress, [0, 0.5], ["0%", "15%"])

  const experienceText =
    (content?.experience_text as string) ||
    "With over 8 years of experience, I have helped startups and enterprises build products that scale. My approach combines deep technical expertise with a strong focus on business outcomes, ensuring every line of code contributes to measurable impact."

  const personalText =
    (content?.personal_text as string) ||
    "When I am not coding, you will find me exploring new technologies, contributing to open source projects, or mentoring aspiring developers. I believe in continuous learning and sharing knowledge with the community."

  const yearsExperience =
    (content?.years_experience as string) || "8+ Years Experience"

  return (
    <section ref={containerRef} className="relative overflow-hidden paper-grain">
      {/* === FULL-WIDTH IMMERSIVE HERO BANNER === */}
      <div className="relative min-h-[60vh] lg:min-h-[70vh] flex items-end">
        <SketchDoodles density="sparse" className="-z-5 opacity-70" />
        {/* Parallax background */}
        <motion.div style={{ y: backgroundY }} className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/50" />
          <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-accent/[0.07] rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/[0.05] rounded-full blur-[100px]" />
          {/* Noise grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </motion.div>

        {/* Vertical line accents */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-[20%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/30 to-transparent" />
          <div className="absolute left-[80%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/30 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pb-20 pt-32 lg:pt-40">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto] items-end">
            {/* Text content */}
            <motion.div style={{ y: textY }}>
              {/* Availability badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {availabilityStatus || "Available for projects"}
                  </span>
                </div>
              </motion.div>

              {/* Large typographic name */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="h-px w-8 bg-accent" />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">
                    About Me
                  </span>
                </div>
                <motion.span
                  initial={{ opacity: 0, rotate: -6 }}
                  animate={{ opacity: 1, rotate: -4 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="font-sketch text-3xl sm:text-4xl text-accent/90 block mb-3"
                  aria-hidden
                >
                  — nice to meet you —
                </motion.span>
                <h1 className="relative text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-foreground leading-[0.9]">
                  {name.split(" ").map((word, i) => (
                    <span key={word} className="block">
                      {i === 1 ? (
                        <span className="relative inline-block">
                          <span
                            className="bg-clip-text text-transparent relative z-10"
                            style={{
                              backgroundImage:
                                "linear-gradient(90deg, hsl(var(--accent)), #818cf8)",
                            }}
                          >
                            {word}
                          </span>
                          <SketchUnderline
                            color="oklch(0.6 0.2 250)"
                            strokeWidth={5}
                            delay={0.9}
                          />
                        </span>
                      ) : (
                        word
                      )}
                    </span>
                  ))}
                  <SketchStar
                    color="oklch(0.6 0.2 320)"
                    delay={1.3}
                    className="absolute -top-6 right-[15%] w-8 h-8 hidden md:block"
                  />
                  <SketchStar
                    color="oklch(0.65 0.15 180)"
                    delay={1.5}
                    className="absolute bottom-4 -right-8 w-5 h-5 hidden md:block"
                  />
                </h1>
              </motion.div>

              {/* Title */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-6 text-xl sm:text-2xl font-medium text-muted-foreground"
              >
                {title}
              </motion.p>
            </motion.div>

            {/* Profile image — creative treatment */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden lg:block"
            >
              <div className="relative w-[340px] h-[420px]">
                {/* Glow behind image */}
                <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-accent/20 via-purple-500/10 to-transparent blur-2xl opacity-60" />

                {/* Main image container */}
                <motion.div
                  style={{ scale: imageScale }}
                  className="relative w-full h-full rounded-3xl overflow-hidden border border-border/50 bg-card"
                >
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt={name}
                      fill
                      className="object-cover"
                      priority
                      sizes="340px"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-transparent to-purple-500/10" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[12rem] font-black text-accent/15 select-none leading-none">
                          {name.charAt(0)}
                        </span>
                      </div>
                    </>
                  )}

                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-card/90 to-transparent" />

                  {/* Top accent line */}
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
                </motion.div>

                {/* Floating stat cards */}
                {floatingStats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: 0.5 + i * 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                    }}
                    className={`absolute ${
                      i === 0
                        ? "-left-14 top-12"
                        : i === 1
                          ? "-right-10 top-1/2 -translate-y-1/2"
                          : "-left-10 bottom-16"
                    }`}
                  >
                    <motion.div
                      animate={{ y: [0, i % 2 === 0 ? -6 : 6, 0] }}
                      transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-border/50 bg-card/90 backdrop-blur-sm shadow-lg"
                    >
                      <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                        <stat.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-foreground leading-none">
                          {stat.value}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium">
                          {stat.label}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}

                {/* Corner decoration */}
                <motion.div
                  animate={{ rotate: [0, 90, 180, 270, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-4 -right-4 w-8 h-8"
                >
                  <Sparkles className="w-full h-full text-accent/30" />
                </motion.div>

                {/* Hand-drawn circle around the profile image */}
                <SketchCircle
                  color="oklch(0.6 0.2 250 / 0.6)"
                  strokeWidth={2.5}
                  delay={1.2}
                  duration={2.2}
                  className="-inset-6 w-[calc(100%+3rem)] h-[calc(100%+3rem)]"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* === BIO SECTION — bento-inspired layout === */}
      <div className="relative border-b border-border/40 paper-grain">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/20 to-background -z-10" />
        <SketchSquiggle
          color="oklch(0.55 0.2 250 / 0.3)"
          strokeWidth={2}
          className="absolute top-6 left-0 right-0 h-5"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main bio — spans 2 cols */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 group rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 lg:p-10 hover:border-accent/30 transition-all duration-500 overflow-hidden relative"
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <Code2 className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-foreground">
                  The Story So Far
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-[15px] mb-4">
                {bio}
              </p>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                {experienceText}
              </p>
            </motion.div>

            {/* Right column — stacked cards */}
            <div className="flex flex-col gap-6">
              {/* Personal card */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="group rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 hover:border-accent/30 transition-all duration-500 overflow-hidden relative flex-1"
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    Beyond Code
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {personalText}
                </p>
              </motion.div>

              {/* Quick info card */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 hover:border-accent/30 transition-all duration-500 overflow-hidden relative"
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
                <div className="flex flex-col gap-3">
                  {[
                    { icon: MapPin, text: location },
                    { icon: Mail, text: email },
                    { icon: Calendar, text: yearsExperience },
                  ].map(({ icon: Icon, text }) => (
                    <div
                      key={text}
                      className="flex items-center gap-3 text-sm text-muted-foreground"
                    >
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Icon className="h-3.5 w-3.5 text-accent" />
                      </div>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA buttons */}
                <div className="mt-6 pt-6 border-t border-border/40 flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="sm"
                    className="group/btn rounded-full flex-1"
                  >
                    <a href={resumeUrl || "/resume.pdf"} download>
                      <Download className="mr-2 h-3.5 w-3.5" />
                      Resume
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="group/btn rounded-full flex-1"
                  >
                    <Link href="/contact">
                      Let&apos;s Talk
                      <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Mobile profile image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:hidden mt-8 relative rounded-3xl overflow-hidden border border-border/50 aspect-[4/3] max-w-md mx-auto"
          >
            {profileImage ? (
              <Image
                src={profileImage}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-muted to-purple-500/10 flex items-center justify-center">
                <span className="text-[8rem] font-black text-accent/15 select-none">
                  {name.charAt(0)}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
