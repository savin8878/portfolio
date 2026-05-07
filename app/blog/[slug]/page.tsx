import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import {
  SketchUnderline,
  SketchStar,
  SketchSquiggle,
} from "@/components/sketch-primitives"
import { SketchDoodles } from "@/components/sketch-doodles"
import { getBlogPostBySlug, getBlogPosts } from "@/lib/data"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} - Akash Vishwakarma`,
    description: post.excerpt || post.meta_description,
  }
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        <article className="relative py-16 md:py-24 paper-grain overflow-hidden">
          <div className="absolute inset-0 notebook-grid opacity-30 -z-10" />
          <SketchSquiggle
            color="oklch(0.55 0.2 250 / 0.3)"
            strokeWidth={2}
            className="absolute top-6 left-0 right-0 h-5"
          />
          <SketchDoodles density="sparse" className="-z-5 opacity-50" />
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative">
            {/* Back Link */}
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-accent mb-8 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="font-sketch text-lg">back to blog</span>
            </Link>

            {/* Header */}
            <header className="mb-12">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {(post as typeof post & { category_name?: string }).category_name && (
                  <Badge>{(post as typeof post & { category_name?: string }).category_name}</Badge>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.reading_time} min read</span>
                  </div>
                  {post.published_at && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(post.published_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <h1 className="relative text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance leading-tight inline-block">
                <span className="relative inline-block">
                  {post.title}
                  <SketchUnderline color="oklch(0.6 0.2 250)" strokeWidth={4} delay={0.5} />
                </span>
                <SketchStar
                  color="oklch(0.6 0.2 320)"
                  delay={1.0}
                  className="absolute -top-4 -right-4 w-6 h-6 hidden sm:block"
                />
              </h1>

              {post.excerpt && (
                <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </header>

            {/* Featured Image Placeholder */}
            <div className="aspect-video rounded-2xl bg-muted mb-12 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-accent/10" />
            </div>

            {/* Content */}
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {/* Author Section */}
            <div className="mt-12 pt-12 border-t border-border">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-accent">A</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Akash Vishwakarma</p>
                  <p className="text-sm text-muted-foreground">
                    Full-Stack Product Engineer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
