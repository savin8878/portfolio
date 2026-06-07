"use client"

import Link from "next/link"
import { Github, Linkedin, Twitter, Mail, ArrowUpRight } from "lucide-react"
import { Reveal, Stagger, StaggerItem, Parallax, TiltCard } from "@/components/anim"

const footerLinks = {
  navigation: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Work" },
    { href: "/services", label: "Services" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],
  services: [
    { href: "/services#saas", label: "SaaS Development" },
    { href: "/services#mvp", label: "MVP Development" },
    { href: "/services#consulting", label: "Technical Consulting" },
    { href: "/services#api", label: "API Development" },
  ],
}

const socialLinks = [
  { href: "https://github.com", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  { href: "mailto:hello@alexchen.dev", icon: Mail, label: "Email" },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-border/50 overflow-hidden">
      {/* layered background drift for depth */}
      <Parallax speed={-50} className="absolute inset-0 -z-10">
        <div className="absolute inset-0 aurora opacity-30" />
      </Parallax>
      <Parallax speed={34} className="absolute inset-0 -z-10">
        <div className="absolute inset-0 dot-grid mask-fade-b opacity-30" />
      </Parallax>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-20">
          {/* Giant wordmark */}
          <Reveal from="zoom" duration={0.9} className="mb-16 pb-12 border-b border-border/50">
            <TiltCard max={6}>
              <Link href="/contact" className="group block">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-[-0.035em] leading-[0.9] text-foreground">
                    Let&rsquo;s <span className="text-gradient-static">talk.</span>
                  </h2>
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-linear-to-br from-accent to-accent-2 grid place-items-center text-accent-foreground shadow-xl shadow-accent/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-45">
                    <ArrowUpRight className="h-6 w-6 md:h-7 md:w-7" />
                  </div>
                </div>
              </Link>
            </TiltCard>
          </Reveal>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            {/* Brand */}
            <Reveal from="left" distance={56} className="md:col-span-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 group"
              >
                <div className="relative w-9 h-9 rounded-xl bg-linear-to-br from-accent to-accent-2 grid place-items-center overflow-hidden">
                  <span className="text-accent-foreground font-bold">A</span>
                  <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
                </div>
                <span className="text-lg font-semibold tracking-tight">
                  akash<span className="text-accent">.</span>dev
                </span>
              </Link>
              <p className="mt-5 max-w-md text-muted-foreground leading-relaxed text-sm">
                Full-stack product engineer. I help teams ship scalable SaaS platforms, AI tools, and high-performance web products that actually move the needle.
              </p>
              <Stagger className="mt-7 flex gap-2" stagger={0.08}>
                {socialLinks.map((social, index) => (
                  <StaggerItem key={social.label} from={index % 2 ? "bottom" : "top"} distance={24}>
                    <Link
                      href={social.href}
                      className="group relative inline-flex p-2.5 rounded-full bg-muted/40 border border-border/50 text-muted-foreground hover:text-foreground hover:border-accent/40 hover:bg-accent/5 transition-all duration-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <social.icon className="h-4 w-4" />
                      <span className="sr-only">{social.label}</span>
                    </Link>
                  </StaggerItem>
                ))}
              </Stagger>
            </Reveal>

            {/* Navigation */}
            <Reveal from="bottom" distance={48}>
              <h3 className="text-[11px] font-semibold text-foreground uppercase tracking-[0.18em] mb-5">
                Navigation
              </h3>
              <Stagger className="space-y-3" stagger={0.08}>
                {footerLinks.navigation.map((link, index) => (
                  <StaggerItem key={link.href} from={index % 2 ? "left" : "right"} distance={28}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </StaggerItem>
                ))}
              </Stagger>
            </Reveal>

            {/* Services */}
            <Reveal from="right" distance={48} delay={0.08}>
              <h3 className="text-[11px] font-semibold text-foreground uppercase tracking-[0.18em] mb-5">
                Services
              </h3>
              <Stagger className="space-y-3" stagger={0.08} delay={0.1}>
                {footerLinks.services.map((link, index) => (
                  <StaggerItem key={link.href} from={index % 2 ? "right" : "left"} distance={28}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </StaggerItem>
                ))}
              </Stagger>
            </Reveal>
          </div>
        </div>

        {/* Bottom */}
        <Reveal from="bottom" distance={32} className="border-t border-border/50 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-mono">
            © {year} Akash Vishwakarma. Crafted with care.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground hover:text-accent transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-muted-foreground hover:text-accent transition-colors"
            >
              Terms
            </Link>
            <span className="text-xs text-muted-foreground font-mono flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              All systems go
            </span>
          </div>
        </Reveal>
      </div>
    </footer>
  )
}
