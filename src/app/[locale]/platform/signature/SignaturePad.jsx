"use client";

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { useState, useRef } from 'react';
import SignatureCanvas from "react-signature-canvas";
import { toast } from 'react-toastify';

import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';

export default function SignaturePad() {

    const t = useTranslations('Platform.pages.home.wizard.steps.step11');

    const [cedula, setCedula] = useState('');

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

    const sigPadRef = useRef(null);

    const clear = () => {
        sigPadRef.current?.clear();
    };

    const save = () => {

        if (!cedula.trim()) {
            toast.error(t('messages.noSignature'));
            return;
        }

        if (sigPadRef.current) {
            const canvas = sigPadRef.current.getCanvas();
            const dataUrl = canvas.toDataURL("image/png");
            const base64Image = dataUrl.split(",")[1];

            saveSignature.mutate(
                { cedula: cedula, signature: base64Image },
                {
                    onError: (error) => {
                        console.error('[Client] Error en mutación:', error);
                        if (axios.isAxiosError(error)) {
                            console.error('[Client] Respuesta del servidor:', error.response);
                        }
                    }
                }
            );
        }
    };



    return (
        <div className="container-md py-4">
            <div className="row justify-content-center">
                <div className="col-xs-11 col-sm-10 col-md-10 col-lg-10">
                    <TitleComponent title={t('title')} />
                    <SubTitleComponent t={t} sub_title="subTitle" />

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
                            onWheel={(e) => e.target.blur()}
                            placeholder={t('form.inputs.documentNumberPlaceholder')}
                        />
                    </div>

                    <div className="border mb-3">
                        <SignatureCanvas
                            ref={sigPadRef}
                            canvasProps={{ className: "border-2 border-black w-100 h-60" }}
                        />
                    </div>

                    <p className="text-center text-muted small d-sm-none d-sm-block">
                        {t('messages.signatureMobile')}
                    </p>

                    <div className="mt-5 flex gap-3">
                        <button
                            className="mx-4 my-2 btn btn-outline-secondary rounded"
                            onClick={clear}
                            type="button"
                        >
                            {t('buttons.clear')}
                        </button>

                        <button
                            className="mx-4 my-2 btn btn-outline-success rounded"
                            onClick={save}
                            type="button"
                            disabled={saveSignature.isLoading || saveSignature.isSuccess}
                        >
                            {saveSignature.isLoading
                                ? `${t('buttons.saving')}...`
                                : saveSignature.isError
                                    ? `${t('buttons.error')} ❌`
                                    : saveSignature.isSuccess
                                        ? `${t('buttons.success')} ✓`
                                        : t('buttons.save')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

