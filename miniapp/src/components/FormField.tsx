type Props = {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
};

export default function FormField({
  label,
  hint,
  value,
  onChange,
  maxLength,
  placeholder,
  multiline,
  required,
}: Props) {
  const len = value.length;
  const over = maxLength != null && len > maxLength;

  return (
    <label className="field">
      <span className="field__label">
        {label}
        {required && <span className="field__req"> *</span>}
      </span>
      {hint && <span className="field__hint">{hint}</span>}
      {multiline ? (
        <textarea
          className={`field__input field__input--area${over ? " field__input--warn" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          maxLength={maxLength ? maxLength + 20 : undefined}
        />
      ) : (
        <input
          className={`field__input${over ? " field__input--warn" : ""}`}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
      {maxLength != null && (
        <span className={`field__counter${over ? " field__counter--warn" : ""}`}>
          {len}/{maxLength}
        </span>
      )}
    </label>
  );
}
