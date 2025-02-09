import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { clsx } from 'clsx';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';
import Navigation from '@/components/Navigation';
import QueryProvider from '@/providers/QueryProvider';
import ToastProvider from '@/providers/ToastProvider';

const inter = Inter({ subsets: ['latin'] });

type Props = {
  children: ReactNode;
  locale: string;
};

export default async function BaseLayout({ children, locale }: Props) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html className="h-full" lang={locale}>
      <body className={clsx(inter.className, 'flex h-full flex-col')}>
        <QueryProvider>
          <ToastProvider>
            <NextIntlClientProvider messages={messages}>
              <Navigation />
              {children}
            </NextIntlClientProvider>
            <ReactQueryDevtools />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
