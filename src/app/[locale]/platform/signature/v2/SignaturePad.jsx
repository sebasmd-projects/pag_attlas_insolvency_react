/* eslint-disable func-style */
"use client";

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { toast } from 'react-toastify';

export default function SignaturePad() {

    const t = useTranslations('Platform.pages.home.wizard.steps.step11');

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

        if (sigPadRef.current) {
            const canvas = sigPadRef.current.getCanvas();
            const dataUrl = canvas.toDataURL("image/png");
            const base64Image = dataUrl.split(",")[1];

            saveSignature.mutate(
                { cedula: "1152225004", signature: base64Image },
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
        <div className="flex flex-col items-center justify-center p-5">
            <h2 className="text-2xl font-bold mb-4">Save your Signature</h2>

            <SignatureCanvas
                ref={sigPadRef}
                canvasProps={{ className: "border-2 border-black w-80 h-60" }}
            />

            <div className="mt-5 flex gap-3">
                <button
                    className="mx-4 my-2 btn btn-outline-secondary rounded"
                    onClick={clear}
                    type="button"
                >
                    Clear
                </button>
                <button
                    className="mx-4 my-2 btn btn-outline-success rounded"
                    onClick={save}
                    type="button"
                >
                    Save & Download
                </button>
            </div>

        </div>
    );
};

