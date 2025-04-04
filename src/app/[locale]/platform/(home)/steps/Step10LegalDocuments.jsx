'use client';

import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { LuSend } from "react-icons/lu";
import { useTranslations } from 'next-intl';

export default function Step10LegalDocuments({ data, onNext, onBack, isSubmitting }) {
  const t = useTranslations('Platform.pages.home.wizard.steps.step10');
  const wizardButton = useTranslations('Platform.pages.home.wizard.buttons');

  const [cedulaFront, setCedulaFront] = useState(data?.cedulaFront || '');
  const [cedulaBack, setCedulaBack] = useState(data?.cedulaBack || '');
  const [hasAccepted, setHasAccepted] = useState(!!data?.hasAccepted);

  // Firma: referencia al lienzo
  const signatureRef = useRef(null);
  const [signatureData, setSignatureData] = useState(data?.signature || '');

  // Validaciones locales
  const [errorMessages, setErrorMessages] = useState({
    cedulaFront: '',
    cedulaBack: '',
    signature: '',
    accepted: '',
  });

  // Rehidratar la firma si hay un valor en base64
  useEffect(() => {
    if (signatureData && signatureRef.current) {
      signatureRef.current.fromDataURL(signatureData);
    }
  }, []);

  const handleClearSignature = () => {
    signatureRef.current?.clear();
    setSignatureData('');
  };

  const handleSaveSignature = () => {
    if (!signatureRef.current?.isEmpty()) {
      const trimmedCanvas = signatureRef.current.getTrimmedCanvas();
      const base64Signature = trimmedCanvas.toDataURL('image/png');
      setSignatureData(base64Signature);
    }
  };

  // Convertir imágenes a base64
  const handleFileChange = async (file, setFile) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFile(reader.result); // base64
    };
    reader.readAsDataURL(file);
  };

  // Validar
  const validateFields = () => {
    let hasError = false;
    const newErrors = {
      cedulaFront: '',
      cedulaBack: '',
      signature: '',
      accepted: '',
    };

    if (!cedulaFront) {
      newErrors.cedulaFront = t('validations.cedulaFrontRequired');
      hasError = true;
    }
    if (!cedulaBack) {
      newErrors.cedulaBack = t('validations.cedulaBackRequired');
      hasError = true;
    }
    if (!signatureData) {
      newErrors.signature = t('validations.signatureRequired');
      hasError = true;
    }
    if (!hasAccepted) {
      newErrors.accepted = t('validations.acceptRequired');
      hasError = true;
    }

    setErrorMessages(newErrors);
    return !hasError;
  };

  const handleNextClick = (e) => {
    e.preventDefault();
    if (!validateFields()) {
      return;
    }
    const payload = {
      ...data,
      cedulaFront,
      cedulaBack,
      signature: signatureData,
      hasAccepted,
    };
    onNext(payload);
  };

  return (
    <div>
      <h2 className="mb-4">{t('title')}</h2>

      {/* Cédula (frente) */}
      <div className="mb-4">
        <label className="form-label">{t('fields.cedulaFront.label')}</label>
        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={(e) => handleFileChange(e.target.files[0], setCedulaFront)}
        />
        {cedulaFront && (
          <div className="mt-2">
            <p className="text-success">{t('fields.cedulaFront.successMessage')}</p>
            {/* Vista previa opcional de la cédula cargada */}
            <img
              src={cedulaFront}
              alt="Cédula frente"
              style={{ maxWidth: '200px', display: 'block', marginTop: '8px' }}
            />
          </div>
        )}
        {errorMessages.cedulaFront && (
          <div className="text-danger">{errorMessages.cedulaFront}</div>
        )}
      </div>

      {/* Cédula (reverso) */}
      <div className="mb-4">
        <label className="form-label">{t('fields.cedulaBack.label')}</label>
        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={(e) => handleFileChange(e.target.files[0], setCedulaBack)}
        />
        {cedulaBack && (
          <div className="mt-2">
            <p className="text-success">{t('fields.cedulaBack.successMessage')}</p>
            {/* Vista previa opcional de la cédula cargada */}
            <img
              src={cedulaBack}
              alt="Cédula reverso"
              style={{ maxWidth: '200px', display: 'block', marginTop: '8px' }}
            />
          </div>
        )}
        {errorMessages.cedulaBack && (
          <div className="text-danger">{errorMessages.cedulaBack}</div>
        )}
      </div>

      {/* Firma */}
      <div className="mb-4">
        <label className="form-label">{t('fields.signature.label')}</label>
        <div>
          <SignatureCanvas
            ref={signatureRef}
            penColor="black"
            canvasProps={{
              width: 800,
              height: 200,
              style: {
                border: '1px solid #ccc',
                marginBottom: '8px',
              },
            }}
          />
        </div>

        <div className="d-flex gap-3">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={handleClearSignature}
          >
            {t('fields.signature.clear')}
          </button>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={handleSaveSignature}
          >
            {t('fields.signature.save')}
          </button>
        </div>
        {signatureData && (
          <p className="text-success mt-2">
            {t('fields.signature.successMessage')}
          </p>
        )}
        {errorMessages.signature && (
          <div className="text-danger">{errorMessages.signature}</div>
        )}
      </div>

      {/* Check de confirmación */}
      <div className="mb-4">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="hasAccepted"
            checked={hasAccepted}
            onChange={(e) => setHasAccepted(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="hasAccepted">
            {t('fields.checkConfirmation')}
          </label>
        </div>
        {errorMessages.accepted && (
          <div className="text-danger">{errorMessages.accepted}</div>
        )}
      </div>

      {/* Botones de navegación */}
      <div className="d-flex justify-content-between">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <FaArrowCircleLeft /> <span className="ms-2">{wizardButton('back')}</span>
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleNextClick}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              {wizardButton('processing')}
            </>
          ) : (
            <>
              {wizardButton('send')} <LuSend className="ms-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
