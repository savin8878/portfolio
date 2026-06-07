"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BlogPost } from "@/lib/db"
import { Reveal, Stagger, StaggerItem, Parallax } from "@/components/anim"

interface BlogPreviewSectionProps {
  posts: BlogPost[]
  content?: Record<string, unknown>
}

const DIRS = ["left", "right"] as const

export function BlogPreviewSection({ posts, content }: BlogPreviewSectionProps) {
  const label = (content?.label as string) || "Writing"
  const title = (content?.title as string) || "Recent"
  const titleHighlight = (content?.title_highlight as string) || "field notes."

  return (
    <section className="relative overflow-hidden border-t border-border/50 py-24 sm:py-32">
      <Parallax speed={-44} className="pointer-events-none absolute -right-4 top-8 -z-10 select-none">
        <span className="block font-mono text-[18vw] font-semibold uppercase leading-none tracking-[-0.05em] text-muted-foreground/5">
          NOTES
        </span>
      </Parallax>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <Reveal from="top">
              <span className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-accent">
                <span className="h-px w-8 bg-accent/60" />
                {label}
              </span>
            </Reveal>
            <Reveal from="left" delay={0.08}>
              <h2 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-foreground sm:text-5xl md:text-6xl">
                {title} <span className="text-gradient-static">{titleHighlight}</span>
              </h2>
            </Reveal>
          </div>
          <Reveal from="right" delay={0.16}>
            <Button asChild variant="outline" className="group h-11 gap-2 rounded-full border-border/60 px-5 hover:border-accent/50">
              <Link href="/blog">
                Read all
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </Reveal>
        </div>

        <Stagger stagger={0.1} className="border-t border-border/50">
          {posts.map((post, index) => {
            const category = (post as BlogPost & { category_name?: string }).category_name
            return (
              <StaggerItem key={post.id} from={DIRS[index % DIRS.length]} className="group relative">
                <Link
                  href={`/blog/${post.slug}`}
                  className="grid grid-cols-1 items-center gap-3 border-b border-border/50 py-8 md:grid-cols-[auto_1fr_auto_auto] md:gap-8"
                >
                  <span className="pointer-events-none absolute -inset-x-6 inset-y-0 -z-10 rounded-2xl bg-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="font-mono text-sm tabular-nums text-muted-foreground/40 md:w-12">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent md:text-2xl">
                      {post.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-1 text-sm text-muted-foreground">{post.excerpt}</p>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {category && <span className="text-accent">{category}</span>}
                    <span>{post.reading_time} min</span>
                  </div>
                  <div className="relative hidden h-14 w-20 shrink-0 overflow-hidden rounded-lg md:block">
                    {post.featured_image ? (
                      <Image
                        src={post.featured_image}
                        alt={post.title}
                        fill
                        className="object-cover opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                        sizes="80px"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-linear-to-br from-accent/30 to-accent-3/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    )}
                    <ArrowUpRight className="absolute right-1 top-1 h-4 w-4 text-foreground opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                </Link>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
