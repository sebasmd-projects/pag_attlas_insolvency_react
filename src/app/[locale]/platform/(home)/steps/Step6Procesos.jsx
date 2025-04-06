// src/app/[locale]/platform/(home)/steps/Step6Procesos.jsx

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';

const getStatesOptions = (t) => [
    t('form.processStatus.options.seizure'),
    t('form.processStatus.options.sequesteredPending'),
    t('form.processStatus.options.lawsuitInProgress'),
    t('form.processStatus.options.admissionOrder'),
    t('form.processStatus.options.auction'),
    t('form.processStatus.options.processCompleted'),
];

export default function Step6Procesos({ data, onNext, onBack, isSubmitting }) {
    const t = useTranslations('Platform.pages.home.wizard.steps.step6');
    const wizardButton = useTranslations('Platform.pages.home.wizard.buttons');
    const statesOptions = getStatesOptions(t);
    const STATE_OPTIONS_BLOCK = statesOptions[5]

    const [form, setForm] = useState({
        processes: data.processes || [],
    });

    const handleChange = (index, field, value) => {
        const updated = [...form.processes];
        updated[index][field] = value;
        setForm({ processes: updated });
    };

    const toggleCheckbox = (index, value) => {
        const current = form.processes[index].status || [];
        let updatedStatus;
        if (value === STATE_OPTIONS_BLOCK) {
            updatedStatus = current.includes(STATE_OPTIONS_BLOCK) ? [] : [STATE_OPTIONS_BLOCK];
        } else {
            updatedStatus = current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current.filter((item) => item !== STATE_OPTIONS_BLOCK), value];
        }
        handleChange(index, 'status', updatedStatus);
    };

    const addRow = () => {
        setForm({
            processes: [
                ...form.processes,
                {
                    affectation: '',
                    court: '',
                    description: '',
                    case_code: '',
                    status: [],
                },
            ],
        });
    };

    const removeRow = (index) => {
        const updated = [...form.processes];
        updated.splice(index, 1);
        setForm({ processes: updated });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext({ processes: form.processes });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h5 className="mb-4">{t('title')}</h5>
            {form.processes.map((proceso, index) => (
                <div key={index} className="border p-3 mb-4 rounded shadow-sm bg-light">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">{t('form.affectation')}</label>
                            <input
                                type="text"
                                className="form-control"
                                value={proceso.affectation}
                                required
                                onChange={(e) => handleChange(index, 'affectation', e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">{t('form.court')}</label>
                            <textarea
                                className="form-control"
                                required
                                value={proceso.court}
                                rows={2}
                                onChange={(e) => handleChange(index, 'court', e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">{t('form.description')}</label>
                            <input
                                type="text"
                                required
                                className="form-control"
                                value={proceso.description}
                                onChange={(e) => handleChange(index, 'description', e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">{t('form.caseCode')}</label>
                            <input
                                type="text"
                                className="form-control"
                                value={proceso.case_code}
                                onChange={(e) => handleChange(index, 'case_code', e.target.value)}
                            />
                        </div>
                        <div className="col-md-8">
                            <label className="form-label">{t('form.processStatus.label')}</label>
                            <div className="d-flex flex-wrap gap-2">
                                {statesOptions.map((estado) => (
                                    <div className="form-check form-check-inline" key={estado}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`estado-${index}-${estado}`}
                                            checked={proceso.status.includes(estado)}
                                            disabled={
                                                estado === STATE_OPTIONS_BLOCK
                                                    ? proceso.status.some((item) => item !== STATE_OPTIONS_BLOCK)
                                                    : proceso.status.includes(STATE_OPTIONS_BLOCK)
                                            }
                                            onChange={() => toggleCheckbox(index, estado)}
                                        />
                                        <label className="form-check-label" htmlFor={`estado-${index}-${estado}`}>
                                            {estado}
                                        </label>
                                    </div>
                                ))}

                            </div>
                        </div>
                        <div className="col-12 d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-sm btn-danger mt-2"
                                onClick={() => removeRow(index)}
                            >
                                {t('form.delete')}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            <div className="mb-3">
                <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={addRow}
                >
                    {t('form.addProcess')}
                </button>
            </div>
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
