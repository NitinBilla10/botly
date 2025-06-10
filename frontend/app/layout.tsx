import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Botly - AI Chatbot Platform',
  description: 'Create intelligent chatbots for your website in minutes. Upload documents, train AI, and embed anywhere.',
  keywords: 'chatbot, AI, customer support, automation, SaaS',
  authors: [{ name: 'Botly Team' }],
  openGraph: {
    title: 'Botly - AI Chatbot Platform',
    description: 'Create intelligent chatbots for your website in minutes.',
    url: 'https://botly.com',
    siteName: 'Botly',
    type: 'website',
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