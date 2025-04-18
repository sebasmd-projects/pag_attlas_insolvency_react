'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FaEnvelope, FaUser } from 'react-icons/fa';
import { HiOutlinePencilAlt } from "react-icons/hi";
import { IoIosSend } from 'react-icons/io';
import { MdFormatAlignLeft } from "react-icons/md";
import { toast } from 'react-toastify';
import TitleComponent from '@/components/micro-components/title';
import SubTitleComponent from '@/components/micro-components/sub_title';

export default function ContactSection({ params }) {

    const locale = params?.locale ?? 'es';

    const t = useTranslations('Pages.homePage.sections.contact');

    // Un solo estado para todos los campos del formulario
    const [formData, setFormData] = useState({
        language: locale,
        name: '',
        last_name: '',
        email: '',
        subject: '',
        message: '',
        from_page: 'ATTLAS'
    });

    // Estado extra para evitar envíos múltiples
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { mutate } = useMutation({
        mutationKey: ['contactFormSubmission'],
        mutationFn: async (data) => {
            const response = await axios.post(`/api/contact`, data);
            return response.data;
        },
        onSuccess: () => {
            toast.success(t('successMessage'));
            // Reiniciamos el formulario tras el éxito
            setFormData({
                language: locale,
                name: '',
                last_name: '',
                email: '',
                subject: '',
                message: '',
                from_page: 'ATTLAS'
            });
            setIsSubmitting(false); // Volvemos a habilitar el envío
        },
        onError: (error) => {
            toast.error(error?.response?.data?.detail || t('errorMessage'));
            setIsSubmitting(false); // Volvemos a habilitar el envío si ocurre error
        },
    });

    // Manejador genérico para todos los campos
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        // Si ya estamos enviando, no hacemos nada
        if (isSubmitting) return;

        // Bloqueamos inmediatamente el envío
        setIsSubmitting(true);

        // Sanitizamos todos los datos
        const sanitizedData = Object.keys(formData).reduce((acc, key) => {
            acc[key] = DOMPurify.sanitize(formData[key]);
            return acc;
        }, {});

        mutate(sanitizedData);
    };

    return (
        <section id="contact">
            <div className="container py-5">

                <TitleComponent title={t('title')} />
                <SubTitleComponent t={t} sub_title={'subTitle'} />

                <form onSubmit={handleSubmit} className="row g-3">
                    {/* Nombre */}
                    <div className="col-md-6" data-aos="fade-right">
                        <label htmlFor="name" className="form-label">
                            <FaUser className="me-1" />
                            {t('name')}
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="form-control"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Apellido */}
                    <div className="col-md-6" data-aos="fade-down">
                        <label htmlFor="last_name" className="form-label">
                            <FaUser className="me-1" />
                            {t('last_name')}
                        </label>
                        <input
                            type="text"
                            name="last_name"
                            id="last_name"
                            className="form-control"
                            required
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Email */}
                    <div className="col-md-6" data-aos="fade-right">
                        <label htmlFor="email" className="form-label">
                            <FaEnvelope className="me-1" />
                            {t('email')}
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="form-control"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Asunto */}
                    <div className="col-md-6" data-aos="fade-down">
                        <label htmlFor="subject" className="form-label">
                            <HiOutlinePencilAlt className="me-1" />
                            {t('subject')}
                        </label>
                        <input
                            type="text"
                            name="subject"
                            id="subject"
                            className="form-control"
                            required
                            value={formData.subject}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Mensaje */}
                    <div className="col-12" data-aos="fade-down">
                        <label htmlFor="message" className="form-label">
                            <MdFormatAlignLeft className="me-1" />
                            {t('message')}
                        </label>
                        <textarea
                            name="message"
                            id="message"
                            className="form-control"
                            rows="5"
                            required
                            value={formData.message}
                            onChange={handleChange}
                        />
                    </div>

                    {/* términos y condiciones */}
                    <div className="col-12">
                        <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="terms" required />
                            <label className="form-check-label" htmlFor="terms">
                                {t.rich('terms', {
                                    termsLink: (chunks) => (
                                        <a
                                            href="/documents/legal/terms-and-conditions"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {chunks}
                                        </a>
                                    ),
                                    privacyLink: (chunks) => (
                                        <a
                                            href="/documents/legal/policies-for-the-treatment-of-information"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {chunks}
                                        </a>
                                    )
                                })}
                            </label>
                        </div>
                    </div>

                    {/* Botón de envío */}
                    <div className="col-12">
                        <button
                            type="submit"
                            className="btn btn-outline-success w-100"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? t('sendingMessage')
                                : (
                                    <>
                                        {t('sendButton')} <IoIosSend className="me-2" />
                                    </>
                                )
                            }
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
