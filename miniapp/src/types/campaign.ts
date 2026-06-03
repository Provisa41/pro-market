export type Platform = "telegram" | "vk" | "instagram" | "youtube" | "tiktok";

export type PostDraft = {
  title: string;
  body: string;
  imageUrl: string;
  link: string;
  hashtags: string;
};

export type AdDraft = {
  headline: string;
  description: string;
  displayUrl: string;
  cta: string;
  keywords: string;
  audience: string;
  budget: string;
  platforms: Platform[];
  utmSource: string;
};

export type PromoteDraft = PostDraft & {
  objective: "traffic" | "leads" | "sales" | "awareness";
  dailyBudget: string;
  platforms: Platform[];
  schedule: "now" | "peak" | "custom";
};

export const CTA_OPTIONS = [
  "Купить",
  "Заказать",
  "Узнать цену",
  "Получить скидку",
  "Подписаться",
  "Написать в Telegram",
  "Скачать",
  "Записаться",
] as const;

export const OBJECTIVES = [
  { id: "traffic" as const, label: "Трафик на сайт", icon: "🚀" },
  { id: "leads" as const, label: "Заявки и лиды", icon: "📩" },
  { id: "sales" as const, label: "Продажи", icon: "💰" },
  { id: "awareness" as const, label: "Охват и узнаваемость", icon: "📣" },
];

export type CampaignType = "post" | "ad" | "promote";

export type CampaignStatus = "queued" | "active" | "completed";

export type SavedCampaign = {
  id: string;
  type: CampaignType;
  status: CampaignStatus;
  title: string;
  summary: string;
  createdAt: number;
  ctrScore: number;
  platforms: string[];
  budget?: string;
};

export const CAMPAIGN_TYPE_LABELS: Record<
  CampaignType,
  { label: string; icon: string }
> = {
  post: { label: "Пост", icon: "✏️" },
  ad: { label: "Реклама", icon: "📢" },
  promote: { label: "Продвижение", icon: "🚀" },
};

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  queued: "В очереди",
  active: "Активна",
  completed: "Завершена",
};

export const PLATFORMS: { id: Platform; label: string; icon: string }[] = [
  { id: "telegram", label: "Telegram", icon: "✈️" },
  { id: "vk", label: "VK", icon: "🔵" },
  { id: "instagram", label: "Instagram", icon: "📸" },
  { id: "youtube", label: "YouTube", icon: "▶️" },
  { id: "tiktok", label: "TikTok", icon: "🎵" },
];
