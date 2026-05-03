import type {
  FlatStyleConfig,
  GlassStyleConfig,
  NeumorphicStyleConfig,
  UIStyleMode,
} from "@/types/styles";
import type { UIStyleState } from "@/types/styles";

// ─── hex helpers ────────────────────────────────────────────────────────────

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.trim().replace(/^#/, "");
  const full = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean.padEnd(6, "0");
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function lighten(hex: string, factor: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.min(255, Math.round(r + (255 - r) * factor))},${Math.min(255, Math.round(g + (255 - g) * factor))},${Math.min(255, Math.round(b + (255 - b) * factor))})`;
}

function darken(hex: string, factor: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.round(r * (1 - factor))},${Math.round(g * (1 - factor))},${Math.round(b * (1 - factor))})`;
}

// ─── Selectors ──────────────────────────────────────────────────────────────
// All CSS is scoped to [data-ui-style="X"] so it only applies inside the
// preview container. We target three semantic data attributes that are added
// directly to the Radix-backed UI primitives:
//   data-ui-button  → Button
//   data-ui-surface → Card
//   data-ui-input   → Input

const BTN = `[data-ui-style="%s"] [data-ui-button]`;
const SURF = `[data-ui-style="%s"] [data-ui-surface]`;
const INP = `[data-ui-style="%s"] [data-ui-input]`;

function s(tpl: string, mode: string) {
  return tpl.replace(/%s/g, mode);
}

// ─── Flat ────────────────────────────────────────────────────────────────────

export function generateFlatCSS(cfg: FlatStyleConfig): string {
  const bw = `${cfg.borderWidth}px`;
  const bo = (cfg.borderOpacity / 100).toFixed(2);
  const radiusOverride = cfg.removeRadius ? "border-radius: 0 !important;" : "";

  return `
/* ── Flat style ── */
${s(BTN, "flat")},
${s(SURF, "flat")},
${s(INP, "flat")} {
  box-shadow: none !important;
  ${radiusOverride}
}
${s(BTN, "flat")} {
  border-width: ${bw} !important;
  border-style: solid !important;
  border-color: color-mix(in srgb, var(--border) ${cfg.borderOpacity}%, transparent) !important;
}
${s(SURF, "flat")} {
  border-width: ${bw} !important;
  border-style: solid !important;
  border-color: color-mix(in srgb, var(--border) ${cfg.borderOpacity}%, transparent) !important;
}
${s(INP, "flat")} {
  border-width: ${bw} !important;
  border-style: solid !important;
  border-color: color-mix(in srgb, var(--border) ${cfg.borderOpacity}%, transparent) !important;
}
`.trim();
}

// ─── Neumorphic ──────────────────────────────────────────────────────────────

export function generateNeumorphicCSS(
  cfg: NeumorphicStyleConfig,
  bgHex: string
): string {
  const f = cfg.intensity / 100;
  const d = cfg.distance;
  const blur = cfg.blur;
  const sp = cfg.spread;

  const lightColor = lighten(bgHex, f * 1.6);
  const darkColor = darken(bgHex, f * 0.9);

  const raised = [
    `${d}px ${d}px ${blur}px ${sp}px ${darkColor}`,
    `-${d}px -${d}px ${blur}px ${sp}px ${lightColor}`,
  ].join(", ");

  const pressed = [
    `inset ${d}px ${d}px ${blur}px ${sp}px ${darkColor}`,
    `inset -${d}px -${d}px ${blur}px ${sp}px ${lightColor}`,
  ].join(", ");

  const primary = cfg.mode === "pressed" ? pressed : raised;
  const interactive = cfg.mode === "raised" ? pressed : raised;

  return `
/* ── Neumorphic style ── */
${s(BTN, "neumorphic")},
${s(SURF, "neumorphic")},
${s(INP, "neumorphic")} {
  background-color: var(--background) !important;
  border: none !important;
  box-shadow: ${primary} !important;
}
${s(BTN, "neumorphic")} {
  color: var(--foreground) !important;
}
${s(BTN, "neumorphic")}:active {
  box-shadow: ${interactive} !important;
  transform: scale(0.98);
}
${s(INP, "neumorphic")}:focus-visible {
  box-shadow: ${pressed}, 0 0 0 2px var(--ring) !important;
}
`.trim();
}

// ─── Glassmorphism ───────────────────────────────────────────────────────────

export function generateGlassCSS(
  cfg: GlassStyleConfig,
  bgHex: string
): string {
  const { r, g, b } = hexToRgb(bgHex);
  const surfOpacity = (cfg.opacity / 100).toFixed(2);
  const btnOpacity = Math.min(0.8, cfg.opacity / 100 + 0.15).toFixed(2);
  const borderOpacity = (cfg.borderOpacity / 100).toFixed(2);
  const sat = cfg.saturation;

  return `
/* ── Glass style ── */
[data-ui-style="glass"] {
  --glass-bg: rgba(${r}, ${g}, ${b}, ${surfOpacity});
  --glass-btn-bg: rgba(${r}, ${g}, ${b}, ${btnOpacity});
  --glass-border: rgba(255, 255, 255, ${borderOpacity});
}
${s(SURF, "glass")} {
  background-color: var(--glass-bg) !important;
  backdrop-filter: blur(${cfg.blur}px) saturate(${sat}%) !important;
  -webkit-backdrop-filter: blur(${cfg.blur}px) saturate(${sat}%) !important;
  border: 1px solid var(--glass-border) !important;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.15) !important;
}
${s(BTN, "glass")} {
  background-color: var(--glass-btn-bg) !important;
  backdrop-filter: blur(${Math.round(cfg.blur * 0.6)}px) !important;
  -webkit-backdrop-filter: blur(${Math.round(cfg.blur * 0.6)}px) !important;
  border: 1px solid var(--glass-border) !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.12) !important;
  color: var(--foreground) !important;
}
${s(INP, "glass")} {
  background-color: rgba(${r}, ${g}, ${b}, ${(cfg.opacity / 100 * 0.6).toFixed(2)}) !important;
  backdrop-filter: blur(${cfg.blur}px) !important;
  -webkit-backdrop-filter: blur(${cfg.blur}px) !important;
  border: 1px solid var(--glass-border) !important;
}
/* Gradient backdrop to showcase glass surfaces */
[data-ui-style="glass"] .glass-bg-layer {
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--chart-1) 60%, transparent),
    color-mix(in srgb, var(--chart-2) 40%, transparent),
    color-mix(in srgb, var(--chart-3) 30%, transparent)
  ) !important;
}
`.trim();
}

// ─── Main entry point ────────────────────────────────────────────────────────

export function generateStyleCSS(
  styleState: UIStyleState,
  bgHex: string
): string {
  switch (styleState.mode) {
    case "flat":
      return generateFlatCSS(styleState.flat);
    case "neumorphic":
      return generateNeumorphicCSS(styleState.neumorphic, bgHex);
    case "glass":
      return generateGlassCSS(styleState.glass, bgHex);
    default:
      return "/* default — no style overrides */";
  }
}
