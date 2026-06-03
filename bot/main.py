import logging

from aiohttp import web
from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.types import BotCommand, BotCommandScopeDefault
from aiogram.webhook.aiohttp_server import SimpleRequestHandler, setup_application

from config import get_settings
from handlers.commands import register_commands, router as commands_router
from keyboards import menu_button

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def configure_bot(bot: Bot, settings) -> None:
    await bot.set_my_commands(
        [
            BotCommand(command="start", description="Welcome & open Pro Market"),
            BotCommand(command="demo", description="Launch demo ad campaign"),
            BotCommand(command="analytics", description="View campaign analytics"),
        ],
        scope=BotCommandScopeDefault(),
    )
    await bot.set_chat_menu_button(menu_button=menu_button(settings.webapp_url))
    await bot.set_webhook(
        url=settings.webhook_url,
        drop_pending_updates=True,
        allowed_updates=[
            "message",
            "callback_query",
            "pre_checkout_query",
            "inline_query",
        ],
    )
    logger.info("Webhook registered at %s", settings.webhook_url)


def create_app() -> web.Application:
    settings = get_settings()
    bot = Bot(
        token=settings.bot_token,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML),
    )
    dp = Dispatcher()

    register_commands(commands_router, settings.webapp_url)
    dp.include_router(commands_router)

    app = web.Application()

    async def health(_request: web.Request) -> web.Response:
        return web.json_response({"ok": True, "service": "pro-market-bot"})

    app.router.add_get("/health", health)

    webhook_handler = SimpleRequestHandler(dispatcher=dp, bot=bot)
    webhook_handler.register(app, path=settings.webhook_path)

    setup_application(app, dp, bot=bot)

    async def on_startup(_app: web.Application) -> None:
        await configure_bot(bot, settings)

    app.on_startup.append(on_startup)
    app["bot"] = bot
    app["dp"] = dp

    return app


def main() -> None:
    settings = get_settings()
    app = create_app()
    logger.info(
        "Bot webhook on %s:%s%s (public URL: %s)",
        settings.host,
        settings.port,
        settings.webhook_path,
        settings.webhook_url,
    )
    web.run_app(app, host=settings.host, port=settings.port)


if __name__ == "__main__":
    main()
