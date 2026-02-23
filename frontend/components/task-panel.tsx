"use client"

import { useState, useCallback, useEffect } from "react"
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Trash2,
  ListTodo,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { todoAPI, Todo } from "@/lib/api"

type FilterType = "all" | "active" | "completed"

const priorityConfig = {
  high: {
    color: "bg-[#dc2626]/15 text-[#f87171] border-[#dc2626]/30",
    label: "High",
  },
  medium: {
    color: "bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/30",
    label: "Medium",
  },
  low: {
    color: "bg-[#22c55e]/15 text-[#4ade80] border-[#22c55e]/30",
    label: "Low",
  },
}

export function TaskPanel() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<FilterType>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<"high" | "medium" | "low">("medium")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load todos from API
  const loadTodos = useCallback(async () => {
    try {
      setLoading(true)
      const data = await todoAPI.getAll()
      setTodos(data)
      setError(null)
    } catch (err) {
      setError("Failed to load tasks. Make sure the backend is running on http://localhost:8000")
      console.error("Error loading todos:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTodos()
  }, [loadTodos])

  // Filter todos
  const filteredTodos = todos.filter((todo) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && todo.status === "pending") ||
      (filter === "completed" && todo.status === "completed")
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Add new todo
  const handleAddTask = useCallback(async () => {
    if (!newTaskTitle.trim()) {
      setError("Task title is required")
      return
    }
    try {
      setIsSubmitting(true)
      await todoAPI.create({
        title: newTaskTitle.trim(),
        priority: newTaskPriority,
      })
      setNewTaskTitle("")
      setNewTaskPriority("medium")
      setShowAddForm(false)
      setError(null)
      await loadTodos()
    } catch (err) {
      setError("Failed to create task")
      console.error("Error creating task:", err)
    } finally {
      setIsSubmitting(false)
    }
  }, [newTaskTitle, newTaskPriority, loadTodos])

  // Toggle todo completion
  const handleToggleStatus = useCallback(
    async (todo: Todo) => {
      try {
        const newStatus = todo.status === "pending" ? "completed" : "pending"
        await todoAPI.update(todo.id.toString(), { status: newStatus })
        await loadTodos()
      } catch (err) {
        setError("Failed to update task")
        console.error("Error updating task:", err)
      }
    },
    [loadTodos]
  )

  // Delete todo
  const handleDeleteTask = useCallback(
    async (id: number) => {
      try {
        await todoAPI.delete(id.toString())
        await loadTodos()
      } catch (err) {
        setError("Failed to delete task")
        console.error("Error deleting task:", err)
      }
    },
    [loadTodos]
  )

  const taskCounts = {
    all: todos.length,
    active: todos.filter((t) => t.status === "pending").length,
    completed: todos.filter((t) => t.status === "completed").length,
  }

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
  ]

  return (
    <section
      className="flex flex-col h-full lg:border-r border-border"
      aria-label="Task Manager"
    >
      {/* Panel Header */}
      <div className="flex-shrink-0 border-b border-border px-3 py-3 sm:px-5 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListTodo className="h-4 w-4 sm:h-5 sm:w-5 text-[#dc2626]" />
            <h2 className="text-sm sm:text-base font-semibold text-foreground">
              Task Manager
            </h2>
            <span className="ml-1 rounded-full bg-[#dc2626]/15 px-2 py-0.5 text-xs font-medium text-[#f87171]">
              {todos.length}
            </span>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 rounded-lg bg-[#dc2626] px-2.5 py-1.5 sm:px-3 text-xs sm:text-sm font-medium text-white transition-all duration-200 hover:bg-[#b91c1c] hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#dc2626]/50 focus-visible:outline-none"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Add Task</span>
            <span className="xs:hidden">Add</span>
          </button>
        </div>

        {/* Search */}
        <div className="mt-2.5 sm:mt-3 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-[#dc2626]/50 focus:ring-2 focus:ring-[#dc2626]/20 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="mt-2.5 sm:mt-3 flex items-center gap-1 sm:gap-1.5 overflow-x-auto" role="tablist" aria-label="Task filters">
          <Filter className="h-3.5 w-3.5 text-muted-foreground mr-0.5 sm:mr-1 flex-shrink-0" />
          {filters.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-shrink-0 rounded-md px-2 py-1 sm:px-2.5 text-xs font-medium transition-all duration-200 ${
                filter === f.key
                  ? "bg-[#dc2626] text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {f.label}
              <span className="ml-1 opacity-70">{taskCounts[f.key]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-3 sm:mx-5 mt-2.5 sm:mt-3 flex items-center justify-between rounded-lg border border-[#dc2626]/30 bg-[#dc2626]/10 px-3 py-2 animate-fade-in-up">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-[#f87171] flex-shrink-0" />
            <span className="text-xs text-[#f87171]">{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-2 rounded-md p-0.5 text-[#f87171] hover:bg-[#dc2626]/20 transition-colors"
            aria-label="Dismiss error"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Add Task Form */}
      {showAddForm && (
        <div className="mx-3 sm:mx-5 mt-2.5 sm:mt-3 rounded-xl border border-border bg-secondary p-3 sm:p-4 animate-fade-in-up">
          <input
            type="text"
            placeholder="Task title"
            value={newTaskTitle}
            onChange={(e) => {
              setNewTaskTitle(e.target.value)
              if (error) setError(null)
            }}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:border-[#dc2626]/50 focus:ring-2 focus:ring-[#dc2626]/20 focus:outline-none"
            autoFocus
          />
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Priority:</span>
            {(["high", "medium", "low"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setNewTaskPriority(p)}
                disabled={isSubmitting}
                className={`rounded-md px-2 py-0.5 text-xs font-medium capitalize transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  newTaskPriority === p
                    ? priorityConfig[p].color + " ring-1 ring-current"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleAddTask}
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-[#dc2626] py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#b91c1c] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Task"
              )}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false)
                setError(null)
              }}
              disabled={isSubmitting}
              className="rounded-lg border border-border bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Task List */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-2.5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#dc2626] mb-3" />
              <p className="text-sm font-medium text-muted-foreground">Loading tasks...</p>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in-up">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <ListTodo className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {searchQuery ? "No tasks found" : "No tasks yet"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Click 'Add Task' to get started or ask the AI to create one"}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo, index) => (
              <div
                key={todo.id}
                className="group relative rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm transition-all duration-300 hover:border-[#dc2626]/30 hover:shadow-md hover:shadow-[#dc2626]/5 hover:-translate-y-0.5 animate-fade-in-up"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="flex items-start gap-2.5 sm:gap-3">
                  {/* Completion Toggle */}
                  <button
                    onClick={() => handleToggleStatus(todo)}
                    disabled={isSubmitting}
                    className="mt-0.5 flex-shrink-0 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed text-muted-foreground hover:text-[#dc2626]"
                    aria-label={`Toggle task: ${todo.status === "completed" ? "completed" : "active"}`}
                  >
                    {todo.status === "completed" ? (
                      <CheckCircle2 className="h-5 w-5 text-[#22c55e]" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>

                  {/* Task Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`text-sm font-semibold leading-snug ${
                          todo.status === "completed"
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {todo.title}
                      </h3>
                      <button
                        onClick={() => handleDeleteTask(todo.id)}
                        disabled={isSubmitting}
                        className="flex-shrink-0 rounded-md p-1 text-muted-foreground opacity-0 transition-all duration-200 hover:bg-[#dc2626]/10 hover:text-[#f87171] group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Delete task: ${todo.title}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Meta Row */}
                    {todo.priority && (
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-[10px] py-0 ${priorityConfig[todo.priority].color}`}
                        >
                          {priorityConfig[todo.priority].label}
                        </Badge>
                        {todo.due_date && (
                          <span className="text-[10px] text-muted-foreground">
                            Due: {new Date(todo.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </section>
  )
}
