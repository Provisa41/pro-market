import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

_REPO_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(_REPO_ROOT / ".env")
load_dotenv()


@dataclass(frozen=True)
class Settings:
    bot_token: str
    webhook_base_url: str
    webapp_url: str
    webhook_path: str = "/webhook/bot"
    host: str = "0.0.0.0"
    port: int = 8080

    @property
    def webhook_url(self) -> str:
        base = self.webhook_base_url.rstrip("/")
        return f"{base}{self.webhook_path}"


def get_settings() -> Settings:
    token = os.getenv("BOT_TOKEN", "").strip()
    base = os.getenv("WEBHOOK_BASE_URL", "").strip()
    webapp = os.getenv("WEBAPP_URL", base).strip() or base

    if not token:
        raise RuntimeError("BOT_TOKEN is required in .env")
    if not base:
        raise RuntimeError("WEBHOOK_BASE_URL is required in .env")

    port = int(os.getenv("BOT_WEBHOOK_PORT", "8080"))
    path = os.getenv("BOT_WEBHOOK_PATH", "/webhook/bot")

    return Settings(
        bot_token=token,
        webhook_base_url=base,
        webapp_url=webapp,
        webhook_path=path,
        port=port,
    )
