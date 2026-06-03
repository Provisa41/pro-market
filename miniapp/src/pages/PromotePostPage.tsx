import { useMemo, useState } from "react";
import WebApp from "@twa-dev/sdk";
import FormField from "../components/FormField";
import PlatformPicker from "../components/PlatformPicker";
import ConversionScore from "../components/ConversionScore";
import AdPreview from "../components/AdPreview";
import { savePromoteCampaign } from "../lib/campaignsStorage";
import { scorePromote } from "../lib/conversion";
import { OBJECTIVES, type PromoteDraft } from "../types/campaign";

const initial: PromoteDraft = {
  title: "",
  body: "",
  imageUrl: "",
  link: "",
  hashtags: "",
  objective: "traffic",
  dailyBudget: "500",
  platforms: ["telegram", "instagram"],
  schedule: "peak",
};

export default function PromotePostPage() {
  const [draft, setDraft] = useState<PromoteDraft>(initial);
  const insight = useMemo(() => scorePromote(draft), [draft]);
  const patch = (key: keyof PromoteDraft) => (v: string) =>
    setDraft((d) => ({ ...d, [key]: v }));

  const publish = () => {
    WebApp.HapticFeedback?.notificationOccurred("success");
    const obj = OBJECTIVES.find((o) => o.id === draft.objective)?.label;
    savePromoteCampaign(
      draft.title,
      `${obj ?? "Продвижение"} · ${draft.body.slice(0, 80)}`,
      insight.score,
      draft.platforms,
      draft.dailyBudget
    );
    WebApp.showAlert(
      `Продвижение запущено!\nЦель: ${obj}\nСети: ${draft.platforms.join(", ")}\nСмотрите в «Мои кампании».`
    );
  };

  return (
    <>
      <section className="page-head">
        <h2 className="page-head__title">Продвижение поста</h2>
        <p className="page-head__sub">
          Таргетированное размещение в Telegram и соцсетях — максимум охвата и кликов
        </p>
      </section>

      <ConversionScore insight={insight} />

      <p className="section-label">Цель кампании</p>
      <div className="objective-grid">
        {OBJECTIVES.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`objective-chip${draft.objective === o.id ? " objective-chip--on" : ""}`}
            onClick={() => setDraft((d) => ({ ...d, objective: o.id }))}
          >
            <span>{o.icon}</span>
            <span>{o.label}</span>
          </button>
        ))}
      </div>

      <AdPreview
        variant="telegram"
        headline={draft.title}
        description={draft.body}
        displayUrl={draft.link}
        cta="Подробнее"
      />

      <section className="form-panel">
        <FormField
          label="Заголовок для продвижения"
          value={draft.title}
          onChange={patch("title")}
          maxLength={56}
          placeholder="Новая коллекция — только 48 часов"
          required
        />
        <FormField
          label="Текст поста"
          value={draft.body}
          onChange={patch("body")}
          multiline
          placeholder="Описание оффера для таргета..."
        />
        <FormField
          label="Ссылка перехода"
          value={draft.link}
          onChange={patch("link")}
          placeholder="https://..."
        />
        <FormField
          label="Хештеги"
          value={draft.hashtags}
          onChange={patch("hashtags")}
          placeholder="#промо #sale"
        />

        <label className="field">
          <span className="field__label">Когда публиковать</span>
          <div className="schedule-row">
            {(
              [
                ["now", "Сейчас"],
                ["peak", "Пик (18–22)"],
                ["custom", "По расписанию"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`schedule-chip${draft.schedule === id ? " schedule-chip--on" : ""}`}
                onClick={() => setDraft((d) => ({ ...d, schedule: id }))}
              >
                {label}
              </button>
            ))}
          </div>
        </label>

        <FormField
          label="Бюджет в день (₽)"
          value={draft.dailyBudget}
          onChange={patch("dailyBudget")}
          placeholder="500"
        />

        <PlatformPicker
          selected={draft.platforms}
          onChange={(platforms) => setDraft((d) => ({ ...d, platforms }))}
        />
      </section>

      <button
        type="button"
        className="btn btn--primary btn--gradient"
        onClick={publish}
        disabled={insight.score < 55 || draft.platforms.length === 0}
      >
        🚀 Запустить продвижение
      </button>
    </>
  );
}
