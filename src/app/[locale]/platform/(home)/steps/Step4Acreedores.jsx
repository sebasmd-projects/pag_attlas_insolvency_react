'use client';

import { useState } from 'react';

export default function Step4Acreedores({ data, onNext, onBack, isSubmitting }) {
    // Función para formatear números según locale es-CO
    const formatToLocaleNumber = (value) => {
        if (value === '' || value === null || value === undefined) return '';

        const numericValue = typeof value === 'string'
            ? parseFloat(value.replace(/\./g, '').replace(',', '.'))
            : value;

        if (isNaN(numericValue)) return '';

        return new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(numericValue);
    };

    // Inicializar estado con valores formateados
    const initialCreditors = data.creditors?.length
        ? data.creditors.map(c => ({
            ...c,
            capital_value: c.capital_value ? formatToLocaleNumber(c.capital_value) : ''
        }))
        : [{ name: '', nature: '', guarantee_support: '', capital_value: '', days_overdue: '' }];

    const [acreedores, setAcreedores] = useState(initialCreditors);

    // Función para normalizar texto (quitar acentos y poner en mayúsculas)
    const normalizeText = (str) => {
        return str.normalize("NFD").replace(/[^a-zA-Z0-9 ]/g, "").toUpperCase();
    };

    // Función para convertir el valor formateado a número
    const parseCurrencyToNumber = (value) => {
        if (!value) return 0;
        const numericString = value.replace(/\./g, '').replace(',', '.');
        return parseFloat(numericString);
    };

    // Manejar cambios en los inputs
    const handleChange = (index, e) => {
        const { name, value, files } = e.target;
        const updated = [...acreedores];

        if (name === 'capital_value') {
            // Permitir solo números, puntos y comas durante la edición
            const filteredValue = value.replace(/[^0-9.,]/g, '');
            updated[index][name] = filteredValue;
        } else if (name === 'name' || name === 'nature') {
            updated[index][name] = normalizeText(value);
        } else if (files) {
            updated[index][name] = files[0];
        } else {
            updated[index][name] = value;
        }

        setAcreedores(updated);
    };

    // Formatear el valor al salir del campo
    const handleBlur = (index, e) => {
        const { name, value } = e.target;
        if (name === 'capital_value') {
            const updated = [...acreedores];
            updated[index][name] = formatToLocaleNumber(value);
            setAcreedores(updated);
        }
    };

    // Agregar nueva fila de acreedor
    const addRow = () => {
        setAcreedores([...acreedores, {
            name: '',
            nature: '',
            guarantee_support: '',
            capital_value: '',
            days_overdue: ''
        }]);
    };

    // Eliminar fila de acreedor
    const removeRow = (index) => {
        if (acreedores.length <= 1) return;
        const updated = [...acreedores];
        updated.splice(index, 1);
        setAcreedores(updated);
    };

    // Enviar el formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar campos requeridos
        if (acreedores.some(a => !a.name || !a.nature)) {
            alert('Debes completar al menos el nombre y la naturaleza de cada acreedor');
            return;
        }

        // Preparar datos para enviar (convertir valores formateados a números)
        const creditorsToSend = acreedores.map(acreedor => ({
            ...acreedor,
            capital_value: parseCurrencyToNumber(acreedor.capital_value),
            days_overdue: acreedor.days_overdue ? parseInt(acreedor.days_overdue) : 0
        }));

        onNext({ creditors: creditorsToSend });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h5 className="mb-4">Relación de Acreedores</h5>

            <div className="table-responsive mb-4">
                <table className="table table-bordered align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Acreedor</th>
                            <th>Naturaleza</th>
                            <th>Soporte de garantía</th>
                            <th>Capital</th>
                            <th>Días en mora</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {acreedores.map((acreedor, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="text"
                                        name="name"
                                        value={acreedor.name}
                                        onChange={(e) => handleChange(index, e)}
                                        className="form-control"
                                        required
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="nature"
                                        value={acreedor.nature}
                                        onChange={(e) => handleChange(index, e)}
                                        className="form-control"
                                        required
                                    />
                                </td>
                                <td>
                                    <textarea
                                        name="guarantee_support"
                                        value={acreedor.guarantee_support}
                                        onChange={(e) => handleChange(index, e)}
                                        className="form-control"
                                        rows={5}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="capital_value"
                                        value={acreedor.capital_value}
                                        onChange={(e) => handleChange(index, e)}
                                        onBlur={(e) => handleBlur(index, e)}
                                        className="form-control text-end"
                                        inputMode="decimal"
                                        onWheel={(e) => (e.target).blur()}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        name="days_overdue"
                                        value={acreedor.days_overdue}
                                        onChange={(e) => handleChange(index, e)}
                                        className="form-control"
                                        min="0"
                                    />
                                </td>
                                <td className="text-center">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-danger"
                                        onClick={() => removeRow(index)}
                                        disabled={acreedores.length <= 1}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mb-4">
                <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={addRow}
                >
                    + Agregar Acreedor
                </button>
            </div>

            <div className="d-flex justify-content-between mt-4">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onBack}
                    disabled={isSubmitting}
                >
                    Atrás
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Procesando...' : 'Siguiente'}
                </button>
            </div>
        </form>
    );
}