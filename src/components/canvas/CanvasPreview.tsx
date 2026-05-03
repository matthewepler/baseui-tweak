"use client";

import React, { useEffect, useRef } from "react";
import { useThemeStore } from "@/store/themeStore";
import { useStyleStore } from "@/store/styleStore";
import { generateStyleCSS } from "@/lib/style-generators";
import type { ColorMode } from "@/store/themeStore";

interface CanvasPreviewProps {
  html: string;
  colorMode: ColorMode;
  isStreaming?: boolean;
}

export function CanvasPreview({ html, colorMode, isStreaming }: CanvasPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { tokens } = useThemeStore();
  const styleState = useStyleStore();
  const currentTokens = tokens[colorMode];

  const cssVars = Object.entries(currentTokens)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join("\n");

  const injectCSS = `
:root {
${cssVars}
  --radius: ${tokens.borderRadius};
  --font-sans: ${tokens.fontFamily.sans};
  --font-serif: ${tokens.fontFamily.serif};
  --font-mono: ${tokens.fontFamily.mono};
}
${generateStyleCSS(styleState, currentTokens.background)}
  `.trim();

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !html) return;

    // Inject or update style override
    const doc = iframe.contentDocument;
    if (!doc) return;

    let tag = doc.getElementById("theme-override") as HTMLStyleElement | null;
    if (!tag) {
      tag = doc.createElement("style");
      tag.id = "theme-override";
      doc.head?.appendChild(tag);
    }
    tag.textContent = injectCSS;
  }, [injectCSS, html]);

  // Build full document when html changes
  const fullDoc = html
    ? (() => {
        const hasDoctype = /^<!doctype/i.test(html.trimStart());
        const hasStyleTag = html.includes("</head>");

        if (hasDoctype && hasStyleTag) {
          // Inject our override after </head>
          return html.replace(
            "</head>",
            `<style id="theme-override">${injectCSS}</style></head>`
          );
        }

        // Wrap bare HTML
        return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="https://cdn.tailwindcss.com"></script>
<style id="theme-override">${injectCSS}</style>
</head>
<body>
${html}
</body>
</html>`;
      })()
    : "";

  return (
    <div className="relative flex-1 overflow-hidden">
      {!html && !isStreaming && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[var(--muted-foreground)]">
          <div className="text-4xl">✦</div>
          <p className="text-sm">Describe a UI in the prompt bar to generate it here</p>
        </div>
      )}
      {isStreaming && !html && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-2 w-2 rounded-full bg-[var(--primary)] animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}
      {fullDoc && (
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          srcDoc={fullDoc}
          title="Canvas preview"
        />
      )}
    </div>
  );
}
