// src/app/[locale]/platform/(home)/steps/Step9PermanentPartner.jsx

'use client';

import { useTranslations } from 'next-intl';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { MdSaveAs } from 'react-icons/md';
import { toast } from 'react-toastify';

import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';

/* ──────────── Constantes ──────────── */
const SKIP_STATES = ['No aplica', 'Soltero/a', 'Viudo/a', 'Divorciado/a'];

const MARITAL_OPTIONS = (t) => [
    { value: 'No aplica', label: t('maritalStatus.notApplicable') },
    { value: 'Soltero/a', label: t('maritalStatus.single') },
    { value: 'Casado/a', label: t('maritalStatus.married') },
    { value: 'Divorciado/a', label: t('maritalStatus.divorced') },
    { value: 'Viudo/a', label: t('maritalStatus.widowed') },
    { value: 'Unión Libre', label: t('maritalStatus.freeUnion') },
    { value: 'Declaración Marital', label: t('maritalStatus.maritalDeclaration') },
];

/* ──────────── Endpoints ──────────── */
async function GetStep9() {
    const { data } = await axios.get(
        '/api/platform/insolvency-form/get-data/?step=9'
    );
    return data;
}

async function SaveStep9(payload) {
    return axios.patch('/api/platform/insolvency-form/?step=9', payload);
}

/* ──────────── Componente ──────────── */
export default function Step9PermanentPartner({ data, updateData, onNext }) {
    const t = useTranslations('Platform.pages.home.wizard.steps.step9');
    const queryClient = useQueryClient();

    /* ---- Query inicial ---- */
    const { data: step9Data } = useQuery({
        queryKey: ['step9Data'],
        queryFn: GetStep9,
        refetchOnMount: true,
    });

    /* ---- Estado local ---- */
    const buildInitialState = (source) => ({
        marital_status: source?.partner_marital_status ?? 'No aplica',
        document: source?.partner_document_number ?? '',
        name: source?.partner_name ?? '',
        lastname: source?.partner_last_name ?? '',
        email: source?.partner_email ?? '',
        phone: source?.partner_cell_phone ?? '',
        relationship_duration:
            source?.partner_relationship_duration?.toString() ?? '',
    });

    const [form, setForm] = useState(buildInitialState(data));
    const initialized = useRef(false);

    /* ---- hidratar del servidor ---- */
    useEffect(() => {
        if (step9Data && !initialized.current) {
            const init = buildInitialState(step9Data);
            setForm(init);
            initialized.current = true;
        }
    }, [step9Data]);

    /* ---- sincronizar con wizard ---- */
    useEffect(() => {
        const payload = { partner_marital_status: form.marital_status };
        if (!SKIP_STATES.includes(form.marital_status)) {
            payload.partner_document_number = form.document;
            payload.partner_name = form.name;
            payload.partner_last_name = form.lastname;
            payload.partner_email = form.email;
            payload.partner_cell_phone = form.phone;
            payload.partner_relationship_duration =
                parseInt(form.relationship_duration, 10) || 0;
        }
        updateData(payload);
    }, [form, updateData]);

    /* ---- Mutación Guardar ---- */
    const saveMutation = useMutation({
        mutationFn: () => {
            const toSend = { partner_marital_status: form.marital_status };
            if (!SKIP_STATES.includes(form.marital_status)) {
                toSend.partner_document_number = form.document;
                toSend.partner_name = form.name;
                toSend.partner_last_name = form.lastname;
                toSend.partner_email = form.email;
                toSend.partner_cell_phone = form.phone;
                toSend.partner_relationship_duration =
                    parseInt(form.relationship_duration, 10) || 0;
            }
            return SaveStep9(toSend);
        },
        onSuccess: () => {
            toast.success(t('messages.saveSuccess'));
            queryClient.invalidateQueries(['step9Data']);
        },
        onError: () => toast.error(t('messages.saveError')),
    });

    const handleSave = () => saveMutation.mutate();

    /* ---- Handlers ---- */
    const handleEstadoChange = (e) => {
        const marital_status = e.target.value;
        setForm((prev) => {
            if (SKIP_STATES.includes(marital_status)) {
                return {
                    ...prev,
                    marital_status,
                    document: '',
                    name: '',
                    lastname: '',
                    email: '',
                    phone: '',
                    relationship_duration: '',
                };
            }
            return { ...prev, marital_status };
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    /* ---- Submit Avanzar ---- */
    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { partner_marital_status: form.marital_status };
        if (!SKIP_STATES.includes(form.marital_status)) {
            payload.partner_document_number = form.document;
            payload.partner_name = form.name;
            payload.partner_last_name = form.lastname;
            payload.partner_email = form.email;
            payload.partner_cell_phone = form.phone;
            payload.partner_relationship_duration =
                parseInt(form.relationship_duration, 10) || 0;
        }
        onNext(payload);
    };

    const showPartnerFields = !SKIP_STATES.includes(form.marital_status);

    return (
        <>
            <TitleComponent title={t('title')} />
            <SubTitleComponent t={t} sub_title="subTitle" />

            <form onSubmit={handleSubmit} className="row" id="wizard-step-form">
                {/* Estado civil */}
                <div className="mb-3">
                    <label className="form-label">
                        {t('maritalSocietyQuestion')}
                    </label>
                    <select
                        className="form-select"
                        value={form.marital_status}
                        onChange={handleEstadoChange}
                        required
                    >
                        {MARITAL_OPTIONS(t).map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Datos del compañero permanente */}
                {showPartnerFields && (
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">{t('partnerDocument')}</label>
                            <input
                                type="text"
                                className="form-control"
                                name="document"
                                value={form.document}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">{t('partnerName')}</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">{t('partnerLastname')}</label>
                            <input
                                type="text"
                                className="form-control"
                                name="lastname"
                                value={form.lastname}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">{t('partnerEmail')}</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">{t('partnerPhone')}</label>
                            <input
                                type="text"
                                className="form-control"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-12">
                            <label className="form-label">
                                {t('relationshipDuration')}
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                name="relationship_duration"
                                value={form.relationship_duration}
                                onChange={handleChange}
                                min={1}
                                max={50000}
                                required
                                onWheel={(e) => e.target.blur()}
                            />
                        </div>
                    </div>
                )}

                {/* Guardar sin avanzar */}
                <div className="my-3">
                    <button
                        type="button"
                        className="btn btn-outline-info"
                        onClick={handleSave}
                        disabled={saveMutation.isLoading}
                    >
                        <MdSaveAs className="me-1" />
                        {saveMutation.isLoading
                            ? t('messages.saving')
                            : t('messages.save')}
                    </button>
                </div>
            </form>
        </>
    );
}

Step9PermanentPartner.propTypes = {
    data: PropTypes.shape({
        partner_marital_status: PropTypes.string,
        partner_document_number: PropTypes.string,
        partner_name: PropTypes.string,
        partner_last_name: PropTypes.string,
        partner_email: PropTypes.string,
        partner_cell_phone: PropTypes.string,
        partner_relationship_duration: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
    }),
    updateData: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
};
