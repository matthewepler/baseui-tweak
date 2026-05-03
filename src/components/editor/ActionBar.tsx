"use client";

import React, { useState } from "react";
import { useThemeStore } from "@/store/themeStore";
import { PRESETS } from "@/lib/presets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ExportDialog } from "./ExportDialog";
import {
  Download,
  Moon,
  Paintbrush,
  RotateCcw,
  Sun,
} from "lucide-react";
import type { ColorMode } from "@/store/themeStore";

interface ActionBarProps {
  mode: ColorMode;
  onModeChange: (mode: ColorMode) => void;
}

export function ActionBar({ mode, onModeChange }: ActionBarProps) {
  const { themeName, presetId, setThemeName, applyPreset, resetToPreset } = useThemeStore();
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--background)] shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-1.5 mr-2">
          <Paintbrush className="h-4 w-4 text-[var(--primary)]" />
          <span className="text-sm font-semibold text-[var(--foreground)]">BaseUI Tweak</span>
        </div>

        <Separator orientation="vertical" className="h-5" />

        {/* Theme name */}
        <Input
          value={themeName}
          onChange={(e) => setThemeName(e.target.value)}
          className="h-8 w-40 text-sm"
          placeholder="Theme name…"
          aria-label="Theme name"
        />

        {/* Preset selector */}
        <Select value={presetId ?? "__custom__"} onValueChange={applyPreset}>
          <SelectTrigger className="h-8 w-40 text-sm">
            <SelectValue placeholder="Preset…" />
          </SelectTrigger>
          <SelectContent>
            {presetId === null && (
              <SelectItem value="__custom__" disabled>
                Custom
              </SelectItem>
            )}
            {PRESETS.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={resetToPreset}
          disabled={!presetId}
          title="Reset to preset"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>

        <div className="flex-1" />

        {/* Light / Dark toggle */}
        <div className="flex items-center rounded-[var(--radius)] border border-[var(--border)] overflow-hidden">
          <button
            type="button"
            onClick={() => onModeChange("light")}
            className={`flex items-center gap-1.5 px-3 h-8 text-xs transition-colors ${
              mode === "light"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "bg-[var(--background)] text-[var(--muted-foreground)] hover:bg-[var(--accent)]"
            }`}
          >
            <Sun className="h-3.5 w-3.5" />
            <span>Light</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange("dark")}
            className={`flex items-center gap-1.5 px-3 h-8 text-xs transition-colors ${
              mode === "dark"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "bg-[var(--background)] text-[var(--muted-foreground)] hover:bg-[var(--accent)]"
            }`}
          >
            <Moon className="h-3.5 w-3.5" />
            <span>Dark</span>
          </button>
        </div>

        {/* Export */}
        <Button size="sm" className="h-8 gap-1.5" onClick={() => setExportOpen(true)}>
          <Download className="h-3.5 w-3.5" />
          Export
        </Button>
      </div>

      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />
    </>
  );
}
