// src/app/[locale]/platform/(home)/steps/Step5Bienes.jsx

'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { FaArrowCircleLeft, FaArrowCircleRight, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

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

export default function Step5Bienes({ data, onNext, onBack, isSubmitting }) {
    const initialAssets = data.assets && data.assets.length > 0 ? data.assets : [];
    const [form, setForm] = useState({ assets: initialAssets });
    const [hasMovableExclusion, setHasMovableExclusion] = useState(false);
    const [hasImmutableExclusion, setHasImmutableExclusion] = useState(false);
    const t = useTranslations('Platform.pages.home.wizard.steps.step5');
    const wizardButton = useTranslations('Platform.pages.home.wizard.buttons');

    const MEASURE_OPTIONS_BLOCK = MEASURE_OPTIONS(t)[3];

    useEffect(() => {
        const movableExclusion = initialAssets.some(a =>
            a.asset_type === 'Furniture' && a.exclusion === true
        );
        const immutableExclusion = initialAssets.some(a =>
            a.asset_type === 'Real Estate' && a.exclusion === true
        );
        setHasMovableExclusion(movableExclusion);
        setHasImmutableExclusion(immutableExclusion);
    }, [data.assets]);


    const handleExclusionChange = (index, assetType) => {
        const updated = [...form.assets];
        const currentExclusion = updated[index].exclusion;

        if (!currentExclusion) {
            updated.forEach((asset, i) => {
                if (i !== index && asset.asset_type === assetType) {
                    asset.exclusion = false;
                }
            });
        }

        updated[index].exclusion = !currentExclusion;

        if (assetType === 'Furniture') {
            setHasMovableExclusion(!currentExclusion);
        } else if (assetType === 'Real Estate') {
            setHasImmutableExclusion(!currentExclusion);
        }

        setForm({ assets: updated });
    };

    const legalReferences = (
        <div className="mt-2 p-2 bg-light rounded small">
            <FaInfoCircle className="me-1" />
            <p>
                {t('form.exclusion.legalReferencesTitle')}
            </p>
            <p>
                {t('form.exclusion.legalReferencesDescription')}
            </p>
            <ul>
                {t.rich('form.exclusion.legalReferences', {
                    li: (chunks) => <li>{chunks}</li>,
                })}
            </ul>

        </div>
    );

    const renderExclusionField = (asset, index) => {
        const isMovable = asset.asset_type === 'Furniture';
        const isImmutable = asset.asset_type === 'Real Estate';
        const showCheckbox =
            (isMovable && !hasMovableExclusion) ||
            (isImmutable && !hasImmutableExclusion) ||
            asset.exclusion;

        if (!showCheckbox) return null;

        return (
            <div className="col-md-12">
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={asset.exclusion || false}
                        onChange={() => handleExclusionChange(index, asset.asset_type)}
                        id={`exclusion-${index}`}
                    />
                    <label className="form-check-label" htmlFor={`exclusion-${index}`}>
                        {t('form.exclusion.label')}
                        {asset.exclusion && legalReferences}
                    </label>
                </div>
            </div>
        );
    };

    const handleChange = (index, field, value) => {
        const updated = [...form.assets];
        if (field === 'commercial_value') {
            updated[index][field] = value.replace(/[^0-9.,]/g, '');
        } else {
            updated[index][field] = value;
        }
        setForm({ assets: updated });
    };

    const handleCommercialValueBlur = (index, e) => {
        const { value } = e.target;
        const updated = [...form.assets];
        updated[index]['commercial_value'] = value;
        setForm({ assets: updated });
    };

    const handleCheckboxChange = (index, option) => {
        const updated = [...form.assets];
        let currentMeasures = updated[index].legal_measure || [];
        const noneOption = MEASURE_OPTIONS_BLOCK;
        if (option === noneOption) {
            if (currentMeasures.includes(noneOption)) {
                currentMeasures = currentMeasures.filter((m) => m !== noneOption);
            } else {
                currentMeasures = [noneOption];
            }
        } else {
            if (currentMeasures.includes(noneOption)) {
                currentMeasures = currentMeasures.filter((m) => m !== noneOption);
            }
            if (currentMeasures.includes(option)) {
                currentMeasures = currentMeasures.filter((m) => m !== option);
            } else {
                currentMeasures = [...currentMeasures, option];
            }
        }
        updated[index].legal_measure = currentMeasures;
        setForm({ assets: updated });
    };

    const isNoneSelected = (asset) => {
        const noneOption = MEASURE_OPTIONS_BLOCK;
        return asset.legal_measure && asset.legal_measure.includes(noneOption);
    };

    const addRow = () => {
        setForm({
            assets: [
                ...form.assets,
                {
                    asset_type: '',
                    description: '',
                    identification: '',
                    lien: '',
                    affectation: '',
                    affectation_other: '',
                    legal_measure: [],
                    patrimonial_society: '',
                    commercial_value: '',
                    exclusion: false,
                },
            ],
        });
    };

    const removeRow = (index) => {
        const updated = [...form.assets];
        if (updated.length <= 1) return;
        updated.splice(index, 1);
        setForm({ assets: updated });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.assets.length > 0) {
            const invalidAsset = form.assets.some(
                (a) =>
                    !a.asset_type ||
                    !a.description ||
                    !a.identification ||
                    !a.commercial_value
            );
            if (invalidAsset) {
                toast.error(t('form.error'));
                return;
            }
        }
        const mapped = form.assets.map((asset) => ({
            ...asset,
        }));
        onNext({ assets: mapped });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h5 className="mb-4">{t('title')}</h5>
            {form.assets.length > 0 ? (
                form.assets.map((asset, index) => (
                    <div key={index} className="border p-3 mb-4 rounded shadow-sm bg-light">
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label">{t('form.assetType.label')}</label>
                                <select
                                    className="form-select"
                                    value={asset.asset_type}
                                    onChange={(e) =>
                                        handleChange(index, 'asset_type', e.target.value)
                                    }
                                >
                                    <option value="">{t('form.assetType.placeholder')}</option>
                                    <option value="Furniture">
                                        {t('form.assetType.options.furniture')}
                                    </option>
                                    <option value="Real Estate">
                                        {t('form.assetType.options.realEstate')}
                                    </option>
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">{t('form.description.label')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={asset.description}
                                    required
                                    onChange={(e) =>
                                        handleChange(index, 'description', e.target.value)
                                    }
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">{t('form.identification.label')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    value={asset.identification}
                                    onChange={(e) =>
                                        handleChange(index, 'identification', e.target.value)
                                    }
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">{t('form.lien.label')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={asset.lien}
                                    onChange={(e) =>
                                        handleChange(index, 'lien', e.target.value)
                                    }
                                    placeholder={t('form.lien.placeholder')}
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">{t('form.affectation.label')}</label>
                                <select
                                    className="form-select"
                                    value={asset.affectation}
                                    onChange={(e) =>
                                        handleChange(index, 'affectation', e.target.value)
                                    }
                                >
                                    {AFFECT_OPTIONS(t).map((opt, i) => (
                                        <option key={i} value={opt}>
                                            {opt ? opt : t('form.affectation.placeholder')}
                                        </option>
                                    ))}
                                </select>
                                {asset.affectation === t('form.affectation.options.other') && (
                                    <input
                                        type="text"
                                        required
                                        className="form-control mt-2"
                                        placeholder={t('form.affectation.options.otherPlaceholder')}
                                        value={asset.affectation_other || ''}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                'affectation_other',
                                                e.target.value
                                            )
                                        }
                                    />
                                )}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">{t('form.measure.label')}</label>
                                <div className="d-flex flex-wrap gap-2">
                                    {MEASURE_OPTIONS(t).map((opt, i) => {
                                        const disableOther =
                                            isNoneSelected(asset) &&
                                            opt !== MEASURE_OPTIONS_BLOCK;
                                        const disableNone =
                                            asset.legal_measure &&
                                            asset.legal_measure.some(
                                                (m) => m !== MEASURE_OPTIONS_BLOCK
                                            ) &&
                                            opt === MEASURE_OPTIONS_BLOCK;
                                        return (
                                            <div className="form-check form-check-inline" key={i}>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`measure-${index}-${opt}`}
                                                    checked={
                                                        asset.legal_measure &&
                                                        asset.legal_measure.includes(opt)
                                                    }
                                                    onChange={() =>
                                                        handleCheckboxChange(index, opt)
                                                    }
                                                    disabled={disableOther || disableNone}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor={`measure-${index}-${opt}`}
                                                >
                                                    {opt}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">{t('form.commercialValue.label')}</label>
                                <input
                                    type="text"
                                    name="commercial_value"
                                    className="form-control text-end"
                                    value={asset.commercial_value}
                                    onChange={(e) =>
                                        handleChange(index, 'commercial_value', e.target.value)
                                    }
                                    onBlur={(e) => handleCommercialValueBlur(index, e)}
                                    inputMode="decimal"
                                    onWheel={(e) => e.target.blur()}
                                    required
                                />
                            </div>

                            <div className="col-md-12">
                                <label className="form-label">
                                    {t('form.patrimonialSociety.label')}
                                </label>
                                <textarea
                                    className="form-control"
                                    placeholder={t('form.patrimonialSociety.placeholder')}
                                    rows={2}
                                    value={asset.patrimonial_society}
                                    onChange={(e) =>
                                        handleChange(index, 'patrimonial_society', e.target.value)
                                    }
                                />
                            </div>

                            <div className="col-md-12">
                                {renderExclusionField(asset, index)}
                            </div>
                        </div>
                        <div className="col-12 d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-sm btn-danger mt-2"
                                onClick={() => removeRow(index)}
                            >
                                {t('form.actions.delete')}
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="mb-3">
                    <button type="button" className="btn btn-outline-success" onClick={addRow}>
                        {t('form.actions.addAsset')}
                    </button>
                </div>
            )}
            {form.assets.length > 0 && (
                <div className="mb-3">
                    <button type="button" className="btn btn-outline-success" onClick={addRow}>
                        {t('form.actions.addAsset')}
                    </button>
                </div>
            )}
            <div className="d-flex justify-content-between mt-4">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onBack}
                    disabled={isSubmitting}
                >
                    <FaArrowCircleLeft /> <span className="ms-2">{wizardButton('back')}</span>
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {wizardButton('processing')}
                        </>
                    ) : (
                        <>
                            {wizardButton('next')} <FaArrowCircleRight className='ms-2' />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
