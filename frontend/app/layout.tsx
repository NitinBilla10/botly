import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const previewImage = `${baseUrl}/preview.png`;

export const metadata: Metadata = {
  title: "Botly - AI Chatbot Platform",
  description:
    "Create intelligent chatbots for your website in minutes. Upload documents, train AI, and embed anywhere.",
  keywords: "chatbot, AI, customer support, automation, SaaS",
  authors: [{ name: "Nitin Billa" }],
    icons: {
    icon: "/favicon.png", 
  },

  openGraph: {
    title: "Botly - AI Chatbot Platform",
    description: "Create intelligent chatbots for your website in minutes.",
    url: baseUrl,
    siteName: "Botly",
    type: "website",
    images: [
      {
        url: previewImage,
        width: 1200,
        height: 630,
        alt: "Botly AI Chatbot Preview",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Botly - AI Chatbot Platform",
    description: "Create intelligent chatbots for your website in minutes.",
    images: [previewImage],
    creator: "@nitinbilla10", 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}