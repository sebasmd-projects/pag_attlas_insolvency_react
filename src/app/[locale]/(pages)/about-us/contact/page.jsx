'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { GrSend } from "react-icons/gr";
import { toast } from 'react-toastify';

export default function ContactPage() {

    const t = useTranslations('Pages.aboutUs.pages.contact');

    const [formData, setFormData] = useState(
        {
            name: '',
            last_name: '',
            email: '',
            subject: '',
            message: ''
        }
    );

    const mutation = useMutation({
        mutationFn: (data) => axios.post('/api/contact', data),
        onSuccess: () => {
            toast.success(t('successMessage'));
            setFormData({ name: '', email: '', message: '' });
        },
        onError: () => {
            toast.error(t('errorMessage'));
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="container my-5 col-6">

            <h1 className="text-uppercase mb-3" style={{
                color: '#0e3692',
                fontSize: '1rem',
                fontWeight: 800,
                letterSpacing: '0.15rem',
                paddingBottom: '2rem'
            }} >
                {t('title')}
            </h1>

            <form onSubmit={handleSubmit}>

                <div className="row">
                    <div className="col-6">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">{t('name')}</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="col-6">
                        <div className="mb-3">
                            <label htmlFor="last_name" className="form-label">{t('last_name')}</label>
                            <input
                                type="text"
                                className="form-control"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="col-6">
                        <div className="mb-3">
                            <label htmlFor="subject" className="form-label">{t('subject')}</label>
                            <input
                                type="text"
                                className="form-control"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="col-6">
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">{t('email')}</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="message" className="form-label">{t('message')}</label>
                    <textarea
                        className="form-control"
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
                    {mutation.isPending ? t('sendingMessage') : t('sendButton')} <GrSend />
                </button>
            </form>

        </div>
    );
}