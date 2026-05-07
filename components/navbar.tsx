"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Moon, Sun, ArrowRight } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "pt-3" : "pt-5"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "relative flex items-center justify-between transition-all duration-500 rounded-full",
            scrolled
              ? "h-14 px-3 bg-background/60 backdrop-blur-xl border border-border/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.25)]"
              : "h-16 px-4 bg-transparent"
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 pl-2 group"
          >
            <div className="relative w-8 h-8 rounded-lg bg-linear-to-br from-accent to-accent-2 grid place-items-center overflow-hidden shimmer">
              <span className="text-accent-foreground font-bold text-sm">A</span>
              <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/20" />
            </div>
            <span className="hidden sm:block font-semibold text-sm tracking-tight">
              akash<span className="text-accent">.</span>dev
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-1.5 text-sm font-medium transition-colors rounded-full",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {pathname === item.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-accent/10 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full h-9 w-9 text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              {mounted && (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={theme}
                    initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="flex"
                  >
                    {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </motion.span>
                </AnimatePresence>
              )}
            </Button>

            <Button
              asChild
              size="sm"
              className="group relative overflow-hidden rounded-full h-9 px-4 bg-foreground text-background hover:bg-foreground/90 shadow-sm"
            >
              <Link href="/contact">
                <span className="relative z-10 flex items-center text-xs font-semibold tracking-tight">
                  Start a Project
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Button>
          </div>

          {/* Mobile */}
          <div className="flex lg:hidden items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full h-9 w-9 text-muted-foreground"
              aria-label="Toggle theme"
            >
              {mounted && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full h-9 w-9"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            className="lg:hidden mx-4 sm:mx-6 mt-3 rounded-3xl glass-strong overflow-hidden"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.04 } },
              }}
              className="px-3 py-4"
            >
              {navItems.map((item) => (
                <motion.div
                  key={item.href}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-2xl text-base font-medium transition-all",
                      pathname === item.href
                        ? "bg-accent/15 text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 },
                }}
                className="pt-3 px-1"
              >
                <Button asChild className="w-full rounded-2xl h-12" size="lg">
                  <Link href="/contact" onClick={() => setIsOpen(false)}>
                    Start a Project
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
