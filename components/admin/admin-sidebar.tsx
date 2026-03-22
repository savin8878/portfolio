"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Briefcase,
  MessageSquare,
  Users,
  Settings,
  Palette,
  Image,
  PenTool,
  Home,
  FormInput,
  FileEdit,
  ToggleLeft,
  FileUser,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    title: "Blog Posts",
    href: "/admin/blog",
    icon: PenTool,
  },
  {
    title: "Services",
    href: "/admin/services",
    icon: Briefcase,
  },
  {
    title: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageSquare,
  },
  {
    title: "Contact Submissions",
    href: "/admin/contacts",
    icon: Users,
  },
  {
    title: "Page Content",
    href: "/admin/content",
    icon: FileEdit,
  },
  {
    title: "Section Visibility",
    href: "/admin/visibility",
    icon: ToggleLeft,
  },
  {
    title: "Resume Builder",
    href: "/admin/resume-builder",
    icon: FileUser,
  },
  {
    title: "Form Builder",
    href: "/admin/form-builder",
    icon: FormInput,
  },
  {
    title: "Media Library",
    href: "/admin/media",
    icon: Image,
  },
  {
    title: "Theme Settings",
    href: "/admin/theme",
    icon: Palette,
  },
  {
    title: "Site Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-border bg-card lg:block">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-xl font-bold text-foreground">
            AC<span className="text-accent">.</span>
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            Admin
          </span>
        </Link>
      </div>

      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4" />
          View Site
        </Link>
      </div>
    </aside>
  )
}
