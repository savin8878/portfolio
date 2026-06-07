"use client"

import type { ClientLogo } from "@/lib/db"
import { Reveal, Parallax } from "@/components/anim"

interface ClientsSectionProps {
  clients: ClientLogo[]
  content?: Record<string, unknown>
}

export function ClientsSection({ clients, content }: ClientsSectionProps) {
  const subtitle = (content?.subtitle as string) || "Trusted by forward-thinking teams"
  const duplicated = [...clients, ...clients]

  return (
    <section className="relative py-20 border-y border-border/40 overflow-hidden bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal from="top" className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
            <span className="h-px w-6 bg-border" />
            {subtitle}
            <span className="h-px w-6 bg-border" />
          </span>
        </Reveal>
      </div>

      <Parallax speed={-24} className="relative mask-fade-x">
        <Reveal from="zoom">
          <div className="flex gap-12 items-center marquee">
            {duplicated.map((client, i) => (
              <div
                key={`${client.id}-${i}`}
                className="shrink-0 px-6 py-3 group"
              >
                <span className="text-2xl font-semibold text-muted-foreground/40 group-hover:text-foreground transition-colors duration-500 whitespace-nowrap tracking-tight">
                  {client.name}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </Parallax>
    </section>
  )
}
