/**
 * Modern Premium Resume Templates
 * 20+ professionally designed templates for every industry and style
 */

export interface TemplateTheme {
  id: string
  name: string
  category: string
  description: string
  previewColors: [string, string, string]
  layout: string
  cssVariables?: Record<string, string>
}

export const THEME_CATEGORIES = [
  { id: "creative", name: "Creative", description: "Bold, artistic designs", icon: "palette" },
  { id: "professional", name: "Professional", description: "Corporate and formal", icon: "briefcase" },
  { id: "modern", name: "Modern", description: "Contemporary and clean", icon: "sparkles" },
  { id: "tech", name: "Tech", description: "For developers and engineers", icon: "code" },
  { id: "minimal", name: "Minimal", description: "Simple and distraction-free", icon: "minus" },
  { id: "corporate", name: "Corporate", description: "Enterprise ready", icon: "squares" },
  { id: "design", name: "Design", description: "For designers and creatives", icon: "palette" },
  { id: "startup", name: "Startup", description: "Innovation focused", icon: "zap" },
  { id: "executive", name: "Executive", description: "Leadership and management", icon: "layers" },
  { id: "academic", name: "Academic", description: "Research and education", icon: "feather" },
]

export const TEMPLATE_THEMES: TemplateTheme[] = [
  // ════════════════════════════════════════════════════════════════
  // CREATIVE & DESIGN
  // ════════════════════════════════════════════════════════════════

  {
    id: "aurora",
    name: "Aurora",
    category: "creative",
    description: "Vibrant gradient design with modern color shifts",
    previewColors: ["#ff6b6b", "#ffffff", "#1a1a2e"],
    layout: "sidebar-left",
  },
  {
    id: "vibrant",
    name: "Vibrant",
    category: "creative",
    description: "Bold and energetic with striking color blocks",
    previewColors: ["#f72585", "#fff5f7", "#1a1a2e"],
    layout: "top-banner",
  },
  {
    id: "sunset",
    name: "Sunset",
    category: "creative",
    description: "Warm gradient inspired by golden sunsets",
    previewColors: ["#ff8c42", "#fff8f0", "#2a2a3e"],
    layout: "sidebar-right",
  },
  {
    id: "neon",
    name: "Neon",
    category: "creative",
    description: "Striking neon accents on dark background",
    previewColors: ["#00ff88", "#0a0e27", "#ffffff"],
    layout: "sidebar-left",
  },
  {
    id: "artist",
    name: "Artist",
    category: "design",
    description: "Portfolio-style layout for creative professionals",
    previewColors: ["#8b5cf6", "#f8f4ff", "#1f1f2e"],
    layout: "two-column",
  },
  {
    id: "minimal-modern",
    name: "Minimal Modern",
    category: "design",
    description: "Clean design with elegant typography",
    previewColors: ["#4f46e5", "#f9f9f9", "#2d2d2d"],
    layout: "single",
  },

  // ════════════════════════════════════════════════════════════════
  // TECH & DEVELOPER
  // ════════════════════════════════════════════════════════════════

  {
    id: "code-stack",
    name: "Code Stack",
    category: "tech",
    description: "Perfect for software engineers and developers",
    previewColors: ["#00d084", "#1e1e1e", "#ffffff"],
    layout: "sidebar-left",
  },
  {
    id: "hacker",
    name: "Hacker",
    category: "tech",
    description: "Terminal-inspired design for tech enthusiasts",
    previewColors: ["#00ff00", "#0a0a0a", "#e0e0e0"],
    layout: "single",
  },
  {
    id: "cloud-native",
    name: "Cloud Native",
    category: "tech",
    description: "Modern architecture-inspired template",
    previewColors: ["#0ea5e9", "#f0f9ff", "#1e293b"],
    layout: "two-column",
  },
  {
    id: "devops",
    name: "DevOps",
    category: "tech",
    description: "Infrastructure focused with technical emphasis",
    previewColors: ["#f59e0b", "#fffbeb", "#1f2937"],
    layout: "sidebar-right",
  },

  // ════════════════════════════════════════════════════════════════
  // PROFESSIONAL & CORPORATE
  // ════════════════════════════════════════════════════════════════

  {
    id: "executive-pro",
    name: "Executive Pro",
    category: "executive",
    description: "Premium template for C-level executives",
    previewColors: ["#1e40af", "#f8fafc", "#0f172a"],
    layout: "sidebar-left",
  },
  {
    id: "corporate-blue",
    name: "Corporate Blue",
    category: "corporate",
    description: "Professional corporate design with blue accent",
    previewColors: ["#0066cc", "#ffffff", "#333333"],
    layout: "top-banner",
  },
  {
    id: "business-classic",
    name: "Business Classic",
    category: "corporate",
    description: "Timeless business-focused design",
    previewColors: ["#1f2937", "#ffffff", "#4b5563"],
    layout: "single",
  },
  {
    id: "investor-ready",
    name: "Investor Ready",
    category: "executive",
    description: "For entrepreneurs and business leaders",
    previewColors: ["#7c3aed", "#f5f3ff", "#1f1f2e"],
    layout: "two-column",
  },

  // ════════════════════════════════════════════════════════════════
  // MODERN & CONTEMPORARY
  // ════════════════════════════════════════════════════════════════

  {
    id: "ultra-modern",
    name: "Ultra Modern",
    category: "modern",
    description: "Cutting edge design with minimal approach",
    previewColors: ["#06b6d4", "#f0f9fa", "#0f172a"],
    layout: "sidebar-left",
  },
  {
    id: "geo-modern",
    name: "Geo Modern",
    category: "modern",
    description: "Geometric patterns with modern typography",
    previewColors: ["#ec4899", "#fdf2f8", "#1f2937"],
    layout: "top-banner",
  },
  {
    id: "gradient-pro",
    name: "Gradient Pro",
    category: "modern",
    description: "Smooth gradient transitions throughout",
    previewColors: ["#6366f1", "#f0f4ff", "#1e1b4b"],
    layout: "sidebar-right",
  },
  {
    id: "sleek",
    name: "Sleek",
    category: "modern",
    description: "Polished and sophisticated modern design",
    previewColors: ["#0891b2", "#ecfdf5", "#164e63"],
    layout: "two-column",
  },

  // ════════════════════════════════════════════════════════════════
  // STARTUP & INNOVATION
  // ════════════════════════════════════════════════════════════════

  {
    id: "startup-spark",
    name: "Startup Spark",
    category: "startup",
    description: "Fast-paced startup culture template",
    previewColors: ["#f59e0b", "#fef3c7", "#1f2937"],
    layout: "sidebar-left",
  },
  {
    id: "innovation",
    name: "Innovation",
    category: "startup",
    description: "Forward-thinking design for innovators",
    previewColors: ["#10b981", "#f0fdf4", "#065f46"],
    layout: "top-banner",
  },
  {
    id: "disruptive",
    name: "Disruptive",
    category: "startup",
    description: "Bold and attention-grabbing template",
    previewColors: ["#e11d48", "#fff1f2", "#4c0519"],
    layout: "sidebar-right",
  },

  // ════════════════════════════════════════════════════════════════
  // MINIMAL & CLEAN
  // ════════════════════════════════════════════════════════════════

  {
    id: "zen",
    name: "Zen",
    category: "minimal",
    description: "Peaceful and balanced design",
    previewColors: ["#94a3b8", "#ffffff", "#334155"],
    layout: "single",
  },
  {
    id: "whitespace",
    name: "Whitespace",
    category: "minimal",
    description: "Maximum whitespace for elegance",
    previewColors: ["#5b6c80", "#ffffff", "#2d3748"],
    layout: "single",
  },
  {
    id: "pure-minimal",
    name: "Pure Minimal",
    category: "minimal",
    description: "Absolutely minimalist approach",
    previewColors: ["#111827", "#fafafa", "#6b7280"],
    layout: "single",
  },

  // ════════════════════════════════════════════════════════════════
  // ACADEMIC & RESEARCH
  // ════════════════════════════════════════════════════════════════

  {
    id: "academic",
    name: "Academic",
    category: "academic",
    description: "Scholarly and research-focused",
    previewColors: ["#3b82f6", "#f0f9ff", "#1e3a8a"],
    layout: "sidebar-left",
  },
  {
    id: "research",
    name: "Research",
    category: "academic",
    description: "For researchers and PhD candidates",
    previewColors: ["#06b6d4", "#f0fdfa", "#164e63"],
    layout: "two-column",
  },

  // ════════════════════════════════════════════════════════════════
  // SPECIALTY & INDUSTRY
  // ════════════════════════════════════════════════════════════════

  {
    id: "medical-pro",
    name: "Medical Pro",
    category: "professional",
    description: "Specialized template for medical professionals",
    previewColors: ["#059669", "#f0fdf4", "#064e3b"],
    layout: "sidebar-right",
  },
  {
    id: "legal",
    name: "Legal",
    category: "professional",
    description: "Formal template for legal professionals",
    previewColors: ["#1e40af", "#f0f4ff", "#172554"],
    layout: "single",
  },
  {
    id: "finance",
    name: "Finance",
    category: "corporate",
    description: "For finance and accounting professionals",
    previewColors: ["#7c2d12", "#fefce8", "#1f2937"],
    layout: "sidebar-left",
  },
  {
    id: "creative-finance",
    name: "Creative Finance",
    category: "corporate",
    description: "Modern take on financial roles",
    previewColors: ["#be123c", "#ffe4e6", "#1f1f2e"],
    layout: "top-banner",
  },

  // ════════════════════════════════════════════════════════════════
  // EDITORIAL & PREMIUM ADDITIONS
  // ════════════════════════════════════════════════════════════════

  {
    id: "magazine",
    name: "Magazine",
    category: "creative",
    description: "Editorial spread with masthead, drop cap, and pull-quote rail",
    previewColors: ["#2563eb", "#fafaf7", "#111827"],
    layout: "top-banner",
  },
  {
    id: "editorial",
    name: "Editorial",
    category: "creative",
    description: "Long-form article look with full-bleed accent hero",
    previewColors: ["#7c3aed", "#fafaf7", "#0f172a"],
    layout: "top-banner",
  },
  {
    id: "monograph",
    name: "Monograph",
    category: "academic",
    description: "Classic journal serif, single-column, small caps section heads",
    previewColors: ["#1f2937", "#fdfcf8", "#3f3f3f"],
    layout: "single",
  },
  {
    id: "blueprint",
    name: "Blueprint",
    category: "tech",
    description: "Architectural blueprint grid with crosshair corners and monospace coordinates",
    previewColors: ["#0ea5e9", "#fcfdff", "#0c1424"],
    layout: "single",
  },
  {
    id: "mosaic-grid",
    name: "Mosaic Grid",
    category: "modern",
    description: "Card-based tile grid for a modern startup vibe",
    previewColors: ["#6366f1", "#f5f6fa", "#0a0e27"],
    layout: "two-column",
  },
]

/**
 * Get template by ID
 */
export function getTemplate(id: string): TemplateTheme | undefined {
  return TEMPLATE_THEMES.find((t) => t.id === id)
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): TemplateTheme[] {
  return TEMPLATE_THEMES.filter((t) => t.category === category)
}

/**
 * Get all unique categories
 */
export function getAllCategories() {
  const cats = new Set(TEMPLATE_THEMES.map((t) => t.category))
  return Array.from(cats).sort()
}

/**
 * CSS Variables for templates
 * Can be extended per template for custom styling
 */
export const TEMPLATE_CSS_VARIABLES = {
  "classic": {
    "--accent": "#2563eb",
    "--background": "#f8fafc",
    "--text": "#1f2937",
  },
  "modern": {
    "--accent": "#2563eb",
    "--background": "#1e293b",
    "--text": "#ffffff",
  },
  "aurora": {
    "--accent": "#ff6b6b",
    "--background": "#ffffff",
    "--text": "#1a1a2e",
  },
  "neon": {
    "--accent": "#00ff88",
    "--background": "#0a0e27",
    "--text": "#ffffff",
  },
} as const
