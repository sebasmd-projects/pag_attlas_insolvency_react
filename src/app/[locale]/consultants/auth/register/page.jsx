// src/app/[locale]/consultants/auth/register/page.jsx

'use client';

import SubTitleComponent from '@/components/micro-components/sub_title';
import { isAllowedEmailDomain } from '@/lib/consultantRegister';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const EMPTY_FORM = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirm: '',
};

function fieldMessages(fields, name) {
  const value = fields?.[name];
  if (!value) return null;
  const list = Array.isArray(value) ? value : [value];
  return list.filter((m) => typeof m === 'string' && m !== 'invalid').join(' ') || null;
}

export default function AuthRegisterPage() {
  const t = useTranslations('Consultants.pages.auth.register');

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [challengeId, setChallengeId] = useState(null);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState(null);
  const [verified, setVerified] = useState(null);

  const emailDomainInvalid =
    formData.email.includes('@') && !isAllowedEmailDomain(formData.email);
  const passwordMismatch =
    formData.password_confirm !== '' && formData.password !== formData.password_confirm;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let next = value;
    if (name === 'first_name' || name === 'last_name') next = value.toUpperCase();
    if (name === 'email') next = value.toLowerCase();
    setFormData((prev) => ({ ...prev, [name]: next }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setFormError(null);
    setFieldErrors({});

    if (!isAllowedEmailDomain(formData.email) || passwordMismatch) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/consultants/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json().catch(() => ({}));

      if (response.status === 429 || data.error === 'RATE_LIMIT') {
        setFormError(t('errors.rateLimit'));
        return;
      }
      if (data.error === 'VALIDATION_ERROR') {
        setFieldErrors(data.fields || {});
        setFormError(t('errorRegister'));
        return;
      }
      if (!response.ok || !data.success || !data.challengeId) {
        setFormError(t('generalError'));
        return;
      }
      setChallengeId(data.challengeId);
      setCode('');
      setCodeError(null);
      setStep(2);
    } catch {
      setFormError(t('generalError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (isSubmitting || !challengeId) return;
    setCodeError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/consultants/auth/register/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, code }),
      });
      const data = await response.json().catch(() => ({}));

      if (response.status === 429 || data.error === 'RATE_LIMIT') {
        setCodeError(t('errors.rateLimit'));
        return;
      }
      if (data.error === 'INVALID_CODE') {
        setCodeError(t('errors.invalidCode'));
        return;
      }
      if (!response.ok || !data.success || !data.user) {
        setCodeError(t('generalError'));
        return;
      }
      setVerified({ user: data.user });
      setFormData(EMPTY_FORM);
      setStep(3);
    } catch {
      setCodeError(t('generalError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setChallengeId(null);
    setCode('');
    setCodeError(null);
  };

  const passwordField = (name, label, shown, toggle, autoComplete) => {
    const error = fieldMessages(fieldErrors, name);
    return (
      <div className="col-md-6 mt-4">
        <label htmlFor={name} className="form-label">{label}</label>
        <div className="input-group">
          <input
            type={shown ? 'text' : 'password'}
            className={`form-control${error ? ' is-invalid' : ''}`}
            name={name}
            id={name}
            required
            autoComplete={autoComplete}
            value={formData[name]}
            onChange={handleChange}
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={toggle}
            aria-label={shown ? t('form.hidePassword') : t('form.showPassword')}
            aria-pressed={shown}
          >
            {shown ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
          </button>
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
      </div>
    );
  };

  const textField = (name, label, props = {}) => {
    const error = fieldMessages(fieldErrors, name);
    return (
      <div className="col-md-6 mt-4">
        <label htmlFor={name} className="form-label">{label}</label>
        <input
          className={`form-control${error || props.invalid ? ' is-invalid' : ''}`}
          name={name}
          id={name}
          required
          value={formData[name]}
          onChange={handleChange}
          type={props.type || 'text'}
          autoComplete={props.autoComplete}
        />
        {error && <div className="invalid-feedback">{error}</div>}
        {!error && props.invalid && props.hint && (
          <div className="invalid-feedback">{props.hint}</div>
        )}
      </div>
    );
  };

  return (
    <div className="container my-5 align-content-center" style={{ minHeight: '60vh' }}>
      <SubTitleComponent t={t} sub_title={'title'} />

      {step === 1 && (
        <form onSubmit={handleSubmit} className="row g-3 my-5" noValidate={false}>
          {textField('first_name', t('form.first_name'), { autoComplete: 'given-name' })}
          {textField('last_name', t('form.last_name'), { autoComplete: 'family-name' })}
          {textField('email', t('form.email'), {
            type: 'email',
            autoComplete: 'email',
            invalid: emailDomainInvalid,
            hint: t('errors.emailDomain'),
          })}
          {passwordField('password', t('form.password'), showPassword, () => setShowPassword((v) => !v), 'new-password')}
          {passwordField('password_confirm', t('form.passwordConfirm'), showConfirm, () => setShowConfirm((v) => !v), 'new-password')}
          {passwordMismatch && (
            <div className="col-12 text-danger" role="alert">{t('errors.passwordMismatch')}</div>
          )}

          {formError && (
            <div className="col-12">
              <div className="alert alert-danger mb-0" role="alert">{formError}</div>
            </div>
          )}

          <div className="col-12 mt-4">
            <button
              type="submit"
              className="btn btn-outline-success w-100"
              disabled={isSubmitting || emailDomainInvalid || passwordMismatch}
            >
              {isSubmitting ? t('form.submitting') : t('form.submit')}
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerify} className="row g-3 my-5">
          <div className="col-12">
            <p>{t('codeDescription', { email: formData.email })}</p>
          </div>
          <div className="col-md-6">
            <label htmlFor="code" className="form-label">{t('codeLabel')}</label>
            <input
              type="text"
              className="form-control"
              name="code"
              id="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder={t('codePlaceholder')}
              required
              minLength={6}
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              disabled={isSubmitting}
            />
          </div>
          {codeError && (
            <div className="col-12">
              <div className="alert alert-danger mb-0" role="alert">{codeError}</div>
            </div>
          )}
          <div className="col-12 d-flex justify-content-between align-items-center">
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              {t('back')}
            </button>
            <button
              type="submit"
              className="btn btn-outline-success"
              disabled={isSubmitting || code.length !== 6}
            >
              {isSubmitting ? t('verifying') : t('verify')}
            </button>
          </div>
        </form>
      )}

      {step === 3 && verified && (
        <div className="my-5 text-center">
          <div className="alert alert-success" role="status">
            {t('verified', { user: verified.user })}
          </div>
          <Link href="/platform/auth/login" className="btn btn-outline-success">
            {t('goToLogin')}
          </Link>
        </div>
      )}
    </div>
  );
}
