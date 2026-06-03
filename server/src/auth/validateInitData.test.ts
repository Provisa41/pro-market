import { describe, it } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { validateInitData } from "./validateInitData.js";

const BOT_TOKEN = "123456:TEST-BOT-TOKEN";

function signInitData(fields: Record<string, string>, token: string): string {
  const params = new URLSearchParams(fields);
  const entries = [...params.entries()].sort(([a], [b]) => a.localeCompare(b));
  const dataCheckString = entries.map(([k, v]) => `${k}=${v}`).join("\n");
  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(token)
    .digest();
  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");
  params.set("hash", hash);
  return params.toString();
}

describe("validateInitData", () => {
  it("accepts valid signature", () => {
    const authDate = String(Math.floor(Date.now() / 1000));
    const initData = signInitData(
      {
        auth_date: authDate,
        user: JSON.stringify({ id: 1, first_name: "Test" }),
      },
      BOT_TOKEN
    );
    const result = validateInitData(initData, BOT_TOKEN);
    assert.equal(result.user?.first_name, "Test");
  });

  it("rejects tampered hash", () => {
    const initData = signInitData(
      { auth_date: String(Math.floor(Date.now() / 1000)) },
      BOT_TOKEN
    );
    const tampered = initData.replace(/hash=[^&]+/, "hash=deadbeef");
    assert.throws(() => validateInitData(tampered, BOT_TOKEN), /Invalid/);
  });
});
