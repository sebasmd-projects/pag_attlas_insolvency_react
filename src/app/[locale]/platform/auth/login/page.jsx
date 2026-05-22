// src/app/[locale]/platform/auth/login/page.jsx

'use client';

import SubTitleComponent from '@/components/micro-components/sub_title';
import { useMutation } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { FaUserPlus, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const FETCH_TIMEOUT = 60000;

async function fetchWithTimeoutAndRetry(url, options, retries = MAX_RETRIES) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }
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
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const timerRef = useRef(null);

  // Clear error when user types
  const clearError = useCallback(() => {
    if (errorMessage) {
      setErrorMessage(null);
      setErrorCode(null);
    }
  }, [errorMessage]);

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

  // Get translated error message based on error code
  const getErrorMessage = useCallback((code, fallbackDetail) => {
    const errorMessages = {
      userNotFound: t('errors.userNotFound'),
      invalidBirthDate: t('errors.invalidBirthDate'),
      invalidCredentials: t('errors.invalidCredentials'),
      invalidAdvisor: t('errors.invalidAdvisor'),
      accountLocked: t('errors.accountLocked'),
      accountDisabled: t('errors.accountDisabled'),
      tooManyAttempts: t('errors.tooManyAttempts'),
      timeoutError: t('errors.timeoutError'),
      networkError: t('errors.networkError'),
      missingFields: t('errors.missingFields'),
      invalidPasswordFormat: t('errors.invalidPasswordFormat'),
      generalError: t('errors.generalError'),
    };
    
    return errorMessages[code] || fallbackDetail || t('errors.generalError');
  }, [t]);

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
        const error = new Error(result.detail || t('errors.generalError'));
        error.errorCode = result.errorCode;
        error.status = response.status;
        throw error;
      }
      
      return result;
    },
    onSuccess: () => {
      setIsSuccess(true);
      setErrorMessage(null);
      setErrorCode(null);
      toast.success(t('successLogin'));
      window.location.href = '/platform';
    },
    onError: (error) => {
      const code = error.errorCode || 'generalError';
      const message = error.name === 'AbortError'
        ? getErrorMessage('timeoutError')
        : getErrorMessage(code, error.message);
      
      setErrorCode(code);
      setErrorMessage(message);
      
      // Only show toast for certain errors
      if (code !== 'tooManyAttempts') {
        toast.error(message);
      }
      
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

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    clearError();
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, [clearError]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setErrorCode(null);
    
    timerRef.current = setTimeout(() => {
      setShowSpinner(true);
    }, 1000);

    const sanitizedData = Object.keys(formData).reduce((acc, key) => {
      acc[key] = DOMPurify.sanitize(formData[key]);
      return acc;
    }, {});

    mutate(sanitizedData);
  }, [isSubmitting, formData, mutate]);

  // Get appropriate error icon and styling
  const errorAlertVariant = useMemo(() => {
    if (!errorCode) return 'danger';
    if (errorCode === 'tooManyAttempts') return 'warning';
    return 'danger';
  }, [errorCode]);

  return (
    <div className="container my-5 align-content-center" style={{ minHeight: '60vh' }}>
      <SubTitleComponent t={t} sub_title={'title'} />
      
      {/* Error Alert */}
      {errorMessage && (
        <div className={`alert alert-${errorAlertVariant} d-flex align-items-center mb-4`} role="alert">
          <FaExclamationTriangle className="me-2 flex-shrink-0" />
          <div>
            <strong>{errorCode === 'tooManyAttempts' ? t('errors.rateLimitTitle') : t('errors.errorTitle')}</strong>
            <p className="mb-0 mt-1">{errorMessage}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="row g-3 my-5">
        <div className="col-md-4 mt-5">
          <label htmlFor="document_number" className="form-label">
            {t('form.documentNumber')}
          </label>
          <input
            type="text"
            className={`form-control ${errorCode === 'userNotFound' ? 'is-invalid' : ''}`}
            name="document_number"
            id="document_number"
            required
            value={formData.document_number}
            onChange={handleChange}
            autoComplete="off"
            disabled={isSubmitting}
            aria-describedby={errorCode === 'userNotFound' ? 'document-error' : undefined}
          />
          {errorCode === 'userNotFound' && (
            <div id="document-error" className="invalid-feedback">
              {t('errors.userNotFoundHint')}
            </div>
          )}
        </div>

        <div className="col-md-4 mt-5">
          <label htmlFor="birth_date" className="form-label">
            {t('form.birthDate')}
          </label>
          <input
            type="date"
            className={`form-control ${errorCode === 'invalidBirthDate' ? 'is-invalid' : ''}`}
            name="birth_date"
            id="birth_date"
            required
            value={formData.birth_date}
            onChange={handleChange}
            disabled={isSubmitting}
            max={new Date().toISOString().split('T')[0]}
            aria-describedby={errorCode === 'invalidBirthDate' ? 'birthdate-error' : undefined}
          />
          {errorCode === 'invalidBirthDate' && (
            <div id="birthdate-error" className="invalid-feedback">
              {t('errors.invalidBirthDateHint')}
            </div>
          )}
        </div>

        <div className="col-md-4 mt-5">
          <label htmlFor="password" className="form-label">
            {t('form.password')}
          </label>
          <input
            type="password"
            className={`form-control ${(errorCode === 'invalidCredentials' || errorCode === 'invalidAdvisor') ? 'is-invalid' : ''}`}
            name="password"
            id="password"
            placeholder="ABCD-****"
            required
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
            aria-describedby={errorCode === 'invalidCredentials' ? 'password-error' : undefined}
          />
          {(errorCode === 'invalidCredentials' || errorCode === 'invalidAdvisor') && (
            <div id="password-error" className="invalid-feedback">
              {t('errors.invalidCredentialsHint')}
            </div>
          )}
          <small className="form-text text-muted">
            {t('form.passwordHint')}
          </small>
        </div>

        <div className="col-12 mt-5">
          <button
            type="submit"
            className="btn btn-outline-success w-100"
            disabled={isSubmitting || errorCode === 'tooManyAttempts'}
          >
            {isSubmitting ? (
              showSpinner ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  {t('form.validating')}
                </>
              ) : (
                t('form.entering')
              )
            ) : (
              t('form.submit')
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
