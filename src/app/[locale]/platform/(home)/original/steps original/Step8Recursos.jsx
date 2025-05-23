// src/app/[locale]/platform/(home)/steps/Step10Expenses.jsx

'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import SubTitleComponent from '@/components/micro-components/sub_title';
import { ReactSVG } from 'react-svg';

export default function Step10Expenses({ data, updateData, onNext }) {
    const t = useTranslations('Platform.pages.home.wizard.steps.step10');

    const BASE_EXPENSES = [
        { label: t('table.defaults.items.baseExpenses.item1.label'), legal: t('table.defaults.items.baseExpenses.item1.legalSupport'), value: '', editable: true, depent: false, id_nuber: 1 }, // Arriendo o Pago cuota de vivienda
        { label: t('table.defaults.items.baseExpenses.item2.label'), legal: t('table.defaults.items.baseExpenses.item2.legalSupport'), value: '', editable: true, depent: false, id_nuber: 2 }, // Seguro Muebles
        { label: t('table.defaults.items.baseExpenses.item3.label'), legal: t('table.defaults.items.baseExpenses.item3.legalSupport'), value: '', editable: true, depent: false, id_nuber: 3 }, // Seguro Inmuebles
        { label: t('table.defaults.items.baseExpenses.item4.label'), legal: t('table.defaults.items.baseExpenses.item4.legalSupport'), value: '', editable: false, depent: true, id_nuber: 4 }, // Alimentación (0 a 5 años: 375000        6 a 9 años: 464.000        10 a 13 años: 630.000        14 a 17 años (varones): 884.000        14 a 17 años (mujeres): 666.000        18 a 59 años (varones): 833.000        18 a 59 años (mujeres): 666.000         Adultos mayores de 60 años: 625.000)
        { label: t('table.defaults.items.baseExpenses.item5.label'), legal: t('table.defaults.items.baseExpenses.item5.legalSupport'), value: '', editable: true, depent: false, id_nuber: 5 }, // Servicios Públicos (Agua)
        { label: t('table.defaults.items.baseExpenses.item6.label'), legal: t('table.defaults.items.baseExpenses.item6.legalSupport'), value: '', editable: true, depent: false, id_nuber: 6 }, // Servicios Públicos (Luz/Energía)
        { label: t('table.defaults.items.baseExpenses.item7.label'), legal: t('table.defaults.items.baseExpenses.item7.legalSupport'), value: '', editable: true, depent: false, id_nuber: 7 }, // Servicios Públicos (Gas)
        { label: t('table.defaults.items.baseExpenses.item8.label'), legal: t('table.defaults.items.baseExpenses.item8.legalSupport'), value: '', editable: true, depent: false, id_nuber: 8 }, // Seguridad social integral
        { label: t('table.defaults.items.baseExpenses.item9.label'), legal: t('table.defaults.items.baseExpenses.item9.legalSupport'), value: '', editable: true, depent: false, id_nuber: 9 }, // Transporte
        { label: t('table.defaults.items.baseExpenses.item10.label'), legal: t('table.defaults.items.baseExpenses.item10.legalSupport'), value: '68.333', editable: false, depent: true, id_nuber: 10 }, // Vestuario y Calzado (68.333)
        { label: t('table.defaults.items.baseExpenses.item11.label'), legal: t('table.defaults.items.baseExpenses.item11.legalSupport'), value: '', editable: true, depent: true, id_nuber: 11 }, // Educación
        { label: t('table.defaults.items.baseExpenses.item12.label'), legal: t('table.defaults.items.baseExpenses.item12.legalSupport'), value: '', editable: true, depent: false, id_nuber: 12 }, // Impuestos
        { label: t('table.defaults.items.baseExpenses.item13.label'), legal: t('table.defaults.items.baseExpenses.item13.legalSupport'), value: '30.000', editable: false, depent: true, id_nuber: 13 }, // Recreación y deporte (30.000 adultos  40.000 hijos)
        { label: t('table.defaults.items.baseExpenses.item14.label'), legal: t('table.defaults.items.baseExpenses.item14.legalSupport'), value: '', editable: true, depent: false, id_nuber: 14 }, // Comunicaciones
    ];

    const FOOD_OBLIGATION_ITEM = { label: t('table.defaults.items.baseExpenses.item15.label'), legal: t('table.defaults.items.baseExpenses.item15.legalSupport'), value: '', editable: true, depent: false, id_nuber: 15 };

    const formatToLocaleNumber = (value) => {
        if (!value) return '';
        const number = typeof value === 'number' ? value : parseCurrencyInput(value);
        return new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 3 }).format(number);
    };

    const parseCurrencyInput = (value) => {
        if (typeof value === 'number') return value;
        const numericString = (value || '').replace(/\./g, '').replace(',', '.');
        return parseFloat(numericString) || 0;
    };

    const [form, setForm] = useState({
        tables: [{
            title: t('table.defaults.debtorTitle'),
            relationship: 'DEBTOR',
            disability: false,
            age: null,
            gender: null,
            items: BASE_EXPENSES.map(it => ({ ...it })),
        }],
        hasFoodObligation: false,
        proposedMonthlyValue: '',
        childrenCount: 0,
    });

    const [showAddForm, setShowAddForm] = useState(false);
    const [newRelationship, setNewRelationship] = useState('');
    const [newDisability, setNewDisability] = useState('no');
    const [newAge, setNewAge] = useState('');
    const [newGender, setNewGender] = useState('male');
    const [childCount, setChildCount] = useState(0);

    useEffect(() => {
        if (data?.tables) {
            const initialChildCount = data.tables.filter(tbl => tbl.relationship === 'child').length;
            const hasObligation = data.tables[0]?.items?.some(it => it.label === FOOD_OBLIGATION_ITEM.label);

            setForm({
                tables: data.tables.map(table => ({
                    ...table,
                    items: table.items.map(it => ({
                        ...it,
                        value: formatToLocaleNumber(it.value),
                    })),
                })),
                hasFoodObligation: hasObligation,
                proposedMonthlyValue: formatToLocaleNumber(data.proposedMonthlyValue),
                childrenCount: initialChildCount,
            });

            setChildCount(initialChildCount);
        }
    }, [data]);

    const calculateTableTotal = (items) => {
        return items.reduce((acc, item) => acc + parseCurrencyInput(item.value), 0);
    };

    const grandTotal = useMemo(() =>
        form.tables.reduce((acc, tbl) => acc + calculateTableTotal(tbl.items), 0),
        [form.tables]
    );

    const handleValueChange = (tableIndex, itemIndex, newVal) => {
        setForm(prev => {
            const filteredValue = newVal.replace(/[^0-9.,]/g, '');
            const newTables = [...prev.tables];
            const newItems = [...newTables[tableIndex].items];
            newItems[itemIndex] = { ...newItems[itemIndex], value: filteredValue };

            newTables[tableIndex] = { ...newTables[tableIndex], items: newItems };
            return { ...prev, tables: newTables };
        });
    };

    const handleValueBlur = (tableIndex, itemIndex) => {
        setForm(prev => {
            const newTables = [...prev.tables];
            const newItems = [...newTables[tableIndex].items];
            const rawValue = newItems[itemIndex].value;

            newItems[itemIndex] = {
                ...newItems[itemIndex],
                value: formatToLocaleNumber(rawValue)
            };

            newTables[tableIndex] = { ...newTables[tableIndex], items: newItems };
            return { ...prev, tables: newTables };
        });
    };

    const handleFoodObligationChange = (e) => {
        const hasObligation = e.target.value === 'yes';

        setForm(prev => {
            const newTables = [...prev.tables];
            const debtorItems = [...newTables[0].items];
            const existingIndex = debtorItems.findIndex(it => it.label === FOOD_OBLIGATION_ITEM.label);

            if (hasObligation && existingIndex === -1) {
                debtorItems.push({ ...FOOD_OBLIGATION_ITEM });
            } else if (!hasObligation && existingIndex > -1) {
                debtorItems.splice(existingIndex, 1);
            }

            newTables[0] = {
                ...newTables[0],
                items: debtorItems
            };

            return {
                ...prev,
                hasFoodObligation: hasObligation,
                tables: newTables
            };
        });
    };

    const insertItemBelow = (tableIndex, itemIndex) => {
        setForm(prev => {
            const newTables = [...prev.tables];
            const newItems = [
                ...newTables[tableIndex].items.slice(0, itemIndex + 1),
                { label: '', legal: '', value: '' },
                ...newTables[tableIndex].items.slice(itemIndex + 1)
            ];

            newTables[tableIndex] = { ...newTables[tableIndex], items: newItems };
            return { ...prev, tables: newTables };
        });
    };

    const removeItem = (tableIndex, itemIndex) => {
        const item = form.tables[tableIndex].items[itemIndex];
        const isBaseExpense = BASE_EXPENSES.some(base => base.label === item.label);
        const isFoodObligation = (item.label === FOOD_OBLIGATION_ITEM.label);
        if (isBaseExpense || isFoodObligation) return;

        setForm(prev => {
            const newTables = [...prev.tables];
            const newItems = newTables[tableIndex].items.filter((_, idx) => idx !== itemIndex);
            newTables[tableIndex] = { ...newTables[tableIndex], items: newItems };
            return { ...prev, tables: newTables };
        });
    };

    const getDefaultFoodValue = (age, gender) => {
        const g = (gender === 'female') ? 'female' : 'male';
        const a = parseInt(age, 10) || 0;

        if (a >= 0 && a <= 5) return 375000;
        if (a >= 6 && a <= 9) return 464000;
        if (a >= 10 && a <= 13) return 630000;
        if (a >= 14 && a <= 17) {
            return g === 'male' ? 884000 : 666000;
        }
        if (a >= 18 && a <= 59) {
            return g === 'male' ? 833000 : 666000;
        }
        if (a >= 60) return 625000;

        return 0;
    };

    const getDefaultVestuarioValue = () => {
        return 68333;
    };

    const getDefaultEducacionValue = () => {
        return 0;
    };

    const getDefaultRecreacionValue = (age) => {
        const a = parseInt(age, 10) || 0;
        return (a < 18) ? 40000 : 30000;
    };

    const handleAddTable = () => {
        const getTitleForRelationship = (relationship, childNumber) => {
            switch (relationship) {
                case 'child': return `${t('table.defaults.childTitle')} ${childNumber}`;
                case 'spouse': return t('table.defaults.spouseTitle');
                case 'partner': return t('table.defaults.partnerTitle');
                default: return t('table.defaults.otherTitle');
            }
        };

        // Si es deudor, mostramos todos los ítems base
        // Si es dependiente, filtramos sólo depent=true
        const relationshipKey = newRelationship || 'other';
        const isDebtor = (relationshipKey === 'DEBTOR');

        // Filtra items según sea deudor o dependiente
        let filteredItems;
        if (isDebtor) {
            // Deudor: todos los ítems
            filteredItems = BASE_EXPENSES.map(it => ({ ...it }));
        } else {
            // Dependiente: solo ítems con depent=true
            filteredItems = BASE_EXPENSES.filter(it => it.depent).map(it => ({ ...it }));
        }

        // Asignar valores por defecto si es dependiente
        if (!isDebtor) {
            const ageVal = parseInt(newAge, 10) || 0;
            const genderVal = newGender === 'female' ? 'female' : 'male';

            filteredItems = filteredItems.map(item => {
                // Compara por id_nuber o label
                switch (item.id_nuber) {
                    case 4:  // Alimentación
                        return { ...item, value: getDefaultFoodValue(ageVal, genderVal).toString() };
                    case 10: // Vestuario y Calzado
                        return { ...item, value: getDefaultVestuarioValue().toString() };
                    case 11: // Educación
                        return { ...item, value: getDefaultEducacionValue().toString() };
                    case 13: // Recreación y deporte
                        return { ...item, value: getDefaultRecreacionValue(ageVal).toString() };
                    default:
                        return item;
                }
            });
        }

        const newChildCount = (relationshipKey === 'child') ? childCount + 1 : childCount;

        // Construir la nueva tabla
        const newTable = {
            title: getTitleForRelationship(relationshipKey, newChildCount),
            relationship: relationshipKey,
            disability: newDisability === 'yes',
            age: newAge || null,
            gender: newGender || null,
            items: filteredItems,
        };

        setForm(prev => ({
            ...prev,
            tables: [...prev.tables, newTable]
        }));

        if (relationshipKey === 'child') {
            setChildCount(newChildCount);
        }

        // Cerrar el formulario y limpiar campos
        setShowAddForm(false);
        setNewRelationship('');
        setNewDisability('no');
        setNewAge('');
        setNewGender('male');
    };

    const removeSubsistenceTable = (tableIndex) => {
        if (tableIndex === 0) return; // la tabla 0 es el Deudor

        setForm(prev => ({
            ...prev,
            tables: prev.tables.filter((_, idx) => idx !== tableIndex)
        }));

        // Ajustar contador de hijos en caso de borrar un hijo
        if (form.tables[tableIndex].relationship === 'child') {
            setChildCount(prev => Math.max(prev - 1, 0));
        }
    };

    const handleProposedMonthlyValueChange = (e) => {
        const filteredValue = e.target.value.replace(/[^0-9.,]/g, '');
        setForm(prev => ({ ...prev, proposedMonthlyValue: filteredValue }));
    };

    const handleProposedMonthlyValueBlur = () => {
        setForm(prev => ({
            ...prev,
            proposedMonthlyValue: formatToLocaleNumber(prev.proposedMonthlyValue),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            tables: form.tables.map(tbl => ({
                ...tbl,
                items: tbl.items.map(it => ({
                    ...it,
                    value: parseCurrencyInput(it.value),
                })),
            })),
            hasFoodObligation: form.hasFoodObligation,
            proposedMonthlyValue: parseCurrencyInput(form.proposedMonthlyValue),
            childrenCount: childCount,
        };
        onNext(payload);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h4 className="mb-3">{t('title')}</h4>

            {form.tables.map((table, tableIndex) => {
                const totalTable = calculateTableTotal(table.items);
                const isDebtorTable = (table.relationship === 'DEBTOR');

                return (
                    <div key={`table-${tableIndex}`} className="mb-5">
                        <h5 className="fw-bold mb-3">{table.title}</h5>

                        <div className="table-responsive">
                            <table className="table table-sm table-hover table-bordered">
                                <thead className="table-light">
                                    <tr>
                                        <th>{t('table.defaults.headers.expense')}</th>
                                        <th>{t('table.defaults.headers.legalSupport')}</th>
                                        <th>{t('table.defaults.headers.value')}</th>
                                        <th>{t('table.defaults.headers.actions.title')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {table.items.map((item, itemIndex) => {
                                        const isBase = BASE_EXPENSES.some(base => base.label === item.label);
                                        const isFood = (item.label === FOOD_OBLIGATION_ITEM.label);

                                        return (
                                            <tr key={`item-${itemIndex}`}>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        required
                                                        value={item.label}
                                                        onChange={(e) => {
                                                            const newLabel = e.target.value;
                                                            setForm(prev => {
                                                                const newTables = [...prev.tables];
                                                                newTables[tableIndex] = {
                                                                    ...newTables[tableIndex],
                                                                    items: newTables[tableIndex].items.map((it, i) =>
                                                                        i === itemIndex ? { ...it, label: newLabel } : it
                                                                    )
                                                                };
                                                                return { ...prev, tables: newTables };
                                                            });
                                                        }}
                                                        disabled={isBase || isFood}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={item.legal}
                                                        onChange={(e) => {
                                                            const newLegal = e.target.value;
                                                            setForm(prev => {
                                                                const newTables = [...prev.tables];
                                                                newTables[tableIndex] = {
                                                                    ...newTables[tableIndex],
                                                                    items: newTables[tableIndex].items.map((it, i) =>
                                                                        i === itemIndex ? { ...it, legal: newLegal } : it
                                                                    )
                                                                };
                                                                return { ...prev, tables: newTables };
                                                            });
                                                        }}
                                                        disabled={isBase || isFood}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control text-end"
                                                        value={item.value}
                                                        required
                                                        onChange={(e) => handleValueChange(tableIndex, itemIndex, e.target.value)}
                                                        onBlur={() => handleValueBlur(tableIndex, itemIndex)}
                                                        inputMode="decimal"
                                                        onWheel={(e) => e.target.blur()}
                                                    />
                                                </td>
                                                <td className="text-center">
                                                    {/* Botón Agregar ítem abajo */}
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-success me-1"
                                                        onClick={() => insertItemBelow(tableIndex, itemIndex)}
                                                    >
                                                        <FaPlus />
                                                    </button>
                                                    {/* Botón Eliminar (solo si no es ítem base ni la obligación alimentaria) */}
                                                    {(!isBase && !isFood) && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => removeItem(tableIndex, itemIndex)}
                                                        >
                                                            <FaMinus />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {isDebtorTable && (
                            <div className="mb-2 d-flex gap-2">
                                <div>
                                    <label className="me-2">{t('foodObligationQuestion.label')}</label>
                                    <select
                                        className="form-select form-select-sm d-inline-block"
                                        style={{ width: 'auto' }}
                                        value={form.hasFoodObligation ? 'yes' : 'no'}
                                        onChange={handleFoodObligationChange}
                                    >
                                        <option value="no">{t('foodObligationQuestion.options.no')}</option>
                                        <option value="yes">{t('foodObligationQuestion.options.yes')}</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <p className="fw-bold">
                            {t('table.defaults.tableTotalLabel')}:{' '}
                            {new Intl.NumberFormat('es-CO').format(totalTable)}
                        </p>

                        {tableIndex > 0 && (
                            <button
                                type="button"
                                className="btn btn-outline-danger mx-1"
                                onClick={() => removeSubsistenceTable(tableIndex)}
                            >
                                <FaMinus className="me-1" /> {t('removeSubsistenceTable')}
                            </button>
                        )}
                    </div>
                );
            })}

            <h5 className="fw-bold mb-4">
                {t('table.defaults.globalTotalLabel')}: {new Intl.NumberFormat('es-CO').format(grandTotal)}
            </h5>

            {/* Botón para abrir el formulario de agregar dependiente */}
            <div className="mb-4">
                <button
                    type="button"
                    className="btn btn-outline-primary mx-1"
                    onClick={() => setShowAddForm(true)}
                >
                    <FaPlus className="me-1" /> {t('addSubsistenceTable')}
                </button>
            </div>

            {showAddForm && (
                <div className="border rounded p-3 mb-4 row">
                    <h6>{t('addTableForm.title')}</h6>

                    {/* Relación */}
                    <div className="mb-3 col-md-4">
                        <label className="form-label">{t('addTableForm.relationShip.label')}</label>
                        <select
                            className="form-select"
                            value={newRelationship}
                            onChange={(e) => setNewRelationship(e.target.value)}
                        >
                            <option value="">{t('addTableForm.relationShip.placeholder')}</option>
                            <option value="spouse">{t('addTableForm.relationShip.options.spouse')}</option>
                            <option value="partner">{t('addTableForm.relationShip.options.partner')}</option>
                            <option value="child">{t('addTableForm.relationShip.options.child')}</option>
                            <option value="other">{t('addTableForm.relationShip.options.other')}</option>
                        </select>
                    </div>

                    {/* Edad y género solo si no es DEBTOR */}
                    {newRelationship !== 'DEBTOR' && (
                        <>
                            <div className="mb-3 col-md-2">
                                <label className="form-label">
                                    {t('addTableForm.age.label')}
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={newAge}
                                    onChange={(e) => setNewAge(e.target.value)}
                                    onWheel={(e) => e.target.blur()}
                                />
                            </div>

                            <div className="mb-3 col-md-3">
                                <label className="form-label">
                                    {t('addTableForm.gender.label')}
                                </label>
                                <select
                                    className="form-select"
                                    value={newGender}
                                    onChange={(e) => setNewGender(e.target.value)}
                                >
                                    <option value="male">{t('addTableForm.gender.options.male')}</option>
                                    <option value="female">{t('addTableForm.gender.options.female')}</option>
                                </select>
                            </div>
                        </>
                    )}

                    {/* Discapacidad */}
                    <div className="mb-3 col-md-2">
                        <label className="form-label">{t('addTableForm.disability.label')}</label>
                        <select
                            className="form-select"
                            value={newDisability}
                            onChange={(e) => setNewDisability(e.target.value)}
                        >
                            <option value="no">{t('addTableForm.disability.options.no')}</option>
                            <option value="yes">{t('addTableForm.disability.options.yes')}</option>
                        </select>
                    </div>

                    {/* Botones agregar / cancelar */}
                    <div className="d-flex gap-2">
                        <button type="button" className="btn btn-success" onClick={handleAddTable}>
                            {t('addTableForm.buttons.add')}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                            {t('addTableForm.buttons.cancel')}
                        </button>
                    </div>
                </div>
            )}

            {/* Valor mensual propuesto */}
            <div className="my-5 card">
                <div className="row justify-content-center align-items-center card-body">
                    <div className="col-5">
                        <label className="form-label d-flex align-items-center gap-2">
                            <div style={{ width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ReactSVG
                                    src="/assets/imgs/icons/family_insolvency.svg"
                                    beforeInjection={(svg) => {
                                        svg.setAttribute('width', '150px');
                                        svg.setAttribute('height', '150px');
                                    }}
                                />
                            </div>
                            <div className='mx-5'>
                                <SubTitleComponent t={t} sub_title="proposedMonthlyValueLabel" />
                            </div>
                        </label>
                    </div>

                    <div className="col-3">
                        <div className="input-group input-group-lg">
                            <span className="input-group-text" style={{ fontSize: '1.5rem' }}>$</span>
                            <input
                                type="text"
                                style={{ fontSize: '2.5rem' }}
                                className="form-control"
                                value={form.proposedMonthlyValue}
                                onChange={handleProposedMonthlyValueChange}
                                onBlur={handleProposedMonthlyValueBlur}
                                inputMode="decimal"
                                required
                                onWheel={(e) => e.target.blur()}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Botones 'Atrás' / 'Siguiente' */}
            <div className="d-flex justify-content-between">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onBack}
                    disabled={isSubmitting}
                >
                    <FaArrowCircleLeft /> <span className="ms-2">{wizardButton('back')}</span>
                </button>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                            ></span>
                            {wizardButton('processing')}
                        </>
                    ) : (
                        <>
                            {wizardButton('next')} <FaArrowCircleRight className="ms-2" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}