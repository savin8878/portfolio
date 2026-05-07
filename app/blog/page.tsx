import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BlogGrid } from "@/components/blog/blog-grid"
import { SketchPageHeader } from "@/components/sketch-page-header"
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
          <SketchPageHeader
            kicker="Writing"
            handwritten="— thoughts & notes —"
            title="Blog & Insights"
            highlight="Insights"
            description="Technical deep-dives, engineering best practices, and lessons learned from building products at scale."
          />
        )}

        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
