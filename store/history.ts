import { create } from 'zustand';

export const useHistoryStore = create((set, get: any) => ({
  history: [],
  setHistory: (history: { id: string; content: any[] }) =>
    set({ history: history }),
  addHistory: (history: { id: string; content: any[] }) =>
    set({ history: [...get().history, history] }),
  removeHistory: (id: string) =>
    set({ history: get().history.filter((item: any) => item.id !== id) }),
}));
