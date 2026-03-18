import {
  Package,
  Users,
  Rocket,
  Calendar,
  Building2,
  Code2,
  BarChart3,
  Zap,
  Search,
  Layers,
  CheckCircle,
  RefreshCw,
  Cloud,
  Lightbulb,
  Server,
  Database,
  Shield,
  Settings,
  Globe,
  Smartphone,
  Code,
} from "lucide-react"

/**
 * Shared icon map used across section components and admin forms.
 * Maps lowercase icon name strings (from the database) to Lucide icon components.
 */
export const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  // Metrics section
  package: Package,
  users: Users,
  rocket: Rocket,
  calendar: Calendar,

  // Philosophy section
  building: Building2,
  code: Code2,
  "chart-bar": BarChart3,
  zap: Zap,

  // Process section
  search: Search,
  layers: Layers,
  "check-circle": CheckCircle,
  "refresh-cw": RefreshCw,

  // Service cards
  cloud: Cloud,
  lightbulb: Lightbulb,
  server: Server,
  database: Database,
  shield: Shield,
  settings: Settings,
  globe: Globe,
  smartphone: Smartphone,

  // Admin service form (PascalCase values from iconOptions)
  Code: Code,
  Rocket: Rocket,
  Zap: Zap,
  Server: Server,
  Database: Database,
  Cloud: Cloud,
  Shield: Shield,
  Settings: Settings,
  Globe: Globe,
  Smartphone: Smartphone,
}

/** Default fallback icon when no match is found */
export const DefaultIcon = Code2
