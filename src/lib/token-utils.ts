import type {
  DesignToken,
  DesignTokenValue,
  ResolvedToken,
  TokenGroup,
  TokenMap,
  TokenType,
} from "@/types/tokens";

/** Returns true if the value string is a token reference like {color.primitive.neutral.0} */
export function isReference(value: unknown): value is string {
  return typeof value === "string" && /^\{.+\}$/.test(value);
}

/** Strip curly braces from a reference: {a.b.c} → a.b.c */
export function getReferencePath(ref: string): string {
  return ref.slice(1, -1);
}

/** Navigate a token tree by dot-separated path */
export function getByPath(
  tree: TokenGroup,
  path: string
): DesignToken | TokenGroup | undefined {
  const parts = path.split(".");
  let current: TokenGroup | DesignToken = tree;
  for (const part of parts) {
    if (typeof current !== "object" || current === null) return undefined;
    current = (current as Record<string, unknown>)[part] as
      | TokenGroup
      | DesignToken;
  }
  return current as DesignToken | TokenGroup | undefined;
}

/** Check if a node is a leaf token (has $value) */
function isToken(node: unknown): node is DesignToken {
  return (
    typeof node === "object" &&
    node !== null &&
    "$value" in node
  );
}

/**
 * Flatten a token tree into a path → token map.
 * Skips keys starting with $ (metadata).
 */
export function flattenTokens(
  tree: TokenGroup,
  prefix = "",
  inheritedType?: TokenType
): TokenMap {
  const result: TokenMap = {};

  for (const [key, value] of Object.entries(tree)) {
    if (key.startsWith("$")) continue;

    const path = prefix ? `${prefix}.${key}` : key;
    const node = value as DesignToken | TokenGroup;

    const type =
      (node as DesignToken).$type ??
      inheritedType ??
      (tree.$type as TokenType | undefined);

    if (isToken(node)) {
      result[path] = {
        path,
        type: type ?? "color",
        value: node.$value,
        rawValue: node.$value,
        description: node.$description,
      };
    } else if (typeof node === "object" && node !== null) {
      Object.assign(result, flattenTokens(node as TokenGroup, path, type));
    }
  }

  return result;
}

/**
 * Resolve all token references in a flat token map.
 * References like {color.primitive.neutral.0} are replaced with their resolved values.
 */
export function resolveReferences(tokens: TokenMap): TokenMap {
  const resolved: TokenMap = {};

  const resolveValue = (
    value: DesignTokenValue,
    depth = 0
  ): DesignTokenValue => {
    if (depth > 10) return value; // prevent circular ref loops
    if (isReference(value)) {
      const refPath = getReferencePath(value);
      const ref = tokens[refPath];
      if (ref) return resolveValue(ref.value, depth + 1);
    }
    return value;
  };

  for (const [path, token] of Object.entries(tokens)) {
    resolved[path] = {
      ...token,
      value: resolveValue(token.rawValue),
    };
  }

  return resolved;
}

/** Convert a resolved token map to CSS custom properties */
export function tokensToCssVars(
  tokens: TokenMap,
  selector = ":root"
): string {
  const vars: string[] = [];
  for (const [path, token] of Object.entries(tokens)) {
    const varName = `--${path.replace(/\./g, "-")}`;
    const value = formatCssValue(token.value, token.type);
    if (value !== null) {
      vars.push(`  ${varName}: ${value};`);
    }
  }
  return `${selector} {\n${vars.join("\n")}\n}`;
}

/** Format a token value as a CSS value string */
export function formatCssValue(
  value: DesignTokenValue,
  type: TokenType
): string | null {
  if (type === "fontFamily" && Array.isArray(value)) {
    return (value as string[]).map((f) => (f.includes(" ") ? `"${f}"` : f)).join(", ");
  }
  if (type === "cubicBezier" && Array.isArray(value)) {
    const [x1, y1, x2, y2] = value as number[];
    return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
  }
  if (type === "shadow" && typeof value === "object" && !Array.isArray(value)) {
    const s = value as { color: string; offsetX: string; offsetY: string; blur: string; spread: string; inset?: boolean };
    const inset = s.inset ? "inset " : "";
    return `${inset}${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread} ${s.color}`;
  }
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  return null;
}

/** Convert hex color to HSL string used by CSS variables */
export function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!result) return "0 0% 0%";

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/** Convert HSL string to hex */
export function hslToHex(hsl: string): string {
  const parts = hsl.trim().split(/\s+/);
  if (parts.length < 3) return "#000000";

  const h = parseFloat(parts[0]) / 360;
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Check if a string is a valid hex color */
export function isValidHex(hex: string): boolean {
  return /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex.trim());
}

/** Normalize a hex color to full 6-digit form with # */
export function normalizeHex(hex: string): string {
  const h = hex.trim().replace(/^#/, "");
  if (h.length === 3) {
    return "#" + h.split("").map((c) => c + c).join("");
  }
  return "#" + h.padEnd(6, "0");
}

/**
 * Convert SemanticColorTokens (hex values) to CSS custom properties string.
 * Uses oklch() where supported, falls back to the hex value.
 */
export function semanticTokensToCssVars(
  tokens: Record<string, string>,
  selector: string
): string {
  const vars = Object.entries(tokens)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");
  return `${selector} {\n${vars}\n}`;
}
