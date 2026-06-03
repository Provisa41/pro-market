import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const src = join(root, "miniapp", "dist");
const dest = join(root, "server", "public");

if (!existsSync(src)) {
  console.error("miniapp/dist not found. Run: cd miniapp && npm run build");
  process.exit(1);
}

if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });
console.log("Copied miniapp/dist → server/public");
