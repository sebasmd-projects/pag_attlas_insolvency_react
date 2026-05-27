// src/app/[locale]/platform/calculator/layout.tsx

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Platform.calculator' });

    return {
        title: t('title'),
        description: t('description'),
        openGraph: {
            title: t('title'),
            description: t('description'),
        },
    };
}

export default function CalculatorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
