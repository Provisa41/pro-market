import type { AdDraft, PostDraft, PromoteDraft } from "../types/campaign";

export type ConversionInsight = {
  score: number;
  label: string;
  tips: string[];
};

/** Оценка креатива по практикам Яндекс.Директ / performance-маркетинга */
export function scoreAd(draft: AdDraft): ConversionInsight {
  let score = 40;
  const tips: string[] = [];

  const h = draft.headline.trim();
  const d = draft.description.trim();

  if (h.length >= 20 && h.length <= 56) score += 15;
  else if (h.length > 0)
    tips.push(
      h.length < 20
        ? "Заголовок короткий — добавьте выгоду или цифру (до 56 символов)."
        : "Сократите заголовок до 56 символов — так выше CTR в ленте."
    );

  if (/\d|%|₽|руб|скидк|бесплат/i.test(h)) score += 10;
  else tips.push("Добавьте в заголовок цифру, % скидки или цену — CTR растёт на 15–25%.");

  if (d.length >= 40 && d.length <= 81) score += 15;
  else if (d.length > 0)
    tips.push("Текст объявления: 40–81 символ — оптимум для мобильной ленты.");

  if (draft.cta) score += 10;
  else tips.push("Выберите чёткий призыв к действию (CTA).");

  if (draft.keywords.split(",").filter(Boolean).length >= 3) score += 8;
  else tips.push("Добавьте 5–10 ключевых фраз через запятую — как в Директе.");

  if (draft.platforms.length >= 2) score += 7;
  else tips.push("Запустите минимум в Telegram + ещё одну соцсеть для охвата.");

  if (draft.budget && Number(draft.budget) >= 500) score += 5;

  score = Math.min(98, score);
  const label =
    score >= 85
      ? "Высокая конверсия"
      : score >= 65
        ? "Хороший потенциал"
        : "Нужна доработка";

  if (tips.length === 0)
    tips.push("Креатив готов к публикации — Pro Market разместит в выбранных каналах.");

  return { score, label, tips };
}

export function scorePost(draft: PostDraft): ConversionInsight {
  let score = 35;
  const tips: string[] = [];

  if (draft.title.trim().length >= 10) score += 20;
  else tips.push("Заголовок поста: от 10 символов, с акцентом на пользу.");

  if (draft.body.trim().length >= 50) score += 20;
  else tips.push("Текст поста: раскройте оффер, добавьте соцдоказательство.");

  if (draft.link.trim()) score += 15;
  else tips.push("Укажите ссылку — без неё падает кликабельность.");

  if (draft.hashtags.split("#").filter((t) => t.trim()).length >= 2) score += 10;
  else tips.push("2–5 хештегов для Telegram и VK увеличивают охват.");

  score = Math.min(95, score);
  const label = score >= 75 ? "Готов к публикации" : "Дополните пост";

  if (tips.length === 0) tips.push("Пост можно публиковать в ленту и каналы.");

  return { score, label, tips };
}

export function scorePromote(draft: PromoteDraft): ConversionInsight {
  const base = scorePost(draft);
  let score = base.score;
  const tips = [...base.tips];

  if (draft.platforms.length >= 2) score += 8;
  if (draft.dailyBudget && Number(draft.dailyBudget) >= 300) score += 7;
  if (draft.objective === "sales" || draft.objective === "leads") score += 5;

  score = Math.min(98, score);
  return {
    score,
    label: score >= 80 ? "Сильная промо-кампания" : base.label,
    tips,
  };
}
