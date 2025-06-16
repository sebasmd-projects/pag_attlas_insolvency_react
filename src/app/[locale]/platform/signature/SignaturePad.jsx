"use client";

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { TbBrush, TbBrushOff } from "react-icons/tb";
import SignatureCanvas from "react-signature-canvas";
import { toast } from 'react-toastify';
import Image from "next/image";

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

                    <Image
                        src="/assets/imgs/CompraSoberana/CompraSoberana.jpg"
                        width={1200}
                        height={600}
                        alt="Pulmón Verde - Carbono Verde Internacional - Conectando Bosques y Mercados"
                        className="img-fluid"
                    />
                    <div className="mt-3">
                        <SubTitleComponent t={t} sub_title="subTitle" />
                    </div>



                    <h4>
                        Declaración bajo gravedad de juramento para la carta de invitación
                    </h4>

                    <h5>
                        No reproducción o utilización de información confidencial
                    </h5>

                    <p className="text-start">
                        Declaro, bajo la gravedad del juramento y en cumplimiento de los principios consagrados en los convenios internacionales de confidencialidad, derecho internacional privado, normas de protección de activos estratégicos y tratados multilaterales de cooperación económica y seguridad (Convención de Viena sobre Relaciones Diplomáticas de 1961; Principios de UNIDROIT sobre Contratos Comerciales Internacionales), que toda la información contenida en el presente instrumento, incluyendo sus aspectos operativos, estratégicos, financieros y de seguridad, constituye material estrictamente confidencial, reservado y sensible. Su divulgación, reproducción o utilización parcial o total queda absolutamente prohibida sin la autorización previa, escrita y formal de las partes autorizadas, obligándome a su custodia y manejo conforme a los más altos estándares de discreción, protección institucional y seguridad jurídica internacional.
                    </p>

                    <div className="mb-3">
                        <label htmlFor="cedula" className="form-label">
                            {t('form.inputs.documentNumberLabel')}
                        </label>
                        <input
                            id="cedula"
                            type="text"
                            value={cedula}
                            className="form-control"
                            onChange={(e) => setCedula(e.target.value)}
                            onWheel={(e) => e.target.blur()}
                            placeholder={t('form.inputs.documentNumberPlaceholder')}
                        />
                    </div>

                    <div className="border">
                        <SignatureCanvas
                            ref={sigPadRef}
                            canvasProps={{ className: "border-2 border-black w-100", style: { height: '150px' } }}
                        />
                    </div>



                    <p className="text-center text-muted small d-sm-none d-sm-block">
                        {t('messages.signatureMobile')}
                    </p>

                    <p className='small'>Al guardar, la firma será enviada y tomada como aceptación de la declaración</p>
                    <div class="d-grid gap-2">

                        <button
                            className="mx-4 my-2 btn btn-outline-success rounded"
                            onClick={save}
                            type="button"
                            disabled={saveSignature.isLoading || saveSignature.isSuccess}
                        >
                            {saveSignature.isLoading
                                ? `${t('buttons.saving')}...`
                                : saveSignature.isError
                                    ? `${t('buttons.error')}`
                                    : saveSignature.isSuccess
                                        ? `${t('buttons.success')}`
                                        : t('buttons.save')} <TbBrush />
                        </button>



                        <button
                            className="mx-4 my-2 btn btn-outline-secondary rounded"
                            onClick={clear}
                            type="button"
                            disabled={saveSignature.isLoading || saveSignature.isSuccess}
                        >
                            {t('buttons.clear')} <TbBrushOff />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

