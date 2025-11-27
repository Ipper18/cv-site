"use client";

import { useTheme } from "./theme-provider";

const SunIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="4" />
    <path strokeLinecap="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364-1.414-1.414M7.05 7.05 5.636 5.636m12.728 0-1.414 1.414M7.05 16.95 5.636 18.364" />
  </svg>
);

const MoonIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 15.5A8.38 8.38 0 0 1 12.5 20 8.5 8.5 0 0 1 12.5 3a0.75 0.75 0 0 1 .73.97A7 7 0 1 0 20 14.77a0.75 0.75 0 0 1 .96.73"
    />
  </svg>
);

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="theme-toggle" aria-live="polite">
      <button type="button" onClick={toggleTheme} aria-label={`Switch to ${isDark ? "light" : "dark"} mode`} title="Przelacz motyw">
        <span className="toggle-track">
          <span className={`toggle-thumb ${isDark ? "is-dark" : ""}`}>
            {isDark ? <MoonIcon className="toggle-icon" /> : <SunIcon className="toggle-icon" />}
          </span>
        </span>
        <span className="toggle-label">{isDark ? "Dark" : "Light"} mode</span>
      </button>
    </div>
  );
}
