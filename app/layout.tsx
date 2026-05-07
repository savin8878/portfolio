import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Caveat } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SmoothScrollProvider } from "@/components/scroll-provider"
import { SketchDefs } from "@/components/sketch-primitives"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sketch",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Akash Vishwakarma - Full-Stack Product Engineer",
  description:
    "Senior Full-Stack Engineer specializing in building scalable SaaS platforms, AI tools, and high-performance web applications.",
  keywords: [
    "Full-Stack Engineer",
    "SaaS Development",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
  ],
  authors: [{ name: "Akash Vishwakarma" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Akash Vishwakarma Portfolio",
    title: "Akash Vishwakarma - Full-Stack Product Engineer",
    description:
      "Building scalable SaaS platforms, AI tools, and high-performance web applications.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akash Vishwakarma - Full-Stack Product Engineer",
    description:
      "Building scalable SaaS platforms, AI tools, and high-performance web applications.",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f14" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} font-sans antialiased`}>
        <SketchDefs />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
