// src/app/[locale]/platform/calculator/components/UserDataDisplay.tsx

'use client';

import { memo } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useTranslations } from 'next-intl';
import type { UserData } from '@/lib/calculator/types';

interface UserDataDisplayProps {
    user: UserData;
    onContinue: () => void;
    onContinueToInsolvency: () => void;
    onChangeUser: () => void;
}

function UserDataDisplayComponent({ user, onContinue, onContinueToInsolvency, onChangeUser }: UserDataDisplayProps) {
    const t = useTranslations('Platform.calculator.userData');

    return (
        <div className="card shadow-sm">
            <div className="card-body p-4">
                <h5 className="card-title mb-3">{t('title')}</h5>
                <p className="text-muted mb-4">{t('description')}</p>

                <Alert variant="success" className="mb-4">
                    <div className="mb-2">
                        <strong>{t('welcome')}, {user.firstName} {user.lastName}</strong>
                    </div>
                    <small className="text-muted">{t('verifiedUser')}</small>
                </Alert>

                <div className="bg-light rounded p-3 mb-4">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div>
                                <small className="text-muted d-block">{t('cedula')}</small>
                                <strong>{user.cedula}</strong>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div>
                                <small className="text-muted d-block">{t('birthDate')}</small>
                                <strong>{user.birthDate}</strong>
                            </div>
                        </div>
                        {user.email && (
                            <div className="col-md-6">
                                <div>
                                    <small className="text-muted d-block">{t('email')}</small>
                                    <strong>{user.email}</strong>
                                </div>
                            </div>
                        )}
                        {user.phone && (
                            <div className="col-md-6">
                                <div>
                                    <small className="text-muted d-block">{t('phone')}</small>
                                    <strong>{user.phone}</strong>
                                </div>
                            </div>
                        )}
                        {user.address && (
                            <div className="col-12">
                                <div>
                                    <small className="text-muted d-block">{t('address')}</small>
                                    <strong>{user.address}</strong>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="d-flex flex-column gap-2">
                    <Button
                        type="button"
                        variant="primary"
                        onClick={onContinue}
                        className="w-100"
                    >
                        {t('continue')}
                    </Button>
                    <Button
                        type="button"
                        variant="outline-primary"
                        onClick={onContinueToInsolvency}
                        className="w-100"
                    >
                        {t('continueToInsolvency')}
                    </Button>
                    <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={onChangeUser}
                        className="w-100"
                    >
                        {t('changeUser')}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export const UserDataDisplay = memo(UserDataDisplayComponent);
export default UserDataDisplay;
