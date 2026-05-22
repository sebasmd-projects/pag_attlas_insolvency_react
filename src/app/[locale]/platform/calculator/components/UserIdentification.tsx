'use client';

import { useState, memo } from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useTranslations } from 'next-intl';
import type { UserData } from '@/lib/calculator/types';

interface UserIdentificationProps {
    onUserFound: (user: UserData) => void;
    onUserNotFound: (cedula: string, birthDate: string) => void;
}

function UserIdentificationComponent({ onUserFound, onUserNotFound }: UserIdentificationProps) {
    const t = useTranslations('Platform.calculator.userIdentification');

    const [cedula, setCedula] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/platform/calculator/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cedula, birthDate }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.detail || t('errors.searchFailed'));
                return;
            }

            if (data.found && data.user) {
                onUserFound(data.user);
            } else {
                onUserNotFound(cedula, birthDate);
            }
        } catch {
            setError(t('errors.networkError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Solo permitir numeros
        const value = e.target.value.replace(/\D/g, '');
        setCedula(value);
    };

    return (
        <div className="card shadow-sm">
            <div className="card-body p-4">
                <h5 className="card-title mb-3">{t('title')}</h5>
                <p className="text-muted mb-4">{t('description')}</p>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">{t('cedula')}</Form.Label>
                        <Form.Control
                            type="text"
                            inputMode="numeric"
                            value={cedula}
                            onChange={handleCedulaChange}
                            placeholder={t('cedulaPlaceholder')}
                            required
                            minLength={6}
                            maxLength={15}
                            disabled={isLoading}
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">{t('birthDate')}</Form.Label>
                        <Form.Control
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            required
                            disabled={isLoading}
                            max={new Date().toISOString().split('T')[0]}
                        />
                    </Form.Group>

                    {error && (
                        <Alert variant="danger" className="mb-3">
                            {error}
                        </Alert>
                    )}

                    <div className="d-grid">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading || !cedula || !birthDate}
                        >
                            {isLoading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    {t('searching')}
                                </>
                            ) : (
                                t('continue')
                            )}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export const UserIdentification = memo(UserIdentificationComponent);
export default UserIdentification;
