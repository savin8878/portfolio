"use client"

import { useState } from "react"
import Link from "next/link"
import { Clock, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Reveal, Stagger, StaggerItem, TiltCard, type RevealFrom } from "@/components/anim"
import type { BlogPost, BlogCategory } from "@/lib/db"

interface BlogGridProps {
  posts: BlogPost[]
  categories: BlogCategory[]
}

const DIRECTIONS: RevealFrom[] = ["left", "bottom", "right", "zoom"]

export function BlogGrid({ posts, categories }: BlogGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === "all" ||
      post.category_id === parseInt(activeCategory)
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div>
      {/* Filters */}
      <Reveal from="top" className="mb-16">
        <div className="flex flex-col gap-6 border-b border-border/50 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full max-w-md">
            <label className="mb-3 flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-accent">
              <span className="h-px w-8 bg-accent/60" />
              Search
            </label>
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-none border-0 border-b border-border/60 bg-transparent px-0 text-lg shadow-none focus-visible:border-accent focus-visible:ring-0"
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-mono">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`uppercase tracking-wide transition-colors ${
                activeCategory === "all"
                  ? "text-accent"
                  : "text-muted-foreground/60 hover:text-foreground"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id.toString())}
                className={`uppercase tracking-wide transition-colors ${
                  activeCategory === category.id.toString()
                    ? "text-accent"
                    : "text-muted-foreground/60 hover:text-foreground"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Posts Grid — keyed so the layered reveal re-fires on filter change */}
      <Stagger
        key={`${activeCategory}-${searchQuery}`}
        stagger={0.1}
        className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filteredPosts.map((post, index) => {
          const categoryName = (post as BlogPost & { category_name?: string })
            .category_name
          return (
            <StaggerItem
              key={post.id}
              from={DIRECTIONS[index % DIRECTIONS.length]}
            >
              <TiltCard className="group relative flex h-full flex-col">
                {/* Image / gradient banner */}
                <div className="relative aspect-video overflow-hidden rounded-xl border border-border/50">
                  <div className="absolute inset-0 bg-linear-to-br from-accent/20 to-accent/3" />
                  <div className="absolute inset-0 bg-linear-to-t from-background/60 to-transparent" />
                  <span className="absolute left-4 top-4 font-mono text-xs tabular-nums text-muted-foreground/50">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {post.is_featured && (
                    <span className="absolute right-4 top-4 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-accent">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col pt-5">
                  <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground/70">
                    {categoryName && (
                      <span className="text-accent">{categoryName}</span>
                    )}
                    <span className="flex items-center">
                      <Clock className="mr-1.5 h-3 w-3" />
                      {post.reading_time} min
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-semibold leading-snug tracking-[-0.02em] text-foreground transition-colors group-hover:text-accent">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                      <span className="absolute inset-0" />
                    </Link>
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-mono text-muted-foreground/50"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-4">
                    <span className="text-xs font-mono tabular-nums text-muted-foreground/60">
                      {post.published_at &&
                        new Date(post.published_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-accent" />
                  </div>
                </div>
              </TiltCard>
            </StaggerItem>
          )
        })}
      </Stagger>

      {filteredPosts.length === 0 && (
        <Reveal from="zoom" className="py-20 text-center">
          <p className="text-muted-foreground">
            No articles found. Try a different search or category.
          </p>
        </Reveal>
      )}
    </div>
  )
}
