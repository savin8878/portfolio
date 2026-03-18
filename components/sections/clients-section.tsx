"use client"

import { motion } from "framer-motion"
import type { ClientLogo } from "@/lib/db"
import { FadeIn } from "@/components/scroll-animations"

interface ClientsSectionProps {
  clients: ClientLogo[]
  content?: Record<string, unknown>
}

export function ClientsSection({ clients, content }: ClientsSectionProps) {
  const subtitle = (content?.subtitle as string) || "Trusted by innovative companies"
  const duplicatedClients = [...clients, ...clients]

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-muted-foreground tracking-wider uppercase">
              {subtitle}
            </p>
          </div>
        </FadeIn>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={{ x: [0, "-50%"] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-16 items-center"
        >
          {duplicatedClients.map((client, index) => (
            <motion.div
              key={`${client.id}-${index}`}
              whileHover={{ scale: 1.1 }}
              className="flex-shrink-0 px-8"
            >
              <span className="text-xl font-semibold text-muted-foreground/40 hover:text-muted-foreground transition-colors duration-300 whitespace-nowrap">
                {client.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
