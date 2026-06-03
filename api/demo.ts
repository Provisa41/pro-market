import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getInitDataFromAuthHeader, requireTma } from "./_lib/tmaAuth";

function engagementForUser(userId?: number) {
  const base = userId ? (userId % 30) + 52 : 58;
  return Math.min(89, base);
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const initData = getInitDataFromAuthHeader(req.headers.authorization ?? null);
    const tma = requireTma(initData);

    const name = tma.user?.first_name ?? tma.user?.username ?? "your brand";
    const engagement = engagementForUser(tma.user?.id);

    res.status(200).json({
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
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    res.status(401).json({ error: message });
  }
}

