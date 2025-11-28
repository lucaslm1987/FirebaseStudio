
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'GCMobile',
  description: 'Sistema de registro de ocorrências para GCM',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <head>
        <link rel="stylesheet" href="/print-styles.css" media="print" />
      </head>
      <body className={`${inter.variable} h-full font-body antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
