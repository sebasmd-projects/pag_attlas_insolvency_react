'use client';

import { useState } from 'react';

export default function Step10Alimentos({ data, onNext, onBack, isSubmitting }) {
    const [hasAlimony, setHasAlimony] = useState(
        typeof data.has_child_support !== 'undefined' ? String(data.has_child_support) : ''
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        if (hasAlimony === '') {
            alert('Por favor indica si tienes obligaciones alimentarias');
            return;
        }

        onNext({
            has_child_support: hasAlimony === 'true',
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h5>Obligaciones Alimentarias</h5>

            <div className="mb-3">
                <label className="form-label">¿Tienes obligaciones alimentarias?</label>
                <select
                    className="form-select"
                    value={hasAlimony}
                    onChange={(e) => setHasAlimony(e.target.value)}
                    required
                >
                    <option value="">Seleccionar...</option>
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                </select>
            </div>

            <div className="d-flex justify-content-between mt-4">
                <button type="button" className="btn btn-secondary" onClick={onBack}>
                    Atrás
                </button>
                <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                    Finalizar
                </button>
            </div>
        </form>
    );
}
