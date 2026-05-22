'use client';

import { useState, memo } from 'react';
import { Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { useTranslations } from 'next-intl';
import type { UserData } from '@/lib/calculator/types';

interface UserRegistrationFormProps {
    cedula: string;
    birthDate: string;
    onUserRegistered: (user: UserData) => void;
    onCancel: () => void;
}

function UserRegistrationFormComponent({
    cedula,
    birthDate,
    onUserRegistered,
    onCancel,
}: UserRegistrationFormProps) {
    const t = useTranslations('Platform.calculator.userRegistration');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Solo permitir numeros y algunos caracteres especiales
        const value = e.target.value.replace(/[^\d\s\-+]/g, '');
        setFormData((prev) => ({
            ...prev,
            phone: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/platform/calculator/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cedula,
                    birthDate,
                    ...formData,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.detail || t('errors.registrationFailed'));
                return;
            }

            onUserRegistered(data.user);
        } catch {
            setError(t('errors.networkError'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card shadow-sm">
            <div className="card-body p-4">
                <h5 className="card-title mb-3">{t('title')}</h5>
                <p className="text-muted mb-4">{t('description')}</p>

                <Alert variant="info" className="mb-4">
                    <small>
                        <strong>{t('cedulaLabel')}:</strong> {cedula}
                        <br />
                        <strong>{t('birthDateLabel')}:</strong> {birthDate}
                    </small>
                </Alert>

                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">{t('firstName')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder={t('firstNamePlaceholder')}
                                    required
                                    minLength={2}
                                    maxLength={100}
                                    disabled={isLoading}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">{t('lastName')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder={t('lastNamePlaceholder')}
                                    required
                                    minLength={2}
                                    maxLength={100}
                                    disabled={isLoading}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">{t('email')}</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder={t('emailPlaceholder')}
                                    required
                                    disabled={isLoading}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">{t('phone')}</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                    placeholder={t('phonePlaceholder')}
                                    required
                                    minLength={7}
                                    maxLength={15}
                                    disabled={isLoading}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                            {t('address')} <span className="text-muted fw-normal">({t('optional')})</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder={t('addressPlaceholder')}
                            maxLength={200}
                            disabled={isLoading}
                        />
                    </Form.Group>

                    {error && (
                        <Alert variant="danger" className="mb-3">
                            {error}
                        </Alert>
                    )}

                    <div className="d-flex gap-2">
                        <Button
                            type="button"
                            variant="outline-secondary"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            {t('cancel')}
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading}
                            className="flex-grow-1"
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
                                    {t('registering')}
                                </>
                            ) : (
                                t('register')
                            )}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export const UserRegistrationForm = memo(UserRegistrationFormComponent);
export default UserRegistrationForm;
