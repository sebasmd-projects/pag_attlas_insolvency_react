'use client';

import { useState } from 'react';

const ESTADOS_OPTIONS = [
    'Embargo',
    'Secuestre pendiente',
    'Demanda en curso',
    'Auto admisorio',
    'Proceso terminado',
];

export default function Step6Procesos({ data, onNext, onBack, isSubmitting }) {
    const [procesos, setProcesos] = useState(data.processes || []);

    const handleChange = (index, field, value) => {
        const updated = [...procesos];
        updated[index][field] = value;
        setProcesos(updated);
    };

    const toggleCheckbox = (index, value) => {
        const current = procesos[index].status || [];
        let updatedStatus;

        if (value === 'Proceso terminado') {
            updatedStatus = current.includes('Proceso terminado')
                ? [] // deselecciona todo si lo quita
                : ['Proceso terminado'];
        } else {
            updatedStatus = current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current.filter((item) => item !== 'Proceso terminado'), value];
        }

        handleChange(index, 'status', updatedStatus);
    };

    const addRow = () => {
        setProcesos([
            ...procesos,
            {
                affectation: '',
                court: '',
                description: '',
                case_code: '',
                status: [],
            },
        ]);
    };

    const removeRow = (index) => {
        const updated = [...procesos];
        updated.splice(index, 1);
        setProcesos(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext({ processes: procesos });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h5>Relación de Procesos Judiciales</h5>

            {procesos.map((proceso, index) => (
                <div key={index} className="border p-3 mb-4 rounded shadow-sm bg-light">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">Afectación</label>
                            <input
                                type="text"
                                className="form-control"
                                value={proceso.affectation}
                                onChange={(e) => handleChange(index, 'affectation', e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Juzgado</label>
                            <input
                                type="text"
                                className="form-control"
                                value={proceso.court}
                                onChange={(e) => handleChange(index, 'court', e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Descripción</label>
                            <input
                                type="text"
                                className="form-control"
                                value={proceso.description}
                                onChange={(e) => handleChange(index, 'description', e.target.value)}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Radicado</label>
                            <input
                                type="text"
                                className="form-control"
                                value={proceso.case_code}
                                onChange={(e) => handleChange(index, 'case_code', e.target.value)}
                            />
                        </div>

                        <div className="col-md-8">
                            <label className="form-label">Estado del proceso</label>
                            <div className="d-flex flex-wrap gap-2">
                                {ESTADOS_OPTIONS.map((estado) => (
                                    <div className="form-check form-check-inline" key={estado}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`estado-${index}-${estado}`}
                                            checked={proceso.status.includes(estado)}
                                            disabled={
                                                proceso.status.includes('Proceso terminado') && estado !== 'Proceso terminado'
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
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            <div className="mb-3">
                <button type="button" className="btn btn-outline-success" onClick={addRow}>
                    + Agregar proceso
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
