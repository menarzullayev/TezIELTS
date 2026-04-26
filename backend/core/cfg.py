from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Cfg(BaseSettings):
    app_name: str = "TezIELTS API"
    app_env: str = "development"
    debug: bool = True

    # Database Settings
    db_url_async: str = "sqlite+aiosqlite:///./tez_ielts.db"
    db_url_sync: str = "sqlite:///./tez_ielts.db"

    # Cloudflare R2 Settings
    r2_account_id: str = ""
    r2_access_key: str = ""
    r2_secret_key: str = ""
    r2_bucket_name: str = "ielts-dev-media"
    r2_custom_domain: str | None = None

    # JWT Settings
    jwt_secret: str = "dev-jwt-secret-change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7

    # Redis & Celery
    redis_url: str = "redis://localhost:6380/0"
    celery_task_always_eager: bool = False
    celery_task_eager_propagates: bool = True

    # AI Settings
    groq_api_key: str = ""
    whisper_model: str = "whisper-large-v3"
    llm_model: str = "llama3-70b-8192"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("debug", mode="before")
    @classmethod
    def normalize_debug(cls, value: object) -> object:
        if isinstance(value, str):
            normalized = value.strip().lower()
            if normalized in {"release", "prod", "production", "false", "0", "no", "off"}:
                return False
            if normalized in {"dev", "development", "debug", "true", "1", "yes", "on"}:
                return True
        return value

    @model_validator(mode="after")
    def validate_production_settings(self) -> "Cfg":
        if self.app_env.lower() in {"production", "staging"}:
            required_values = {
                "jwt_secret": self.jwt_secret,
                "db_url_async": self.db_url_async,
                "redis_url": self.redis_url,
            }
            missing = [name for name, value in required_values.items() if not value]
            if missing:
                raise ValueError(f"Missing required production settings: {', '.join(missing)}")
        return self


cfg = Cfg()
