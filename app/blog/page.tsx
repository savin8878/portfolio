import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BlogGrid } from "@/components/blog/blog-grid"
import { PageHeader } from "@/components/page-header"
import { Parallax } from "@/components/anim"
import { getBlogPosts, getBlogCategories, getPageVisibility } from "@/lib/data"

export const metadata: Metadata = {
  title: "Blog - Akash Vishwakarma",
  description:
    "Technical deep-dives, engineering best practices, and lessons learned from building products at scale.",
}

export default async function BlogPage() {
  const [posts, categories, vis] = await Promise.all([
    getBlogPosts(),
    getBlogCategories(),
    getPageVisibility("blog"),
  ])

  const show = (section: string) => vis[section] !== false

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {show("hero") && (
          <PageHeader
            eyebrow="Writing"
            title="Blog &"
            highlight="Insights"
            description="Technical deep-dives, engineering best practices, and lessons learned from building products at scale."
          />
        )}

        <section className="relative overflow-hidden border-t border-border/50 py-24 sm:py-32">
          {/* layered ambient glows for depth */}
          <Parallax
            speed={55}
            className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full opacity-60 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(255,122,24,0.10), transparent 70%)" }}
          >
            <div className="h-full w-full" />
          </Parallax>
          <Parallax
            speed={-35}
            className="pointer-events-none absolute -left-24 bottom-10 h-80 w-80 rounded-full opacity-50 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(255,122,24,0.07), transparent 70%)" }}
          >
            <div className="h-full w-full" />
          </Parallax>

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {show("blog_grid") && (
              <BlogGrid posts={posts} categories={categories} />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
