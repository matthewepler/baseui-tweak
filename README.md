# BaseUI Tweak

Create and export custom themes for BaseUI. Design tokens conform to the [W3C Design Token Community Group](https://tr.designtokens.org/format/) format.

## Features

- **W3C-compliant design tokens** — full token tree in `src/tokens/base.tokens.json` covering colors (primitive + semantic), typography, spacing, border radius, shadows, and transitions
- **Live theme editor** — split-panel interface inspired by tweakcn with real-time preview
- **6 built-in preset themes** — Default, Ocean, Forest, Rose, Midnight, Amber
- **Light & dark mode** — edit tokens independently for each mode
- **Export** in three formats: CSS custom properties, W3C Tokens JSON, Tailwind config
- **Persistent state** — your edits survive page refreshes via `localStorage`

## Tech stack

- Next.js 16 + TypeScript
- Tailwind CSS v4
- Radix UI primitives
- Zustand (state management)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Token structure

```
src/tokens/base.tokens.json
├── color
│   ├── primitive   (neutral, blue, violet, emerald, rose, amber)
│   └── semantic
│       ├── light   (background, foreground, primary, card, …)
│       └── dark
├── typography
│   ├── fontFamily  (sans, serif, mono)
│   ├── fontSize    (xs → 5xl)
│   ├── fontWeight
│   ├── lineHeight
│   └── letterSpacing
├── spacing         (0 → 24 on a 4px scale)
├── borderRadius    (none → full)
├── shadow          (none → 2xl, inner)
└── transition
    ├── duration    (fast → slowest)
    └── easing      (linear, ease, spring, …)
```

Each token follows the DTCG format:

```json
{
  "color": {
    "primitive": {
      "blue": {
        "$type": "color",
        "500": { "$value": "#3b82f6" }
      }
    },
    "semantic": {
      "light": {
        "primary": {
          "$type": "color",
          "$value": "{color.primitive.neutral.900}",
          "$description": "Primary action color"
        }
      }
    }
  }
}
```
