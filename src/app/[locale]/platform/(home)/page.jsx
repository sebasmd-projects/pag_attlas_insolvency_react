// src/app/[locale]/platform/(home)/page.jsx

'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

import Step0Instrucciones from './steps/Step0Instrucciones';
import Step1DatosPersonales from './steps/Step1DatosPersonales';
import Step2DeclaracionDeCesacionDePagos from './steps/Step2DeclaracionDeCesacionDePagos';
import Step3InformeDeCesacionDePagos from './steps/Step3InformeDeCesacionDePagos';
import Step4Acreedores from './steps/Step4Acreedores';
import Step5Bienes from './steps/Step5Bienes';
import Step6Procesos from './steps/Step6Procesos';
import Step7Ingresos from './steps/Step7Ingresos';
import Step8Recursos from './steps/Step8Recursos';
import Step9Sociedad from './steps/Step9Sociedad';
import Step10LegalDocuments from './steps/Step10LegalDocuments';

const steps = [
    Step0Instrucciones,
    Step1DatosPersonales,
    Step2DeclaracionDeCesacionDePagos,
    Step3InformeDeCesacionDePagos,
    Step4Acreedores,
    Step5Bienes,
    Step6Procesos,
    Step7Ingresos,
    Step8Recursos,
    Step9Sociedad,
    Step10LegalDocuments,
];

const STORAGE_KEY = 'insolvency_form_data';

const loadFromStorage = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
        return {};
    }
};

const saveToStorage = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export default function PlatformHomePage() {
    const router = useRouter();
    const [stepIndex, setStepIndex] = useState(0);
    const [formData, setFormData] = useState(loadFromStorage());
    const [isProcessing, setIsProcessing] = useState(false);

    const StepComponent = steps[stepIndex];

    const { mutate, isPending } = useMutation({
        mutationFn: async (data) => {
            setIsProcessing(true);
            try {
                const res = await fetch('/api/platform/insolvency-form', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ form_data: data }),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.detail);
                }

                return await res.json();
            } finally {
                setIsProcessing(false);
            }
        },
        onSuccess: () => {
            toast.success('Formulario enviado con éxito');
            localStorage.removeItem(STORAGE_KEY);
            router.push('/');
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const validateSession = async () => {
        try {
            const res = await fetch('/api/platform/auth/token-info');
            if (!res.ok) {
                throw new Error('Sesión inválida');
            }
            return true;
        } catch (error) {
            router.push('/platform/auth/login');
            return false;
        }
    };

    const handleNextStep = async (data) => {
        if (isProcessing || isPending) return;

        setIsProcessing(true);

        const sessionValid = await validateSession();
        if (!sessionValid) {
            setIsProcessing(false);
            return;
        }

        const updatedData = { ...formData, ...data };
        setFormData(updatedData);
        saveToStorage(updatedData);

        if (stepIndex === steps.length - 1) {
            mutate(updatedData);
        } else {
            setStepIndex((prev) => prev + 1);
            setIsProcessing(false);
        }
    };


    const prevStep = () => {
        if (stepIndex > 0) setStepIndex((prev) => prev - 1);
    };

    return (
        <div className="container py-4">
            <h3 className="mb-4">
                Paso {stepIndex} de {steps.length - 1}
            </h3>
            <StepComponent
                data={formData}
                onNext={handleNextStep}
                onBack={prevStep}
                isSubmitting={isProcessing || isPending}
            />
        </div>
    );
}
