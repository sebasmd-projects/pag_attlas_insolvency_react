// src/app/[locale]/platform/(home)/steps/Step6MovableImmovableProperty.jsx

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { MdSaveAs } from 'react-icons/md';


import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';

/* ──────────── Constantes ──────────── */
const EMPTY_ASSET = {
    asset_type: '',
    name: '',
    identification: '',
    lien: '',
    affectation: '',
    legal_measure: [],
    patrimonial_society: '',
    commercial_value: '',
    exclusion: false,
};

const AFFECT_OPTIONS = (t) => [
    '',
    t('form.affectation.options.family_heritage'),
    t('form.affectation.options.family_home'),
    t('form.affectation.options.decent_housing'),
    t('form.affectation.options.not_apply'),
];

const MEASURE_OPTIONS = (t) => [
    t('form.measure.options.seizure'),
    t('form.measure.options.confiscation'),
    t('form.measure.options.auction'),
    t('form.measure.options.none'),
];

/* ─────────── Formato moneda es-CO ─────────── */
const parseCurrencyInput = (v) =>
    parseFloat(String(v || '0').replace(/,/g, '')) || 0;

const formatToLocaleCOP = (value) => {
    if (value === '' || value == null) return '';
    const n = typeof value === 'number' ? value : parseCurrencyInput(value);
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
        .format(n)
};

/* ─────────── Endpoints ─────────── */
async function fetchStep6() {
    const { data } = await axios.get('/api/platform/insolvency-form/get-data/?step=6');
    return data;
}

async function saveStep6(assets) {
    const payload = {
        assets: assets.map((a) => ({
            ...a,
            commercial_value: parseCurrencyInput(a.commercial_value),
        })),
    };
    return axios.patch('/api/platform/insolvency-form/?step=6', payload);
}

export default function Step6MovableImmovableProperty({ data, updateData, onNext }) {
    const t = useTranslations('Platform.pages.home.wizard.steps.step6');
    const queryClient = useQueryClient();

    const { data: step6Data, isFetching } = useQuery({
        queryKey: ['step6Data'],
        queryFn: fetchStep6,
        refetchOnMount: true,
    });

    const saveMutation = useMutation({
        mutationFn: saveStep6,
        onSuccess: () => {
            toast.success(t('messages.saveSuccess'));
            queryClient.invalidateQueries(['step6Data']);
        },
        onError: () => {
            toast.error(t('messages.saveError'));
        },
    });

    const [form, setForm] = useState({ assets: [EMPTY_ASSET] });

    const initialized = useRef(false);
    useEffect(() => {
        if (step6Data && !initialized.current) {
            const initList = step6Data.assets ?? data.assets ?? [EMPTY_ASSET];
            setForm({ assets: initList });
            updateData({ assets: initList });
            initialized.current = true;
        }
    }, [step6Data, data, updateData]);

    useEffect(() => { updateData({ assets: form.assets }); }, [form.assets, updateData]);

    const [hasMovableExcl, setHasMovableExcl] = useState(false);
    const [hasImmoExcl, setHasImmoExcl] = useState(false);

    useEffect(() => {
        setHasMovableExcl(form.assets.some(a => a.asset_type === 'MUEBLE' && a.exclusion));
        setHasImmoExcl(form.assets.some(a => a.asset_type === 'INMUEBLE' && a.exclusion));
    }, [form.assets]);

    const persist = (assets) => setForm({ assets });
    const addRow = () => persist([...form.assets, EMPTY_ASSET]);
    const removeRow = (i) => persist(form.assets.filter((_, idx) => idx !== i));
    const handleChange = (i, field, value) =>
        persist(form.assets.map((a, idx) => idx === i ? { ...a, [field]: value } : a));

    const handleExclusionChange = (i) => {
        const type = form.assets[i].asset_type;
        persist(
            form.assets.map((a, idx) => {
                if (idx === i) return { ...a, exclusion: !a.exclusion };
                if (a.asset_type === type) return { ...a, exclusion: false };
                return a;
            })
        );
    };

    // 6) Formateo while typing
    const handleCommercialValueChange = (i, raw) => {
        const numeric = parseCurrencyInput(raw);
        handleChange(i, 'commercial_value', formatToLocaleCOP(numeric));
    };

    // 7) Toggle medidas
    const toggleMeasure = (i, opt) => {
        const none = MEASURE_OPTIONS(t)[3];
        const cur = form.assets[i].legal_measure || [];
        let next;
        if (opt === none) {
            next = cur.includes(none) ? [] : [none];
        } else {
            next = cur.includes(opt)
                ? cur.filter(m => m !== opt)
                : [...cur.filter(m => m !== none), opt];
        }
        handleChange(i, 'legal_measure', next);
    };

    // 8) Guardar sin avanzar
    const handleSave = () => saveMutation.mutate(form.assets);

    // 9) Siguiente paso
    const handleSubmit = (e) => {
        e.preventDefault();
        onNext({
            assets: form.assets.map(a => ({
                asset_type: a.asset_type,
                name: a.name,
                identification: a.identification,
                lien: a.lien,
                affectation: a.affectation,
                legal_measure: a.legal_measure,
                patrimonial_society: a.patrimonial_society,
                commercial_value: parseCurrencyInput(a.commercial_value),
                exclusion: a.exclusion,
            }))
        });
    };

    const MEASURE_NONE = MEASURE_OPTIONS(t)[3];

    const renderExclusionField = (asset, i) => {
        const isMov = asset.asset_type === 'MUEBLE';
        const isIm = asset.asset_type === 'INMUEBLE';
        const show =
            (isMov && !hasMovableExcl) ||
            (isIm && !hasImmoExcl) ||
            asset.exclusion;
        if (!show) return null;
        return (
            <div className="col-12">
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={asset.exclusion}
                        onChange={() => handleExclusionChange(i)}
                        id={`exclusion-${i}`}
                    />
                    <label className="form-check-label" htmlFor={`exclusion-${i}`}>
                        {t('form.exclusion.label')}
                    </label>
                    {asset.exclusion && (
                        <div className="mt-2 p-2 bg-light rounded small">
                            <p>{t('form.exclusion.legalReferencesTitle')}</p>
                            <ul>
                                {t.rich('form.exclusion.legalReferences', {
                                    li: chunks => <li>{chunks}</li>,
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <TitleComponent title={t('title')} />
            <SubTitleComponent t={t} sub_title="subTitle" />

            <form onSubmit={handleSubmit} className="row" id="wizard-step-form">
                {form.assets.map((asset, i) => (
                    <div key={i} className="border p-3 mb-4 rounded shadow-sm bg-light">
                        <div className="row g-3">
                            {/* Asset Type */}
                            <div className="col-md-3">
                                <label className="form-label fw-bold">{t('form.assetType.label')}</label>
                                <select
                                    className="form-select"
                                    value={asset.asset_type}
                                    onChange={e => handleChange(i, 'asset_type', e.target.value)}
                                    required
                                >
                                    <option value="">{t('form.assetType.placeholder')}</option>
                                    <option value="MUEBLE">{t('form.assetType.options.furniture')}</option>
                                    <option value="INMUEBLE">{t('form.assetType.options.realEstate')}</option>
                                </select>
                            </div>

                            {/* Name */}
                            <div className="col-md-3">
                                <label className="form-label fw-bold">{t('form.description.label')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={asset.name}
                                    onChange={e => handleChange(i, 'name', e.target.value)}
                                    required
                                />
                            </div>

                            {/* Identification */}
                            <div className="col-md-3">
                                <label className="form-label fw-bold">{t('form.identification.label')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={asset.identification}
                                    onChange={e => handleChange(i, 'identification', e.target.value)}
                                    required
                                />
                            </div>

                            {/* Lien */}
                            <div className="col-md-3">
                                <label className="form-label">{t('form.lien.label')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={asset.lien}
                                    onChange={e => handleChange(i, 'lien', e.target.value)}
                                />
                            </div>

                            {/* Affectation */}
                            <div className="col-md-3">
                                <label className="form-label">{t('form.affectation.label')}</label>
                                <select
                                    className="form-select"
                                    value={asset.affectation}
                                    onChange={e => handleChange(i, 'affectation', e.target.value)}
                                >
                                    {AFFECT_OPTIONS(t).map((opt, idx) => (
                                        <option key={idx} value={opt}>
                                            {opt || t('form.affectation.placeholder')}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Legal Measure */}
                            <div className="col-md-6">
                                <label className="form-label">{t('form.measure.label')}</label>
                                <div className="d-flex flex-wrap gap-2">
                                    {MEASURE_OPTIONS(t).map((opt, idx) => {
                                        const disabled =
                                            (opt === MEASURE_NONE && asset.legal_measure?.length > 0 && !asset.legal_measure.includes(MEASURE_NONE)) ||
                                            (opt !== MEASURE_NONE && asset.legal_measure?.includes(MEASURE_NONE));
                                        return (
                                            <div className="form-check form-check-inline" key={idx}>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`measure-${i}-${idx}`}
                                                    checked={asset.legal_measure?.includes(opt) || false}
                                                    onChange={() => toggleMeasure(i, opt)}
                                                    disabled={disabled}
                                                />
                                                <label className="form-check-label" htmlFor={`measure-${i}-${idx}`}>
                                                    {opt}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Commercial Value */}
                            <div className="col-md-3">
                                <label className="form-label fw-bold">{t('form.commercialValue.label')}</label>
                                <input
                                    type="text"
                                    className="form-control text-end"
                                    value={asset.commercial_value}
                                    onChange={e => handleCommercialValueChange(i, e.target.value)}
                                    inputMode="decimal"
                                    required
                                />
                            </div>

                            {/* Patrimonial Society */}
                            <div className="col-md-12">
                                <label className="form-label">{t('form.patrimonialSociety.label')}</label>
                                <textarea
                                    className="form-control"
                                    rows={2}
                                    placeholder={t('form.patrimonialSociety.placeholder')}
                                    value={asset.patrimonial_society}
                                    onChange={e => handleChange(i, 'patrimonial_society', e.target.value)}
                                />
                            </div>

                            {/* Exclusion */}
                            {renderExclusionField(asset, i)}
                        </div>

                        {/* Delete row */}
                        <div className="d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-sm btn-danger mt-2"
                                onClick={() => removeRow(i)}
                            >
                                {t('form.actions.delete')}
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add new asset */}
                <div className="mb-3">
                    <button type="button" className="btn btn-outline-success" onClick={addRow}>
                        {t('form.actions.addAsset')}
                    </button>
                </div>

                {/* Save */}
                <div className="my-3">
                    <button
                        type="button"
                        className="btn btn-outline-info"
                        onClick={handleSave}
                        disabled={saveMutation.isLoading}
                    >
                        <MdSaveAs /> {saveMutation.isLoading ? t('messages.saving') : t('messages.save')}
                    </button>
                </div>
            </form>
        </>
    );
}

Step6MovableImmovableProperty.propTypes = {
    data: PropTypes.shape({ assets: PropTypes.array }),
    updateData: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
};
