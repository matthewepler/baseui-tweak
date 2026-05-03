"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SemanticColorTokens, ThemeTokens } from "@/types/tokens";
import { DEFAULT_PRESET, PRESETS } from "@/lib/presets";

export type ColorMode = "light" | "dark";

interface ThemeState {
  themeName: string;
  presetId: string | null;
  tokens: ThemeTokens;
  mode: ColorMode;

  setThemeName: (name: string) => void;
  setMode: (mode: ColorMode) => void;
  applyPreset: (presetId: string) => void;
  updateToken: (tokenKey: keyof SemanticColorTokens, value: string, mode: ColorMode) => void;
  updateBorderRadius: (value: string) => void;
  updateFontFamily: (variant: "sans" | "serif" | "mono", value: string) => void;
  resetToPreset: () => void;
  getCurrentModeTokens: () => SemanticColorTokens;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeName: "My Theme",
      presetId: DEFAULT_PRESET.id,
      tokens: DEFAULT_PRESET.tokens,
      mode: "light",

      setThemeName: (name) => set({ themeName: name }),

      setMode: (mode) => set({ mode }),

      applyPreset: (presetId) => {
        const preset = PRESETS.find((p) => p.id === presetId);
        if (!preset) return;
        set({
          presetId: preset.id,
          tokens: JSON.parse(JSON.stringify(preset.tokens)),
          themeName: preset.name,
        });
      },

      updateToken: (tokenKey, value, mode) => {
        set((state) => ({
          presetId: null,
          tokens: {
            ...state.tokens,
            [mode]: {
              ...state.tokens[mode],
              [tokenKey]: value,
            },
          },
        }));
      },

      updateBorderRadius: (value) => {
        set((state) => ({
          presetId: null,
          tokens: {
            ...state.tokens,
            borderRadius: value,
          },
        }));
      },

      updateFontFamily: (variant, value) => {
        set((state) => ({
          presetId: null,
          tokens: {
            ...state.tokens,
            fontFamily: {
              ...state.tokens.fontFamily,
              [variant]: value,
            },
          },
        }));
      },

      resetToPreset: () => {
        const { presetId } = get();
        if (!presetId) return;
        const preset = PRESETS.find((p) => p.id === presetId);
        if (!preset) return;
        set({ tokens: JSON.parse(JSON.stringify(preset.tokens)) });
      },

      getCurrentModeTokens: () => {
        const { tokens, mode } = get();
        return tokens[mode];
      },
    }),
    {
      name: "baseui-theme-store",
    }
  )
);
