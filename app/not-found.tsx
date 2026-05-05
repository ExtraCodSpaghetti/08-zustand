'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface';

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist. You will be redirected to the homepage shortly.",
  openGraph: {
    title: "404 - Page Not Found",
    description: "The page you are looking for does not exist. You will be redirected to the homepage shortly.",
    url: "http://localhost:3000/404",
    siteName: "Zustand",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "404 - Zustand App preview",
      },
    ],
    type: "website",
  },
};

const NotFound = () => {
  const router = useRouter();

  useEffect(() => {
    // Редірект через 3 секунди
    const timer = setTimeout(() => router.push('/'), 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div>
      <h1>404 - Сторінку не знайдено</h1>
      <p>Вас буде перенаправлено на головну через кілька секунд…</p>
    </div>
  );
};

export default NotFound