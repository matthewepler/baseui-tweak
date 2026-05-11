"use client";

import React from "react";
import { useThemeStore, type ColorMode } from "@/store/themeStore";
import type { SemanticColorTokens } from "@/types/tokens";
import { ColorPicker } from "./ColorPicker";
import { TokenGroup } from "./TokenGroup";
import { StylePanel } from "./StylePanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const COLOR_TOKEN_GROUPS: {
  title: string;
  description?: string;
  keys: (keyof SemanticColorTokens)[];
}[] = [
  {
    title: "Base",
    description: "Page background and primary text",
    keys: ["background", "foreground"],
  },
  {
    title: "Primary",
    description: "Main action color",
    keys: ["primary", "primary-foreground"],
  },
  {
    title: "Secondary",
    description: "Subdued actions and surfaces",
    keys: ["secondary", "secondary-foreground"],
  },
  {
    title: "Muted",
    description: "Low-emphasis content",
    keys: ["muted", "muted-foreground"],
  },
  {
    title: "Accent",
    description: "Highlighted or hovered surfaces",
    keys: ["accent", "accent-foreground"],
  },
  {
    title: "Card",
    keys: ["card", "card-foreground"],
  },
  {
    title: "Popover",
    keys: ["popover", "popover-foreground"],
  },
  {
    title: "Destructive",
    description: "Error or destructive actions",
    keys: ["destructive", "destructive-foreground"],
  },
  {
    title: "Border & Input",
    keys: ["border", "input", "ring"],
  },
  {
    title: "Charts",
    description: "Data visualization series",
    keys: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  },
  {
    title: "Sidebar",
    keys: [
      "sidebar",
      "sidebar-foreground",
      "sidebar-primary",
      "sidebar-primary-foreground",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "sidebar-ring",
    ],
  },
];

const BORDER_RADIUS_PRESETS = [
  { label: "None", value: "0rem" },
  { label: "SM", value: "0.25rem" },
  { label: "MD", value: "0.375rem" },
  { label: "LG", value: "0.5rem" },
  { label: "XL", value: "0.75rem" },
  { label: "2XL", value: "1rem" },
  { label: "Full", value: "9999px" },
];

interface ControlPanelProps {
  mode: ColorMode;
}

export function ControlPanel({ mode }: ControlPanelProps) {
  const { tokens, updateToken, updateBorderRadius, updateFontFamily } =
    useThemeStore();

  const currentTokens = tokens[mode];

  const handleColorChange = (key: keyof SemanticColorTokens, value: string) => {
    updateToken(key, value, mode);
  };

  const radiusValue = parseFloat(tokens.borderRadius) || 0.5;
  const radiusMax = tokens.borderRadius === "9999px" ? 10 : 2;

  return (
    <ScrollArea className="h-full">
      <div className="divide-y divide-[var(--border)]">
        {/* UI Style */}
        <TokenGroup title="UI Style" description="Visual language overlay for the preview" defaultOpen>
          <StylePanel />
        </TokenGroup>

        {/* Border Radius */}
        <TokenGroup title="Border Radius" description="Controls the roundness of components" defaultOpen>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Radius</Label>
              <span className="text-xs text-[var(--muted-foreground)] font-mono">
                {tokens.borderRadius}
              </span>
            </div>
            <Slider
              min={0}
              max={2}
              step={0.125}
              value={[Math.min(radiusValue, radiusMax)]}
              onValueChange={([v]) => updateBorderRadius(`${v}rem`)}
            />
            <div className="flex flex-wrap gap-1.5">
              {BORDER_RADIUS_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => updateBorderRadius(p.value)}
                  className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                    tokens.borderRadius === p.value
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                      : "border-[var(--border)] hover:bg-[var(--accent)] text-[var(--foreground)]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </TokenGroup>

        {/* Font Families */}
        <TokenGroup title="Font Families" description="Typefaces used across the UI" defaultOpen={false}>
          <div className="space-y-3">
            {(["sans", "serif", "mono"] as const).map((variant) => (
              <div key={variant} className="space-y-1">
                <Label className="text-xs capitalize">{variant}</Label>
                <Input
                  value={tokens.fontFamily[variant]}
                  onChange={(e) => updateFontFamily(variant, e.target.value)}
                  className="text-xs h-7"
                  placeholder={`e.g. Inter, sans-serif`}
                />
              </div>
            ))}
          </div>
        </TokenGroup>

        {/* Color token groups */}
        {COLOR_TOKEN_GROUPS.map((group) => (
          <TokenGroup
            key={group.title}
            title={group.title}
            description={group.description}
            defaultOpen={["Base", "Primary", "Secondary"].includes(group.title)}
          >
            <div className="space-y-2">
              {group.keys.map((key) => (
                <ColorPicker
                  key={key}
                  label={key}
                  value={currentTokens[key] ?? "#000000"}
                  onChange={(v) => handleColorChange(key, v)}
                />
              ))}
            </div>
          </TokenGroup>
        ))}
      </div>
    </ScrollArea>
  );
}
