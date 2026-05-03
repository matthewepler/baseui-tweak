"use client";

import React, { useState } from "react";
import { ActionBar } from "./ActionBar";
import { ControlPanel } from "./ControlPanel";
import { PreviewPanel } from "./PreviewPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ColorMode } from "@/store/themeStore";
import { Sliders, Eye } from "lucide-react";

export function ThemeEditor() {
  const [mode, setMode] = useState<ColorMode>("light");

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <ActionBar mode={mode} onModeChange={setMode} />

      {/* Desktop: side-by-side */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Control panel */}
        <div className="w-80 shrink-0 border-r border-[var(--border)] flex flex-col overflow-hidden">
          <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--muted)]">
            <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
              Tokens
            </p>
          </div>
          <div className="flex-1 overflow-hidden">
            <ControlPanel mode={mode} />
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--muted)] flex items-center justify-between">
            <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
              Preview
            </p>
            <div
              className="text-xs text-[var(--muted-foreground)] px-2 py-0.5 rounded-full border border-[var(--border)]"
            >
              {mode === "dark" ? "Dark mode" : "Light mode"}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <PreviewPanel mode={mode} />
          </div>
        </div>
      </div>

      {/* Mobile: tabbed */}
      <div className="flex md:hidden flex-1 overflow-hidden flex-col">
        <Tabs defaultValue="tokens" className="flex flex-col flex-1 overflow-hidden">
          <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--muted)]">
            <TabsList className="w-full">
              <TabsTrigger value="tokens" className="flex-1 gap-1.5">
                <Sliders className="h-3.5 w-3.5" />
                Tokens
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex-1 gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                Preview
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="tokens" className="flex-1 overflow-hidden mt-0">
            <ControlPanel mode={mode} />
          </TabsContent>
          <TabsContent value="preview" className="flex-1 overflow-hidden mt-0">
            <PreviewPanel mode={mode} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
