import WebApp from "@twa-dev/sdk";

const base = import.meta.env.VITE_API_BASE ?? "";

async function apiFetch<T>(path: string): Promise<T> {
  const initData = WebApp.initData;
  if (!initData) {
    throw new Error("Open this app from Telegram to authenticate.");
  }

  const res = await fetch(`${base}${path}`, {
    headers: {
      Authorization: `tma ${initData}`,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? res.statusText);
  }

  return res.json() as Promise<T>;
}

export type DemoResponse = {
  campaignId: string;
  title: string;
  preview: {
    headline: string;
    cta: string;
    segments: string[];
  };
  metrics: {
    engagementRate: number;
    impressions: number;
    clicks: number;
  };
  message: string;
};

export type AnalyticsResponse = {
  period: string;
  summary: {
    campaigns: number;
    avgEngagement: number;
    spendStars: number;
  };
  series: { day: string; engagement: number }[];
  note: string;
};

export const fetchDemo = () => apiFetch<DemoResponse>("/api/demo");
export const fetchAnalytics = () => apiFetch<AnalyticsResponse>("/api/analytics");
