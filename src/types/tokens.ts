/**
 * W3C Design Token Community Group (DTCG) type definitions.
 * Spec: https://tr.designtokens.org/format/
 */

export type TokenType =
  | "color"
  | "dimension"
  | "fontFamily"
  | "fontWeight"
  | "duration"
  | "cubicBezier"
  | "number"
  | "strokeStyle"
  | "border"
  | "transition"
  | "shadow"
  | "gradient"
  | "typography"
  | "fontStyle"
  | "textDecoration";

export interface ShadowValue {
  color: string;
  offsetX: string;
  offsetY: string;
  blur: string;
  spread: string;
  inset?: boolean;
}

export interface BorderValue {
  color: string;
  width: string;
  style: string;
}

export interface TransitionValue {
  duration: string;
  timingFunction: string;
  delay?: string;
}

export interface GradientStop {
  color: string;
  position: number;
}

export interface TypographyValue {
  fontFamily: string | string[];
  fontSize: string;
  fontWeight: number | string;
  lineHeight: number | string;
  letterSpacing?: string;
  fontStyle?: string;
  textDecoration?: string;
}

export type DesignTokenValue =
  | string
  | number
  | number[]
  | string[]
  | ShadowValue
  | BorderValue
  | TransitionValue
  | GradientStop[]
  | TypographyValue;

/** A single design token */
export interface DesignToken {
  $value: DesignTokenValue;
  $type?: TokenType;
  $description?: string;
  $extensions?: Record<string, unknown>;
}

/** A group of tokens or nested groups */
export interface TokenGroup {
  $type?: TokenType;
  $description?: string;
  $extensions?: Record<string, unknown>;
  [key: string]: DesignToken | TokenGroup | TokenType | string | Record<string, unknown> | undefined;
}

export type TokenTree = TokenGroup;

/** Resolved token with its full path */
export interface ResolvedToken {
  path: string;
  type: TokenType;
  value: DesignTokenValue;
  rawValue: DesignTokenValue;
  description?: string;
}

/** Flat map of token path → resolved token */
export type TokenMap = Record<string, ResolvedToken>;

/** Theme semantic token values (CSS variable values) */
export interface SemanticColorTokens {
  background: string;
  foreground: string;
  card: string;
  "card-foreground": string;
  popover: string;
  "popover-foreground": string;
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  destructive: string;
  "destructive-foreground": string;
  border: string;
  input: string;
  ring: string;
  "chart-1": string;
  "chart-2": string;
  "chart-3": string;
  "chart-4": string;
  "chart-5": string;
  sidebar: string;
  "sidebar-foreground": string;
  "sidebar-primary": string;
  "sidebar-primary-foreground": string;
  "sidebar-accent": string;
  "sidebar-accent-foreground": string;
  "sidebar-border": string;
  "sidebar-ring": string;
}

export interface ThemeTokens {
  light: SemanticColorTokens;
  dark: SemanticColorTokens;
  borderRadius: string;
  fontFamily: {
    sans: string;
    serif: string;
    mono: string;
  };
}

export interface ThemePreset {
  id: string;
  name: string;
  description?: string;
  tokens: ThemeTokens;
}
