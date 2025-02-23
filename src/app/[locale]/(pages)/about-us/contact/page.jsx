'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';

export default function ContactPage() {

    const t = useTranslations('Pages.aboutUs.pages.contact');

    const [formData, setFormData] = useState(
        {
            name: '',
            email: '',
            message: '',
        }
    );

    const mutation = useMutation({
        mutationFn: (data) => axios.post('/api/contact', data),
        onSuccess: () => {
            toast.success('Message sent successfully!');
            setFormData({ name: '', email: '', message: '' });
        },
        onError: () => {
            toast.error('Failed to send message. Please try again.');
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
                    {mutation.isPending ? t('sendingMessage') : t('sendButton')}
                </button>
            </form>
        </div>
    );
}