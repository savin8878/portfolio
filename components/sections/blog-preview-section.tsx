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

  const label = (content?.label as string) || "Latest Insights"
  const title = (content?.title as string) || "From the Blog"
  const description =
    (content?.description as string) ||
    "Technical deep-dives, engineering best practices, and lessons learned from building products."

  return (
    <section className="relative py-28 border-t border-border/40">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-transparent to-transparent -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="h-px w-8 bg-accent" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">{label}</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl font-black tracking-tight text-foreground"
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed"
            >
              {description}
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}>
            <Button asChild variant="outline" className="group gap-2 border-border/60 hover:border-accent/50 shrink-0">
              <Link href="/blog">
                View All Posts <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
              className="group relative flex flex-col rounded-2xl border border-border/50 bg-card overflow-hidden hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500"
            >
              {/* Featured Image */}
              <div className="aspect-video bg-muted relative overflow-hidden">
                {post.featured_image ? (
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5" />
                )}
              </div>

              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-3 mb-3">
                  {(post as BlogPost & { category_name?: string }).category_name && (
                    <Badge variant="secondary" className="text-[11px] px-2 py-0.5 bg-muted/60 border border-border/40">
                      {(post as BlogPost & { category_name?: string }).category_name}
                    </Badge>
                  )}
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {post.reading_time} min read
                  </div>
                </div>

                <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors duration-300 line-clamp-2 leading-snug">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                    <span className="absolute inset-0" />
                  </Link>
                </h3>

                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="mt-auto pt-4">
                  <span className="text-sm font-semibold text-accent group-hover:underline inline-flex items-center gap-1">
                    Read more
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
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
