
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import css from './NoteForm.module.css';
import { createNote } from '../../lib/api';
import {useNoteDraftStore} from '../../lib/stores/noteStore';


interface NoteFormProps {
  onClose: () => void;      
}

const validationSchema = Yup.object().shape({
  title: Yup.string().min(3).max(50).required('Title is required'),
  content: Yup.string().max(500, 'Maximum length is 500'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag')
    .required('Tag is required'),
});

export const NoteForm: React.FC<NoteFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft(); // Очищаем черновик после успешного создания заметки
      onClose(); // Закриваємо після інвалідейту
    },
    onError: (error) => {
      console.error('Note creation failed:', error);
    },
  });

return (
    <Formik
      initialValues={draft}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => {
        mutate(values);
      }}
    >
      {({ values, handleChange }) => {

        const handleDraftChange = (
          event: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
          >
        ) => {
          handleChange(event); // Обновляем Formik state

          setDraft({
            ...values,
            [event.target.name]: event.target.value,
          });
        };

        return (
          <Form className={css.form}>

            <div className={css.formGroup}>
              <label htmlFor="title">Title</label>

              <Field
                id="title"
                name="title"
                type="text"
                className={css.input}
                onChange={handleDraftChange}
              />

              <ErrorMessage
                name="title"
                component="span"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="content">Content</label>

              <Field
                as="textarea"
                id="content"
                name="content"
                rows={8}
                className={css.textarea}
                onChange={handleDraftChange}
              />

              <ErrorMessage
                name="content"
                component="span"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="tag">Tag</label>

              <Field
                as="select"
                id="tag"
                name="tag"
                className={css.select}
                onChange={handleDraftChange}
              >
                <option value="">Select a tag</option>
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
              </Field>

              <ErrorMessage
                name="tag"
                component="span"
                className={css.error}
              />
            </div>

            <div className={css.actions}>
              <button
                type="button"
                className={css.cancelButton}
                onClick={onClose}
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

          </Form>
        );
      }}
    </Formik>
  );
};
