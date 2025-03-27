'use client';

import { useState } from 'react';

// TODO: Item (Conyuge, Declaración Marital de hecho, Unión libre, No aplica)

export default function Step9Sociedad({ data, onNext, onBack, isSubmitting }) {
    const [estado, setEstado] = useState(data.marital_status || 'no');
    const [pareja, setPareja] = useState({
        partner_document: data.partner_document || '',
        partner_name: data.partner_name || '',
        partner_lastname: data.partner_lastname || '',
        partner_email: data.partner_email || '',
        partner_phone: data.partner_phone || '',
        partner_relationship_duration: data.partner_relationship_duration || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPareja((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const baseData = { marital_status: estado };
        if (estado === 'yes') {
            onNext({ ...baseData, ...pareja });
        } else {
            onNext(baseData);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h5>Sociedad Conyugal / Patrimonial</h5>

            <div className="mb-3">
                <label className="form-label">¿Tiene sociedad conyugal o patrimonial?</label>
                <select
                    className="form-select"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                >
                    <option value="no">No</option>
                    <option value="yes">Sí</option>
                </select>
            </div>

            {estado === 'yes' && (
                <div className="row g-3">
                    <div className="col-md-4">
                        <label className="form-label">Cédula de la pareja</label>
                        <input
                            type="text"
                            className="form-control"
                            name="partner_document"
                            value={pareja.partner_document}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Nombres</label>
                        <input
                            type="text"
                            className="form-control"
                            name="partner_name"
                            value={pareja.partner_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Apellidos</label>
                        <input
                            type="text"
                            className="form-control"
                            name="partner_lastname"
                            value={pareja.partner_lastname}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Correo</label>
                        <input
                            type="email"
                            className="form-control"
                            name="partner_email"
                            value={pareja.partner_email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Celular</label>
                        <input
                            type="text"
                            className="form-control"
                            name="partner_phone"
                            value={pareja.partner_phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-12">
                        <label className="form-label">¿Desde hace cuánto?</label>
                        <input
                            type="text"
                            className="form-control"
                            name="partner_relationship_duration"
                            value={pareja.partner_relationship_duration}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            )}

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
