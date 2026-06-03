type Props = {
  headline: string;
  description: string;
  displayUrl: string;
  cta: string;
  variant?: "ad" | "post" | "telegram";
};

export default function AdPreview({
  headline,
  description,
  displayUrl,
  cta,
  variant = "ad",
}: Props) {
  return (
    <div className={`preview preview--${variant}`}>
      <div className="preview__label">Предпросмотр в ленте</div>
      <div className="preview__card">
        {variant === "telegram" && <div className="preview__channel">Pro Market · канал</div>}
        <div className="preview__headline">
          {headline || "Заголовок объявления"}
        </div>
        <div className="preview__desc">
          {description || "Текст с выгодой для клиента и призывом к действию."}
        </div>
        {displayUrl && (
          <div className="preview__url">{displayUrl.replace(/^https?:\/\//, "")}</div>
        )}
        {cta && <button type="button" className="preview__cta">{cta}</button>}
      </div>
    </div>
  );
}
