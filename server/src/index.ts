import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import * as api from "./routes/api.js";
import { tmaAuth } from "./middleware/tmaAuth.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
dotenv.config({ path: path.join(repoRoot, ".env") });
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

const BOT_TOKEN = process.env.BOT_TOKEN;
const PORT = Number(process.env.SERVER_PORT ?? 3000);

if (!BOT_TOKEN) {
  console.error("BOT_TOKEN is required in .env");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", api.health);
app.get("/api/demo", tmaAuth(BOT_TOKEN), api.demo);
app.get("/api/analytics", tmaAuth(BOT_TOKEN), api.analytics);

app.use(express.static(publicDir));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(publicDir, "index.html"), (err) => {
    if (err) {
      res.status(404).send(
        "Mini App not built. Run: cd miniapp && npm run build && cd ../server && npm run prepare:miniapp"
      );
    }
  });
});

app.listen(PORT, () => {
  console.log(`Pro Market server listening on http://localhost:${PORT}`);
});
