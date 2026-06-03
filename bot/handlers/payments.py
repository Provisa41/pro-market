"""
Telegram Stars payments (XTR) — starter pattern for V1+.

Enable in BotFather, then uncomment and wire SKU labels.
See: https://core.telegram.org/bots/payments-stars
"""

# from aiogram import Router
# from aiogram.types import LabeledPrice, Message, PreCheckoutQuery
#
# router = Router(name="payments")
#
# TEMPLATE_SKU = "exclusive_template_pack"
#
# @router.message(commands={"subscribe"})
# async def cmd_subscribe(message: Message, bot):
#     await bot.send_invoice(
#         chat_id=message.chat.id,
#         title="Pro Market Advanced",
#         description="Advanced analytics and AI tools (monthly)",
#         payload=f"sub:{message.from_user.id}",
#         currency="XTR",
#         prices=[LabeledPrice(label="Monthly access", amount=100)],
#         provider_token="",  # empty for digital goods / Stars
#     )
#
# @router.pre_checkout_query()
# async def pre_checkout(query: PreCheckoutQuery, bot):
#     await bot.answer_pre_checkout_query(query.id, ok=True)
