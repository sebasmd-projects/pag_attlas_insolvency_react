// src/app/[locale]/platform/signature/page.jsx
'use client';

import { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Container, Row, Col, Button, Spinner, Form } from 'react-bootstrap';
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
        t('messages.saveError') ||
        'Error al guardar la firma';
      toast.error(msg);
    },
  });

  const handleClear = () => {
    sigCanvasRef.current.clear();
    setPreviewURL('');
  };

  const handleSave = () => {
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
    <Container fluid="md" className="py-4">
      <Row className="justify-content-center">
        <Col xs={11} sm={10} md={10} lg={10}>
          <TitleComponent title={t('title')} />
          <SubTitleComponent t={t} sub_title="subTitle" />

          {/* Input de cédula */}
          <Form.Group className="mb-3" controlId="cedula">
            <Form.Label>{t('form.inputs.documentNumberLabel')}</Form.Label>
            <Form.Control
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              placeholder={t('form.inputs.documentNumberPlaceholder')}
            />
          </Form.Group>

          {/* Botones */}
          <div className="d-flex justify-content-between py-3 d-sm-block d-sm-none">
            <Button variant="secondary" onClick={handleClear}>
              {t('buttons.clear')}
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saveSignature.isLoading}
            >
              {saveSignature.isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (t('buttons.save'))}
            </Button>
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
            <Button variant="secondary" onClick={handleClear}>
              {t('buttons.clear')}
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saveSignature.isLoading}
            >
              {saveSignature.isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (t('buttons.save'))}
            </Button>
          </div>

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
        </Col>
      </Row>
    </Container>
  );
}
