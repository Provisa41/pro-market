from aiogram import Router
from aiogram.filters import Command
from aiogram.types import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    Message,
    WebAppInfo,
)

from keyboards import main_inline_keyboard, webapp_url

router = Router(name="commands")


def webapp_button_row(base: str, start_param: str, text: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text=text,
                    web_app=WebAppInfo(url=webapp_url(base, start_param)),
                )
            ]
        ]
    )


async def send_success_carousel(message: Message) -> None:
    """Rich message carousel: success stories & ROI highlights (text-based V1)."""
    stories = [
        (
            "Case: Retail brand",
            "Switched to interactive personalized units → <b>+62%</b> engagement vs static banners.",
        ),
        (
            "Case: E-commerce",
            "Real-time preference tiles in Telegram → <b>2.1×</b> CTR on promo creatives.",
        ),
        (
            "Case: Tech SaaS",
            "Mini App ad flow with Stars upsell → <b>18%</b> trial-to-paid in 14 days.",
        ),
    ]
    for title, body in stories:
        await message.answer(f"<b>{title}</b>\n{body}")


def register_commands(parent: Router, webapp_base: str) -> None:
    @parent.message(Command("start"))
    async def cmd_start(message: Message) -> None:
        await message.answer(
            "<b>Pro Market</b>\n\n"
            "Harness AI-driven personalized interactive advertising for your business.\n\n"
            "• <code>/demo</code> — launch a demo ad campaign\n"
            "• <code>/analytics</code> — view basic campaign metrics\n\n"
            "Use the menu button or keyboard below to open the Mini App.",
            reply_markup=main_inline_keyboard(webapp_base),
        )
        await send_success_carousel(message)

    @parent.message(Command("demo"))
    async def cmd_demo(message: Message) -> None:
        await message.answer(
            "Your <b>demo campaign</b> is ready — open the Mini App to see a "
            "personalized interactive preview (target: <b>50%+</b> engagement).",
            reply_markup=webapp_button_row(
                webapp_base, "demo", "Launch demo in Mini App"
            ),
        )

    @parent.message(Command("analytics"))
    async def cmd_analytics(message: Message) -> None:
        await message.answer(
            "View <b>basic analytics</b> for your trial campaign (7-day snapshot, V1 scope).",
            reply_markup=webapp_button_row(
                webapp_base, "analytics", "Open analytics"
            ),
        )
