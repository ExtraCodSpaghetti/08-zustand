import { getCategories } from '@/lib/api';
import {NoteForm}  from '@/components/NoteForm/NoteForm';

const CreateNote = async () => {
  const categories = await getCategories();

  return (
    <>
      <NoteForm tag={categories} />
    </>
  );
};

export default CreateNote;