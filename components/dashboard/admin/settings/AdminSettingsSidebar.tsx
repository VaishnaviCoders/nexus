"use client"

import { useState, Children, type ReactNode, type ReactElement } from "react"
import { Settings, Sliders, GraduationCap, Bell, Shield, Search, CreditCard, Menu, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const navItems = [
  { id: "general", label: "General", icon: Settings },
  { id: "configurations", label: "Configurations", icon: Sliders },
  { id: "grading", label: "Grading System", icon: GraduationCap },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "roles", label: "Roles & Access", icon: Shield },
]

interface AdminSettingsSidebarProps {
  children: ReactNode
}

export default function AdminSettingsSidebar({ children }: AdminSettingsSidebarProps) {
  const [activeSection, setActiveSection] = useState("general")
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const filteredNav = navItems.filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))

  // Map children to their section IDs
  const childrenArray = Children.toArray(children)
  const sectionMap: Record<string, ReactElement> = {
    general: childrenArray[0] as ReactElement,
    configurations: childrenArray[1] as ReactElement,
    grading: childrenArray[2] as ReactElement,
    notifications: childrenArray[3] as ReactElement,
    billing: childrenArray[4] as ReactElement,
    roles: childrenArray[5] as ReactElement,
  }

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId)
    setMobileMenuOpen(false)
  }

  const activeItem = navItems.find(item => item.id === activeSection)

  return (
    <>
      {/* Mobile Header with Menu Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg w-full justify-between"
        >
          <div className="flex items-center gap-2">
            {activeItem && <activeItem.icon className="h-4 w-4" />}
            <span className="font-medium">{activeItem?.label}</span>
          </div>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mt-2 bg-card border rounded-lg shadow-lg p-2 space-y-2">
            {/* Search */}
            <div className="relative px-2 pb-2 border-b">
              <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search settings..."
                className="pl-9 bg-muted/50 border-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Navigation Items */}
            {filteredNav.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  activeSection === item.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search settings..."
              className="pl-9 bg-muted/50 border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {filteredNav.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  activeSection === item.id
                    ? "bg-primary/10 text-primary border-l-2 border-primary -ml-[2px] pl-[14px]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 min-w-0">{sectionMap[activeSection]}</main>
    </>
  )
}