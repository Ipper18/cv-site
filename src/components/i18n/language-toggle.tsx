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
    <svg viewBox="0 0 640 480" className="flag" aria-label="United Kingdom">
      <path fill="#012169" d="M0 0h640v480H0z" />
      <path fill="#FFF" d="M75 0l244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-179L0 62V0h75z" />
      <path fill="#C8102E" d="M424 294l216 162v24H455L233 325 0 500v-24l217-163 9-6-14-11L0 130V0h11l221 166 10 7-9-7L12 0h223l213 160 13 10-13-10L640 0v132L424 294z" />
      <path fill="#FFF" d="M253 0h134v480H253zM0 173h640v134H0z" />
      <path fill="#C8102E" d="M287 0h66v480h-66zM0 206h640v68H0z" />
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
