'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { RiRefreshLine, RiHome2Line } from 'react-icons/ri';

type Props = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function CalculatorError({ error, reset }: Props) {
    const t = useTranslations('Platform.calculator.error');

    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Calculator Error:', error);
    }, [error]);

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-8 text-center">
                    <div className="card shadow-sm">
                        <div className="card-body p-5">
                            <div className="mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="80"
                                    height="80"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-danger"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            </div>
                            
                            <h2 className="mb-3">{t('title')}</h2>
                            <p className="text-muted mb-4">{t('description')}</p>
                            
                            {process.env.NODE_ENV === 'development' && (
                                <div className="alert alert-secondary text-start mb-4">
                                    <small>
                                        <strong>Error:</strong> {error.message}
                                        {error.digest && (
                                            <>
                                                <br />
                                                <strong>Digest:</strong> {error.digest}
                                            </>
                                        )}
                                    </small>
                                </div>
                            )}
                            
                            <div className="d-flex gap-3 justify-content-center">
                                <Button
                                    variant="primary"
                                    onClick={reset}
                                    className="d-inline-flex align-items-center gap-2"
                                >
                                    <RiRefreshLine />
                                    {t('retry')}
                                </Button>
                                <Link href="/" passHref legacyBehavior>
                                    <Button
                                        as="a"
                                        variant="outline-secondary"
                                        className="d-inline-flex align-items-center gap-2"
                                    >
                                        <RiHome2Line />
                                        {t('goHome')}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
