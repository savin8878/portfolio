"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Filter,
  Mail,
  Eye,
  Archive,
  MoreHorizontal,
  Trash2,
  CheckCircle2,
  Clock,
  MessageSquare,
  Building2,
  Calendar,
  DollarSign,
  ChevronDown,
  X,
  StickyNote,
  Send,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

interface Contact {
  id: number
  name: string
  email: string
  company: string | null
  project_type: string | null
  budget_range: string | null
  timeline: string | null
  message: string
  status: string
  notes: string | null
  created_at: string
  updated_at: string | null
}

interface ContactStats {
  new_count: number
  read_count: number
  responded_count: number
  archived_count: number
  total_count: number
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Mail }> = {
  new: { label: "New", color: "bg-blue-600 hover:bg-blue-700", icon: Mail },
  read: { label: "Read", color: "bg-yellow-600 hover:bg-yellow-700", icon: Eye },
  responded: { label: "Responded", color: "bg-green-600 hover:bg-green-700", icon: CheckCircle2 },
  archived: { label: "Archived", color: "bg-muted-foreground hover:bg-muted-foreground/80", icon: Archive },
}

const projectTypes = [
  "All Types",
  "SaaS Development",
  "Web Application",
  "Mobile App",
  "E-Commerce",
  "API Development",
  "Consulting",
  "Other",
]

const budgetRanges = [
  "All Budgets",
  "Under $5,000",
  "$5,000 - $15,000",
  "$15,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000+",
]

const timelines = [
  "All Timelines",
  "ASAP",
  "1-2 weeks",
  "1 month",
  "2-3 months",
  "3-6 months",
  "Flexible",
]

export function ContactsManager({
  initialContacts,
  stats,
}: {
  initialContacts: Contact[]
  stats: ContactStats
}) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [projectTypeFilter, setProjectTypeFilter] = useState("All Types")
  const [budgetFilter, setBudgetFilter] = useState("All Budgets")
  const [timelineFilter, setTimelineFilter] = useState("All Timelines")
  const [sortBy, setSortBy] = useState<"date" | "name" | "status">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedContacts, setSelectedContacts] = useState<number[]>([])
  const [viewContact, setViewContact] = useState<Contact | null>(null)
  const [editContact, setEditContact] = useState<Contact | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // Filtered and sorted contacts
  const filteredContacts = useMemo(() => {
    let result = [...contacts]

    // Tab filter (status quick filter)
    if (activeTab !== "all") {
      result = result.filter((c) => c.status === activeTab)
    }

    // Status dropdown filter
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter)
    }

    // Project type filter
    if (projectTypeFilter !== "All Types") {
      result = result.filter((c) => c.project_type === projectTypeFilter)
    }

    // Budget filter
    if (budgetFilter !== "All Budgets") {
      result = result.filter((c) => c.budget_range === budgetFilter)
    }

    // Timeline filter
    if (timelineFilter !== "All Timelines") {
      result = result.filter((c) => c.timeline === timelineFilter)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.company?.toLowerCase().includes(query) ||
          c.message.toLowerCase().includes(query)
      )
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "date":
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return result
  }, [contacts, searchQuery, statusFilter, projectTypeFilter, budgetFilter, timelineFilter, sortBy, sortOrder, activeTab])

  // Update contact status
  async function updateStatus(contactId: number, newStatus: string) {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: contactId, status: newStatus }),
      })
      if (res.ok) {
        setContacts((prev) =>
          prev.map((c) => (c.id === contactId ? { ...c, status: newStatus } : c))
        )
      }
    } catch (error) {
      console.error("Failed to update status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Update contact notes
  async function updateNotes(contactId: number, notes: string) {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: contactId, notes }),
      })
      if (res.ok) {
        setContacts((prev) =>
          prev.map((c) => (c.id === contactId ? { ...c, notes } : c))
        )
      }
    } catch (error) {
      console.error("Failed to update notes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Delete contact
  async function deleteContact(contactId: number) {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: contactId }),
      })
      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== contactId))
        setIsDeleteDialogOpen(false)
        setContactToDelete(null)
      }
    } catch (error) {
      console.error("Failed to delete contact:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Bulk update status
  async function bulkUpdateStatus(newStatus: string) {
    if (selectedContacts.length === 0) return
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/contacts/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedContacts, status: newStatus }),
      })
      if (res.ok) {
        setContacts((prev) =>
          prev.map((c) =>
            selectedContacts.includes(c.id) ? { ...c, status: newStatus } : c
          )
        )
        setSelectedContacts([])
      }
    } catch (error) {
      console.error("Failed to bulk update:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle contact selection
  function toggleSelect(contactId: number) {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    )
  }

  // Select all visible contacts
  function toggleSelectAll() {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([])
    } else {
      setSelectedContacts(filteredContacts.map((c) => c.id))
    }
  }

  // Clear all filters
  function clearFilters() {
    setSearchQuery("")
    setStatusFilter("all")
    setProjectTypeFilter("All Types")
    setBudgetFilter("All Budgets")
    setTimelineFilter("All Timelines")
    setActiveTab("all")
  }

  const hasActiveFilters =
    searchQuery ||
    statusFilter !== "all" ||
    projectTypeFilter !== "All Types" ||
    budgetFilter !== "All Budgets" ||
    timelineFilter !== "All Timelines"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Contact Submissions</h2>
          <p className="text-muted-foreground">
            Manage and respond to {stats.total_count} contact inquiries
          </p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setActiveTab("new")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New</CardTitle>
            <Mail className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.new_count}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setActiveTab("read")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Read</CardTitle>
            <Eye className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.read_count}</div>
            <p className="text-xs text-muted-foreground">Pending response</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setActiveTab("responded")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Responded</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.responded_count}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setActiveTab("archived")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Archived</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.archived_count}</div>
            <p className="text-xs text-muted-foreground">Closed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Search and Quick Actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, company, or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                {selectedContacts.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Bulk Actions ({selectedContacts.length})
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => bulkUpdateStatus("read")}>
                        <Eye className="mr-2 h-4 w-4" />
                        Mark as Read
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => bulkUpdateStatus("responded")}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark as Responded
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => bulkUpdateStatus("archived")}>
                        <Archive className="mr-2 h-4 w-4" />
                        Archive Selected
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filters:</span>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={projectTypeFilter} onValueChange={setProjectTypeFilter}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue placeholder="Project Type" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={timelineFilter} onValueChange={setTimelineFilter}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Timeline" />
                </SelectTrigger>
                <SelectContent>
                  {timelines.map((timeline) => (
                    <SelectItem key={timeline} value={timeline}>
                      {timeline}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Separator orientation="vertical" className="h-6" />
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(val) => {
                const [by, order] = val.split("-") as ["date" | "name" | "status", "asc" | "desc"]
                setSortBy(by)
                setSortOrder(order)
              }}>
                <SelectTrigger className="w-[150px] h-9">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="name-asc">Name A-Z</SelectItem>
                  <SelectItem value="name-desc">Name Z-A</SelectItem>
                  <SelectItem value="status-asc">Status A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({contacts.length})</TabsTrigger>
          <TabsTrigger value="new">New ({stats.new_count})</TabsTrigger>
          <TabsTrigger value="read">Read ({stats.read_count})</TabsTrigger>
          <TabsTrigger value="responded">Responded ({stats.responded_count})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({stats.archived_count})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Contacts Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-4 w-12">
                    <Checkbox
                      checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Contact</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Project Details</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className={`border-b border-border last:border-0 hover:bg-muted/50 transition-colors ${
                        contact.status === "new" ? "bg-blue-500/5" : ""
                      }`}
                    >
                      <td className="p-4">
                        <Checkbox
                          checked={selectedContacts.includes(contact.id)}
                          onCheckedChange={() => toggleSelect(contact.id)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.email}</p>
                          {contact.company && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Building2 className="h-3 w-3" />
                              {contact.company}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-2">
                          {contact.project_type && (
                            <Badge variant="secondary" className="text-xs">
                              {contact.project_type}
                            </Badge>
                          )}
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            {contact.budget_range && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {contact.budget_range}
                              </span>
                            )}
                            {contact.timeline && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {contact.timeline}
                              </span>
                            )}
                          </div>
                          {contact.notes && (
                            <div className="flex items-center gap-1 text-xs text-amber-600">
                              <StickyNote className="h-3 w-3" />
                              Has notes
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="default"
                              size="sm"
                              className={`${statusConfig[contact.status]?.color || "bg-muted"} text-white`}
                            >
                              {statusConfig[contact.status]?.label || contact.status}
                              <ChevronDown className="ml-2 h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {Object.entries(statusConfig).map(([key, config]) => (
                              <DropdownMenuItem
                                key={key}
                                onClick={() => updateStatus(contact.id, key)}
                                disabled={contact.status === key}
                              >
                                <config.icon className="mr-2 h-4 w-4" />
                                {config.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="text-sm text-foreground">
                            {new Date(contact.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(contact.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setViewContact(contact)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditContact(contact)}
                          >
                            <StickyNote className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <a href={`mailto:${contact.email}?subject=Re: Your inquiry`}>
                              <Send className="h-4 w-4" />
                            </a>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setViewContact(contact)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setEditContact(contact)}>
                                <StickyNote className="mr-2 h-4 w-4" />
                                Add/Edit Notes
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <a href={`mailto:${contact.email}?subject=Re: Your inquiry`}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Email
                                </a>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setContactToDelete(contact)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground font-medium">No contacts found</p>
                      <p className="text-sm text-muted-foreground">
                        {hasActiveFilters
                          ? "Try adjusting your filters"
                          : "Contact submissions will appear here"}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Contact Sheet */}
      <Sheet open={!!viewContact} onOpenChange={() => setViewContact(null)}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          {viewContact && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  Contact from {viewContact.name}
                  <Badge className={statusConfig[viewContact.status]?.color || "bg-muted"}>
                    {statusConfig[viewContact.status]?.label || viewContact.status}
                  </Badge>
                </SheetTitle>
                <SheetDescription>
                  Received on {new Date(viewContact.created_at).toLocaleString()}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Contact Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-foreground">Contact Information</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Name</Label>
                      <p className="font-medium">{viewContact.name}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Email</Label>
                      <a
                        href={`mailto:${viewContact.email}`}
                        className="font-medium text-primary hover:underline block"
                      >
                        {viewContact.email}
                      </a>
                    </div>
                    {viewContact.company && (
                      <div className="space-y-1 sm:col-span-2">
                        <Label className="text-muted-foreground">Company</Label>
                        <p className="font-medium">{viewContact.company}</p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Project Details */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-foreground">Project Details</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Project Type</Label>
                      <p className="font-medium">{viewContact.project_type || "Not specified"}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Budget Range</Label>
                      <p className="font-medium">{viewContact.budget_range || "Not specified"}</p>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <Label className="text-muted-foreground">Timeline</Label>
                      <p className="font-medium">{viewContact.timeline || "Not specified"}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Message */}
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Message</Label>
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <p className="whitespace-pre-wrap text-foreground">{viewContact.message}</p>
                  </div>
                </div>

                {/* Notes */}
                {viewContact.notes && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label className="text-muted-foreground flex items-center gap-2">
                        <StickyNote className="h-4 w-4" />
                        Internal Notes
                      </Label>
                      <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <p className="whitespace-pre-wrap text-foreground">{viewContact.notes}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-4">
                  <Button asChild className="w-full">
                    <a href={`mailto:${viewContact.email}?subject=Re: Your inquiry`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Reply via Email
                    </a>
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setViewContact(null)
                        setEditContact(viewContact)
                      }}
                    >
                      <StickyNote className="mr-2 h-4 w-4" />
                      Add Notes
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        updateStatus(viewContact.id, "responded")
                        setViewContact(null)
                      }}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark Responded
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Edit Notes Dialog */}
      <Dialog open={!!editContact} onOpenChange={() => setEditContact(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Notes for {editContact?.name}</DialogTitle>
            <DialogDescription>
              Add internal notes about this contact inquiry
            </DialogDescription>
          </DialogHeader>
          {editContact && (
            <EditNotesForm
              contact={editContact}
              onSave={(notes) => {
                updateNotes(editContact.id, notes)
                setEditContact(null)
              }}
              onCancel={() => setEditContact(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the contact from {contactToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => contactToDelete && deleteContact(contactToDelete.id)}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EditNotesForm({
  contact,
  onSave,
  onCancel,
}: {
  contact: Contact
  onSave: (notes: string) => void
  onCancel: () => void
}) {
  const [notes, setNotes] = useState(contact.notes || "")

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="notes">Internal Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this contact, follow-up actions, etc..."
          rows={5}
        />
        <p className="text-xs text-muted-foreground">
          These notes are only visible to admins and will not be shared with the contact.
        </p>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(notes)}>Save Notes</Button>
      </DialogFooter>
    </div>
  )
}
