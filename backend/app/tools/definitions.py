TOOLS = [
    {
        "name": "add_todo",
        "description": (
            "Add a new task to the user's todo list. "
            "Use this when the user says something like 'add X to my list', "
            "'remind me to X', or 'create a task for X'."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "title": {
                    "type": "string",
                    "description": "The task title or description. Be concise and action-oriented."
                },
                "priority": {
                    "type": "string",
                    "enum": ["high", "medium", "low"],
                    "description": "Task priority. Default to 'medium' if not specified by the user."
                },
                "due_date": {
                    "type": "string",
                    "description": (
                        "Due date in ISO 8601 format (YYYY-MM-DD). "
                        "If the user says 'today', use today's date. "
                        "If not mentioned, omit this field."
                    )
                }
            },
            "required": ["title"]
        }
    },
    {
        "name": "list_todos",
        "description": (
            "Retrieve and display todos from the user's list. "
            "Use this when the user asks 'what do I have today?', "
            "'show my tasks', 'what's on my list?', or similar."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "filter": {
                    "type": "string",
                    "enum": ["all", "today", "high_priority", "backlog"],
                    "description": (
                        "Filter to apply. Use 'today' for today's tasks, "
                        "'high_priority' for urgent items, 'backlog' for incomplete past tasks, "
                        "'all' to show everything."
                    )
                }
            },
            "required": ["filter"]
        }
    },
    {
        "name": "complete_todo",
        "description": (
            "Mark a specific task as completed. "
            "Use this when user says 'mark X as done', 'I finished X', 'complete task X'."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer",
                    "description": "The numeric ID of the todo to mark complete."
                },
                "title_hint": {
                    "type": "string",
                    "description": (
                        "Optional: the task title as the user referred to it, "
                        "used for fuzzy-matching if exact ID is unknown."
                    )
                }
            },
            "required": ["id"]
        }
    },
    {
        "name": "delete_todo",
        "description": (
            "Permanently delete a task from the list. "
            "Use this when user says 'remove X', 'delete X', 'get rid of X task'."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer",
                    "description": "The numeric ID of the todo to delete."
                },
                "title_hint": {
                    "type": "string",
                    "description": "Optional: the task title as the user referred to it."
                }
            },
            "required": ["id"]
        }
    }
]

SYSTEM_PROMPT = """
You are a personal productivity assistant. You help users manage their todo list and answer questions.

When the user wants to add, view, complete, or delete tasks, use the appropriate tool.
Always confirm what action you took after using a tool (e.g., "I've added 'Buy groceries' to your list with medium priority.").

Today's date is {today_date}.

For regular conversation that doesn't involve tasks, just respond naturally.
Keep responses concise and helpful.
"""
