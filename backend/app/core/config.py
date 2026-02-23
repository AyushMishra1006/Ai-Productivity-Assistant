from pydantic import BaseSettings
from typing import List


class Settings(BaseSettings):
    # API Configuration
    api_title: str = "AI Productivity Assistant API"
    api_version: str = "1.0.0"
    environment: str = "development"

    # Database Configuration
    database_url: str = "sqlite:///./todos.db"

    # Groq API Configuration (for Claude/Mistral models via Groq)
    groq_api_key: str = ""

    # CORS Configuration
    allowed_origins: str = "http://localhost:5173,http://localhost:3000"

    # AI Model Configuration
    ai_model: str = "llama-3.3-70b-versatile"  # Groq's latest Llama model (mixtral-8x7b is deprecated)
    ai_max_tokens: int = 1024

    class Config:
        env_file = ".env"
        case_sensitive = False

    @property
    def allowed_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",")]


settings = Settings()
