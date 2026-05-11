"use client";

import React, { useState, useRef } from "react";
import { useThemeStore } from "@/store/themeStore";
import { useStyleStore } from "@/store/styleStore";
import { useCanvasStore } from "@/store/canvasStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Square } from "lucide-react";
import type { ColorMode } from "@/store/themeStore";

interface PromptBarProps {
  colorMode: ColorMode;
}

export function PromptBar({ colorMode }: PromptBarProps) {
  const [prompt, setPrompt] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const { tokens } = useThemeStore();
  const { mode: styleMode } = useStyleStore();
  const { addEntry, updateEntryHtml, setGenerating, isGenerating } =
    useCanvasStore();

  const currentTokens = tokens[colorMode];

  const generate = async () => {
    const text = prompt.trim();
    if (!text || isGenerating) return;

    const id = addEntry(text);
    setGenerating(true);
    setPrompt("");

    const abort = new AbortController();
    abortRef.current = abort;

    try {
      const res = await fetch("/api/generate-ui", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abort.signal,
        body: JSON.stringify({
          prompt: text,
          tokens: currentTokens,
          styleMode,
          borderRadius: tokens.borderRadius,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Server error: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        updateEntryHtml(id, accumulated);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        updateEntryHtml(
          id,
          `<html><body style="font-family:sans-serif;padding:2rem;color:#c00"><strong>Error:</strong> ${String(err)}</body></html>`
        );
      }
    } finally {
      setGenerating(false);
      abortRef.current = null;
    }
  };

  const cancel = () => {
    abortRef.current?.abort();
    setGenerating(false);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generate();
    }
  };

  return (
    <div className="flex items-end gap-2 p-3 border-t border-[var(--border)] bg-[var(--background)]">
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Describe a UI to generate… (e.g. 'A pricing page with three tiers')"
        className="flex-1 min-h-[2.5rem] max-h-40 resize-none text-sm"
        disabled={isGenerating}
        rows={1}
      />
      {isGenerating ? (
        <Button
          size="sm"
          variant="outline"
          className="shrink-0 gap-1.5"
          onClick={cancel}
        >
          <Square className="h-3.5 w-3.5" />
          Stop
        </Button>
      ) : (
        <Button
          size="sm"
          className="shrink-0 gap-1.5"
          onClick={generate}
          disabled={!prompt.trim()}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Generate
        </Button>
      )}
    </div>
  );
}
