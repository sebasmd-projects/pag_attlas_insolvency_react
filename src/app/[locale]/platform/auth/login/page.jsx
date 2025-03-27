// src/app/[locale]/platform/auth/login/page.jsx

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import DOMPurify from 'dompurify';

export default function AuthLoginPage() {
  const t = useTranslations('Platform.pages.auth.login');

  const router = useRouter();

  const [formData, setFormData] = useState({
    document_number: '',
    document_issue_date: '',
    birth_date: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate } = useMutation({
    mutationKey: ['loginUser'],
    mutationFn: async (data) => {
      const response = await fetch('/api/platform/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.detail || t('errorLogin'));
      }
      return result;
    },
    onSuccess: (data) => {
      toast.success(t('successLogin') || t('successLogin'));
      setIsSubmitting(false);
      router.push('/platform');
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
    <div className="container my-5 align-content-center">
      <form onSubmit={handleSubmit} className="row g-3 my-5">
        <div className="col-6">
          <label htmlFor="document_number" className="form-label">{t('form.documentNumber')}</label>
          <input
            type="text"
            className="form-control"
            name="document_number"
            id="document_number"
            required
            value={formData.document_number}
            onChange={handleChange}
          />
        </div>

        <div className="col-6">
          <label htmlFor="document_issue_date" className="form-label">{t('form.documentIssueDate')}</label>
          <input
            type="date"
            className="form-control"
            name="document_issue_date"
            id="document_issue_date"
            required
            value={formData.document_issue_date}
            onChange={handleChange}
          />
        </div>

        <div className="col-12">
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

        <div className="col-12">
          <button
            type="submit"
            className="btn btn-outline-success w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </div>
      </form>
    </div>
  );
}
