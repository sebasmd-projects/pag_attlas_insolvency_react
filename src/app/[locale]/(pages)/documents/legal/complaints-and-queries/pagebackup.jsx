'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ContactMethodsStep from './components/steps/ContactMethodsStep';
import DescriptionStep from './components/steps/DescriptionStep';
import PrivateDataStep from './components/steps/PrivateDataStep';
import RequestTypeStep from './components/steps/RequestTypeStep';
import ConfirmationStep from './components/steps/ConfirmationStep';
import styles from './ComplaintsAndQueries.module.css'

export default function ComplaintFormWizard() {

    const STEPS = [
        'Tipo de Solicitud',
        'Datos del Titular',
        'Descripción',
        'Medios de Contacto',
        'Confirmación'
    ];

    const [currentStep, setCurrentStep] = useState(0);

    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        request_type: '',
        is_legal_entity: false,
        name: '',
        surname: '',
        company_name: '',
        nit: '',
        legal_representative: '',
        id_type: '',
        id_number: '',
        country: '',
        city: '',
        address: '',
        email: '',
        cellphone: '',
        description: '',
        contact_methods: [],
        documents: {},
        useExistingContact: false,
        contact_email: '',
        contact_cell: '',
        contact_cell_prefix: '',
        contact_phone: '',
        contact_phone_prefix: '',
        terms_accepted: false
    });

    const { mutate, isPending } = useMutation({

        mutationFn: async (data) => {
            const formDataToSend = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'documents') {
                    Object.entries(value).forEach(([docKey, file]) => {
                        formDataToSend.append(docKey, file);
                    });
                } else {
                    formDataToSend.append(key, value);
                }
            });

            const response = await axios.post(
                'https://your-django-api-endpoint.com/complaints/',
                formDataToSend,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );

            return response.data;
        },

        onSuccess: () => {
            toast.success('Solicitud enviada exitosamente');
            setCurrentStep(0);
            setFormData({
                request_type: '',
                is_legal_entity: false,
                name: '',
                surname: '',
                company_name: '',
                nit: '',
                legal_representative: '',
                id_type: '',
                id_number: '',
                country: '',
                city: '',
                address: '',
                email: '',
                cell_prefix: '',
                cellphone: '',
                description: '',
                contact_methods: [],
                documents: {},
                useExistingContact: false,
                contact_email: '',
                contact_cell: '',
                contact_cell_prefix: '',
                contact_phone: '',
                contact_phone_prefix: '',
                terms_accepted: false
            });
            setErrors({});
        },

        onError: (error) => {
            toast.error(`Error al enviar la solicitud: ${error.message}`);
        },
    });

    const validateStep = (step) => {
        let newErrors = {};
        switch (step) {
            case 0:
                if (!formData.request_type) {
                    newErrors.request_type = 'Seleccione un tipo de solicitud';
                    setErrors(newErrors);
                    toast.error('Seleccione un tipo de solicitud');
                    return false;
                }
                break;

            case 1:
                const fieldNames = {
                    name: 'Nombres',
                    surname: 'Apellidos',
                    company_name: 'Razón Social',
                    nit: 'NIT',
                    legal_representative: 'Representante Legal',
                    id_type: 'Tipo de Identificación',
                    id_number: 'Número de Identificación',
                    country: 'País',
                    city: 'Ciudad',
                    address: 'Dirección',
                    email: 'Correo Electrónico',
                    cellphone: 'Celular'
                };

                if (formData.is_legal_entity) {
                    if (!formData.company_name?.trim()) newErrors.company_name = `El campo "${fieldNames.company_name}" es obligatorio`;
                    if (!formData.nit?.trim()) newErrors.nit = `El campo "${fieldNames.nit}" es obligatorio`;
                    if (!formData.legal_representative?.trim()) newErrors.legal_representative = `El campo "${fieldNames.legal_representative}" es obligatorio`;
                } else {
                    if (!formData.name?.trim()) newErrors.name = `El campo "${fieldNames.name}" es obligatorio`;
                    if (!formData.surname?.trim()) newErrors.surname = `El campo "${fieldNames.surname}" es obligatorio`;
                }

                if (!formData.id_type?.trim()) newErrors.id_type = `El campo "${fieldNames.id_type}" es obligatorio`;
                if (!formData.id_number?.trim()) newErrors.id_number = `El campo "${fieldNames.id_number}" es obligatorio`;
                if (!formData.country?.trim()) newErrors.country = `El campo "${fieldNames.country}" es obligatorio`;
                if (!formData.city?.trim()) newErrors.city = `El campo "${fieldNames.city}" es obligatorio`;
                if (!formData.address?.trim()) newErrors.address = `El campo "${fieldNames.address}" es obligatorio`;
                if (!formData.email?.trim()) newErrors.email = `El campo "${fieldNames.email}" es obligatorio`;
                if (!formData.cellphone?.trim()) newErrors.cellphone = `El campo "${fieldNames.cellphone}" es obligatorio`;

                if (Object.keys(newErrors).length > 0) {
                    setErrors(newErrors);
                    toast.error(Object.values(newErrors)[0]);
                    return false;
                }
                break;

            case 3:
                // Si se utiliza el contacto existente, se considera válido
                if (formData.useExistingContact) {
                    setErrors({});
                    return true;
                }

                if (formData.contact_methods.length === 0) {
                    newErrors.contact_methods = 'Seleccione al menos un medio de contacto';
                }
                if (formData.contact_methods.includes('email') && !formData.contact_email?.trim()) {
                    newErrors.contact_email = 'Ingrese un correo electrónico válido';
                }
                if (formData.contact_methods.includes('cell') && !formData.contact_cell?.trim()) {
                    newErrors.contact_cell = 'Ingrese un número de celular válido';
                }
                if (formData.contact_methods.includes('phone') && !formData.contact_phone?.trim()) {
                    newErrors.contact_phone = 'Ingrese un número de teléfono válido';
                }
                if (Object.keys(newErrors).length > 0) {
                    setErrors(newErrors);
                    toast.error(Object.values(newErrors)[0]);
                    return false;
                }
                break;

            case 4:
                if (!formData.terms_accepted) {
                    newErrors.terms_accepted = 'Debe aceptar los términos y condiciones';
                    setErrors(newErrors);
                    toast.error('Debe aceptar los términos y condiciones');
                    return false;
                }
                break;

            default:
                break;
        }
        setErrors({});
        return true;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const handleFileChange = (name, file) => {
        setFormData(prev => ({
            ...prev,
            documents: { ...prev.documents, [name]: file }
        }));
    };

    const handleSubmit = () => {
        if (validateStep(currentStep)) {
            mutate(formData);
        }
    };

    return (
        <div className="container py-5">
            <h1 className="mb-4 text-center">FORMULARIO DE RECLAMOS Y CONSULTAS</h1>
            <h2 className="mb-4 text-center">Propensiones Abogados y Fundación Attlas</h2>

            <div className={`${styles.wizardProgress} mb-5`}>
                {STEPS.map((step, index) => (
                    <div
                        key={step}
                        className={`${styles.stepWizzard} ${index <= currentStep ? `${styles.stepWizzardActive}` : ''}`}
                        onClick={() => index < currentStep && setCurrentStep(index)}
                    >
                        <div className={`${styles.stepWizzardNumber}`}>{index + 1}</div>
                        <div className={`${styles.stepWizzardLabel}`}>{step}</div>
                    </div>
                ))}
            </div>

            <Form>
                {/* Paso 1: Tipo de Solicitud */}
                {currentStep === 0 && <RequestTypeStep formData={formData} setFormData={setFormData} />}

                {/* Paso 2: Datos del Titular */}
                {currentStep === 1 && <PrivateDataStep formData={formData} setFormData={setFormData} errors={errors} handleFileChange={handleFileChange} />}

                {/* Paso 3: Descripción */}
                {currentStep === 2 && <DescriptionStep formData={formData} setFormData={setFormData} errors={errors} />}

                {/* Paso 4: Medios de Contacto */}
                {currentStep === 3 && <ContactMethodsStep formData={formData} setFormData={setFormData} errors={errors} />}

                {/* Paso 5: Confirmación */}
                {currentStep === 4 && <ConfirmationStep formData={formData} setFormData={setFormData} errors={errors} />}

                <div className="d-flex justify-content-between mt-4">
                    {currentStep > 0 && (
                        <Button variant="outline-secondary" onClick={handlePrevious}>
                            Anterior
                        </Button>
                    )}

                    {currentStep < STEPS.length - 1 ? (
                        <Button variant="primary" onClick={handleNext}>
                            Siguiente
                        </Button>
                    ) : (
                        <Button variant="success" onClick={handleSubmit} disabled={isPending}>
                            {isPending ? 'Enviando...' : 'Enviar Solicitud'}
                        </Button>
                    )}
                </div>
            </Form>
        </div>
    );
}
