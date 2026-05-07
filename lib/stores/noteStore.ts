import { create } from "zustand";
import { persist } from 'zustand/middleware';

export type NoteDraft = {
  title: string;
  content: string;
  tag: string;
};

interface NoteDraftStore {
  draft: NoteDraft;
  setDraft: (note: NoteDraft) => void;
  clearDraft: () => void;
}

const initialDraft: NoteDraft = {
  title: "",
  content: "",
  tag: "",
};

export const useNoteDraftStore = create<NoteDraftStore>()(
    persist(
    (set) => ({
  draft: initialDraft,
 
  setDraft: (note) =>
    set(() => ({
      draft: note,
    })),

  clearDraft: () =>
    set(() => ({
      draft: initialDraft,
    })),
}),

{
  name: 'note-draft-storage', // Назва ключа в localStorage
  partialize: (state) => ({ draft: state.draft }), // Зберігаємо тільки draft
}
));