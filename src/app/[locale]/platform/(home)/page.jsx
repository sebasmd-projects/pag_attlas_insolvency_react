// src/app/[locale]/platform/(home)/page.jsx

'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import pako from 'pako';

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
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        return stored;
    } catch {
        return {};
    }
};

const saveToStorage = (data) => {
    const toStore = { ...data };

    if (toStore.supportDocs) {
        toStore.supportDocs = toStore.supportDocs.map(doc => ({
            description: doc.description,
            fileName: doc.fileName
        }));
    }

    delete toStore.cedulaFront;
    delete toStore.cedulaBack;
    delete toStore.signature;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
};

const getLocalStorageUsage = () => {
    let total = 0;
    for (let key in localStorage) {
        if (!localStorage.hasOwnProperty(key)) continue;
        const value = localStorage.getItem(key);
        total += key.length + (value ? value.length : 0);
    }
    return total;
};

const getLocalStorageUsageInKB = () => {
    const bytes = getLocalStorageUsage();
    return (bytes / 1024).toFixed(2);
};

const isLocalStorageNearLimit = (thresholdPercentage = 80) => {
    const MAX_LIMIT_KB = 5120; // 5MB
    const currentUsageKB = getLocalStorageUsageInKB();
    const usagePercent = (currentUsageKB / MAX_LIMIT_KB) * 100;
    return usagePercent >= thresholdPercentage;
};

async function compressData(data) {
    const jsonString = JSON.stringify(data);
    const compressed = pako.deflate(jsonString);

    const base64Compressed = btoa(
        compressed.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    return base64Compressed;
}

export default function PlatformHomePage() {
    const router = useRouter();
    const [stepIndex, setStepIndex] = useState(0);
    const [formData, setFormData] = useState(loadFromStorage());
    const [isProcessing, setIsProcessing] = useState(false);
    const [compressedSizeKB, setCompressedSizeKB] = useState(0);

    const StepComponent = steps[stepIndex];

    useEffect(() => {
        async function updateCompressedSize() {
            try {
                const compressedData = await compressData({ form_data: formData });
                const compressedSizeInBytes = atob(compressedData).length;
                const compressedSizeInKB = compressedSizeInBytes / 1024;
                setCompressedSizeKB(compressedSizeInKB);
            } catch (error) {
                console.error('Error calculando tamaño comprimido:', error);
            }
        }

        updateCompressedSize();
    }, [formData]);

    const { mutate, isPending } = useMutation({
        mutationFn: async (data) => {
            setIsProcessing(true);
            try {
                const compressedData = await compressData({ form_data: data });

                const res = await fetch('/api/platform/insolvency-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Encoding': 'gzip'
                    },
                    body: JSON.stringify({ compressed_form_data: compressedData }),
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

        if (isLocalStorageNearLimit(80)) {
            const usage = getLocalStorageUsageInKB();
            toast.warning(`¡Atención! Estás usando ${usage} KB de almacenamiento. Si cargas más documentos grandes, podrías tener errores.`);
        }

        try {
            const compressedData = await compressData({ form_data: updatedData });

            const compressedSizeInBytes = atob(compressedData).length;
            const compressedSizeInKB = compressedSizeInBytes / 1024;

            // Actualizar el peso en KB
            setCompressedSizeKB(compressedSizeInKB);

            if (stepIndex === steps.length - 1) {
                if (compressedSizeInKB > 4096) { // 4MB = 4096 KB
                    toast.error(`El formulario comprimido pesa ${compressedSizeKB.toFixed(2)} KB, y el límite es 4096 KB. Por favor elimina o reduce el tamaño de las imágenes.`);
                    setIsProcessing(false);
                    return;
                }
                mutate(updatedData);
            } else {
                setStepIndex((prev) => prev + 1);
                setIsProcessing(false);
            }
        } catch (error) {
            console.error('Error al comprimir:', error);
            toast.error('Ocurrió un error al comprimir los datos.');
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
            <div className="text-end mt-2">
                <small className="text-muted">
                    Peso actual del formulario: {compressedSizeKB.toFixed(2)} KB
                </small>
            </div>
        </div>
    );
}

