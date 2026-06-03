import { useMemo, useState } from "react";
import WebApp from "@twa-dev/sdk";
import FormField from "../components/FormField";
import ConversionScore from "../components/ConversionScore";
import AdPreview from "../components/AdPreview";
import { scorePost } from "../lib/conversion";
import type { PostDraft } from "../types/campaign";

const initial: PostDraft = {
  title: "",
  body: "",
  imageUrl: "",
  link: "",
  hashtags: "",
};

export default function CreatePostPage() {
  const [draft, setDraft] = useState<PostDraft>(initial);
  const [published, setPublished] = useState(false);

  const insight = useMemo(() => scorePost(draft), [draft]);
  const patch = (key: keyof PostDraft) => (v: string) =>
    setDraft((d) => ({ ...d, [key]: v }));

  const publish = () => {
    WebApp.HapticFeedback?.impactOccurred("medium");
    setPublished(true);
    WebApp.showAlert(
      "Пост принят! Pro Market подготовит публикацию в Telegram и выбранных соцсетях."
    );
  };

  return (
    <>
      <section className="page-head">
        <h2 className="page-head__title">Добавить пост</h2>
        <p className="page-head__sub">
          Контент для ленты и каналов — оптимизируем под клики
        </p>
      </section>

      <ConversionScore insight={insight} />

      <AdPreview
        variant="telegram"
        headline={draft.title}
        description={draft.body}
        displayUrl={draft.link}
        cta="Читать"
      />

      <section className="form-panel">
        <FormField
          label="Заголовок поста"
          hint="Цепляющая фраза с выгодой для ленты"
          value={draft.title}
          onChange={patch("title")}
          maxLength={70}
          placeholder="Скидка 30% на первый заказ до пятницы"
          required
        />
        <FormField
          label="Текст поста"
          hint="Оффер, дедлайн, соцдоказательство"
          value={draft.body}
          onChange={patch("body")}
          multiline
          placeholder="Расскажите, что получит клиент и почему сейчас..."
        />
        <FormField
          label="Ссылка"
          hint="Куда ведём клик — сайт, бот, лендинг"
          value={draft.link}
          onChange={patch("link")}
          placeholder="https://ваш-сайт.ru"
        />
        <FormField
          label="Хештеги"
          hint="Через пробел или # — для охвата в TG и VK"
          value={draft.hashtags}
          onChange={patch("hashtags")}
          placeholder="#реклама #скидка #вашбренд"
        />
        <FormField
          label="Ссылка на изображение"
          hint="Необязательно — URL картинки для поста"
          value={draft.imageUrl}
          onChange={patch("imageUrl")}
          placeholder="https://..."
        />
      </section>

      <button
        type="button"
        className="btn btn--primary"
        onClick={publish}
        disabled={insight.score < 50}
      >
        {published ? "✓ Пост в очереди" : "Опубликовать пост"}
      </button>
      {insight.score < 50 && (
        <p className="form-note">Дополните поля — индекс CTR должен быть выше 50</p>
      )}
    </>
  );
}
