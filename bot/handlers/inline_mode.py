"""
Inline mode starter: @YourBot <query>

Enable with BotFather /setinline, then in main.py:
  from handlers.inline_mode import create_inline_router
  dp.include_router(create_inline_router(settings.webapp_url))
"""

from aiogram import Router
from aiogram.types import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    InlineQuery,
    InlineQueryResultArticle,
    InputTextMessageContent,
    WebAppInfo,
)

from keyboards import webapp_url


def create_inline_router(webapp_base: str) -> Router:
    router = Router(name="inline")

    @router.inline_query()
    async def inline_search(inline_query: InlineQuery) -> None:
        query = (inline_query.query or "demo").strip()[:64]
        await inline_query.answer(
            [
                InlineQueryResultArticle(
                    id="promo-1",
                    title="Pro Market — Interactive ads",
                    description=f"Personalized preview: {query}",
                    input_message_content=InputTextMessageContent(
                        message_text=(
                            f"<b>Pro Market</b>\n"
                            f"Interactive ad preview for «{query}» — tap below to open."
                        ),
                        parse_mode="HTML",
                    ),
                    reply_markup=InlineKeyboardMarkup(
                        inline_keyboard=[
                            [
                                InlineKeyboardButton(
                                    text="Open Mini App",
                                    web_app=WebAppInfo(
                                        url=webapp_url(
                                            webapp_base, f"demo_{query[:16]}"
                                        )
                                    ),
                                )
                            ]
                        ]
                    ),
                ),
            ],
            cache_time=30,
            is_personal=True,
        )

    return router
