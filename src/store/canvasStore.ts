import { create } from "zustand";

export interface CanvasEntry {
  id: string;
  prompt: string;
  html: string;
  createdAt: number;
}

interface CanvasState {
  entries: CanvasEntry[];
  activeId: string | null;
  isGenerating: boolean;

  addEntry: (prompt: string) => string;
  updateEntryHtml: (id: string, html: string) => void;
  setActiveId: (id: string | null) => void;
  setGenerating: (v: boolean) => void;
  removeEntry: (id: string) => void;
  clearAll: () => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  entries: [],
  activeId: null,
  isGenerating: false,

  addEntry: (prompt) => {
    const id = crypto.randomUUID();
    set((s) => ({
      entries: [{ id, prompt, html: "", createdAt: Date.now() }, ...s.entries],
      activeId: id,
    }));
    return id;
  },

  updateEntryHtml: (id, html) =>
    set((s) => ({
      entries: s.entries.map((e) => (e.id === id ? { ...e, html } : e)),
    })),

  setActiveId: (id) => set({ activeId: id }),
  setGenerating: (v) => set({ isGenerating: v }),

  removeEntry: (id) =>
    set((s) => {
      const entries = s.entries.filter((e) => e.id !== id);
      const activeId =
        s.activeId === id ? (entries[0]?.id ?? null) : s.activeId;
      return { entries, activeId };
    }),

  clearAll: () => set({ entries: [], activeId: null }),
}));
