// src/components/BaseLayout.tsx

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';
import Footer from '@/components/Footer/Footer';
import Navigation from '@/components/Navigation/Navigation';
import WhatsAppButton from '@/components/WhatsAppButton/WhatsAppButton';
import AOSProvider from '@/providers/AOSProvider';
import QueryProvider from '@/providers/QueryProvider';
import ToastProvider from '@/providers/ToastProvider';


import 'aos/dist/aos.css';

const inter = Inter({ subsets: ['latin'] });

type Props = { children: ReactNode; locale: string };

export default async function BaseLayout({ children, locale }: Props) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} flex flex-col`}>

        <QueryProvider>
          <ToastProvider>
            <NextIntlClientProvider messages={messages}>
              <AOSProvider>
                <Navigation />
                {children}
                <Analytics />
                <SpeedInsights />
                <Footer />
                <WhatsAppButton />
              </AOSProvider>
            </NextIntlClientProvider>
            <ReactQueryDevtools />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}