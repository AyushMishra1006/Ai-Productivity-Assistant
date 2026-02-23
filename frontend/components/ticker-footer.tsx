"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Clock, Flame } from "lucide-react"
import { todoAPI, Todo } from "@/lib/api"

type TickerType = "overdue" | "high-priority" | "due-soon"

const typeConfig = {
  overdue: {
    icon: AlertTriangle,
    color: "text-[#f87171]",
    bg: "bg-[#dc2626]/10",
  },
  "high-priority": {
    icon: Flame,
    color: "text-[#fbbf24]",
    bg: "bg-[#f59e0b]/10",
  },
  "due-soon": {
    icon: Clock,
    color: "text-[#60a5fa]",
    bg: "bg-[#3b82f6]/10",
  },
}

/**
 * Categorize todos for ticker display
 * Shows: overdue, high-priority pending, and upcoming due dates
 */
function categorizeTodos(todos: Todo[]): Array<{ id: number; title: string; type: TickerType }> {
  const now = new Date()
  const upcoming = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now

  return todos
    .filter((todo) => todo.status === "pending") // Only show pending todos
    .map((todo) => {
      // Check if overdue
      if (todo.due_date && new Date(todo.due_date) < now) {
        return {
          id: todo.id,
          title: `${todo.title} — Overdue`,
          type: "overdue" as TickerType,
        }
      }

      // Check if high priority
      if (todo.priority === "high") {
        return {
          id: todo.id,
          title: `${todo.title} — High priority`,
          type: "high-priority" as TickerType,
        }
      }

      // Check if due soon (within 7 days)
      if (todo.due_date && new Date(todo.due_date) <= upcoming) {
        return {
          id: todo.id,
          title: `${todo.title} — Due soon`,
          type: "due-soon" as TickerType,
        }
      }

      return null
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .slice(0, 6) // Show max 6 items
}

export function TickerFooter() {
  const [items, setItems] = useState<Array<{ id: number; title: string; type: TickerType }>>([])

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todos = await todoAPI.getAll()
        const categorized = categorizeTodos(todos)

        // Duplicate for continuous scrolling effect
        const scrollItems = [...categorized, ...categorized]
        setItems(scrollItems.length > 0 ? scrollItems : [])
      } catch (err) {
        console.error("Failed to load todos for ticker:", err)
        // Show empty state instead of hardcoded data
      }
    }

    loadTodos()

    // Refresh every 30 seconds
    const interval = setInterval(loadTodos, 30000)
    return () => clearInterval(interval)
  }, [])

  // If no items, show empty ticker
  if (items.length === 0) {
    return (
      <footer
        className="border-t border-border bg-muted/50 overflow-hidden"
        aria-label="Priority task ticker"
      >
        <div className="flex items-center h-10">
          <div className="flex-shrink-0 flex items-center gap-2 border-r border-border bg-[#dc2626]/10 px-4 h-full z-10">
            <AlertTriangle className="h-3.5 w-3.5 text-[#f87171]" />
            <span className="text-xs font-semibold text-[#f87171] whitespace-nowrap">
              ALERTS
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center h-full">
            <span className="text-xs text-muted-foreground">
              No pending tasks — Great job! 🎉
            </span>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer
      className="border-t border-border bg-muted/50 overflow-hidden"
      aria-label="Priority task ticker"
    >
      <div className="flex items-center h-10">
        <div className="flex-shrink-0 flex items-center gap-2 border-r border-border bg-[#dc2626]/10 px-4 h-full z-10">
          <AlertTriangle className="h-3.5 w-3.5 text-[#f87171]" />
          <span className="text-xs font-semibold text-[#f87171] whitespace-nowrap">
            ALERTS
          </span>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-muted/50 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-muted/50 to-transparent z-10 pointer-events-none" />
          <div className="animate-ticker flex items-center gap-6 whitespace-nowrap py-2.5 px-4">
            {items.map((item, i) => {
              const config = typeConfig[item.type]
              const Icon = config.icon
              return (
                <span
                  key={`${item.id}-${i}`}
                  className={`inline-flex items-center gap-1.5 rounded-full ${config.bg} px-2.5 py-0.5 text-xs font-medium ${config.color} transition-opacity`}
                >
                  <Icon className="h-3 w-3" />
                  {item.title}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
