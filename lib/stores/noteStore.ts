import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { Tag } from '@/types/note';

export type NoteDraft = {
  title: string;
  content: string;
  tag: Tag | '';
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
    persist( // Используем middleware persist для сохранения состояния в localStorage
    (set) => ({
  draft: initialDraft,
 
  setDraft: (note) => // Функция для обновления черновика заметки
    set(() => ({
      draft: note,
    })),

  clearDraft: () => // Функция для очистки черновика заметки, возвращая его к начальному состоянию
    set(() => ({
      draft: initialDraft,
    })),
}),

{
  name: 'note-draft-storage', // Назва ключа в localStorage
  partialize: (state) => ({ draft: state.draft }), // Зберігаємо тільки draft
}
));