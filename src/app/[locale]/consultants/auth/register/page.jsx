// src/app/[locale]/consultants/auth/register/page.jsx

'use client';

import SubTitleComponent from '@/components/micro-components/sub_title';
import { useMutation } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function AuthRegisterPage() {

  const t = useTranslations('Consultants.pages.auth.register');

  const router = useRouter();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate } = useMutation({
    mutationKey: ['registerConsultant'],
    mutationFn: async (data) => {
      const response = await fetch('/api/consultants/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const contentType = response.headers.get('content-type');
      const responseData = contentType?.includes('application/json')
        ? await response.json()
        : { detail: await response.text() };

      if (!response.ok) {
        throw new Error(
          responseData.detail || t('generalError')
        );
      }
      return responseData;
    },
    onSuccess: (data) => {
      toast.success(t('successRegister'));
      setIsSubmitting(false);
      window.location.href = '/platform';
    },
    onError: (error) => {
      toast.error(error.message || t('generalError'));
      console.error(error);
      setIsSubmitting(false);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    const sanitizedData = Object.keys(formData).reduce((acc, key) => {
      acc[key] = DOMPurify.sanitize(formData[key]);
      return acc;
    }, {});

    mutate(sanitizedData);
  };

  return (
    <div className="container my-5 align-content-center" style={{ minHeight: '60vh' }}>
      <SubTitleComponent t={t} sub_title={'title'} />
      <form onSubmit={handleSubmit} className="row g-3 my-5">
        <div className="col-md-6 mt-5">
          <label htmlFor="first_name" className="form-label">{t('form.first_name')}</label>
          <input
            type="text"
            className="form-control"
            name="first_name"
            id="first_name"
            required
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mt-5">
          <label htmlFor="last_name" className="form-label">{t('form.last_name')}</label>
          <input
            type="text"
            className="form-control"
            name="last_name"
            id="last_name"
            required
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mt-5">
          <label htmlFor="password" className="form-label">{t('form.password')}</label>
          <input
            type="password"
            className="form-control"
            name="password"
            id="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="col-12 mt-5">
          <button
            type="submit"
            className="btn btn-outline-success w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Consultor'}
          </button>
        </div>
      </form>
    </div>
  );
}