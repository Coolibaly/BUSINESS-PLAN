# app/core/config.py
from pydantic_settings import BaseSettings
from pydantic import Field
from functools import lru_cache
from typing import List, Optional, Union

class Settings(BaseSettings):
    # —–– Base de données
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    POSTGRES_URL: str = Field(..., env="POSTGRES_URL")

    # —–– Authentification
    JWT_SECRET_KEY: str = Field(..., env="JWT_SECRET_KEY")
    JWT_ALGORITHM: str = Field("HS256", env="JWT_ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(60, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    REFRESH_TOKEN_EXPIRE_MINUTES: int = Field(1440, env="REFRESH_TOKEN_EXPIRE_MINUTES")
    FERNET_SECRET: str = Field(..., env="FERNET_SECRET")

    # —–– CORS
    CORS_ORIGINS: Union[str, List[str]] = Field(default="*", env="CORS_ORIGINS")

    # —–– LLM / RAG
    USE_OPENAI: bool = Field(True, env="USE_OPENAI")
    OPENAI_API_KEY: Optional[str] = Field(None, env="OPENAI_API_KEY")
    OPENAI_MODEL: str = Field(
        "gpt-3.5-turbo-instruct",  # compatible fallback; si tu mets "gpt-4o-mini", on passera automatiquement en chat
        env="OPENAI_MODEL"
    )
    OPENAI_BASE_URL: Optional[str] = Field(None, env="OPENAI_BASE_URL")

    USE_OLLAMA: bool = Field(False, env="USE_OLLAMA")
    OLLAMA_API_KEY: Optional[str] = Field(None, env="OLLAMA_API_KEY")
    OLLAMA_API_BASE: Optional[str] = Field(None, env="OLLAMA_API_BASE")
    OLLAMA_MODEL: str = Field("llama3.1:8b-instruct", env="OLLAMA_MODEL")

    # Paramètres communs LLM
    LLM_TEMPERATURE: float = Field(0.7, env="LLM_TEMPERATURE")
    LLM_MAX_TOKENS: int = Field(800, env="LLM_MAX_TOKENS")
    LLM_STREAMING: bool = Field(False, env="LLM_STREAMING")

    # —–– Vectorstore (ChromaDB)
    CHROMA_PERSIST_DIR: str = Field("data/chroma", env="CHROMA_PERSIST_DIR")

    # —–– Scraping marché local
    GOOGLE_TRENDS_CI_API: Optional[str] = Field(None, env="GOOGLE_TRENDS_CI_API")
    INS_API_URL: Optional[str] = Field(None, env="INS_API_URL")
    MTN_SCRAPER_CREDENTIALS: Optional[str] = Field(None, env="MTN_SCRAPER_CREDENTIALS")

    # —–– Redis
    ENABLE_REDIS: bool = Field(False, env="ENABLE_REDIS")
    REDIS_URL: Optional[str] = Field(None, env="REDIS_URL")

    # —–– SSE
    ENABLE_SSE: bool = Field(True, env="ENABLE_SSE")

    # —–– Whisper
    WHISPER_MODEL: str = Field("openai/whisper-base", env="WHISPER_MODEL")

    # —–– Fuseau horaire
    TIME_ZONE: str = Field("Africa/Abidjan", env="TIME_ZONE")

    class Config:
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"

    def cors_list(self) -> List[str]:
        if isinstance(self.CORS_ORIGINS, list):
            return self.CORS_ORIGINS
        return [origin.strip() for origin in str(self.CORS_ORIGINS).split(",") if origin.strip()]


@lru_cache
def get_settings():
    return Settings()

settings = get_settings()
