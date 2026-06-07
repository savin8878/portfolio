import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, Calendar } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Reveal, Parallax, TiltCard } from "@/components/anim"
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

  const categoryName = (post as typeof post & { category_name?: string })
    .category_name

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        <article className="relative overflow-hidden">
          {/* layered ambient glows for depth */}
          <Parallax
            speed={60}
            className="pointer-events-none absolute -right-40 top-0 h-112 w-md rounded-full opacity-60 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(255,122,24,0.10), transparent 70%)" }}
          >
            <div className="h-full w-full" />
          </Parallax>
          <Parallax
            speed={-40}
            className="pointer-events-none absolute -left-32 top-160 h-96 w-96 rounded-full opacity-50 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(255,122,24,0.06), transparent 70%)" }}
          >
            <div className="h-full w-full" />
          </Parallax>

          {/* Header */}
          <header className="relative border-b border-border/50 pb-16 pt-12 sm:pt-16">
            <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <Reveal from="left">
                <Link
                  href="/blog"
                  className="group inline-flex items-center text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to blog
                </Link>
              </Reveal>

              <Reveal from="top" delay={0.05} className="mt-8">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground/70">
                  {categoryName && <span className="text-accent">{categoryName}</span>}
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {post.reading_time} min read
                  </span>
                  {post.published_at && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(post.published_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </Reveal>

              <Reveal from="bottom" delay={0.1}>
                <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-balance text-foreground sm:text-5xl md:text-6xl">
                  {post.title}
                </h1>
              </Reveal>

              {post.excerpt && (
                <Reveal from="bottom" delay={0.18}>
                  <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                </Reveal>
              )}

              {post.tags && post.tags.length > 0 && (
                <Reveal from="left" delay={0.24}>
                  <div className="mt-8 flex flex-wrap gap-x-4 gap-y-1">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono text-muted-foreground/60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>
          </header>

          {/* Body */}
          <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            {/* Featured Image Placeholder */}
            <Reveal from="zoom">
              <TiltCard className="relative aspect-video overflow-hidden rounded-2xl border border-border/50">
                <div className="absolute inset-0 bg-linear-to-br from-accent/25 to-accent/4" />
                <div className="absolute inset-0 bg-linear-to-t from-background/50 to-transparent" />
              </TiltCard>
            </Reveal>

            {/* Content */}
            <Reveal from="bottom" delay={0.05} className="mt-14">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                  {post.content}
                </p>
              </div>
            </Reveal>

            {/* Author Section */}
            <Reveal from="right" className="mt-16 border-t border-border/50 pt-12">
              <TiltCard className="flex items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10">
                  <span className="text-2xl font-semibold text-accent">A</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Akash Vishwakarma</p>
                  <p className="text-sm text-muted-foreground">
                    Full-Stack Product Engineer
                  </p>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
