"use client";

import React from "react";
import { useCanvasStore } from "@/store/canvasStore";
import { CanvasPreview } from "./CanvasPreview";
import { PromptBar } from "./PromptBar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ColorMode } from "@/store/themeStore";

interface CanvasViewProps {
  colorMode: ColorMode;
}

export function CanvasView({ colorMode }: CanvasViewProps) {
  const { entries, activeId, isGenerating, setActiveId, removeEntry } =
    useCanvasStore();

  const activeEntry = entries.find((e) => e.id === activeId) ?? null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* History sidebar */}
        {entries.length > 0 && (
          <div className="w-56 shrink-0 border-r border-[var(--border)] flex flex-col overflow-hidden">
            <div className="px-3 py-2 border-b border-[var(--border)] bg-[var(--muted)]">
              <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                History
              </p>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className={cn(
                      "group flex items-start gap-1 p-2 rounded-[var(--radius)] cursor-pointer transition-colors",
                      entry.id === activeId
                        ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                        : "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
                    )}
                    onClick={() => setActiveId(entry.id)}
                  >
                    <p className="flex-1 text-xs leading-snug line-clamp-3 min-w-0">
                      {entry.prompt}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeEntry(entry.id);
                      }}
                      className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Preview area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Active prompt label */}
          {activeEntry && (
            <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--muted)] shrink-0">
              <p className="text-xs text-[var(--muted-foreground)] truncate max-w-xl">
                {activeEntry.prompt}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={() => removeEntry(activeEntry.id)}
                title="Remove"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}

          <CanvasPreview
            html={activeEntry?.html ?? ""}
            colorMode={colorMode}
            isStreaming={isGenerating && activeEntry?.id === activeId}
          />
        </div>
      </div>

      {/* Prompt input */}
      <PromptBar colorMode={colorMode} />
    </div>
  );
}
