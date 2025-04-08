'use client';

import React, { useState } from 'react';
import { FaArrowCircleLeft, FaPlus, FaMinus } from 'react-icons/fa';
import { LuSend } from 'react-icons/lu';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';


export default function Step10LegalDocuments({ data, onNext, onBack, isSubmitting }) {
  const t = useTranslations('Platform.pages.home.wizard.steps.step10');
  const wizardButton = useTranslations('Platform.pages.home.wizard.buttons');

  const [signatureData, setSignatureData] = useState(data?.signature || '');
  const [hasAccepted, setHasAccepted] = useState(!!data?.hasAccepted);
  const [supportDocs, setSupportDocs] = useState(data?.supportDocs || []);

  const [errorMessages, setErrorMessages] = useState({
    signature: '',
    accepted: '',
  });

  const handleFileChange = async (file, index) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes...');
      return;
    }

    try {
      let fileToUse = file;

      // Si el archivo supera 200KB, comprimimos
      if (file.size > 200 * 1024) {
        const options = {
          maxSizeMB: 0.2, // 200 KB
          maxWidthOrHeight: 1024, // opcional, redimensiona si es necesario
          useWebWorker: true
        };
        fileToUse = await imageCompression(file, options);
        toast.info('La imagen fue optimizada automáticamente para reducir su tamaño.');
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newDocs = [...supportDocs];
        newDocs[index].file = reader.result;
        newDocs[index].fileName = fileToUse.name;
        setSupportDocs(newDocs);
      };
      reader.readAsDataURL(fileToUse);

    } catch (error) {
      console.error('Error optimizando la imagen:', error);
      toast.error('Error al optimizar la imagen.');
    }
  };

  const addSupportDoc = () => {
    setSupportDocs([...supportDocs, { description: '', file: '', fileName: '' }]);
  };

  const removeSupportDoc = (index) => {
    const newDocs = [...supportDocs];
    newDocs.splice(index, 1);
    setSupportDocs(newDocs);
  };

  const handleDescriptionChange = (index, value) => {
    const newDocs = [...supportDocs];
    newDocs[index].description = value;
    setSupportDocs(newDocs);
  };

  const handleSimpleFileChange = async (file, setFile) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes...');
      return;
    }

    try {
      let fileToUse = file;

      if (file.size > 200 * 1024) {
        const options = {
          maxSizeMB: 0.2, // 200 KB
          maxWidthOrHeight: 1024, // opcional
          useWebWorker: true
        };
        fileToUse = await imageCompression(file, options);
        toast.info('La imagen fue optimizada automáticamente para reducir su tamaño.');
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result);
      };
      reader.readAsDataURL(fileToUse);

    } catch (error) {
      console.error('Error optimizando la imagen:', error);
      toast.error('Error al optimizar la imagen.');
    }
  };


  const validateFields = () => {
    let hasError = false;
    const newErrors = { signature: '', accepted: '' };

    if (!hasAccepted) newErrors.accepted = t('validations.acceptRequired'), hasError = true;

    setErrorMessages(newErrors);
    return !hasError;
  };

  const handleNextClick = (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    const filteredSupportDocs = supportDocs.filter(doc => doc.file && doc.fileName);

    const payload = {
      ...data,
      signature: signatureData,
      hasAccepted,
      supportDocs: filteredSupportDocs,
    };
    onNext(payload);
  };

  return (
    <div>
      <h2 className="mb-4">{t('title')}</h2>

      {/* Firma */}
      <div className="mb-4">
        <label className="form-label">{t('fields.signature.label')}</label>
        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={(e) => handleSimpleFileChange(e.target.files[0], setSignatureData)}
        />
        {signatureData && <img src={signatureData} alt="Firma" style={{ maxWidth: '200px', marginTop: '8px' }} />}
        {errorMessages.signature && <div className="text-danger">{errorMessages.signature}</div>}
      </div>

      {/* Nota para PDFs */}
      <div className="alert alert-info" role="alert">
        Si el documento a cargar es un <strong>PDF</strong>, por favor envíalo al correo <strong>insolvencia@propensionesabogados.com</strong> incluyendo tu <strong>número de documento</strong>.
      </div>

      {/* Documentos de soporte */}
      <div className="mb-4">
        <p><label className="form-label">Documentos demostrativos (solo imágenes)</label></p>

        {supportDocs.map((doc, index) => (
          <div key={index} className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Descripción"
              value={doc.description}
              onChange={(e) => handleDescriptionChange(index, e.target.value)}

            />
            <input
              type="file"
              className="form-control"
              accept="image/*"
              id={`fileInput-${index}`}
              onChange={(e) => handleFileChange(e.target.files[0], index)}

            />
            <button
              className="btn btn-outline-success"
              type="button"
              onClick={addSupportDoc}
              style={{ display: index === supportDocs.length - 1 ? 'inline-block' : 'none' }}
            >
              <FaPlus />
            </button>
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={() => removeSupportDoc(index)}
            >
              <FaMinus />
            </button>
          </div>
        ))}

        {/* Botón inicial si no hay documentos */}
        {supportDocs.length === 0 && (
          <button
            type="button"
            className="btn btn-outline-primary mt-2"
            onClick={addSupportDoc}
          >
            + Añadir documento
          </button>
        )}

        {/* Previsualización */}
        {supportDocs.map((doc, index) => (
          <div key={`preview-${index}`} className="mt-2">
            {doc.file && (
              <img
                src={doc.file}
                alt="Documento cargado"
                style={{ maxWidth: '200px', marginTop: '8px' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Aceptar términos */}
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
        {errorMessages.accepted && <div className="text-danger">{errorMessages.accepted}</div>}
      </div>

      {/* Botones navegación */}
      <div className="d-flex justify-content-between">
        <button type="button" className="btn btn-secondary" onClick={onBack} disabled={isSubmitting}>
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
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
