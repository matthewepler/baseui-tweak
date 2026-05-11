/** UI style mode — controls the visual language applied to the component preview */
export type UIStyleMode = "default" | "flat" | "neumorphic" | "glass";

/** Flat: no depth, crisp borders, no shadows */
export interface FlatStyleConfig {
  /** Border width in px (1–4) */
  borderWidth: number;
  /** Border opacity 0–100 */
  borderOpacity: number;
  /** Remove border radius entirely */
  removeRadius: boolean;
}

/** Neumorphic: soft extruded 3-D look using dual directional shadows */
export interface NeumorphicStyleConfig {
  /** Shadow offset in px (2–24) */
  distance: number;
  /** Shadow blur radius in px (6–48) */
  blur: number;
  /** Shadow spread in px (-4–4) */
  spread: number;
  /** Shadow strength as percentage (5–40) */
  intensity: number;
  /** Raised (extruded) or Pressed (inset) */
  mode: "raised" | "pressed";
}

/** Glassmorphism: frosted-glass surfaces with backdrop blur */
export interface GlassStyleConfig {
  /** backdrop-filter blur in px (4–40) */
  blur: number;
  /** Surface background opacity 5–60 */
  opacity: number;
  /** Border opacity 5–50 */
  borderOpacity: number;
  /** backdrop-filter saturate 100–200 */
  saturation: number;
}

export interface UIStyleState {
  mode: UIStyleMode;
  flat: FlatStyleConfig;
  neumorphic: NeumorphicStyleConfig;
  glass: GlassStyleConfig;
}

export const DEFAULT_STYLE_STATE: UIStyleState = {
  mode: "default",
  flat: {
    borderWidth: 1,
    borderOpacity: 100,
    removeRadius: false,
  },
  neumorphic: {
    distance: 8,
    blur: 16,
    spread: 0,
    intensity: 18,
    mode: "raised",
  },
  glass: {
    blur: 12,
    opacity: 15,
    borderOpacity: 20,
    saturation: 160,
  },
};

export const STYLE_META: Record<UIStyleMode, { label: string; description: string }> = {
  default: {
    label: "Default",
    description: "Standard token-based styling",
  },
  flat: {
    label: "Flat",
    description: "No depth — crisp borders, no shadows",
  },
  neumorphic: {
    label: "Neumorphic",
    description: "Soft extruded 3-D via dual directional shadows",
  },
  glass: {
    label: "Glass",
    description: "Frosted-glass surfaces with backdrop blur",
  },
};
