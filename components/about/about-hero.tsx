"use client"

import { motion } from "framer-motion"
import { MapPin, Mail, Download, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AboutHeroProps {
  name: string
  title: string
  bio: string
  location: string
  email: string
}

export function AboutHero({ name, title, bio, location, email }: AboutHeroProps) {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Image/Avatar Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="aspect-square max-w-md mx-auto lg:mx-0 rounded-3xl bg-muted overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-accent/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-9xl font-bold text-accent/30">
                  {name.charAt(0)}
                </span>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/10 rounded-2xl -z-10" />
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-accent/5 rounded-full -z-10" />
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              About Me
            </h1>
            <p className="mt-2 text-xl text-accent font-medium">{title}</p>

            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {bio}
            </p>

            <p className="mt-4 text-muted-foreground leading-relaxed">
              With over 8 years of experience, I have helped startups and
              enterprises build products that scale. My approach combines deep
              technical expertise with a strong focus on business outcomes,
              ensuring every line of code contributes to measurable impact.
            </p>

            <p className="mt-4 text-muted-foreground leading-relaxed">
              When I am not coding, you will find me exploring new technologies,
              contributing to open source projects, or mentoring aspiring
              developers. I believe in continuous learning and sharing knowledge
              with the community.
            </p>

            {/* Quick Info */}
            <div className="mt-8 flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-accent" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-accent" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 text-accent" />
                <span>8+ Years Experience</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild>
                <a href="/resume.pdf" download>
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:hello@alexchen.dev">Get in Touch</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
