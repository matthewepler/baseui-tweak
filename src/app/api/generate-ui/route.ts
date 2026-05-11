import Anthropic from "@anthropic-ai/sdk";
import type { SemanticColorTokens } from "@/types/tokens";
import type { UIStyleMode } from "@/types/styles";

const client = new Anthropic();

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const {
    prompt,
    tokens,
    styleMode,
    borderRadius,
  }: {
    prompt: string;
    tokens: SemanticColorTokens;
    styleMode: UIStyleMode;
    borderRadius: string;
  } = await request.json();

  const cssVarBlock = Object.entries(tokens)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join("\n");

  const systemPrompt = `You are a UI code generator. Generate a single self-contained HTML document that renders a beautiful user interface.

RULES:
- Output ONLY the complete HTML document, no markdown fences, no commentary.
- Use the CSS custom properties already defined in the document's :root for all colors/radius/fonts — never hardcode color values.
- The document will have these CSS variables available in :root:
${cssVarBlock}
  --radius: ${borderRadius};
- Use Tailwind CDN classes where helpful, but you may also write <style> blocks.
- The current UI style mode is "${styleMode}" — reflect that aesthetic: ${
    styleMode === "flat"
      ? "clean flat borders, no shadows, solid colors"
      : styleMode === "neumorphic"
      ? "soft extruded shadows giving 3D depth"
      : styleMode === "glass"
      ? "frosted glass surfaces with backdrop blur and translucency"
      : "standard drop shadows and subtle depth"
  }.
- Make the UI look polished and production-ready.
- The design should feel cohesive with the provided color palette.
- Include realistic placeholder content.
- Do NOT use external images. Use SVGs or emoji as placeholders.
- Wrap everything inside <body> in a container that looks good at 900px wide.

Respond with the complete HTML only.`;

  const stream = await client.messages.stream({
    model: "claude-opus-4-7",
    max_tokens: 8000,
    thinking: { type: "adaptive" },
    system: systemPrompt,
    messages: [{ role: "user", content: prompt }],
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
