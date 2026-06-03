import { validateInitData, type ValidatedInitData } from "./validateInitData";

export function getInitDataFromAuthHeader(
  headerValue: string | null
): string | null {
  if (!headerValue) return null;
  if (!headerValue.startsWith("tma ")) return null;
  const initData = headerValue.slice(4).trim();
  return initData.length ? initData : null;
}

export function requireTma(initData: string | null): ValidatedInitData {
  const token = process.env.BOT_TOKEN;
  if (!token) throw new Error("Server misconfigured: BOT_TOKEN missing");
  if (!initData) throw new Error("Missing Authorization: tma <initData>");
  return validateInitData(initData, token);
}

