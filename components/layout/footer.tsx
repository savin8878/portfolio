import Link from "next/link"
import { Github, Linkedin, Twitter, Mail, MapPin, ArrowUpRight } from "lucide-react"
import { getSiteSettings, getSocialLinks } from "@/lib/data"

const footerLinks = {
  navigation: [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Services", href: "/services" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  resources: [
    { name: "Resume", href: "/resume" },
    { name: "Case Studies", href: "/projects" },
    { name: "Tech Stack", href: "/about#tech-stack" },
  ],
}

const socialIcons: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
}

export async function Footer() {
  const [settings, socialLinks] = await Promise.all([
    getSiteSettings(),
    getSocialLinks(),
  ])

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-xl">A</span>
                </div>
                <span className="font-semibold text-xl text-foreground">
                  {settings?.developer_name || "Akash Vishwakarma"}
                </span>
              </Link>
              <p className="mt-4 text-muted-foreground max-w-md leading-relaxed">
                {settings?.tagline || "Building exceptional digital experiences that drive business growth and user engagement."}
              </p>
              <div className="mt-6 flex items-center gap-4">
                {socialLinks.map((link) => {
                  const Icon = socialIcons[link.platform.toLowerCase()] || Github
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="sr-only">{link.platform}</span>
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Navigation
              </h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.navigation.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Get in Touch
              </h3>
              <ul className="mt-4 space-y-4">
                {settings?.email && (
                  <li>
                    <a
                      href={`mailto:${settings.email}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      {settings.email}
                    </a>
                  </li>
                )}
                {settings?.location && (
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {settings.location}
                  </li>
                )}
                <li>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 text-accent hover:text-accent/80 font-medium transition-colors"
                  >
                    Start a Project
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {new Date().getFullYear()} {settings?.developer_name || "Akash Vishwakarma"}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                {settings?.availability_status || "Available for projects"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
