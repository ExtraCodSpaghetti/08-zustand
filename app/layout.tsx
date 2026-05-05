import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
// import "./globals.css";
import TanStackProvider from "../components/TanStackProvider/TanStackProvider";
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Zustand",
  description: "Example App",
      openGraph: {
      title: `Zustand`,
      description: "Example App",
      url: 'http://localhost:3000',
      siteName: 'Zustand',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'Zustand App preview',
        },
      ],
      type: 'website',
    },
};

export default function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode;
  modal:  React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable} style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <TanStackProvider>
          <Header />
          <hr />
          {children}
          {modal}
          <hr />
          <Footer />
        </TanStackProvider>

      </body>
    </html>
  );
}

