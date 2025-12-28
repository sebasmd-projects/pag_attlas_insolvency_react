"use client";

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import Image from "next/image";
import { useRef, useState } from 'react';
import { TbBrush, TbBrushOff } from "react-icons/tb";
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
                    <div className="text-center mb-3">
                        <Image
                            src="/assets/imgs/page/aegis_app.webp"
                            width={400}
                            height={600}
                            alt="Alianza Compra Soberana"
                            className="img-fluid"
                        />
                    </div>

                    <div className="mt-3">
                        <SubTitleComponent t={t} sub_title="subTitle" />
                    </div>



                    <h4>
                        DECLARACIÓN JURAMENTADA DE CONFIDENCIALIDAD INTERNACIONAL
                    </h4>

                    <h4>
                        Código Único: 4NAF
                    </h4>

                    <p className="text-start">
                        Bajo la gravedad de juramento, manifiesto que el presente documento, su membrete, contenido, anexos y cualquier información asociada, se encuentra protegido por los principios y obligaciones derivados del Acuerdo sobre los Aspectos de los Derechos de Propiedad Intelectual relacionados con el Comercio (ADPIC/TRIPS), la Convención de Viena sobre el Derecho de los Tratados (1969), la Convención Interamericana sobre Obligaciones de Derecho Internacional Privado (CIDIP), así como por las disposiciones del Título 18 del Código de los Estados Unidos —incluyendo, entre otras, la Sección 1905 (Divulgación No Autorizada de Información Confidencial), las Secciones 1831-1839 (Ley de Espionaje Económico y Protección de Secretos Comerciales) y la Ley de Privacidad de 1974—, quedando prohibida su reproducción, distribución o divulgación total o parcial, por cualquier medio físico, electrónico o digital, sin autorización escrita y expresa de las partes facultadas. Reconozco que toda infracción podrá generar responsabilidad civil, penal y administrativa, tanto a nivel nacional como internacional, siendo susceptible de acciones judiciales en la jurisdicción de los Estados Unidos de América, la República de Colombia y foros arbitrales internacionales conforme a la Convención de Nueva York de 1958, y que el incumplimiento de estas obligaciones conllevará las sanciones legales aplicables. Declaro que he leído, comprendo y acepto en su totalidad el contenido de la presente declaración, comprometiéndome a su estricto cumplimiento.
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
                    <div className="d-grid gap-2">

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

