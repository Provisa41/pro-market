import { useMemo, useState } from "react";
import WebApp from "@twa-dev/sdk";
import FormField from "../components/FormField";
import PlatformPicker from "../components/PlatformPicker";
import ConversionScore from "../components/ConversionScore";
import AdPreview from "../components/AdPreview";
import { scoreAd } from "../lib/conversion";
import { CTA_OPTIONS, type AdDraft } from "../types/campaign";

const initial: AdDraft = {
  headline: "",
  description: "",
  displayUrl: "",
  cta: CTA_OPTIONS[0],
  keywords: "",
  audience: "",
  budget: "1000",
  platforms: ["telegram", "vk"],
  utmSource: "pro_market",
};

export default function PublishAdPage() {
  const [draft, setDraft] = useState<AdDraft>(initial);
  const insight = useMemo(() => scoreAd(draft), [draft]);
  const patch = (key: keyof AdDraft) => (v: string) =>
    setDraft((d) => ({ ...d, [key]: v }));

  const publish = () => {
    WebApp.HapticFeedback?.notificationOccurred("success");
    WebApp.showAlert(
      `Реклама отправлена!\nПлатформы: ${draft.platforms.join(", ")}\nБюджет: ${draft.budget} ₽/день\nPro Market запускает кампанию с оптимизацией CTR.`
    );
  };

  return (
    <>
      <section className="page-head">
        <h2 className="page-head__title">Выложить рекламу</h2>
        <p className="page-head__sub">
          Структура как в Яндекс.Директ — заголовок, текст, CTA, ключи, бюджет
        </p>
      </section>

      <ConversionScore insight={insight} />

      <AdPreview
        headline={draft.headline}
        description={draft.description}
        displayUrl={draft.displayUrl}
        cta={draft.cta}
      />

      <section className="form-panel">
        <div className="direct-tip">
          <span>💡</span>
          <p>
            <strong>Яндекс.Директ:</strong> заголовок до 56 символов, текст до 81 —
            так выше CTR в мобильной выдаче. Мы применяем те же лимиты.
          </p>
        </div>

        <FormField
          label="Заголовок объявления"
          hint="До 56 символов · цифра или % повышают клики"
          value={draft.headline}
          onChange={patch("headline")}
          maxLength={56}
          placeholder="-30% на доставку сегодня"
          required
        />
        <FormField
          label="Текст объявления"
          hint="До 81 символа · выгода + срочность"
          value={draft.description}
          onChange={patch("description")}
          maxLength={81}
          multiline
          placeholder="Закажите до 23:59 — бесплатная доставка по городу"
          required
        />
        <FormField
          label="Отображаемая ссылка"
          hint="Как в сниппете Директа — домен без https"
          value={draft.displayUrl}
          onChange={patch("displayUrl")}
          placeholder="shop.example.ru"
        />

        <label className="field">
          <span className="field__label">Кнопка (CTA)</span>
          <select
            className="field__input field__select"
            value={draft.cta}
            onChange={(e) => patch("cta")(e.target.value)}
          >
            {CTA_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <FormField
          label="Ключевые фразы"
          hint="Через запятую — как подбор ключей в Директе"
          value={draft.keywords}
          onChange={patch("keywords")}
          placeholder="купить онлайн, доставка еда, скидка"
        />
        <FormField
          label="Аудитория"
          hint="Гео, интересы, возраст"
          value={draft.audience}
          onChange={patch("audience")}
          placeholder="Москва, 25–45, интерес: e-commerce"
        />
        <FormField
          label="Бюджет в день (₽)"
          hint="От 500 ₽ — рекомендуем для теста"
          value={draft.budget}
          onChange={patch("budget")}
          placeholder="1000"
        />

        <PlatformPicker
          selected={draft.platforms}
          onChange={(platforms) => setDraft((d) => ({ ...d, platforms }))}
        />
      </section>

      <button
        type="button"
        className="btn btn--primary"
        onClick={publish}
        disabled={insight.score < 60 || draft.platforms.length === 0}
      >
        Запустить рекламу
      </button>
    </>
  );
}
