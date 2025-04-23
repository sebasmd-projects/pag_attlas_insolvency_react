// src/app/[locale]/platform/auth/login/page.jsx

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

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 segundo entre reintentos
const FETCH_TIMEOUT = 60000; // 60 segundos de timeout

async function fetchWithTimeoutAndRetry(url, options, retries = MAX_RETRIES) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithTimeoutAndRetry(url, options, retries - 1);
    }
    throw error;
  }
}

export default function AuthLoginPage() {
  const t = useTranslations('Platform.pages.auth.login');
  const router = useRouter();

  const [formData, setFormData] = useState({
    document_number: '',
    password: '',
    birth_date: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isSubmitting && isSuccess) {
      router.push('/platform');
    }
  }, [isSubmitting, isSuccess, router]);

  const { mutate } = useMutation({
    mutationKey: ['loginUser'],
    mutationFn: async (data) => {
      const response = await fetchWithTimeoutAndRetry('/api/platform/auth/login', {
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
      const errorMessage = error.name === 'AbortError'
        ? t('timeoutError')
        : error.message || t('generalError');
      toast.error(errorMessage);
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
    <div className="container my-5 align-content-center" style={{ minHeight: '60vh' }}>
      <SubTitleComponent t={t} sub_title={'title'} />
      <form onSubmit={handleSubmit} className="row g-3 my-5">
        <div className="col-md-4 mt-5">
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
            autoComplete="off"
          />
        </div>

        <div className="col-md-4 mt-5">
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

        <div className="col-md-4 mt-5">
          <label htmlFor="password" className="form-label">
            {t('form.password')}
          </label>
          <input
            type="password"
            className="form-control"
            name="password"
            id="password"
            placeholder='ABCD-****'
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