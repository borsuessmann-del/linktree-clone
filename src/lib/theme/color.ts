// Farb-Helfer für die Per-User-Accent-Color (guidelines.md 002).
// Bewusst ohne Imports, damit `node --test` die Datei direkt laden kann.

export const DEFAULT_ACCENT = "#4f46e5";

/** Gleiche Regex wie CHECK `profiles_accent_color_format`. */
export const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

export const ACCENT_PRESETS = [
  { name: "Indigo", value: "#4f46e5" },
  { name: "Blau", value: "#2563eb" },
  { name: "Cyan", value: "#0891b2" },
  { name: "Smaragd", value: "#059669" },
  { name: "Limette", value: "#65a30d" },
  { name: "Amber", value: "#d97706" },
  { name: "Orange", value: "#ea580c" },
  { name: "Rose", value: "#e11d48" },
  { name: "Pink", value: "#db2777" },
  { name: "Violett", value: "#7c3aed" },
] as const;

/** Seitenhintergründe aus globals.css (Light/Dark) für den Kontrast-Hinweis. */
export const PAGE_BACKGROUNDS = { light: "#f4f4f5", dark: "#09090b" } as const;

const LIGHT_FOREGROUND = "#ffffff";
const DARK_FOREGROUND = "#0a0a0a";

export function isHexColor(value: unknown): value is string {
  return typeof value === "string" && HEX_COLOR_PATTERN.test(value);
}

/** Erwartet einen gültigen Hex-Wert und vereinheitlicht ihn auf Kleinbuchstaben. */
export function normalizeHex(hex: string) {
  return hex.toLowerCase();
}

/** Ungültige Werte (z. B. aus einer manipulierten DB-Zeile) → Default-Farbe. */
export function safeAccent(value: unknown) {
  return isHexColor(value) ? normalizeHex(value) : DEFAULT_ACCENT;
}

/** Relative Luminanz nach WCAG 2.x. */
export function relativeLuminance(hex: string) {
  const channels = [1, 3, 5].map((start) => {
    const value = parseInt(hex.slice(start, start + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/** Kontrastverhältnis (1–21) nach WCAG. */
export function contrastRatio(a: string, b: string) {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Textfarbe auf der Akzentfarbe: Weiß bei Kontrast ≥ 4.5, sonst fast Schwarz. */
export function getContrastForeground(hex: string) {
  return contrastRatio(safeAccent(hex), LIGHT_FOREGROUND) >= 4.5
    ? LIGHT_FOREGROUND
    : DARK_FOREGROUND;
}
