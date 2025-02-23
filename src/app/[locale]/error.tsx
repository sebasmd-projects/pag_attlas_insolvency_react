'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

type Props = {
  error: Error;
};

export default function Error({ error }: Props) {
  const t = useTranslations('Error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="py-5 text-center">
      <h3 className="text-uppercase mb-3" style={{
        color: '#0e3692',
        fontSize: '1rem',
        fontWeight: 800,
        letterSpacing: '0.15rem',
        paddingBottom: '2rem'
      }} >
        {t('title')}
      </h3>
      <h2 className="display-5 fw-bold" style={{
        color: '#7fd2cb',
        fontSize: '2rem',
        lineHeight: '2.25rem',
        marginBottom: '1.5rem'
      }} >
        {t.rich('description', {
          span: (chunks) => (
            <span style={{ color: '#0e3692' }}>
              {chunks}
            </span>
          )
        })}
      </h2>
      <p className="text-muted mb-4" style={{ fontSize: '1rem', lineHeight: '1.688rem' }}>
        {error.message}
      </p>
    </div>
  );
}
