import type { CSSProperties } from "react";
import type { ConversionInsight } from "../lib/conversion";

type Props = { insight: ConversionInsight };

export default function ConversionScore({ insight }: Props) {
  const color =
    insight.score >= 85
      ? "var(--success)"
      : insight.score >= 65
        ? "var(--warn)"
        : "var(--danger)";

  const ringStyle = {
    "--pct": insight.score,
    "--ring-color": color,
  } as CSSProperties;

  return (
    <section className="score-card">
      <div className="score-card__ring" style={ringStyle}>
        <span className="score-card__value">{insight.score}</span>
      </div>
      <div className="score-card__meta">
        <strong>{insight.label}</strong>
        <p className="score-card__hint">Индекс кликабельности (CTR)</p>
      </div>
      <ul className="score-card__tips">
        {insight.tips.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </section>
  );
}
