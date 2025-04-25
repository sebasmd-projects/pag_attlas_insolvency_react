// src/app/[locale]/platform/(home)/steps/Step7JudicialProcesses.jsx

'use client';

import { useTranslations } from 'next-intl';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { MdSaveAs } from 'react-icons/md';
import { toast } from 'react-toastify';

import TitleComponent from '@/components/micro-components/title';
import SubTitleComponent from '@/components/micro-components/sub_title';

/* ──────────── Constantes ──────────── */
const EMPTY_ROW = {
    id: null,
    affectation: '',
    court: '',
    description: '',
    case_code: '',
    process_status: [],
};

const STATUS_OPTIONS = (t) => [
    t('form.processStatus.options.seizure'),
    t('form.processStatus.options.sequesteredPending'),
    t('form.processStatus.options.lawsuitInProgress'),
    t('form.processStatus.options.admissionOrder'),
    t('form.processStatus.options.auction'),
    t('form.processStatus.options.processCompleted'),
];

async function GetStep7() {
    const { data } = await axios.get('/api/platform/insolvency-form/get-data/?step=7');
    return data;
}

async function SaveStep7(processes) {
    // 1) limpiamos ids nulos  –  2) convertimos los estados a string
    const body = {
        judicial_processes: processes.map((p) => {
            const payload = {
                affectation: p.affectation,
                court: p.court,
                description: p.description,
                case_code: p.case_code,
                process_status: Array.isArray(p.process_status)
                    ? p.process_status.join(',')          // <-- “SEIZURE,AUCTION”
                    : p.process_status || '',
            };
            if (p.id) payload.id = p.id;              // solo incluir si existe
            return payload;
        }),
    };

    return axios.patch('/api/platform/insolvency-form/?step=7', body);
}

export default function Step7JudicialProcesses({ data, updateData, onNext }) {
    const t = useTranslations('Platform.pages.home.wizard.steps.step7');
    const queryClient = useQueryClient();

    const { data: step7Data } = useQuery({
        queryKey: ['step7Data'],
        queryFn: GetStep7,
        refetchOnMount: true,
    });

    // Estado local
    const [form, setForm] = useState({ judicial_processes: [] });

    const initialized = useRef(false);
    useEffect(() => {
        if (step7Data?.judicial_processes && !initialized.current) {
            const initList = step7Data.judicial_processes.map(p => ({
                id: p.id,
                affectation: p.affectation,
                court: p.court,
                description: p.description,
                case_code: p.case_code,
                process_status: Array.isArray(p.process_status)
                    ? p.process_status
                    : p.process_status
                        ? p.process_status.split(',').map(s => s.trim())
                        : [],
            }));
            setForm({ judicial_processes: initList });
            updateData({ judicial_processes: initList });
            initialized.current = true;
        }
    }, [step7Data, data, updateData]);

    // Sincronizar con wizard global
    useEffect(() => {
        updateData({ judicial_processes: form.judicial_processes });
    }, [form.judicial_processes, updateData]);

    const saveMutation = useMutation({
        mutationFn: () => SaveStep7(form.judicial_processes),
        onSuccess: () => {
            toast.success(t('messages.saveSuccess'));
            queryClient.invalidateQueries(['step7Data']);
        },
        onError: (err) => {
            const msg =
                err?.response?.data?.detail || t('messages.saveError');
            toast.error(msg);
        },
    });

    const handleSave = () => saveMutation.mutate();

    // CRUD filas
    const persist = useCallback(list => setForm({ judicial_processes: list }), []);
    const addRow = () => persist([...form.judicial_processes, EMPTY_ROW]);
    const removeRow = idx => persist(form.judicial_processes.filter((_, i) => i !== idx));

    const handleChange = (idx, field, value) => {
        persist(
            form.judicial_processes.map((p, i) => i === idx ? { ...p, [field]: value } : p)
        );
    };

    const STATUS_NONE = STATUS_OPTIONS(t)[5];
    const toggleStatus = (idx, option) => {
        const current = form.judicial_processes[idx].process_status || [];
        let next;
        if (option === STATUS_NONE) {
            next = current.includes(STATUS_NONE) ? [] : [STATUS_NONE];
        } else {
            next = current.includes(option)
                ? current.filter(s => s !== option)
                : [...current.filter(s => s !== STATUS_NONE), option];
        }
        handleChange(idx, 'process_status', next);
    };

    // Envío del paso
    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = form.judicial_processes.map(p => {
            const obj = {
                affectation: p.affectation,
                court: p.court,
                description: p.description,
                case_code: p.case_code,
                process_status: p.process_status,
            };
            if (p.id) obj.id = p.id;
            return obj;
        });
        onNext({ judicial_processes: payload });
    };

    return (
        <>
            <TitleComponent title={t('title')} />
            <SubTitleComponent t={t} sub_title="subTitle" />

            <form onSubmit={handleSubmit} className="row" id="wizard-step-form">
                {form.judicial_processes.map((proc, idx) => (
                    <div
                        key={idx}
                        className="border p-3 mb-4 rounded shadow-sm bg-light"
                    >
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label">
                                    {t('form.affectation')}
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={proc.affectation}
                                    onChange={(e) =>
                                        handleChange(idx, 'affectation', e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">
                                    {t('form.court')}
                                </label>
                                <textarea
                                    className="form-control"
                                    rows={2}
                                    value={proc.court}
                                    onChange={(e) =>
                                        handleChange(idx, 'court', e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">
                                    {t('form.description')}
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={proc.description}
                                    onChange={(e) =>
                                        handleChange(idx, 'description', e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">
                                    {t('form.caseCode')}
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={proc.case_code}
                                    onChange={(e) =>
                                        handleChange(idx, 'case_code', e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="col-md-8">
                                <label className="form-label">
                                    {t('form.processStatus.label')}
                                </label>
                                <div className="d-flex flex-wrap gap-2">
                                    {STATUS_OPTIONS(t).map((opt, i) => {
                                        const disabled =
                                            (opt === STATUS_NONE &&
                                                proc.process_status.length > 0 &&
                                                !proc.process_status.includes(STATUS_NONE)) ||
                                            (opt !== STATUS_NONE &&
                                                proc.process_status.includes(STATUS_NONE));
                                        return (
                                            <div
                                                className="form-check form-check-inline"
                                                key={opt}
                                            >
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`status-${idx}-${i}`}
                                                    checked={proc.process_status.includes(opt)}
                                                    disabled={disabled}
                                                    onChange={() => toggleStatus(idx, opt)}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor={`status-${idx}-${i}`}
                                                >
                                                    {opt}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="col-12 d-flex justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-danger mt-2"
                                    onClick={() => removeRow(idx)}
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
            </form>

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
        </>
    );
}

Step7JudicialProcesses.propTypes = {
    data: PropTypes.shape({
        judicial_processes: PropTypes.array,
    }),
    updateData: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
};
