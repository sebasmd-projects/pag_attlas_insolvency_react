// src/app/[locale]/platform/signature/page.jsx
'use client';

import { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';

export default function Page() {
  const t = useTranslations('Platform.pages.home.wizard.steps.step11');

  const sigCanvasRef = useRef(null);
  const [cedula, setCedula] = useState('');
  const [previewURL, setPreviewURL] = useState('');

  const saveSignature = useMutation({
    mutationFn: ({ cedula, signature }) =>
      axios.post(
        '/api/platform/insolvency-form/signature',
        { cedula, signature },
        { withCredentials: true }
      ),
    onSuccess: () => {
      toast.success(t('messages.saveSuccess'));
    },
    onError: (err) => {
      const msg =
        err.response?.data?.detail ||
        err.response?.data ||
        t('messages.saveError');
      toast.error(msg);
    },
  });

  const handleClear = () => {
    sigCanvasRef.current.clear();
    setPreviewURL('');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!cedula.trim()) {
      toast.error(t('messages.noSignature'));
      return;
    }
    if (sigCanvasRef.current.isEmpty()) {
      toast.error(t('messages.noSignature'));
      return;
    }
    const dataURL = sigCanvasRef.current
      .getTrimmedCanvas()
      .toDataURL('image/png');
    const base64 = dataURL.split(',')[1];
    setPreviewURL(dataURL);
    saveSignature.mutate({ cedula: cedula.trim(), signature: base64 });
  };

  return (
    <div className="container-md py-4">
      <div className="row justify-content-center">
        <div className="col-xs-11 col-sm-10 col-md-10 col-lg-10">
          <TitleComponent title={t('title')} />
          <SubTitleComponent t={t} sub_title="subTitle" />

          <form onSubmit={handleSave} className="mb-3">
            {/* Input de cédula */}
            <div className="mb-3">
              <label htmlFor="cedula" className="form-label">
                {t('form.inputs.documentNumberLabel')}
              </label>
              <input
                id="cedula"
                type="number"
                value={cedula}
                className="form-control"
                onChange={(e) => setCedula(e.target.value)}
                placeholder={t('form.inputs.documentNumberPlaceholder')}
              />
            </div>

            {/* Lienzo de firma */}
            <div
              className="border rounded mb-3"
              style={{ height: '200px', position: 'relative' }}
            >
              <SignatureCanvas
                ref={sigCanvasRef}
                penColor="black"
                backgroundColor="white"
                canvasProps={{ className: 'w-100 h-100' }}
              />
            </div>

            <p className="text-center text-muted small d-sm-none d-sm-block">
              {t('messages.signatureMobile')}
            </p>

            {/* Botones */}
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleClear}
              >
                {t('buttons.clear')}
              </button>

              <button
                type="submit"
                className="btn btn-outline-success"
                disabled={saveSignature.isLoading || saveSignature.isSuccess}
              >
                {saveSignature.isLoading
                  ? t('buttons.saving')
                  : saveSignature.isError
                    ? t('buttons.error')
                    : saveSignature.isSuccess
                      ? t('buttons.success')
                      : t('buttons.save')}
              </button>
            </div>
          </form>

          {/* Vista previa */}
          {previewURL && (
            <div className="mt-3 text-center">
              <img
                src={previewURL}
                alt="Vista previa de la firma"
                className="img-fluid rounded"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
