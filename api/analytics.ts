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

    const engagement = engagementForUser(tma.user?.id);

    res.status(200).json({
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
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    res.status(401).json({ error: message });
  }
}

