"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, MapPin, Clock, Github, Linkedin, Twitter } from "lucide-react"

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

export function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-8"
    >
      {/* Status */}
      <div className="p-6 rounded-2xl bg-accent/5 border border-accent/20">
        <div className="flex items-center gap-3 mb-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="font-semibold text-foreground">
            Available for Projects
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Currently accepting new projects starting in 2-4 weeks.
        </p>
      </div>

      {/* Contact Details */}
      <div className="p-6 rounded-2xl bg-card border border-border">
        <h3 className="font-semibold text-foreground mb-4">Contact Details</h3>
        <div className="space-y-4">
          {contactDetails.map((detail) => (
            <div key={detail.label} className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                <detail.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{detail.label}</p>
                {detail.href ? (
                  <Link
                    href={detail.href}
                    className="font-medium text-foreground hover:text-accent transition-colors"
                  >
                    {detail.value}
                  </Link>
                ) : (
                  <p className="font-medium text-foreground">{detail.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="p-6 rounded-2xl bg-card border border-border">
        <h3 className="font-semibold text-foreground mb-4">Connect</h3>
        <div className="flex gap-3">
          {socialLinks.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
            >
              <social.icon className="h-5 w-5" />
              <span className="sr-only">{social.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Note */}
      <div className="p-6 rounded-2xl bg-muted/50 border border-border">
        <h3 className="font-semibold text-foreground mb-2">What to Expect</h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>1. Initial response within 24 hours</li>
          <li>2. Discovery call to discuss your project</li>
          <li>3. Detailed proposal within 3-5 business days</li>
          <li>4. Kick-off once terms are agreed</li>
        </ul>
      </div>
    </motion.div>
  )
}
