# Pro Market — Telegram Bot + Mini App (MVP Starter)

AI-driven personalized interactive advertising for businesses. This repo is a **deployable starter** (V1 scope): bot commands, Mini App entry points, webhook updates, and server-side `initData` validation.

## Architecture

| Component | Stack | Role |
|-----------|-------|------|
| `bot/` | Python (aiogram 3) | `/start`, `/demo`, `/analytics`, rich messages, menu button, inline keyboards |
| `server/` | Node.js (Express) | Validates Telegram WebApp `initData`, demo/analytics APIs, serves Mini App build |
| `miniapp/` | React (Vite) | Telegram Mini App UI (`Telegram.WebApp`) |

```
Telegram → webhook → bot (Python)
User opens Mini App → server (Node) validates initData → JSON APIs
Mini App static files ← server/public (after `npm run build` in miniapp)
```

## Quick start (local)

### 1. Environment

Copy `.env.example` to `.env` and fill values:

- `BOT_TOKEN` — from [@BotFather](https://t.me/BotFather)
- `WEBHOOK_BASE_URL` — public HTTPS URL (e.g. ngrok tunnel)
- `WEBAPP_URL` — Mini App URL (usually `{WEBHOOK_BASE_URL}` or same origin as server)
- `SERVER_PORT` — default `3000`

### 2. Mini App + server

```bash
cd miniapp && npm install && npm run build
cd ../server && npm install && npm run build
# Copy miniapp dist into server public
npm run prepare:miniapp
npm run dev
```

Server runs at `http://localhost:3000` (API + static Mini App).

## Deploy (Vercel) — public link for Mini App + API

This repo supports a simple Vercel deploy that gives you:

- **Public Mini App URL** (the website)
- **Public `/api/*` endpoints** (Serverless Functions) with Telegram `initData` validation

Important:

- **The Python bot (`bot/`) is NOT deployed to Vercel**. Deploy it separately (Render/Fly/VPS), or keep it local during MVP demos.

### Vercel build settings

- **Framework preset**: `Other`
- **Build Command**: `npm run build`
- **Output Directory**: `miniapp/dist`

### Vercel environment variables

Set in Vercel → Project → Settings → Environment Variables:

- `BOT_TOKEN` = your Telegram bot token (used to validate `initData`)

### After deploy

- Your public site URL will look like `https://<project>.vercel.app`
- Health check: `/api/health`
- In BotFather: `/setdomain` to your Vercel domain
- In your bot config: set `WEBAPP_URL` to the same Vercel URL

### 3. Bot (webhook)

```bash
cd bot
python -m venv .venv
# Windows: .venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

On startup, the bot registers the webhook at `{WEBHOOK_BASE_URL}/webhook/bot` and sets the chat menu button to open the Mini App.

### 4. Telegram setup (BotFather)

1. Create bot → save token to `.env`
2. Set domain for Mini App: `/setdomain` → your `WEBHOOK_BASE_URL` host
3. Commands (optional, bot also sets via API):

```
start - Welcome and open Pro Market
demo - Launch demo ad campaign
analytics - View campaign analytics
```

### 5. HTTPS tunnel (development)

Use one public URL for both services (see `deploy/nginx.example.conf`), or run two tunnels:

- `WEBAPP_URL` / server → port `3000`
- `WEBHOOK_BASE_URL` + path `/webhook/bot` → bot port `8080`

Example with ngrok (server only for Mini App; point bot webhook to the same host via reverse proxy):

```bash
ngrok http 3000
# WEBAPP_URL=https://xxxx.ngrok-free.app
# Route /webhook/bot to bot:8080 (nginx) OR second ngrok on 8080 with WEBHOOK_BASE_URL
```

## API (authenticated)

All `/api/*` routes (except health) require header:

`Authorization: tma <initData raw string>`

The Mini App client sends this automatically via `src/api/client.ts`.

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Health check |
| `GET /api/demo` | Demo campaign payload (V1 mock) |
| `GET /api/analytics` | Basic analytics (V1 mock) |

## Payments (Telegram Stars)

Starter includes a **commented pattern** in `bot/handlers/payments.py` for `sendInvoice` with `currency=XTR`. Wire up when you add SKUs in BotFather.

## Out of scope (V1)

- Custom ML models (use third-party APIs later)
- Full analytics dashboard (basic reporting only)

## Production

See `docker-compose.yml` for a simple two-service layout (bot + server). Put TLS termination on a reverse proxy in front of the server port.

## References

- [Bot platform](https://core.telegram.org/bots)
- [Mini Apps](https://core.telegram.org/bots/webapps)
- [WebApp initData](https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app)
