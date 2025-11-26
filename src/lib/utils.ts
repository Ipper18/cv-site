export function formatDateLabel(value?: string) {
  if (!value) return "Present";
  const date = new Date(value);
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(date);
}

export function formatDateRange(start: string, end?: string) {
  const startLabel = formatDateLabel(start);
  const endLabel = end ? formatDateLabel(end) : "Present";
  return `${startLabel} — ${endLabel}`;
}

export function toInputMonthValue(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function parseMonthValue(value: string) {
  const [year, month] = value.split("-").map(Number);
  if (!year || !month) return null;
  return new Date(Date.UTC(year, month - 1, 1));
}

export function parseLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parseCommaSeparated(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
