import type { CampaignType, SavedCampaign } from "../types/campaign";
import { PLATFORMS } from "../types/campaign";

const STORAGE_KEY = "pro_market_campaigns";

function platformLabels(ids: string[]): string[] {
  return ids.map(
    (id) => PLATFORMS.find((p) => p.id === id)?.label ?? id
  );
}

export function loadCampaigns(): SavedCampaign[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as SavedCampaign[];
    return list.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export function saveCampaign(
  input: Omit<SavedCampaign, "id" | "createdAt" | "status">
): SavedCampaign {
  const campaign: SavedCampaign = {
    ...input,
    id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    status: "queued",
  };
  const list = loadCampaigns();
  list.unshift(campaign);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
  return campaign;
}

export function savePostCampaign(
  title: string,
  summary: string,
  ctrScore: number
) {
  return saveCampaign({
    type: "post",
    title: title || "Пост без названия",
    summary,
    ctrScore,
    platforms: ["Telegram"],
  });
}

export function saveAdCampaign(
  headline: string,
  summary: string,
  ctrScore: number,
  platformIds: string[],
  budget: string
) {
  return saveCampaign({
    type: "ad",
    title: headline || "Рекламная кампания",
    summary,
    ctrScore,
    platforms: platformLabels(platformIds),
    budget,
  });
}

export function savePromoteCampaign(
  title: string,
  summary: string,
  ctrScore: number,
  platformIds: string[],
  budget: string
) {
  return saveCampaign({
    type: "promote",
    title: title || "Продвижение поста",
    summary,
    ctrScore,
    platforms: platformLabels(platformIds),
    budget,
  });
}

export function formatCampaignDate(ts: number): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

export type { CampaignType };
