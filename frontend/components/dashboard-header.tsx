"use client"

import { Zap, Bell, Settings } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-r from-[#dc2626] via-[#ef4444] to-[#991b1b] opacity-90" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)]" />
      <div className="relative flex items-center justify-between px-3 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-bold tracking-tight text-white">
              AI Productivity
            </h1>
            <p className="hidden sm:block text-xs text-white/70">
              Intelligent task management
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-white/10 text-white/80 transition-all duration-200 hover:bg-white/20 hover:text-white hover:scale-105 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
              <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
            </span>
          </button>
          <button
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-white/10 text-white/80 transition-all duration-200 hover:bg-white/20 hover:text-white hover:scale-105 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <div className="ml-1 sm:ml-2 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/20 text-xs sm:text-sm font-semibold text-white ring-2 ring-white/30">
            A
          </div>
        </div>
      </div>
    </header>
  )
}
