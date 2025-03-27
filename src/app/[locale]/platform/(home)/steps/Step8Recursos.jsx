'use client';

import { useState } from 'react';

// TODO: On add new, can select "Discapacity"
// TODO: Subsistency => Legal support

const DEFAULT_CATEGORIES = [
    'Gastos de subsistencia',
    'Gastos del proceso de insolvencia económica',
    'Ingresos',
    'Descuentos',
];

export default function Step8Recursos({ data, onNext, onBack, isSubmitting }) {
    const initialResources = data.resources || [];

    const [resources, setResources] = useState(() => {
        const grouped = {};
        DEFAULT_CATEGORIES.forEach((cat) => {
            grouped[cat] = initialResources
                .filter((r) => r.category === cat)
                .map((r) => ({ ...r }));
        });
        return grouped;
    });

    const handleChange = (category, index, field, value) => {
        const updated = { ...resources };
        updated[category][index][field] = value;
        setResources(updated);
    };

    const addRow = (category) => {
        setResources((prev) => ({
            ...prev,
            [category]: [...prev[category], { label: '', amount: '' }],
        }));
    };

    const removeRow = (category, index) => {
        const updated = { ...resources };
        updated[category].splice(index, 1);
        setResources(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const allResources = Object.entries(resources).flatMap(([category, items]) =>
            items.map((item) => ({
                ...item,
                category,
                amount: parseFloat(item.amount || 0),
            }))
        );
        onNext({ resources: allResources });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h5>Recursos disponibles y gastos esenciales</h5>

            {DEFAULT_CATEGORIES.map((category) => (
                <div key={category} className="mb-4">
                    <h6>{category}</h6>
                    <div className="table-responsive">
                        <table className="table table-bordered align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Valor</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(resources[category] || []).map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={item.label}
                                                onChange={(e) =>
                                                    handleChange(category, index, 'label', e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={item.amount}
                                                onChange={(e) =>
                                                    handleChange(category, index, 'amount', e.target.value)
                                                }
                                            />
                                        </td>
                                        <td className="text-center">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger"
                                                onClick={() => removeRow(category, index)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <button
                        type="button"
                        className="btn btn-outline-success btn-sm"
                        onClick={() => addRow(category)}
                    >
                        Añadir más
                    </button>
                </div>
            ))}

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
