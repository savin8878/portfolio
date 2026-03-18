import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { sql } from "@/lib/db"
import { BlogPostForm } from "@/components/admin/blog-post-form"

async function getCategories() {
  const categories = await sql`SELECT id, name FROM blog_categories ORDER BY name`
  return categories
}

export default async function NewBlogPostPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link
          href="/admin/blog"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog Posts
        </Link>
        <h2 className="text-2xl font-bold text-foreground">New Blog Post</h2>
        <p className="text-muted-foreground">
          Write a new article for your blog
        </p>
      </div>

      <BlogPostForm categories={categories} />
    </div>
  )
}
