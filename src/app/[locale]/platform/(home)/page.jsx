// src/app/[locale]/platform/insolvency/wizard/page.jsx
'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

import Step0Instrucciones from './steps/Step0Instrucciones';
import Step1DatosPersonales from './steps/Step1DatosPersonales';
import Step2Informe from './steps/Step2Informe';
import Step3Propuesta from './steps/Step3Propuesta';
import Step4Acreedores from './steps/Step4Acreedores';
import Step5Bienes from './steps/Step5Bienes';
import Step6Procesos from './steps/Step6Procesos';
import Step7Ingresos from './steps/Step7Ingresos';
import Step8Recursos from './steps/Step8Recursos';
import Step9Sociedad from './steps/Step9Sociedad';
import Step10Alimentos from './steps/Step10Alimentos';

const steps = [
    Step0Instrucciones,
    Step1DatosPersonales,
    Step2Informe,
    Step3Propuesta,
    Step4Acreedores,
    Step5Bienes,
    Step6Procesos,
    Step7Ingresos,
    Step8Recursos,
    Step9Sociedad,
    Step10Alimentos,
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

    const StepComponent = steps[stepIndex];

    const { mutate, isPending } = useMutation({
        mutationFn: async (data) => {
            const res = await fetch('/api/platform/insolvency', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Error al guardar');
            const result = await res.json();

            await fetch(`/api/v1/insolvency/${result.id}/submit/`, { method: 'POST' });

            return result;
        },
        onSuccess: () => {
            toast.success('Formulario completado y enviado al abogado');
            localStorage.removeItem(STORAGE_KEY);
            router.push('/platform');
        },
        onError: () => toast.error('Hubo un error al guardar'),
    });

    const nextStep = (data) => {
        const updatedData = { ...formData, ...data };
        setFormData(updatedData);
        saveToStorage(updatedData);

        if (stepIndex === steps.length - 1) {
            mutate(updatedData);
            localStorage.removeItem(STORAGE_KEY);
        } else {
            setStepIndex((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        if (stepIndex > 0) setStepIndex((prev) => prev - 1);
    };

    return (
        <div className="container py-4">
            <h3 className="mb-4">Paso {stepIndex} de {steps.length - 1}</h3>
            <StepComponent
                data={formData}
                onNext={nextStep}
                onBack={prevStep}
                isSubmitting={isPending}
            />
        </div>
    );
}