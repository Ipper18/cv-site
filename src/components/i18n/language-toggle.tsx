"use client";

import { useLanguage } from "./language-provider";

function Flag({ variant }: { variant: "pl" | "en" }) {
  if (variant === "pl") {
    return (
      <svg viewBox="0 0 640 480" className="flag" aria-label="Polska">
        <g fillRule="evenodd">
          <path fill="#fff" d="M640 480H0V0h640z" />
          <path fill="#dc143c" d="M640 480H0V240h640z" />
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 60 60" className="flag" aria-label="United Kingdom">
      <defs>
        <clipPath id="uk-circle">
          <circle cx="30" cy="30" r="30" />
        </clipPath>
      </defs>
      <g clipPath="url(#uk-circle)">
        <path fill="#012169" d="M0 0h60v60H0z" />
        <path fill="#FFF" d="M0 0l60 40v-8L10 0H0zm60 0h-8L0 40v8L60 8V0z" />
        <path fill="#C8102E" d="M0 0l60 40v-5.6L5 0H0zm60 0h-5L0 40v5.6L60 5V0z" />
        <path fill="#FFF" d="M24 0h12v60H24zM0 24h60v12H0z" />
        <path fill="#C8102E" d="M26.5 0h7v60h-7zM0 26.5h60v7H0z" />
      </g>
    </svg>
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
          <span className={`flag-text ${!isEn ? "is-active" : ""}`}>PL</span>
          <span className="flag-divider" />
          <span className={`flag-text ${isEn ? "is-active" : ""}`}>EN</span>
        </span>
      </button>
    </div>
  );
}
