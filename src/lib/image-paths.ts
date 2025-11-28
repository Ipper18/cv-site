const PUBLIC_IMAGES_PREFIX = "/images/";

export const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"]);

export function normalizeImagePath(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const withoutLeading = trimmed.replace(/^\.?\//, "");
  const withoutPrefix = withoutLeading.startsWith("images/") ? withoutLeading.slice("images/".length) : withoutLeading;
  return `${PUBLIC_IMAGES_PREFIX}${withoutPrefix}`;
}

export function isPublicImagePath(value: string) {
  const normalized = normalizeImagePath(value);
  return normalized.startsWith(PUBLIC_IMAGES_PREFIX) && !/^https?:\/\//i.test(normalized);
}

export function getImageFileName(path: string) {
  const segments = path.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? path;
}

export function pickImageOption(current: string | undefined, available: string[]) {
  const normalized = current ? normalizeImagePath(current) : "";
  const inList = normalized ? available.includes(normalized) : false;
  if (inList) {
    return { value: normalized, missing: false };
  }
  return { value: available[0] ?? "", missing: Boolean(normalized) };
}
