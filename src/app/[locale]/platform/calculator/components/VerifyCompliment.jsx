'use client';

import { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function VerifyCompliment() {
    const [creditors, setCreditors] = useState([
        { name: '', nature: '', other_nature: '', capital_value: '', days_overdue: '' },
    ]);

    const [result, setResult] = useState(null);
    const [overdueDebt, setOverdueDebt] = useState(0);
    const [onTimeDebt, setOnTimeDebt] = useState(0);
    const [totalDebt, setTotalDebt] = useState(0);

    useEffect(() => {
        const filteredCreditors = creditors.filter(c =>
            c.nature !== 'CRÉDITO DE LIBRANZA' && c.nature !== 'CRÉDITO DE NÓMINA'
        );

        let overdue = 0;
        let onTime = 0;
        let total = 0;

        filteredCreditors.forEach(c => {
            const capital = parseCurrencyToNumber(c.capital_value);
            const overdueDays = parseInt(c.days_overdue);

            if (!isNaN(capital)) {
                total += capital;
                if (!isNaN(overdueDays)) {
                    if (overdueDays >= 90) {
                        overdue += capital;
                    } else {
                        onTime += capital;
                    }
                }
            }
        });

        setOverdueDebt(overdue);
        setOnTimeDebt(onTime);
        setTotalDebt(total);
    }, [creditors]);

    const normalizeText = (str) => str.normalize('NFD').replace(/[^a-zA-Z0-9 ]/g, '').toUpperCase();

    const formatToLocaleNumber = (value) => {
        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) return '';
        return new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(numericValue);
    };

    const parseCurrencyToNumber = (value) => {
        if (!value) return 0;
        const numericString = value.replace(/\./g, '').replace(',', '.');
        return parseFloat(numericString);
    };

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const updated = [...creditors];

        if (name === 'capital_value') {
            const filteredValue = value.replace(/[^0-9.,]/g, '');
            updated[index][name] = filteredValue;
        } else if (name === 'name' || name === 'other_nature') {
            updated[index][name] = normalizeText(value);
        } else {
            updated[index][name] = value;
        }

        if (name === 'nature' && value !== 'OTRO') {
            updated[index]['other_nature'] = '';
        }

        setCreditors(updated);
    };

    const handleBlur = (index, e) => {
        const { name, value } = e.target;
        if (name === 'capital_value') {
            const updated = [...creditors];
            updated[index][name] = formatToLocaleNumber(parseCurrencyToNumber(value));
            setCreditors(updated);
        }
    };

    const addRow = () => {
        setCreditors([
            ...creditors,
            { name: '', nature: '', other_nature: '', capital_value: '', days_overdue: '' },
        ]);
    };

    const removeRow = (index) => {
        if (creditors.length <= 1) return;
        const updated = [...creditors];
        updated.splice(index, 1);
        setCreditors(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const incomplete = creditors.some(c =>
            !c.name || !c.nature || (c.nature === 'OTRO' && !c.other_nature) || !c.capital_value || !c.days_overdue
        );

        if (incomplete) {
            toast.error('Por favor llena todos los campos antes de validar cumplimiento.');
            return;
        }

        validateCompliance();
    };

    const validateCompliance = () => {
        const filteredCreditors = creditors.filter(c =>
            c.nature !== 'CRÉDITO DE LIBRANZA' && c.nature !== 'CRÉDITO DE NÓMINA'
        );

        const overdueCreditors = filteredCreditors.filter(c => parseInt(c.days_overdue) >= 90);
        const overdueCount = overdueCreditors.length;

        const totalDebt = filteredCreditors.reduce((sum, c) => sum + parseCurrencyToNumber(c.capital_value), 0);
        const overdueDebt = overdueCreditors.reduce((sum, c) => sum + parseCurrencyToNumber(c.capital_value), 0);

        const overduePercentage = totalDebt ? (overdueDebt / totalDebt) * 100 : 0;

        setResult({
            overdueCount,
            overdueDebt,
            totalDebt,
            overduePercentage,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="container my-5">
            <h5 className="mb-4">Verificación de cumplimiento para insolvencia</h5>

            <div className="table-responsive mb-4">
                <table className="table table-bordered align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Acreedor</th>
                            <th>Naturaleza</th>
                            <th>Capital</th>
                            <th>Días en mora</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {creditors.map((c, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="text"
                                        name="name"
                                        value={c.name}
                                        onChange={(e) => handleChange(index, e)}
                                        className="form-control"
                                        required
                                    />
                                </td>
                                <td>
                                    <select
                                        name="nature"
                                        value={c.nature}
                                        onChange={(e) => handleChange(index, e)}
                                        className="form-control"
                                        required
                                    >
                                        <option value="">Seleccione...</option>
                                        <option value="CRÉDITO DE LIBRANZA">Crédito de Libranza</option>
                                        <option value="CRÉDITO HIPOTECARIO">Crédito Hipotecario</option>
                                        <option value="CRÉDITO CON GARANTÍA MOBILIARIA">Crédito con Garantía Mobiliaria</option>
                                        <option value="CRÉDITO FISCAL O TRIBUTARIO">Crédito Fiscal o Tributario</option>
                                        <option value="CRÉDITO DE LIBRE INVERSIÓN">Crédito de Libre Inversión</option>
                                        <option value="CRÉDITO DE NÓMINA">Crédito de Nómina</option>
                                        <option value="CRÉDITO PERSONAL">Crédito Personal</option>
                                        <option value="CRÉDITO COMERCIAL">Crédito Comercial</option>
                                        <option value="CRÉDITO ROTATIVO">Crédito Rotativo</option>
                                        <option value="CRÉDITO EDUCATIVO O DE ESTUDIO">Crédito Educativo o de Estudio</option>
                                        <option value="CRÉDITO DE CONSUMO">Crédito de Consumo</option>
                                        <option value="OTRO">Otro</option>
                                    </select>
                                    {c.nature === 'OTRO' && (
                                        <input
                                            type="text"
                                            name="other_nature"
                                            value={c.other_nature}
                                            onChange={(e) => handleChange(index, e)}
                                            className="form-control mt-2"
                                            placeholder="Especifique cuál"
                                            required
                                        />
                                    )}
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="capital_value"
                                        value={c.capital_value}
                                        onChange={(e) => handleChange(index, e)}
                                        onBlur={(e) => handleBlur(index, e)}
                                        className="form-control text-end"
                                        inputMode="decimal"
                                        required
                                    />
                                </td>
                                <td>
                                    <input
                                        className="form-control"
                                        min="0"
                                        name="days_overdue"
                                        onChange={(e) => handleChange(index, e)}
                                        onWheel={(e) => e.target.blur()}
                                        required
                                        type="number"
                                        value={c.days_overdue}
                                    />
                                </td>
                                <td className="text-center">
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => removeRow(index)}
                                        disabled={creditors.length <= 1}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="row mb-4">
                <div className="col-md-4">
                    <strong>Total capital en mora:</strong> $ {formatToLocaleNumber(overdueDebt)}
                </div>
                <div className="col-md-4">
                    <strong>Total capital al día:</strong> $ {formatToLocaleNumber(onTimeDebt)}
                </div>
                <div className="col-md-4">
                    <strong>Total deudas:</strong> $ {formatToLocaleNumber(totalDebt)}
                </div>
            </div>

            <div className="d-flex mb-4 gap-2">
                <button type="button" className="btn btn-outline-success" onClick={addRow}>
                    + Agregar acreedor
                </button>
                <button type="submit" className="btn btn-primary">
                    Verificar cumplimiento
                </button>
            </div>

            {result && (
                <div className="mt-4">
                    {result.overdueCount >= 2 && result.overduePercentage >= 30 ? (
                        <Alert variant="success">
                            <strong>¡Cumples!</strong> Tienes {result.overdueCount} deudas vencidas y el {result.overduePercentage.toFixed(2)}% del capital vencido.
                        </Alert>
                    ) : (
                        <Alert variant="danger">
                            <strong>No cumples.</strong> {result.overdueCount < 2 ? `Solo tienes ${result.overdueCount} deuda(s) vencida(s) por más de 90 días.` : `El porcentaje de mora es ${result.overduePercentage.toFixed(2)}% y debe ser al menos 30%.`}
                        </Alert>
                    )}

                    <div className="row mt-4">
                        <div className="col-md-6">
                            <strong>Total capital en mora (sin Libranza/Nómina):</strong> $ {formatToLocaleNumber(result.overdueDebt)}
                        </div>
                        <div className="col-md-6">
                            <strong>Total deudas (sin Libranza/Nómina):</strong> $ {formatToLocaleNumber(result.totalDebt)}
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}
