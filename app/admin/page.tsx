import Link from "next/link"
import {
  FolderKanban,
  PenTool,
  MessageSquare,
  Users,
  Eye,
  TrendingUp,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { sql } from "@/lib/db"

async function getDashboardStats() {
  const [projects, posts, testimonials, contacts] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM projects WHERE is_published = true`,
    sql`SELECT COUNT(*) as count FROM blog_posts WHERE is_published = true`,
    sql`SELECT COUNT(*) as count FROM testimonials WHERE is_active = true`,
    sql`SELECT COUNT(*) as count FROM contact_submissions WHERE status = 'new'`,
  ])

  return {
    projects: Number(projects[0].count),
    posts: Number(posts[0].count),
    testimonials: Number(testimonials[0].count),
    newContacts: Number(contacts[0].count),
  }
}

async function getRecentContacts() {
  const contacts = await sql`
    SELECT id, name, email, project_type, created_at 
    FROM contact_submissions 
    ORDER BY created_at DESC 
    LIMIT 5
  `
  return contacts
}

export default async function AdminDashboard() {
  const [stats, recentContacts] = await Promise.all([
    getDashboardStats(),
    getRecentContacts(),
  ])

  const statCards = [
    {
      title: "Published Projects",
      value: stats.projects,
      icon: FolderKanban,
      href: "/admin/projects",
      color: "text-blue-500",
    },
    {
      title: "Blog Posts",
      value: stats.posts,
      icon: PenTool,
      href: "/admin/blog",
      color: "text-green-500",
    },
    {
      title: "Testimonials",
      value: stats.testimonials,
      icon: MessageSquare,
      href: "/admin/testimonials",
      color: "text-purple-500",
    },
    {
      title: "New Inquiries",
      value: stats.newContacts,
      icon: Users,
      href: "/admin/contacts",
      color: "text-orange-500",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <Link
                href={stat.href}
                className="text-xs text-muted-foreground hover:text-accent flex items-center mt-2"
              >
                View all
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Inquiries
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/contacts">View All</Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentContacts.length > 0 ? (
              <div className="space-y-4">
                {recentContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {contact.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {contact.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {contact.project_type || "General"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(contact.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No recent inquiries
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/projects/new">
                <FolderKanban className="mr-2 h-4 w-4" />
                Add New Project
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/blog/new">
                <PenTool className="mr-2 h-4 w-4" />
                Write Blog Post
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/testimonials/new">
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Testimonial
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/" target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                View Live Site
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
