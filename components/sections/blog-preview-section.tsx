"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { BlogPost } from "@/lib/db"

interface BlogPreviewSectionProps {
  posts: BlogPost[]
}

export function BlogPreviewSection({ posts }: BlogPreviewSectionProps) {
  return (
    <section className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-sm font-semibold text-accent uppercase tracking-wider">
              Latest Insights
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-bold text-foreground text-balance">
              From the Blog
            </p>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Technical deep-dives, engineering best practices, and lessons
              learned from building products.
            </p>
          </div>
          <Button asChild variant="outline" className="group shrink-0">
            <Link href="/blog">
              View All Posts
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative flex flex-col rounded-2xl bg-card border border-border overflow-hidden hover:border-accent/50 transition-colors"
            >
              {/* Image Placeholder */}
              <div className="aspect-video bg-muted relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5" />
              </div>

              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-3 mb-3">
                  {(post as BlogPost & { category_name?: string }).category_name && (
                    <Badge variant="secondary" className="text-xs">
                      {(post as BlogPost & { category_name?: string }).category_name}
                    </Badge>
                  )}
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {post.reading_time} min read
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                    <span className="absolute inset-0" />
                  </Link>
                </h3>

                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="mt-auto pt-4">
                  <span className="text-sm font-medium text-accent group-hover:underline">
                    Read more
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
