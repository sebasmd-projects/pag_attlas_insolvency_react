'use client';

import { useState } from 'react';

const AFFECT_OPTIONS = ['', 'No tiene', 'N-A', 'Otro'];
const MEASURE_OPTIONS = [
    'Embargo',
    'Secuestre',
    'No tiene',
];

export default function Step5Bienes({ data, onNext, onBack, isSubmitting }) {
    const [bienes, setBienes] = useState(data.assets || []);

    const parseLocaleNumber = (value) => {
        const cleaned = value.replace(/\./g, '').replace(',', '.');
        return Number(cleaned);
    };

    const formatToCOP = (value) => {
        const numeric = parseLocaleNumber(value);
        if (isNaN(numeric)) return value;
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numeric);
    };

    const handleChange = (index, field, value) => {
        const updated = [...bienes];
        updated[index][field] = value;
        setBienes(updated);
    };

    const addRow = () => {
        setBienes([
            ...bienes,
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
                exclusion: '',
            },
        ]);
    };

    const removeRow = (index) => {
        const updated = [...bienes];
        updated.splice(index, 1);
        setBienes(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const mapped = bienes.map((b) => ({
            ...b,
            affectation: b.affectation === 'Otro' ? b.affectation_other : b.affectation,
        }));
        onNext({ assets: mapped });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h5>Relación de Bienes</h5>

            {bienes.map((bien, index) => (
                <div key={index} className="border p-3 mb-4 rounded shadow-sm bg-light">
                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label">Tipo de bien</label>
                            <select
                                className="form-select"
                                value={bien.asset_type}
                                onChange={(e) => handleChange(index, 'asset_type', e.target.value)}
                            >
                                <option value="">Seleccionar...</option>
                                <option value="Mueble">Mueble</option>
                                <option value="Inmueble">Inmueble</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Bien / Descripción</label>
                            <input
                                type="text"
                                className="form-control"
                                value={bien.description}
                                onChange={(e) => handleChange(index, 'description', e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Identificación</label>
                            <input
                                type="text"
                                className="form-control"
                                value={bien.identification}
                                onChange={(e) => handleChange(index, 'identification', e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Gravamen</label>
                            <input
                                type="text"
                                className="form-control"
                                value={bien.lien}
                                onChange={(e) => handleChange(index, 'lien', e.target.value)}
                                placeholder="(Opcional)"
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Afectación</label>
                            <select
                                className="form-select"
                                value={bien.affectation}
                                onChange={(e) => handleChange(index, 'affectation', e.target.value)}
                            >
                                {AFFECT_OPTIONS.map((opt, i) => (
                                    <option key={i} value={opt}>
                                        {opt || 'Seleccionar...'}
                                    </option>
                                ))}
                            </select>
                            {bien.affectation === 'Otro' && (
                                <input
                                    type="text"
                                    className="form-control mt-2"
                                    placeholder="Especificar otra afectación"
                                    value={bien.affectation_other || ''}
                                    onChange={(e) => handleChange(index, 'affectation_other', e.target.value)}
                                />
                            )}
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Medidas Cautelares</label>
                            <div className="d-flex flex-wrap gap-2">
                                {MEASURE_OPTIONS.map((opt) => (
                                    <div className="form-check form-check-inline" key={opt}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`medida-${index}-${opt}`}
                                            checked={bien.legal_measure.includes(opt)}
                                            onChange={(e) => {
                                                const selected = bien.legal_measure.includes(opt)
                                                    ? bien.legal_measure.filter(m => m !== opt)
                                                    : [...bien.legal_measure, opt];
                                                handleChange(index, 'legal_measure', selected);
                                            }}
                                        />
                                        <label className="form-check-label" htmlFor={`medida-${index}-${opt}`}>
                                            {opt}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Valor comercial</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formatToCOP(bien.commercial_value)}
                                onChange={(e) => handleChange(index, 'commercial_value', e.target.value)}
                            />
                        </div>

                        <div className="col-md-12">
                            <label className="form-label">Sociedad conyugal / patrimonial</label>
                            <textarea
                                className="form-control"
                                rows={2}
                                value={bien.patrimonial_society}
                                onChange={(e) => handleChange(index, 'patrimonial_society', e.target.value)}
                            />
                        </div>

                        <div className="col-md-12">
                            <label className="form-label">Exclusión de un bien (Por vivienda digna)</label>
                            <textarea
                                className="form-control"
                                rows={2}
                                value={bien.exclusion}
                                onChange={(e) => handleChange(index, 'exclusion', e.target.value)}
                            />
                        </div>

                        <div className="col-12 d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-sm btn-danger mt-2"
                                onClick={() => removeRow(index)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            <div className="mb-3">
                <button type="button" className="btn btn-outline-success" onClick={addRow}>
                    + Agregar bien
                </button>
            </div>

            <div className="d-flex justify-content-between mt-4">
                <button type="button" className="btn btn-secondary" onClick={onBack}>
                    Atrás
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    Siguiente
                </button>
            </div>
        </form>
    );
}
