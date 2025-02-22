'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import styles from './ComplaintsAndQueries.module.css';
import ConfirmationStep from './components/steps/ConfirmationStep';
import ContactMethodsStep from './components/steps/ContactMethodsStep';
import DescriptionStep from './components/steps/DescriptionStep';
import PrivateDataStep from './components/steps/PrivateDataStep';
import RequestTypeStep from './components/steps/RequestTypeStep';

export default function ComplaintFormWizard() {

    const STEPS = [
        'Tipo de Solicitud',
        'Datos del Titular',
        'Descripción',
        'Medios de Contacto',
        'Confirmación'
    ];

    const initialFormData = {
        // RequestTypeStep
        request_type: '',

        // PrivateDataStep
        is_legal_entity: false,

        //true
        company_name: '',
        nit: '',
        legal_representative: '',

        //false
        name: '',
        surname: '',

        // PrivateDataStep ALL
        id_type: '',
        id_number: '',
        country: '',
        city: '',
        address: '',
        email: '',
        cell_prefix: '',
        cellphone: '',
        documents: {},

        // DescriptionStep
        description: '',

        // ContactMethodsStep
        contact_methods: [],
        useExistingContact: false,
        contact_email: '',
        contact_cell_prefix: '',
        contact_cell: '',
        contact_phone_prefix: '',
        contact_phone: '',

        // ConfirmationStep
        terms_accepted: false
    };

    const [currentStep, setCurrentStep] = useState(0);

    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState(initialFormData);

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
            setFormData(initialFormData);
            setErrors({});
        },

        onError: (error) => {
            toast.error(`Error al enviar la solicitud: ${error.message}`);
        },
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const prefix_cellphoneRegex = /^\+?\d{1,4}$/;
    const phoneRegex = /^\+?\d{1,4}\d{6,12}$/;
    const nitRegex = /^[0-9]{9}-[0-9]$/;

    const validateStep = (step) => {
        let newErrors = {};
        const MAX_FILE_SIZE = 2 * 1024 * 1024;
        const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

        switch (step) {
            case 0:
                const errorMessage = 'Seleccione un tipo de solicitud'
                if (!formData.request_type) {
                    newErrors.request_type = errorMessage;
                    setErrors(newErrors);
                    toast.error(errorMessage);
                    return false;
                }
                break;

            case 1:
                const errorMessages = {
                    company_name: 'El campo "Nombre de la Empresa" es obligatorio',
                    nit: 'El campo "NIT" es obligatorio',
                    nit_format: 'Formato de NIT inválido (XXXXXXX-X)',
                    legal_representative: 'El campo "Representante Legal" es obligatorio',

                    name: 'El campo "Nombre" es obligatorio',
                    surname: 'El campo "Apellido" es obligatorio',

                    id_type: 'El campo "Tipo de Documento" es obligatorio',
                    id_number: 'El campo "Número de Documento" es obligatorio',
                    country: 'El campo "País" es obligatorio',
                    city: 'El campo "Ciudad" es obligatorio',
                    address: 'El campo "Dirección" es obligatorio',
                    email: 'El campo "Correo Electrónico" es obligatorio',
                    prefix_cellphone: 'El campo "Prefijo" es obligatorio',
                    cellphone: 'El campo "Celular" es obligatorio',
                    invalid_cellphone: 'Número de celular inválido',
                    document: 'El documento es obligatorio',
                    document_type: 'Solo se permiten archivos PDF, JPEG o PNG',
                    document_size: `El archivo no puede superar los ${MAX_FILE_SIZE / 1048576} MB`
                }

                if (formData.is_legal_entity) {
                    if (!formData.company_name?.trim()) newErrors.company_name = errorMessages.company_name;
                    if (!formData.nit?.trim()) newErrors.nit = errorMessages.nit;
                    if (!nitRegex.test(formData.nit)) newErrors.nit = errorMessages.nit_format;
                    if (!formData.legal_representative?.trim()) newErrors.legal_representative = errorMessages.legal_representative;
                } else {
                    if (!formData.name?.trim()) newErrors.name = errorMessages.name;
                    if (!formData.surname?.trim()) newErrors.surname = errorMessages.surname;
                }

                if (!formData.id_type?.trim()) newErrors.id_type = errorMessages.id_type;
                if (!formData.id_number?.trim()) newErrors.id_number = errorMessages.id_number;
                if (!formData.country?.trim()) newErrors.country = errorMessages.country;
                if (!formData.city?.trim()) newErrors.city = errorMessages.city;
                if (!formData.address?.trim()) newErrors.address = errorMessages.address;
                if (!formData.email?.trim()) newErrors.email = errorMessages.email;
                if (!emailRegex.test(formData.email)) newErrors.email = errorMessages.email;
                if (!formData.cell_prefix?.trim()) newErrors.cell_prefix = errorMessages.prefix_cellphone;
                if (!formData.cellphone?.trim()) newErrors.cellphone = errorMessages.cellphone;
                if (!prefix_cellphoneRegex.test(formData.cell_prefix)) newErrors.cell_prefix = errorMessages.prefix_cellphone;
                if (!phoneRegex.test(`${formData.cell_prefix}${formData.cellphone}`)) newErrors.cellphone = errorMessages.invalid_cellphone;

                const documentType = formData.is_legal_entity ? 'legal_certificate' : 'id_document';
                const file = formData.documents[documentType];

                if (!file) {
                    newErrors[documentType] = errorMessages.document;
                } else {
                    if (!ALLOWED_TYPES.includes(file.type)) newErrors[documentType] = errorMessages.document_type;
                    if (file.size > MAX_FILE_SIZE) newErrors[documentType] = errorMessages.document_size;
                }

                if (Object.keys(newErrors).length > 0) {
                    setErrors(newErrors);
                    Object.values(newErrors).forEach(errorMessage => {
                        toast.error(errorMessage);
                    });
                    return false;
                }

                break;

            case 2:
                if (!formData.description?.trim()) {
                    newErrors.description = 'El campo "Descripción" es obligatorio';
                    setErrors(newErrors);
                    toast.error('El campo "Descripción" es obligatorio');
                    return false;
                }
                break

            case 3:

                const errorContactMessages = {
                    contact_methods: 'Seleccione al menos un medio de contacto',
                    contact_email: 'Ingrese un correo electrónico válido',
                    contact_cell: 'Ingrese un número de celular válido',
                    contact_phone: 'Ingrese un número de teléfono válido',
                    contact_cell_prefix: 'El campo "Prefijo" es obligatorio',
                    contact_cell: 'El campo "Celular" es obligatorio',
                    prefix_cellphone: 'El campo "Prefijo" es obligatorio',
                    cellphone: 'El campo "Celular" es obligatorio',
                    invalid_cellphone: 'Número de celular inválido',
                    phone: 'El campo "Teléfono" es obligatorio',
                    prefix_phone: 'El campo "Prefijo" es obligatorio',
                    invalid_phone: 'Número de teléfono inválido'
                }

                if (formData.useExistingContact) {
                    setErrors({});
                    return true;
                }

                if (formData.contact_methods.length === 0) newErrors.contact_methods = errorContactMessages.contact_methods;
                if (formData.contact_methods.includes('email') && !formData.contact_email?.trim()) newErrors.contact_email = errorContactMessages.contact_email;
                if (formData.contact_methods.includes('cell') && !formData.contact_cell?.trim()) newErrors.contact_cell = errorContactMessages.contact_cell;
                if (formData.contact_methods.includes('phone') && !formData.contact_phone?.trim()) newErrors.contact_phone = errorContactMessages.contact_phone;

                if (formData.contact_methods.includes('email')) {
                    if (!formData.contact_email?.trim()) newErrors.contact_email = errorContactMessages.contact_email;
                    if (!emailRegex.test(formData.contact_email)) newErrors.contact_email = errorContactMessages.contact_email;
                }

                if (formData.contact_methods.includes('cell')) {
                    if (!formData.contact_cell_prefix?.trim()) newErrors.contact_cell_prefix = errorContactMessages.prefix_cellphone;
                    if (!formData.contact_cell?.trim()) newErrors.contact_cell = errorContactMessages.cellphone;
                    if (!prefix_cellphoneRegex.test(formData.contact_cell_prefix)) newErrors.contact_cell_prefix = errorContactMessages.prefix_cellphone;
                    if (!phoneRegex.test(`${formData.contact_cell_prefix}${formData.contact_cell}`)) newErrors.contact_cell = errorContactMessages.invalid_cellphone;
                }

                if (formData.contact_methods.includes('phone')) {
                    if (!formData.contact_phone_prefix?.trim()) newErrors.contact_phone_prefix = errorContactMessages.prefix_phone;
                    if (!formData.contact_phone?.trim()) newErrors.contact_phone = errorContactMessages.phone;
                    if (!prefix_cellphoneRegex.test(formData.contact_phone_prefix)) newErrors.contact_phone_prefix = errorContactMessages.invalid_phone;
                    if (!phoneRegex.test(`${formData.contact_phone_prefix}${formData.contact_phone}`)) newErrors.contact_phone = errorContactMessages.prefix_phone;
                }

                if (Object.keys(newErrors).length > 0) {
                    setErrors(newErrors);
                    Object.values(newErrors).forEach(errorMessage => {
                        toast.error(errorMessage);
                    });
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
            <h1 className="mb-4 text-center">Peticiones, Quejas, Reclamos y Sugerencias</h1>
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
