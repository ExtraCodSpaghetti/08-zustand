"use client";
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import css from './NoteForm.module.css';
import { createNote } from '../../lib/api';
import {useNoteDraftStore} from '../../lib/stores/noteStore';
import { useRouter } from 'next/navigation';
import { tags } from '@/types/note';

const validTags = tags.filter((tag) => tag.toLowerCase() !== 'all');

const validationSchema = Yup.object().shape({
  title: Yup.string().min(3).max(50).required('Title is required'),
  content: Yup.string().max(500, 'Maximum length is 500'),
  tag: Yup.string()
    .oneOf(validTags, 'Invalid tag')
    .required('Tag is required'),
});

export const NoteForm  = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore(); // Получаем состояние черновика и функции для его обновления и очистки из Zustand

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft(); // Очищаем черновик после успешного создания заметки
      router.push('/notes/filter/All'); // Перенаправляем пользователя на страницу со списком заметок после успешного создания
    },
    onError: (error) => {
      console.error('Note creation failed:', error);
    },
  });

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const values = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      tag: (formData.get('tag') as string) || '',
    };

    mutate(values);
  };

 return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>

        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={draft.title}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>

        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>

        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={handleChange}
        >
          <option value="">Select a tag</option>

          {validTags.map((tag) => (
            <option
              key={tag}
              value={tag}
            >
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.push('/notes/filter/All')}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={isPending}
        >
          {isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
};
