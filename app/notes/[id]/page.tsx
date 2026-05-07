
import NoteDetailsClient from "./NoteDetails.client";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchNoteById } from "../../../lib/api";


export async function generateMetadata({
    params,
}: {
  params: { id: string };
}) {
  const note = await fetchNoteById(params.id);
  return {
    title: note.title,
    description: note.content.slice(0, 160), // Краткое описание для мета-тега
    openGraph: {
      title: note.title,
      description: note.content.slice(0, 160),
      url: `http://localhost:3000/notes/${params.id}`,
      siteName: 'Zustand',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
      type: 'website',
    },
  };
}


// Основной компонент (АСИНХРОННЫЙ = работает на сервере)
export default async function NoteDetailsPage({
  // Получаем параметры из URL (в данном случае, id заметки)
  params,
}: {
  params: { id: string };
}) {
    // 1. Создаем React Query клиент
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ // 2. Предварительно загружаем данные заметки по id
    queryKey: ['note', params.id],
    queryFn: () => fetchNoteById(params.id),
  });
  return ( // 3. Оборачиваем клиентский компонент в HydrationBoundary, передавая ему предварительно загруженные данные
    <HydrationBoundary state={dehydrate(queryClient)}> 
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}; // Типизация для асинхронного компонента, который возвращает JSX.Element