"use client";

import React from "react";
import { useStyleStore } from "@/store/styleStore";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { UIStyleMode } from "@/types/styles";
import { STYLE_META } from "@/types/styles";
import { Layers2, Square, Droplets, Sparkles } from "lucide-react";

const STYLE_ICONS: Record<UIStyleMode, React.ReactNode> = {
  default: <Sparkles className="h-3.5 w-3.5" />,
  flat: <Square className="h-3.5 w-3.5" />,
  neumorphic: <Layers2 className="h-3.5 w-3.5" />,
  glass: <Droplets className="h-3.5 w-3.5" />,
};

const MODES: UIStyleMode[] = ["default", "flat", "neumorphic", "glass"];

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs">{label}</Label>
        <span className="text-xs text-[var(--muted-foreground)] font-mono tabular-nums">
          {value}{unit ?? ""}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
      />
    </div>
  );
}

export function StylePanel() {
  const { mode, flat, neumorphic, glass, setMode, updateFlat, updateNeumorphic, updateGlass } =
    useStyleStore();

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="grid grid-cols-4 gap-1">
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            title={STYLE_META[m].description}
            className={cn(
              "flex flex-col items-center gap-1 px-1 py-2 rounded-[var(--radius)] text-xs transition-all border",
              mode === m
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-sm"
                : "bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
            )}
          >
            {STYLE_ICONS[m]}
            <span className="font-medium leading-none">{STYLE_META[m].label}</span>
          </button>
        ))}
      </div>

      {/* Per-style controls */}
      {mode === "flat" && (
        <div className="space-y-3 pt-1">
          <SliderRow
            label="Border Width"
            value={flat.borderWidth}
            min={1} max={4} step={1} unit="px"
            onChange={(v) => updateFlat({ borderWidth: v })}
          />
          <SliderRow
            label="Border Opacity"
            value={flat.borderOpacity}
            min={10} max={100} step={5} unit="%"
            onChange={(v) => updateFlat({ borderOpacity: v })}
          />
          <div className="flex items-center justify-between">
            <Label htmlFor="flat-radius" className="text-xs">Remove Radius</Label>
            <Switch
              id="flat-radius"
              checked={flat.removeRadius}
              onCheckedChange={(c) => updateFlat({ removeRadius: c })}
            />
          </div>
        </div>
      )}

      {mode === "neumorphic" && (
        <div className="space-y-3 pt-1">
          {/* Raised / Pressed toggle */}
          <div>
            <Label className="text-xs mb-1.5 block">Mode</Label>
            <div className="flex rounded-[var(--radius)] border border-[var(--border)] overflow-hidden">
              {(["raised", "pressed"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => updateNeumorphic({ mode: m })}
                  className={cn(
                    "flex-1 py-1 text-xs capitalize transition-colors",
                    neumorphic.mode === m
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "bg-[var(--background)] text-[var(--muted-foreground)] hover:bg-[var(--accent)]"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <SliderRow
            label="Distance"
            value={neumorphic.distance}
            min={2} max={24} step={1} unit="px"
            onChange={(v) => updateNeumorphic({ distance: v })}
          />
          <SliderRow
            label="Blur"
            value={neumorphic.blur}
            min={6} max={48} step={2} unit="px"
            onChange={(v) => updateNeumorphic({ blur: v })}
          />
          <SliderRow
            label="Intensity"
            value={neumorphic.intensity}
            min={5} max={40} step={1} unit="%"
            onChange={(v) => updateNeumorphic({ intensity: v })}
          />
          <SliderRow
            label="Spread"
            value={neumorphic.spread}
            min={-4} max={4} step={1} unit="px"
            onChange={(v) => updateNeumorphic({ spread: v })}
          />
        </div>
      )}

      {mode === "glass" && (
        <div className="space-y-3 pt-1">
          <SliderRow
            label="Surface Blur"
            value={glass.blur}
            min={4} max={40} step={2} unit="px"
            onChange={(v) => updateGlass({ blur: v })}
          />
          <SliderRow
            label="Opacity"
            value={glass.opacity}
            min={5} max={60} step={1} unit="%"
            onChange={(v) => updateGlass({ opacity: v })}
          />
          <SliderRow
            label="Border Opacity"
            value={glass.borderOpacity}
            min={5} max={50} step={1} unit="%"
            onChange={(v) => updateGlass({ borderOpacity: v })}
          />
          <SliderRow
            label="Saturation"
            value={glass.saturation}
            min={100} max={200} step={5} unit="%"
            onChange={(v) => updateGlass({ saturation: v })}
          />
        </div>
      )}

      {mode === "default" && (
        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
          Select a style to apply visual overrides on top of your tokens.
        </p>
      )}
    </div>
  );
}
