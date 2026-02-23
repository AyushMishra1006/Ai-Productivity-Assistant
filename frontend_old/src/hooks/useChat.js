import { useState, useCallback } from 'react';
import * as api from '../services/api';
import { createSSEParser } from '../utils/sseParser';
import { useTodoStore } from '../store/todoStore';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const refreshTodos = useTodoStore((state) => state.refreshTodos);

  const sendMessage = useCallback(
    async (content) => {
      // Add user message
      const userMessage = { id: Date.now(), role: 'user', content };
      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);
      setError(null);

      // Create pending assistant message
      const assistantMessageId = Date.now() + 1;
      const pendingMessage = { id: assistantMessageId, role: 'assistant', content: '' };
      setMessages((prev) => [...prev, pendingMessage]);

      try {
        // Prepare messages for API
        const apiMessages = [{ role: 'user', content }];
        const conversationHistory = messages
          .filter((m) => m.role !== 'system') // Exclude any system messages
          .map((m) => ({ role: m.role, content: m.content }))
          .slice(0, -1); // Exclude the message we just added

        // Stream the chat response
        let fullText = '';
        const parser = createSSEParser((eventType, data) => {
          if (eventType === 'text_delta') {
            fullText += data.delta;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMessageId
                  ? { ...m, content: fullText }
                  : m
              )
            );
          } else if (eventType === 'tool_call') {
            // Show tool call indicator
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMessageId
                  ? { ...m, toolCalling: true, toolName: data.tool_name }
                  : m
              )
            );
          } else if (eventType === 'tool_result') {
            // Hide tool call indicator
            if (data.refresh_todos) {
              refreshTodos();
            }
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMessageId
                  ? { ...m, toolCalling: false }
                  : m
              )
            );
          } else if (eventType === 'message_stop') {
            // Message complete
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMessageId
                  ? { ...m, complete: true, toolCalling: false }
                  : m
              )
            );
          }
        });

        // Start streaming
        for await (const chunk of api.streamChat(apiMessages, conversationHistory)) {
          parser(chunk);
        }
      } catch (err) {
        console.error('Chat error:', err);
        setError(err.message);
        // Remove pending message on error
        setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));
      } finally {
        setLoading(false);
      }
    },
    [messages, refreshTodos]
  );

  return {
    messages,
    loading,
    error,
    sendMessage,
    setError
  };
}
