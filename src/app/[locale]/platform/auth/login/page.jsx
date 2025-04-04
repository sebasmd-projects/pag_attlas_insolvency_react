'use client';

import SubTitleComponent from '@/components/micro-components/sub_title';
import { useMutation } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';


export default function AuthLoginPage() {
  const t = useTranslations('Platform.pages.auth.login');
  const router = useRouter();

  const [formData, setFormData] = useState({
    document_number: '',
    document_issue_date: '',
    birth_date: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const timerRef = useRef(null);

  // Run redirect if conditions met
  useEffect(() => {
    if (!isSubmitting && isSuccess) {
      router.push('/platform');
    }
  }, [isSubmitting, isSuccess, router]);

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
    onSuccess: () => {
      setIsSuccess(true);
      window.location.href = '/platform';
      toast.success(t('successLogin'));
    },
    onError: (error) => {
      toast.error(error.message || t('generalError'));
      setIsSubmitting(false);
    },
    onSettled: () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setShowSpinner(false);
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
    timerRef.current = setTimeout(() => {
      setShowSpinner(true);
    }, 1000);

    const sanitizedData = Object.keys(formData).reduce((acc, key) => {
      acc[key] = DOMPurify.sanitize(formData[key]);
      return acc;
    }, {});

    mutate(sanitizedData);
  };

  return (
    <div className="container my-5 align-content-center">
      <SubTitleComponent t={t} sub_title={'title'} />
      <form onSubmit={handleSubmit} className="row g-3 my-5">
        <div className="col-6">
          <label htmlFor="document_number" className="form-label">
            {t('form.documentNumber')}
          </label>
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
          <label htmlFor="document_issue_date" className="form-label">
            {t('form.documentIssueDate')}
          </label>
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
          <label htmlFor="birth_date" className="form-label">
            {t('form.birthDate')}
          </label>
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
            {isSubmitting ? (
              showSpinner ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Validando información...
                </>
              ) : (
                'Ingresando...'
              )
            ) : (
              'Ingresar'
            )}
          </button>

          {/* Sección de registro */}
          <div className="text-center mt-4">
            <Link
              href="/platform/auth/register"
              className="btn btn-link text-decoration-none d-inline-flex align-items-center gap-2"
            >
              <FaUserPlus className="me-1" />
              {t('registerLink')}
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
