import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '../../../../lib/api';
import NotesClient from './NotesClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const rawTag = slug?.[0] || '';
  const tag = rawTag.toLowerCase() === 'all' ? '' : rawTag;

  return {
    title: tag ? `Notes tagged "${tag}"` : 'All notes',
    description: tag
      ? `Viewing notes filtered by tag "${tag}".`
      : 'Viewing all notes.',
    openGraph: {
      title: tag ? `Notes tagged "${tag}"` : 'All notes',
      description: tag
        ? `Viewing notes filtered by tag "${tag}".`
        : 'Viewing all notes.',
      url: `http://localhost:3000/notes/${slug ? slug.join('/') : 'all'}`,
      siteName: 'Zustand',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: tag ? `Notes tagged "${tag}"` : 'All notes',
        },
      ],
      type: 'website',
    },
  };
}


export default async function NotesPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const queryClient = new QueryClient();
  const rawTag = slug?.[0] || '';
  const tag = rawTag.toLowerCase() === 'all' ? '' : rawTag;
  const data = await fetchNotes(1, 12, '', tag);
  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () => Promise.resolve(data),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialData={data} tag={tag} />
    </HydrationBoundary>
  );
}