import crypto from "node:crypto";

type TelegramWebAppUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
};

export type ValidatedInitData = {
  user?: TelegramWebAppUser;
  authDate: number;
  hash: string;
  raw: Record<string, string>;
};

/**
 * Telegram Mini App initData validation:
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function validateInitData(
  initData: string,
  botToken: string,
  maxAgeSeconds = 86400
): ValidatedInitData {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) throw new Error("Missing hash in initData");

  const entries: [string, string][] = [];
  params.forEach((value, key) => {
    if (key !== "hash") entries.push([key, value]);
  });
  entries.sort(([a], [b]) => a.localeCompare(b));
  const dataCheckString = entries.map(([k, v]) => `${k}=${v}`).join("\n");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (calculatedHash !== hash) throw new Error("Invalid initData signature");

  const authDate = Number(params.get("auth_date"));
  if (!authDate || Number.isNaN(authDate)) throw new Error("Missing auth_date");
  const now = Math.floor(Date.now() / 1000);
  if (now - authDate > maxAgeSeconds) throw new Error("initData expired");

  let user: TelegramWebAppUser | undefined;
  const userJson = params.get("user");
  if (userJson) user = JSON.parse(userJson) as TelegramWebAppUser;

  const raw: Record<string, string> = {};
  params.forEach((value, key) => {
    raw[key] = value;
  });

  return { user, authDate, hash, raw };
}

