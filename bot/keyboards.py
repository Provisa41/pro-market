from aiogram.types import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    MenuButtonWebApp,
    WebAppInfo,
)


# Меняйте при обновлении Mini App — сбрасывает кэш Telegram
WEBAPP_CACHE_VERSION = "2"


def webapp_url(base: str, start_param: str | None = None) -> str:
    url = base.rstrip("/")
    sep = "&" if "?" in url else "?"
    url = f"{url}{sep}v={WEBAPP_CACHE_VERSION}"
    if start_param:
        url = f"{url}&tgWebAppStartParam={start_param}"
    return url


def main_inline_keyboard(webapp_base: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="Open Pro Market",
                    web_app=WebAppInfo(url=webapp_url(webapp_base)),
                )
            ],
            [
                InlineKeyboardButton(
                    text="Demo campaign",
                    web_app=WebAppInfo(url=webapp_url(webapp_base, "demo")),
                ),
                InlineKeyboardButton(
                    text="Analytics",
                    web_app=WebAppInfo(url=webapp_url(webapp_base, "analytics")),
                ),
            ],
        ]
    )


def menu_button(webapp_base: str) -> MenuButtonWebApp:
    return MenuButtonWebApp(
        text="Pro Market",
        web_app=WebAppInfo(url=webapp_url(webapp_base)),
    )
