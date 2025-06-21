"use client"

import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarToggleProps {
  isOpen: boolean | undefined
  setIsOpen?: () => void
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
  return (
    <div className="invisible lg:visible absolute top-[12px] -right-[16px] z-20">
      <Button
        onClick={() => setIsOpen?.()}
        className={cn(
          "rounded-full w-8 h-8 transition-all duration-200 ease-in-out",
          "bg-white dark:bg-slate-800",
          "border-2 border-slate-200 dark:border-slate-700",
          "shadow-lg hover:shadow-xl",
          "hover:scale-110 hover:bg-blue-50 dark:hover:bg-blue-950/50",
          "hover:border-blue-300 dark:hover:border-blue-600",
        )}
        variant="outline"
        size="icon"
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 transition-transform ease-in-out duration-300",
            "text-slate-600 dark:text-slate-400",
            isOpen === false ? "rotate-180" : "rotate-0",
          )}
        />
      </Button>
    </div>
  )
}
