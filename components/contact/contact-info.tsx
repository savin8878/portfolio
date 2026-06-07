"use client"

import Link from "next/link"
import { Mail, MapPin, Clock, Github, Linkedin, Twitter } from "lucide-react"
import { Reveal, Stagger, StaggerItem, TiltCard } from "@/components/anim"

const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@alexchen.dev",
    href: "mailto:hello@alexchen.dev",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "San Francisco, CA",
    href: null,
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "Within 24 hours",
    href: null,
  },
]

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
]

const expectations = [
  "Initial response within 24 hours",
  "Discovery call to discuss your project",
  "Detailed proposal within 3-5 business days",
  "Kick-off once terms are agreed",
]

export function ContactInfo() {
  return (
    <div className="space-y-12">
      {/* Status */}
      <Reveal from="right">
        <TiltCard className="rounded-2xl border border-accent/20 bg-accent/5 p-6">
          <div className="mb-2 flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
            </span>
            <span className="font-semibold text-foreground">Available for Projects</span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Currently accepting new projects starting in 2-4 weeks.
          </p>
        </TiltCard>
      </Reveal>

      {/* Contact Details */}
      <div>
        <Reveal from="top">
          <span className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-accent">
            <span className="h-px w-8 bg-accent/60" />
            Contact Details
          </span>
        </Reveal>
        <Stagger className="mt-6 border-t border-border/50">
          {contactDetails.map((detail, i) => (
            <StaggerItem
              key={detail.label}
              from={i % 2 ? "right" : "left"}
              className="flex items-start gap-4 border-b border-border/50 py-4"
            >
              <span className="mt-0.5 text-accent">
                <detail.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground/60">
                  {detail.label}
                </p>
                {detail.href ? (
                  <Link
                    href={detail.href}
                    className="font-medium text-foreground transition-colors hover:text-accent"
                  >
                    {detail.value}
                  </Link>
                ) : (
                  <p className="font-medium text-foreground">{detail.value}</p>
                )}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {/* Social Links */}
      <div>
        <Reveal from="left">
          <span className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-accent">
            <span className="h-px w-8 bg-accent/60" />
            Connect
          </span>
        </Reveal>
        <Stagger className="mt-6 flex gap-3">
          {socialLinks.map((social, i) => (
            <StaggerItem key={social.label} from={i % 2 ? "bottom" : "zoom"}>
              <Link
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:border-accent/60 hover:text-accent"
              >
                <social.icon className="h-5 w-5" />
                <span className="sr-only">{social.label}</span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {/* Quick Note */}
      <div>
        <Reveal from="bottom">
          <span className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-accent">
            <span className="h-px w-8 bg-accent/60" />
            What to Expect
          </span>
        </Reveal>
        <Stagger className="mt-6 space-y-4">
          {expectations.map((step, i) => (
            <StaggerItem
              key={step}
              from={i % 2 ? "right" : "left"}
              className="flex items-baseline gap-4"
            >
              <span className="font-mono text-sm tabular-nums text-muted-foreground/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground">{step}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  )
}
