// src/app/[locale]/platform/auth/register/page.jsx

'use client';

import SubTitleComponent from '@/components/micro-components/sub_title';
import { useMutation } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function AuthRegisterPage() {

  const t = useTranslations('Platform.pages.auth.register');

  const router = useRouter();

  const [formData, setFormData] = useState({
    document_number: '',
    birth_date: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate } = useMutation({
    mutationKey: ['registerUser'],
    mutationFn: async (data) => {
      const response = await fetch('/api/platform/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.detail || t('generalError'));
      }
      return result;
    },
    onSuccess: (data) => {
      toast.success(t('successRegister'));
      setIsSubmitting(false);
      router.push('/platform/login');
    },
    onError: (error) => {
      toast.error(error.message || t('generalError'));
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
          <label htmlFor="document_number" className="form-label">{t('form.documentNumber')}</label>
          <input
            type="text"
            className="form-control"
            name="document_number"
            id="document_number"
            required
            value={formData.document_number}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>

        <div className="col-md-6 mt-5">
          <label htmlFor="birth_date" className="form-label">{t('form.birthDate')}</label>
          <input
            type="date"
            className="form-control"
            name="birth_date"
            id="birth_date"
            required
            value={formData.birth_date}
            onChange={handleChange}
          />
        </div>

        <div className="col-12 mt-5">
          <button
            type="submit"
            className="btn btn-outline-success w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registrando...' : 'Registrarme'}
          </button>

          {/* Sección de Inicio de sesión */}
          <div className="text-center mt-4">
            <Link
              href="/platform/auth/login"
              className="btn btn-link text-decoration-none d-inline-flex align-items-center gap-2"
            >
              <FaUserPlus className="me-1" />
              {t('loginLink')}
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}