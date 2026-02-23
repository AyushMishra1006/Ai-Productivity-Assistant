from groq import Groq
from datetime import date
from sqlalchemy.orm import Session
from app.core.config import settings

# Use Groq API (fast cloud-based LLM)
# Get free API key from https://groq.com/
if not settings.groq_api_key:
    raise ValueError("GROQ_API_KEY environment variable is not set")

client = Groq(api_key=settings.groq_api_key)

# Simple system prompt for productivity assistant
SYSTEM_PROMPT = """You are a friendly and helpful personal productivity assistant.
You help users manage their tasks and provide useful advice.
Today's date is {today_date}.
Keep responses concise and helpful."""


def stream_chat(messages: list, conversation_history: list, db: Session):
    """
    Stream chat response using Groq's API.
    Yields SSE events: text_delta, message_stop.
    Note: Tool support will be added in a future update.
    """
    system = SYSTEM_PROMPT.format(today_date=date.today().isoformat())

    # Build chat messages list with system message first
    chat_messages = [
        {"role": "system", "content": system}
    ]

    # Add conversation history and new messages
    for msg in conversation_history + messages:
        chat_messages.append({
            "role": msg.get("role", "user"),
            "content": msg.get("content", "")
        })

    try:
        # Stream the response using Groq's API
        stream = client.chat.completions.create(
            model=settings.ai_model,  # Groq's Mixtral 8x7B (fast & powerful)
            max_tokens=settings.ai_max_tokens,
            messages=chat_messages,
            stream=True,
        )

        # Process the stream
        for chunk in stream:
            # Check if there's content to yield
            if chunk.choices[0].delta.content is not None:
                yield {
                    "type": "text_delta",
                    "data": {"delta": chunk.choices[0].delta.content}
                }

        # Signal end of message
        yield {
            "type": "message_stop",
            "data": {"finish_reason": "end_turn"}
        }

    except Exception as e:
        # Let the chat API endpoint handle the error
        raise e
