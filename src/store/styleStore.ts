"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  FlatStyleConfig,
  GlassStyleConfig,
  NeumorphicStyleConfig,
  UIStyleMode,
  UIStyleState,
} from "@/types/styles";
import { DEFAULT_STYLE_STATE } from "@/types/styles";

interface StyleStoreState extends UIStyleState {
  setMode: (mode: UIStyleMode) => void;
  updateFlat: (patch: Partial<FlatStyleConfig>) => void;
  updateNeumorphic: (patch: Partial<NeumorphicStyleConfig>) => void;
  updateGlass: (patch: Partial<GlassStyleConfig>) => void;
  resetStyle: () => void;
}

export const useStyleStore = create<StyleStoreState>()(
  persist(
    (set) => ({
      ...DEFAULT_STYLE_STATE,

      setMode: (mode) => set({ mode }),

      updateFlat: (patch) =>
        set((state) => ({ flat: { ...state.flat, ...patch } })),

      updateNeumorphic: (patch) =>
        set((state) => ({ neumorphic: { ...state.neumorphic, ...patch } })),

      updateGlass: (patch) =>
        set((state) => ({ glass: { ...state.glass, ...patch } })),

      resetStyle: () => set({ ...DEFAULT_STYLE_STATE }),
    }),
    { name: "baseui-style-store" }
  )
);
