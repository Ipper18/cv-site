"use client";

import { useLanguage } from "./language-provider";

function Flag({ variant }: { variant: "pl" | "en" }) {
  const emoji = variant === "pl" ? "🇵🇱" : "🇬🇧";
  return (
    <span className="flag" role="img" aria-label={variant === "pl" ? "Polska" : "United Kingdom"}>
      {emoji}
    </span>
  );
}

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  const isEn = language === "en";

  return (
    <div className="language-toggle" aria-live="polite">
      <button type="button" onClick={toggleLanguage} aria-label={`Przełącz na ${isEn ? "polski" : "angielski"}`}>
        <div className="flag-track">
          <div className={`flag-thumb ${isEn ? "flag-thumb-en" : "flag-thumb-pl"}`}>{isEn ? <Flag variant="en" /> : <Flag variant="pl" />}</div>
        </div>
        <span className="flag-label">
          <Flag variant="pl" /> <span className={`flag-text ${!isEn ? "is-active" : ""}`}>PL</span>
          <span className="flag-divider" />
          <Flag variant="en" /> <span className={`flag-text ${isEn ? "is-active" : ""}`}>EN</span>
        </span>
      </button>
    </div>
  );
}
