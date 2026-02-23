"use client"

import { ListTodo, MessageSquare } from "lucide-react"

type MobileTabBarProps = {
  activeTab: "tasks" | "chat"
  onTabChange: (tab: "tasks" | "chat") => void
}

export function MobileTabBar({ activeTab, onTabChange }: MobileTabBarProps) {
  return (
    <div className="flex border-b border-border bg-card" role="tablist" aria-label="Dashboard panels">
      <button
        role="tab"
        aria-selected={activeTab === "tasks"}
        onClick={() => onTabChange("tasks")}
        className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-200 ${
          activeTab === "tasks"
            ? "border-b-2 border-[#dc2626] text-foreground bg-[#dc2626]/5"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
        }`}
      >
        <ListTodo className="h-4 w-4" />
        Tasks
      </button>
      <button
        role="tab"
        aria-selected={activeTab === "chat"}
        onClick={() => onTabChange("chat")}
        className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-200 ${
          activeTab === "chat"
            ? "border-b-2 border-[#dc2626] text-foreground bg-[#dc2626]/5"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
        }`}
      >
        <MessageSquare className="h-4 w-4" />
        Chat
      </button>
    </div>
  )
}
