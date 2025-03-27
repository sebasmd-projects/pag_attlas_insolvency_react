'use client';

import { useState } from 'react';

const TIPO_INGRESO = [
    { label: 'Asalariado', value: 'SALARIED' },
    { label: 'Independiente', value: 'INDEPENDENT' },
    { label: 'Pensionado', value: 'PENSIONER' },
    { label: 'Desempleado', value: 'UNEMPLOYED' },
    { label: 'Otro', value: 'OTHER' },
];

// TODO If other specify which

export default function Step7Ingresos({ data, onNext, onBack, isSubmitting }) {
    const [ingreso, setIngreso] = useState({
        type: data?.income_documents?.[0]?.type || '',
        file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!ingreso.type) {
            alert('Debes seleccionar el tipo de ingreso');
            return;
        }

        onNext({
            income_documents: [
                {
                    type: ingreso.type,
                    file: ingreso.file || null, // Puede ir null si no se subió nada
                },
            ],
        });
    };

    const handleFileChange = (e) => {
        setIngreso((prev) => ({
            ...prev,
            file: e.target.files[0] || null,
        }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h5>Relación de Ingresos</h5>

            <div className="mb-3">
                <label className="form-label">Tipo de ingreso</label>
                <select
                    className="form-select"
                    value={ingreso.type}
                    onChange={(e) => setIngreso({ ...ingreso, type: e.target.value })}
                    required
                >
                    <option value="">Seleccionar...</option>
                    {TIPO_INGRESO.map((op) => (
                        <option key={op.value} value={op.value}>
                            {op.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Valor ingresos</label>
                <input
                    type="text"
                    className="form-control"
                    accept="application/pdf, image/*\"
                    onChange={handleFileChange}
                />
                {ingreso.file && (
                    <div className="form-text">
                        Archivo seleccionado: {ingreso.file.name}
                    </div>
                )}
            </div>

            <div className="d-flex justify-content-between">
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
