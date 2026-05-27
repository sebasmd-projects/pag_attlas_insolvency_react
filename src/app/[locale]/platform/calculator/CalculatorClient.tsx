// src/app/[locale]/platform/calculator/CalculatorClient.tsx

'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useState, useCallback } from 'react';
import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';
import type { UserData } from '@/lib/calculator/types';

// Dynamic imports for code splitting
const UserIdentification = dynamic(() => import('./components/UserIdentification'));
const UserRegistrationForm = dynamic(() => import('./components/UserRegistrationForm'));
const UserDataDisplay = dynamic(() => import('./components/UserDataDisplay'));
const CalculatorForm = dynamic(() => import('./components/CalculatorForm'));
const VerifyCompliment = dynamic(() => import('./components/VerifyCompliment'));

type Step = 'identification' | 'registration' | 'userData' | 'calculator';
type ActiveSection = 'calculator' | 'insolvency';

export default function CalculatorClient() {
    const t = useTranslations('Platform.calculator');

    // State for the multi-step flow
    const [step, setStep] = useState<Step>('identification');
    const [user, setUser] = useState<UserData | null>(null);
    const [pendingCedula, setPendingCedula] = useState<string>('');
    const [pendingBirthDate, setPendingBirthDate] = useState<string>('');
    const [activeSection, setActiveSection] = useState<ActiveSection>('calculator');

    // Handlers
    const handleUserFound = useCallback((foundUser: UserData) => {
        setUser(foundUser);
        setStep('userData');
    }, []);

    const handleUserNotFound = useCallback((cedula: string, birthDate: string) => {
        setPendingCedula(cedula);
        setPendingBirthDate(birthDate);
        setStep('registration');
    }, []);

    const handleUserRegistered = useCallback((registeredUser: UserData) => {
        setUser(registeredUser);
        setStep('calculator');
    }, []);

    const handleContinueToCalculator = useCallback(() => {
        setStep('calculator');
        setActiveSection('calculator');
    }, []);

    const handleContinueToInsolvency = useCallback(() => {
        setStep('calculator');
        setActiveSection('insolvency');
    }, []);

    const handleChangeUser = useCallback(() => {
        setUser(null);
        setPendingCedula('');
        setPendingBirthDate('');
        setStep('identification');
    }, []);

    const handleCancelRegistration = useCallback(() => {
        setPendingCedula('');
        setPendingBirthDate('');
        setStep('identification');
    }, []);

    // Render step indicator
    const renderStepIndicator = () => {
        const steps = [
            { key: 'identification', label: t('steps.identification') },
            { key: 'calculator', label: t('steps.calculator') },
        ];

        const currentIndex = step === 'identification' || step === 'registration' || step === 'userData' ? 0 : 1;

        return (
            <div className="d-flex justify-content-center mb-4">
                {steps.map((s, index) => (
                    <div key={s.key} className="d-flex align-items-center">
                        <div
                            className={`rounded-circle d-flex align-items-center justify-content-center ${index <= currentIndex ? 'bg-primary text-white' : 'bg-light text-muted'
                                }`}
                            style={{ width: 32, height: 32 }}
                        >
                            {index + 1}
                        </div>
                        <span className={`ms-2 ${index <= currentIndex ? 'fw-bold' : 'text-muted'}`}>
                            {s.label}
                        </span>
                        {index < steps.length - 1 && (
                            <div
                                className={`mx-3 ${index < currentIndex ? 'bg-primary' : 'bg-light'}`}
                                style={{ width: 40, height: 2 }}
                            />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="container my-5">
            {/* Title */}
            <div className="mb-4 container-lg">
                <TitleComponent title={t('title')} />
                <SubTitleComponent sub_title="subTitle" t={t} />
            </div>

            {/* Step indicator */}
            {renderStepIndicator()}

            {/* Content based on current step */}
            <div className="row justify-content-center">
                {step === 'identification' && (
                    <div className="col-md-6">
                        <UserIdentification
                            onUserFound={handleUserFound}
                            onUserNotFound={handleUserNotFound}
                        />
                    </div>
                )}

                {step === 'registration' && (
                    <div className="col-md-8">
                        <UserRegistrationForm
                            cedula={pendingCedula}
                            birthDate={pendingBirthDate}
                            onUserRegistered={handleUserRegistered}
                            onCancel={handleCancelRegistration}
                        />
                    </div>
                )}

                {step === 'userData' && user && (
                    <div className="col-md-8">
                        <UserDataDisplay
                            user={user}
                            onContinue={handleContinueToCalculator}
                            onContinueToInsolvency={handleContinueToInsolvency}
                            onChangeUser={handleChangeUser}
                        />
                    </div>
                )}

                {step === 'calculator' && (
                    <div className="col-12">
                        {/* Section tabs */}
                        <div className="d-flex justify-content-center mb-4">
                            <div className="btn-group" role="group" aria-label={t('sectionSelector')}>
                                <button
                                    type="button"
                                    className={`btn ${activeSection === 'calculator' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setActiveSection('calculator')}
                                >
                                    {t('title')}
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${activeSection === 'insolvency' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setActiveSection('insolvency')}
                                >
                                    {t('caseOfInsolvency')}
                                </button>
                            </div>
                        </div>
                        {/* Calculator section */}
                        {activeSection === 'calculator' && (
                            <CalculatorForm
                                user={user ?? undefined}
                                onBack={handleChangeUser}
                            />
                        )}

                        {/* Insolvency section */}
                        {activeSection === 'insolvency' && user && (
                            <>
                                <div className="mb-4 container-lg text-center">
                                    <TitleComponent title={t('caseOfInsolvency')} />
                                    <SubTitleComponent sub_title="becomeInsolvent" t={t} />
                                </div>
                                <VerifyCompliment user={user} onBack={handleChangeUser}/>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
