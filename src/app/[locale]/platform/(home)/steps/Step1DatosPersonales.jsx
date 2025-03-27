// src/app/[locale]/platform/steps/Step1DatosPersonales.jsx

'use client';

import { useEffect, useState } from 'react';

export default function Step1DatosPersonales({ data, onNext, onBack, isSubmitting }) {
    const [form, setForm] = useState({
        document_number: '',
        expedition_city: '',
        first_name: '',
        last_name: '',
        is_merchant: 'no',
    });

    useEffect(() => {
        fetch('/api/platform/auth/token-info')
            .then((res) => res.json())
            .then((data) => {
                if (data?.document_number) {
                    setForm((prev) => ({ ...prev, document_number: data.document_number }));
                }
            })
            .catch((err) => console.error('Error obteniendo cédula:', err));
    }, []);

    const removeAccents = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const handleChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;
        if (name === 'expedition_city' || name === 'first_name' || name === 'last_name') {
            newValue = removeAccents(value).toUpperCase();
        }

        setForm((prev) => ({ ...prev, [name]: newValue }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.expedition_city || !form.first_name || !form.last_name) {
            alert('Por favor complete todos los campos obligatorios');
            return;
        }
        onNext(form);
    };

    return (
        <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-4">
                <label className="form-label">Número de documento</label>
                <input
                    type="text"
                    name="document_number"
                    className="form-control"
                    value={form.document_number}
                    disabled
                />
            </div>

            <div className="col-md-4">
                <label className="form-label">Lugar de expedición</label>
                <input
                    type="text"
                    name="expedition_city"
                    className="form-control"
                    value={form.expedition_city}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="col-md-4">
                <label className="form-label">Nombres</label>
                <input
                    type="text"
                    name="first_name"
                    className="form-control"
                    value={form.first_name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="col-md-4">
                <label className="form-label">Apellidos</label>
                <input
                    type="text"
                    name="last_name"
                    className="form-control"
                    value={form.last_name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="col-md-4">
                <label className="form-label">¿Eres persona natural comerciante?</label>
                <select
                    className="form-select"
                    name="is_merchant"
                    value={form.is_merchant}
                    onChange={handleChange}
                >
                    <option value="no">No</option>
                    <option value="yes">Sí</option>
                </select>
            </div>

            <div className="col-12 d-flex justify-content-between">
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
