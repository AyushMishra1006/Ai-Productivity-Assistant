from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.chat import ChatRequest
from app.services.claude_service import stream_chat
import json
import traceback

router = APIRouter()


@router.post("/stream")
async def chat_stream(request: ChatRequest, db: Session = Depends(get_db)):
    """Stream chat response via SSE."""
    print(f"Chat request received: {len(request.messages)} messages")

    def event_generator():
        """Generate SSE events from Groq stream."""
        try:
            print("Starting stream generation...")
            # Pass messages as both current and history (simplified for now)
            event_count = 0
            for event in stream_chat(request.messages, request.messages, db):
                event_count += 1
                # Send event in proper SSE format
                event_json = json.dumps(event)
                print(f"Yielding event {event_count}: {event['type']}")
                yield f"data: {event_json}\n\n"
            print(f"Stream finished with {event_count} events")
        except Exception as e:
            error_trace = traceback.format_exc()
            error_msg = f"Chat error: {str(e)}\n{error_trace}"
            print(error_msg)

            # Send error event
            error_event = {
                "type": "error",
                "data": {"error": str(e)}
            }
            yield f"data: {json.dumps(error_event)}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # Disable Nginx buffering
            "Connection": "keep-alive"
        }
    )
