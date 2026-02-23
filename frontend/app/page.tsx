"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { TaskPanel } from "@/components/task-panel"
import { ChatPanel } from "@/components/chat-panel"
import { TickerFooter } from "@/components/ticker-footer"
import { MobileTabBar } from "@/components/mobile-tab-bar"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"tasks" | "chat">("tasks")

  return (
    <div className="flex h-dvh flex-col bg-background">
      <DashboardHeader />

      {/* Desktop: side-by-side */}
      <main className="hidden lg:flex flex-1 min-h-0">
        <div className="w-[55%] min-w-0">
          <TaskPanel />
        </div>
        <div className="w-[45%] min-w-0">
          <ChatPanel />
        </div>
      </main>

      {/* Mobile / Tablet: tabbed view */}
      <main className="flex flex-col flex-1 min-h-0 lg:hidden">
        <MobileTabBar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 min-h-0">
          {activeTab === "tasks" ? <TaskPanel /> : <ChatPanel />}
        </div>
      </main>

      <TickerFooter />
    </div>
  )
}
