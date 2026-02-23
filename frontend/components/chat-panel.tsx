"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  Send,
  Bot,
  User,
  MessageSquare,
  Sparkles,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { chatAPI, todoAPI } from "@/lib/api"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  // Auto-grow textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px"
    }
  }, [input])

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      // Get all todos to send as context
      const todos = await todoAPI.getAll()

      // Create assistant message placeholder
      const assistantId = (Date.now() + 1).toString()
      const assistantMessage: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Stream the response
      const messages_for_api = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }))

      for await (const event of chatAPI.stream(messages_for_api, todos)) {
        if (event.type === "text_delta") {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? { ...msg, content: msg.content + event.data.delta }
                : msg
            )
          )
        } else if (event.type === "tool_result") {
          // Handle tool results (e.g., task created)
          if (event.data.refresh_todos) {
            // Optionally refresh todos if a task was modified
            console.log("Todo refreshed:", event.data)
          }
        }
      }
    } catch (err) {
      console.error("Error sending message:", err)
      setError("Failed to get response. Make sure the backend is running.")
      // Remove the empty assistant message on error
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })

  return (
    <section className="flex flex-col h-full" aria-label="AI Chat">
      {/* Chat Header */}
      <div className="flex-shrink-0 border-b border-border px-3 py-3 sm:px-5 sm:py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-[#dc2626]/15">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#f87171]" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-foreground">
              AI Assistant
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-[#22c55e]">
                <span className="sr-only">Online</span>
              </span>
              <span className="text-xs text-muted-foreground">
                Powered by Groq
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-3 sm:mx-5 mt-2.5 sm:mt-3 flex items-center justify-between rounded-lg border border-[#dc2626]/30 bg-[#dc2626]/10 px-3 py-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-[#f87171] flex-shrink-0" />
            <span className="text-xs text-[#f87171]">{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-2 rounded-md p-0.5 text-[#f87171] hover:bg-[#dc2626]/20 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0">
        <div ref={scrollRef} className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <MessageSquare className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                No messages yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                Start a conversation to get AI-powered help with your tasks
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-fade-in-up ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                    message.role === "assistant"
                      ? "bg-[#dc2626]/15"
                      : "bg-secondary"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <Bot className="h-4 w-4 text-[#f87171]" />
                  ) : (
                    <User className="h-4 w-4 text-foreground" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`group max-w-[80%] rounded-xl px-4 py-2.5 transition-all duration-200 ${
                    message.role === "assistant"
                      ? "bg-card border border-border text-foreground"
                      : "bg-[#dc2626] text-white"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content || (
                      <span className="text-muted-foreground italic">
                        Generating response...
                      </span>
                    )}
                  </p>
                  <span
                    className={`mt-1 block text-[10px] ${
                      message.role === "assistant"
                        ? "text-muted-foreground"
                        : "text-white/60"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))
          )}

          {/* Loading Indicator */}
          {isLoading && messages[messages.length - 1]?.role === "assistant" && (
            <div className="flex gap-3 animate-fade-in-up">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#dc2626]/15">
                <Bot className="h-4 w-4 text-[#f87171]" />
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#dc2626]" />
                <span className="text-xs text-muted-foreground">
                  AI is thinking...
                </span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-border p-4">
        <div className="flex items-end gap-2 rounded-xl border border-border bg-secondary p-2 transition-colors focus-within:border-[#dc2626]/40 focus-within:ring-2 focus-within:ring-[#dc2626]/10">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your AI assistant..."
            disabled={isLoading}
            className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
            rows={1}
            style={{ maxHeight: "120px" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#dc2626] text-white transition-all duration-200 hover:bg-[#b91c1c] hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-[#dc2626]/50 focus-visible:outline-none"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] text-muted-foreground/60">
          Responses powered by Groq API • Try "Create a task to..."
        </p>
      </div>
    </section>
  )
}
