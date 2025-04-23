// src/app/[locale]/platform/(home)/steps/Step6MovableImmovableProperty.jsx

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';

/* ─────────── Helpers ─────────── */
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

const toNum = (v) => parseFloat(String(v || '0').replace(/,/g, '')) || 0;

/* ─────────── Endpoints ─────────── */
async function fetchStep6() {
    const { data } = await axios.get('/api/platform/insolvency-form/get-data/?step=6');
    return data;
}

async function saveStep6(assets) {
    // convierte commercial_value a número real
    const payload = {
        assets: assets.map(a => ({
            ...a,
            commercial_value: toNum(a.commercial_value),
        }))
    };
    return axios.patch('/api/platform/insolvency-form/?step=6', payload);
}

export default function Step6MovableImmovableProperty({ data, updateData, onNext }) {
    const t = useTranslations('Platform.pages.home.wizard.steps.step6');
    
    const queryClient = useQueryClient();

    // 1) fetch inicial
    const { data: step6Data } = useQuery({
        queryKey: ['step6Data'],
        queryFn: fetchStep6,
    });

    // 2) save mutation
    const saveMutation = useMutation({
        mutationFn: saveStep6,
        onSuccess: () => {
            toast.success(t('messages.saveSuccess'));
            queryClient.invalidateQueries(['step6Data']);
        },
        onError: () => {
            toast.error(t('messages.saveError'));
        }
    });

    // 3) estado local
    const [form, setForm] = useState({ assets: [] });
    const initialized = useRef(false);

    useEffect(() => {
        if (step6Data && !initialized.current) {
            const initList = step6Data.assets ?? data.assets ?? [];
            setForm({ assets: initList });
            updateData({ assets: initList });
            initialized.current = true;
        }
    }, [step6Data, data, updateData]);

    // 4) sincronizar wizard
    useEffect(() => {
        updateData({ assets: form.assets });
    }, [form.assets, updateData]);

    // 5) lógica de filas (igual que antes)
    const [hasMovableExclusion, setHasMovableExclusion] = useState(false);
    const [hasImmutableExclusion, setHasImmutableExclusion] = useState(false);
    useEffect(() => {
        setHasMovableExclusion(form.assets.some(a => a.asset_type === 'MUEBLE' && a.exclusion));
        setHasImmutableExclusion(form.assets.some(a => a.asset_type === 'INMUEBLE' && a.exclusion));
    }, [form.assets]);

    const persist = (assets) => setForm({ assets });
    const addRow = () => persist([...form.assets, EMPTY_ASSET]);
    const removeRow = (idx) => persist(form.assets.filter((_, i) => i !== idx));
    const handleChange = (idx, field, value) => {
        persist(form.assets.map((a, i) => i === idx ? { ...a, [field]: value } : a));
    };
    const handleExclusionChange = (idx) => {
        const assetType = form.assets[idx].asset_type;
        persist(form.assets.map((a, i) => {
            if (i === idx) return { ...a, exclusion: !a.exclusion };
            if (a.asset_type === assetType) return { ...a, exclusion: false };
            return a;
        }));
    };
    const handleCommercialValueBlur = (idx, e) => {
        const val = e.target.value.replace(/[^0-9.,]/g, '');
        handleChange(idx, 'commercial_value', val);
    };
    const toggleMeasure = (idx, option) => {
        const none = MEASURE_OPTIONS(t)[3];
        const current = form.assets[idx].legal_measure || [];
        let next;
        if (option === none) {
            next = current.includes(none) ? [] : [none];
        } else {
            next = current.includes(option)
                ? current.filter(m => m !== option)
                : [...current.filter(m => m !== none), option];
        }
        handleChange(idx, 'legal_measure', next);
    };

    // 6) Guardar en BD
    const handleSave = () => saveMutation.mutate(form.assets);

    // 7) Siguiente (envía al wizard y avanza)
    const handleSubmit = (e) => {
        e.preventDefault();
        // aquí puedes volver a validar si es necesario
        const payload = form.assets.map(a => ({
            asset_type: a.asset_type,
            name: a.name,
            identification: a.identification,
            lien: a.lien,
            affectation: a.affectation,
            legal_measure: a.legal_measure,
            patrimonial_society: a.patrimonial_society,
            commercial_value: toNum(a.commercial_value),
            exclusion: a.exclusion,
        }));
        onNext({ assets: payload });
    };


    const MEASURE_NONE = MEASURE_OPTIONS(t)[3];
    const renderExclusionField = (asset, idx) => {
        const isMovable = asset.asset_type === 'MUEBLE';
        const isImmutable = asset.asset_type === 'INMUEBLE';
        const show =
            (isMovable && !hasMovableExclusion) ||
            (isImmutable && !hasImmutableExclusion) ||
            asset.exclusion;
        if (!show) return null;
        return (
            <div className="col-12">
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={asset.exclusion || false}
                        onChange={() => handleExclusionChange(idx)}
                        id={`exclusion-${idx}`}
                    />
                    <label className="form-check-label" htmlFor={`exclusion-${idx}`}>
                        {t('form.exclusion.label')}
                    </label>
                    {asset.exclusion && (
                        <div className="mt-2 p-2 bg-light rounded small">
                            <p>{t('form.exclusion.legalReferencesTitle')}</p>
                            <ul>
                                {t.rich('form.exclusion.legalReferences', {
                                    li: chunks => <li>{chunks}</li>
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
                {form.assets.map((asset, idx) => (
                    <div key={idx} className="border p-3 mb-4 rounded shadow-sm bg-light">
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label fw-bold">{t('form.assetType.label')}</label>
                                <select
                                    className="form-select"
                                    value={asset.asset_type}
                                    onChange={e => handleChange(idx, 'asset_type', e.target.value)}
                                    required
                                >
                                    <option value="">{t('form.assetType.placeholder')}</option>
                                    <option value="MUEBLE">{t('form.assetType.options.furniture')}</option>
                                    <option value="INMUEBLE">{t('form.assetType.options.realEstate')}</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">{t('form.description.label')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={asset.name}
                                    onChange={e => handleChange(idx, 'name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">{t('form.identification.label')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={asset.identification}
                                    onChange={e => handleChange(idx, 'identification', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">{t('form.lien.label')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={asset.lien}
                                    onChange={e => handleChange(idx, 'lien', e.target.value)}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">{t('form.affectation.label')}</label>
                                <select
                                    className="form-select"
                                    value={asset.affectation}
                                    onChange={e => handleChange(idx, 'affectation', e.target.value)}
                                >
                                    {AFFECT_OPTIONS(t).map((opt, i) => (
                                        <option key={i} value={opt}>
                                            {opt || t('form.affectation.placeholder')}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">{t('form.measure.label')}</label>
                                <div className="d-flex flex-wrap gap-2">
                                    {MEASURE_OPTIONS(t).map((opt, i) => {
                                        const disabled =
                                            (opt === MEASURE_NONE &&
                                                asset.legal_measure?.length > 0 &&
                                                !asset.legal_measure.includes(MEASURE_NONE)) ||
                                            (opt !== MEASURE_NONE &&
                                                asset.legal_measure?.includes(MEASURE_NONE));
                                        return (
                                            <div className="form-check form-check-inline" key={i}>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`measure-${idx}-${i}`}
                                                    checked={asset.legal_measure?.includes(opt) || false}
                                                    onChange={() => toggleMeasure(idx, opt)}
                                                    disabled={disabled}
                                                />
                                                <label className="form-check-label" htmlFor={`measure-${idx}-${i}`}>
                                                    {opt}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">{t('form.commercialValue.label')}</label>
                                <input
                                    type="text"
                                    className="form-control text-end"
                                    value={asset.commercial_value}
                                    onChange={e => handleChange(idx, 'commercial_value', e.target.value)}
                                    onBlur={e => handleCommercialValueBlur(idx, e)}
                                    inputMode="decimal"
                                    required
                                />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">{t('form.patrimonialSociety.label')}</label>
                                <textarea
                                    className="form-control"
                                    rows={2}
                                    placeholder={t('form.patrimonialSociety.placeholder')}
                                    value={asset.patrimonial_society}
                                    onChange={e => handleChange(idx, 'patrimonial_society', e.target.value)}
                                />
                            </div>
                            {renderExclusionField(asset, idx)}
                        </div>
                        <div className="d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-sm btn-danger mt-2"
                                onClick={() => removeRow(idx)}
                            >
                                {t('form.actions.delete')}
                            </button>
                        </div>
                    </div>
                ))}
                <div className="mb-3">
                    <button type="button" className="btn btn-outline-success" onClick={addRow}>
                        {t('form.actions.addAsset')}
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
