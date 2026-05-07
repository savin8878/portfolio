"use client"

import Link from "next/link"
import Image from "next/image"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { BlogPost } from "@/lib/db"

interface BlogPreviewSectionProps {
  posts: BlogPost[]
  content?: Record<string, unknown>
}

export function BlogPreviewSection({ posts, content }: BlogPreviewSectionProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  const label = (content?.label as string) || "Writing"
  const title = (content?.title as string) || "Recent"
  const titleHighlight = (content?.title_highlight as string) || "field notes."
  const description =
    (content?.description as string) ||
    "Engineering deep-dives, product lessons, and occasional essays from building at the edge of what's possible."

  return (
    <section className="relative py-32 border-t border-border/40 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-medium text-accent mb-5"
            >
              {label}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.05] text-foreground"
            >
              {title} <span className="text-gradient-static">{titleHighlight}</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-lg text-muted-foreground leading-relaxed"
            >
              {description}
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}>
            <Button
              asChild
              variant="outline"
              className="group gap-2 rounded-full border-border/60 hover:border-accent/50 shrink-0 h-11 px-5"
            >
              <Link href="/blog">
                Read all
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col rounded-3xl border border-border/60 bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-accent/40 hover:-translate-y-1"
            >
              {/* Top glow on hover */}
              <div className="absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                {post.featured_image ? (
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-accent/20 via-accent-2/10 to-accent-3/10" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-background/20 via-transparent to-transparent" />
              </div>

              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-3 mb-4">
                  {(post as BlogPost & { category_name?: string }).category_name && (
                    <Badge
                      variant="secondary"
                      className="text-[11px] px-2 py-0.5 bg-accent/10 text-accent border border-accent/20 font-medium"
                    >
                      {(post as BlogPost & { category_name?: string }).category_name}
                    </Badge>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                    <Clock className="h-3 w-3" />
                    {post.reading_time} min read
                  </div>
                </div>

                <h3 className="text-lg md:text-xl font-semibold tracking-tight text-foreground group-hover:text-accent transition-colors duration-300 line-clamp-2 leading-snug">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                    <span className="absolute inset-0" />
                  </Link>
                </h3>

                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="mt-auto pt-5">
                  <span className="text-sm font-semibold text-accent inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                    Read article
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
