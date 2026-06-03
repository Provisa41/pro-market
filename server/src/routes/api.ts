import type { Request, Response } from "express";
import type { ValidatedInitData } from "../auth/validateInitData.js";

function engagementForUser(userId?: number) {
  const base = userId ? (userId % 30) + 52 : 58;
  return Math.min(89, base);
}

export function health(_req: Request, res: Response) {
  res.json({ ok: true, service: "pro-market-server" });
}

export function demo(req: Request, res: Response) {
  const tma = req.tma as ValidatedInitData;
  const name =
    tma.user?.first_name ?? tma.user?.username ?? "your brand";
  const engagement = engagementForUser(tma.user?.id);

  res.json({
    campaignId: "demo-001",
    title: `Personalized campaign for ${name}`,
    preview: {
      headline: `${name}, boost engagement with interactive ads`,
      cta: "See live preview",
      segments: ["e-commerce", "retargeting", "mobile-first"],
    },
    metrics: {
      engagementRate: engagement,
      impressions: 12400,
      clicks: Math.round(12400 * (engagement / 100) * 0.4),
    },
    message:
      "V1 demo — replace with your ad engine or third-party personalization API.",
  });
}

export function analytics(req: Request, res: Response) {
  const tma = req.tma as ValidatedInitData;
  const engagement = engagementForUser(tma.user?.id);

  res.json({
    period: "last_7_days",
    summary: {
      campaigns: 1,
      avgEngagement: engagement,
      spendStars: 0,
    },
    series: [
      { day: "Mon", engagement: engagement - 4 },
      { day: "Tue", engagement: engagement - 2 },
      { day: "Wed", engagement: engagement },
      { day: "Thu", engagement: engagement + 1 },
      { day: "Fri", engagement: engagement + 3 },
      { day: "Sat", engagement: engagement - 1 },
      { day: "Sun", engagement: engagement + 2 },
    ],
    note: "Basic reporting only (V1). Full dashboard is out of scope.",
  });
}
