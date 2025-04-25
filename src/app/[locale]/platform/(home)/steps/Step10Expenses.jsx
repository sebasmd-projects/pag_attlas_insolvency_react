// src/app/[locale]/platform/(home)/steps/Step10Expenses.jsx

'use client';

import { useTranslations } from 'next-intl';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState, useMemo } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';
import { ReactSVG } from 'react-svg';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { MdSaveAs } from 'react-icons/md';
import { toast } from 'react-toastify';

// ---------- Constantes ----------
const BASE_EXPENSES = [
  { labelKey: 'table.defaults.items.baseExpenses.item1', legalKey: 'table.defaults.items.baseExpenses.item1.legalSupport', id: 1, editable: true, dependent: false },
  { labelKey: 'table.defaults.items.baseExpenses.item2', legalKey: 'table.defaults.items.baseExpenses.item2.legalSupport', id: 2, editable: true, dependent: false },
  { labelKey: 'table.defaults.items.baseExpenses.item3', legalKey: 'table.defaults.items.baseExpenses.item3.legalSupport', id: 3, editable: true, dependent: false },
  { labelKey: 'table.defaults.items.baseExpenses.item4', legalKey: 'table.defaults.items.baseExpenses.item4.legalSupport', id: 4, editable: false, dependent: true },
  { labelKey: 'table.defaults.items.baseExpenses.item5', legalKey: 'table.defaults.items.baseExpenses.item5.legalSupport', id: 5, editable: true, dependent: false },
  { labelKey: 'table.defaults.items.baseExpenses.item6', legalKey: 'table.defaults.items.baseExpenses.item6.legalSupport', id: 6, editable: true, dependent: false },
  { labelKey: 'table.defaults.items.baseExpenses.item7', legalKey: 'table.defaults.items.baseExpenses.item7.legalSupport', id: 7, editable: true, dependent: false },
  { labelKey: 'table.defaults.items.baseExpenses.item8', legalKey: 'table.defaults.items.baseExpenses.item8.legalSupport', id: 8, editable: true, dependent: false },
  { labelKey: 'table.defaults.items.baseExpenses.item9', legalKey: 'table.defaults.items.baseExpenses.item9.legalSupport', id: 9, editable: true, dependent: false },
  { labelKey: 'table.defaults.items.baseExpenses.item10', legalKey: 'table.defaults.items.baseExpenses.item10.legalSupport', id: 10, editable: false, dependent: true },
  { labelKey: 'table.defaults.items.baseExpenses.item11', legalKey: 'table.defaults.items.baseExpenses.item11.legalSupport', id: 11, editable: true, dependent: true },
  { labelKey: 'table.defaults.items.baseExpenses.item12', legalKey: 'table.defaults.items.baseExpenses.item12.legalSupport', id: 12, editable: true, dependent: false },
  { labelKey: 'table.defaults.items.baseExpenses.item13', legalKey: 'table.defaults.items.baseExpenses.item13.legalSupport', id: 13, editable: false, dependent: true },
  { labelKey: 'table.defaults.items.baseExpenses.item14', legalKey: 'table.defaults.items.baseExpenses.item14.legalSupport', id: 14, editable: true, dependent: false },
];
const FOOD_OBLIGATION = {
  labelKey: 'table.defaults.items.baseExpenses.item15',
  legalKey: 'table.defaults.items.baseExpenses.item15.legalSupport',
  id: 15,
  editable: true,
  dependent: false
};

// ---------- Funciones auxiliares ----------
const parseCurrency = v =>
  typeof v === 'number'
    ? v
    : parseFloat(String(v || '0').replace(/,/g, '')) || 0;

const formatCurrency = v =>
  new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    .format(parseCurrency(v));

const calculateTableTotal = items =>
  items.reduce((sum, it) => sum + parseCurrency(it.value), 0);

const getDefaultFoodValue = (age, gender) => {
  const a = parseInt(age, 10) || 0;
  const isFemale = gender === 'FEMENINO';
  if (a <= 5) return 375000;
  if (a <= 9) return 464000;
  if (a <= 13) return 630000;
  if (a <= 17) return isFemale ? 666000 : 884000;
  if (a <= 59) return isFemale ? 666000 : 833000;
  return 625000;
};
const getDefaultVestuarioValue = () => 68333;
const getDefaultRecreacionValue = age =>
  (parseInt(age, 10) || 0) < 18 ? 40000 : 30000;

// ---------- Llamados a API ----------
async function GetStep10() {
  const { data } = await axios.get('/api/platform/insolvency-form/get-data/?step=10');
  return data;
}
async function SaveStep10(resourcesPayload) {
  return axios.patch('/api/platform/insolvency-form/?step=10', {
    resources: [resourcesPayload],
  });
}

const countChildren = (tables) => tables.filter(tbl => tbl.relationship === 'HIJO' || tbl.relationship === 'HIJA').length;

export default function Step10Expenses({ data, updateData, onNext }) {
  const t = useTranslations('Platform.pages.home.wizard.steps.step10');
  const queryClient = useQueryClient();
  const initialized = useRef(false);

  const { data: step10Data } = useQuery({
    queryKey: ['step10Data'],
    queryFn: GetStep10,
    refetchOnMount: true,
  });

  // ---------- Estado inicializado ----------
  const buildInitial = () => {
    const base = step10Data ?? data;
    const res = base?.resources?.[0] ?? {};
    const debtorAge = data.debtor_age;
    const debtorSex = data.debtor_sex;

    // 1) Si ya hay tablas guardadas, reaplicar editable/dependent desde nuestras constantes
    let tables = Array.isArray(res.tables) && res.tables.length > 0
      ? res.tables.map((tbl, ti) => {
        const items = tbl.items.map((it, idx) => {
          // buscar en BASE_EXPENSES o FOOD_OBLIGATION por etiqueta
          const label = it.label;
          const defBase = BASE_EXPENSES.find(be =>
            t(`${be.labelKey}.label`) === label
          );
          const defFood = t(`${FOOD_OBLIGATION.labelKey}.label`) === label
            ? FOOD_OBLIGATION
            : null;
          const def = defBase || defFood;
          return {
            id: `table${ti}-item${idx}-${Date.now()}`,
            label,
            legal_support: it.legal_support,
            value: formatCurrency(it.value),
            editable: def ? def.editable : true,
            dependent: def ? def.dependent : false,
          };
        });
        return {
          title: tbl.title,
          relationship: tbl.relationship,
          disability: tbl.disability,
          age: tbl.age,
          gender: tbl.gender,
          items,
        };
      })
      : [
        // 2) Si no hay nada guardado, inicializamos solo al deudor
        {
          title: t('table.defaults.debtorTitle'),
          relationship: 'DEUDOR',
          disability: false,
          age: debtorAge,
          gender: debtorSex,
          items: BASE_EXPENSES.map((be, idx) => {
            let computed = '';
            if (be.id === 4) computed = getDefaultFoodValue(debtorAge, debtorSex);
            else if (be.id === 10) computed = getDefaultVestuarioValue();
            else if (be.id === 13) computed = getDefaultRecreacionValue(debtorAge);
            return {
              id: `table0-item${idx}-${Date.now()}`,
              label: t(`${be.labelKey}.label`),
              legal_support: t(`${be.legalKey}`),
              value: formatCurrency(computed),
              editable: be.editable,
              dependent: be.dependent,
            };
          }),
        },
      ];

    // 3) Asegurar que el deudor esté en primer lugar y no pueda moverse
    const idxD = tables.findIndex(tbl => tbl.relationship === 'DEUDOR');
    if (idxD > 0) {
      const [debtorTbl] = tables.splice(idxD, 1);
      tables.unshift(debtorTbl);
    }

    return {
      tables,
      hasFoodObligation: !!res.has_food_obligation,
      proposedMonthlyValue:
        res.has_food_obligation != null
          ? formatCurrency(res.proposed_monthly_value)
          : '',
      childrenCount: countChildren(tables),
    };
  };

  const [childCount, setChildCount] = useState(0);
  const [form, setForm] = useState(buildInitial);
  const [newAge, setNewAge] = useState('');
  const [newDis, setNewDis] = useState(false);
  const [newGender, setNewGender] = useState('MASCULINO');
  const [newName, setNewName] = useState('');
  const [newRel, setNewRel] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (step10Data && !initialized.current) {
      const init = buildInitial();
      setForm(init);
      setChildCount(init.childrenCount);
      initialized.current = true;
    }
  }, [step10Data, data]);

  // Sincronizar cambios con el wizard global
  useEffect(() => {
    const payload = {
      has_food_obligation: form.hasFoodObligation,
      proposed_monthly_value: parseCurrency(form.proposedMonthlyValue),
      children_count: childCount,
      tables: form.tables.map(tbl => ({
        title: tbl.title,
        relationship: tbl.relationship,
        disability: tbl.disability,
        age: tbl.age,
        gender: tbl.gender,
        items: tbl.items.map(it => ({
          label: it.label,
          legal_support: it.legal_support,
          value: parseCurrency(it.value),
        })),
      })),
    };
    updateData({ resources: [payload] });
  }, [form, childCount, updateData]);

  // Mutación de guardado
  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        has_food_obligation: form.hasFoodObligation,
        proposed_monthly_value: parseCurrency(form.proposedMonthlyValue),
        children_count: childCount,
        tables: form.tables.map(tbl => ({
          title: tbl.title,
          relationship: tbl.relationship,
          disability: tbl.disability,
          age: tbl.age,
          gender: tbl.gender,
          items: tbl.items.map(it => ({
            label: it.label,
            legal_support: it.legal_support,
            value: parseCurrency(it.value),
          })),
        })),
      };
      return SaveStep10(payload);
    },
    onSuccess: () => {
      toast.success(t('messages.saveSuccess'));
      queryClient.invalidateQueries(['step10Data']);
    },
    onError: () => toast.error(t('messages.saveError')),
  });
  const handleSave = () => saveMutation.mutate();

  const grandTotal = useMemo(
    () => form.tables.reduce((sum, tbl) => sum + calculateTableTotal(tbl.items), 0),
    [form.tables]
  );

  // ---------- Handlers ----------
  // 1) Permite editar label
  const handleLabelChange = (ti, ii, newLabel) => {
    setForm(prev => {
      const tables = prev.tables.map((tbl, idx) =>
        idx !== ti
          ? tbl
          : {
            ...tbl,
            items: tbl.items.map((it, j) =>
              j !== ii ? it : { ...it, label: newLabel }
            ),
          }
      );
      return { ...prev, tables };
    });
  };

  // 2) Permite editar legal_support
  const handleLegalChange = (ti, ii, newLegal) => {
    setForm(prev => {
      const tables = prev.tables.map((tbl, idx) =>
        idx !== ti
          ? tbl
          : {
            ...tbl,
            items: tbl.items.map((it, j) =>
              j !== ii ? it : { ...it, legal_support: newLegal }
            ),
          }
      );
      return { ...prev, tables };
    });
  };

  // 3) Valor (igual que antes)
  const handleValueChange = (ti, ii, val) => {
    const cleaned = val.replace(/[^0-9.,]/g, '');
    setForm(prev => {
      const tables = prev.tables.map((tbl, idx) =>
        idx !== ti
          ? tbl
          : {
            ...tbl,
            items: tbl.items.map((it, j) =>
              j !== ii ? it : { ...it, value: cleaned }
            ),
          }
      );
      return { ...prev, tables };
    });
  };

  const handleValueBlur = (ti, ii) => {
    setForm(prev => {
      const tables = prev.tables.map((tbl, idx) =>
        idx !== ti
          ? tbl
          : {
            ...tbl,
            items: tbl.items.map((it, j) =>
              j !== ii ? it : { ...it, value: formatCurrency(it.value) }
            ),
          }
      );
      return { ...prev, tables };
    });
  };

  const handleFoodObligationChange = (e) => {
    const has = e.target.value === 'yes';
    setForm(prev => {
      const tables = [...prev.tables];
      const items = [...tables[0].items];
      const idx = items.findIndex(it => it.label === t(`${FOOD_OBLIGATION.labelKey}.label`));
      if (has && idx === -1) items.push({
        label: t(`${FOOD_OBLIGATION.labelKey}.label`),
        legal_support: t(`${FOOD_OBLIGATION.legalKey}`),
        value: '', editable: FOOD_OBLIGATION.editable, dependent: FOOD_OBLIGATION.dependent,
      });
      if (!has && idx > -1) items.splice(idx, 1);
      tables[0].items = items;
      return { ...prev, hasFoodObligation: has, tables };
    });
  };

  // 4) Inserta un solo item
  const insertItemBelow = (ti, ii) => {
    setForm(prev => {
      const table = prev.tables[ti];
      // hacemos una copia limpia de items
      const items = [...table.items];
      items.splice(ii + 1, 0, {
        id: `tbl-${ti}-${Date.now()}`,
        label: '',
        legal_support: '',
        value: '',
        editable: true,
        dependent: false,
      });
      const newTables = [...prev.tables];
      newTables[ti] = { ...table, items };
      return { ...prev, tables: newTables };
    });
  };

  // 5) Elimina item sin afectar base ni comida obligatoria
  const removeItem = (ti, ii) => {
    setForm(prev => {
      const table = prev.tables[ti];
      const items = table.items.filter((_, j) => j !== ii);
      const newTables = [...prev.tables];
      newTables[ti] = { ...table, items };
      return { ...prev, tables: newTables };
    });
  };

  const handleAddTable = () => {
    if (!newRel || !newName) return;
    const isDependent = newRel !== 'DEUDOR';

    // Generar items con valores automáticos para dependientes
    let items = BASE_EXPENSES
      .filter(be => isDependent ? be.dependent : true)
      .map((be, idx) => {
        let value = '';

        // Solo calcular automáticamente para dependientes
        if (isDependent) {
          switch (be.id) {
            case 4: // Alimentación
              value = getDefaultFoodValue(newAge, newGender);
              break;
            case 10: // Vestuario
              value = getDefaultVestuarioValue();
              break;
            case 13: // Recreación
              value = getDefaultRecreacionValue(newAge);
              break;
            default:
              value = '';
          }
        }

        return {
          id: `tbl-${Date.now()}-${idx}`,           // ← id único
          label: t(`${be.labelKey}.label`),
          legal_support: t(`${be.legalKey}`),
          value: formatCurrency(value),
          editable: be.editable,
          dependent: be.dependent,
        };
      });

    // Determinar título según relación
    let title;
    let relationshipName = "";

    switch (newRel) {
      case 'ESPOSO':
        relationshipName = t(`addTableForm.relationShip.options.husband`);
        break;
      case 'ESPOSA':
        relationshipName = t(`addTableForm.relationShip.options.wife`);
        break;
      case 'PAREJA PERMANENTE':
        relationshipName = t(`addTableForm.relationShip.options.permanentPartner`);
        break;
      case 'HIJO':
        relationshipName = t(`addTableForm.relationShip.options.son`);
        break;
      case 'HIJA':
        relationshipName = t(`addTableForm.relationShip.options.daughter`);
        break;
      case 'MADRE':
        relationshipName = t(`addTableForm.relationShip.options.mother`);
        break;
      case 'PADRE':
        relationshipName = t(`addTableForm.relationShip.options.father`);
        break;
      case 'OTRO':
        relationshipName = t(`addTableForm.relationShip.options.other`);
        break;
    }

    const isChild = ['HIJO', 'HIJA'].includes(newRel);

    if (isChild) {
      const newChildCount = childCount + 1;
      title = `${newName} - ${relationshipName} ${newChildCount}`;
      setChildCount(newChildCount);
    } else {
      title = `${newName} - ${relationshipName}`;
    }

    setForm(prev => ({
      ...prev,
      tables: [...prev.tables, {
        title,
        relationship: newRel,
        disability: newDis,
        age: newAge ? parseInt(newAge) : null,
        gender: newGender,
        items
      }]
    }));

    // Resetear formulario
    setShowAdd(false);
    setNewName('');
    setNewRel('');
    setNewAge('');
    setNewGender('MASCULINO');
    setNewDis(false);
  };

  const removeSubsistenceTable = (ti) => {
    if (ti === 0) return;
    setForm(prev => {
      const removedRel = prev.tables[ti].relationship;
      const isChild = ['HIJO', 'HIJA'].includes(removedRel);

      if (isChild) {
        setChildCount(prevCount => Math.max(prevCount - 1, 0));
      }

      return {
        ...prev,
        tables: prev.tables.filter((_, i) => i !== ti),
      };
    });
  };


  const handleProposedMonthlyValueChange = (e) => setForm(prev => ({ ...prev, proposedMonthlyValue: e.target.value.replace(/[^0-9.,]/g, '') }));
  const handleProposedMonthlyValueBlur = () => setForm(prev => ({ ...prev, proposedMonthlyValue: formatCurrency(prev.proposedMonthlyValue) }));

  const handleSubmit = e => {
    e.preventDefault();
    onNext({
      resources: [
        {
          has_food_obligation: form.hasFoodObligation,
          proposed_monthly_value: parseCurrency(form.proposedMonthlyValue),
          children_count: childCount,
          tables: form.tables.map(tbl => ({
            title: tbl.title,
            relationship: tbl.relationship,
            disability: tbl.disability,
            age: tbl.age,
            gender: tbl.gender,
            items: tbl.items.map(it => ({
              label: it.label,
              legal_support: it.legal_support,
              value: parseCurrency(it.value),
            })),
          })),
        },
      ],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="row" id="wizard-step-form">
      <TitleComponent title={t('title')} />
      <SubTitleComponent t={t} sub_title="subTitle" />
      {form.tables.map((tbl, ti) => {
        const isDebtor = ti === 0;
        const total = calculateTableTotal(tbl.items);
        return (
          <div key={ti} className="mb-5">
            <h5 className="fw-bold">{tbl.title}</h5>
            <div className="table-responsive">
              <table className="table table-sm table-hover table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>{t('table.defaults.headers.expense')}</th>
                    <th>{t('table.defaults.headers.legalSupport')}</th>
                    <th className="text-end">{t('table.defaults.headers.value')}</th>
                    <th className="text-center">{t('table.defaults.headers.actions.title')}</th>
                  </tr>
                </thead>
                <tbody>
                  {tbl.items.map((it, ii) => {
                    const isBase = BASE_EXPENSES.some(be => t(`${be.labelKey}.label`) === it.label);
                    const isFood = it.label === t(`${FOOD_OBLIGATION.labelKey}.label`);
                    return (
                      <tr key={it.id || ii}>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={it.label}
                            onChange={e => handleLabelChange(ti, ii, e.target.value)}
                            disabled={isBase || isFood}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={it.legal_support}
                            onChange={e => handleLegalChange(ti, ii, e.target.value)}
                            disabled={isBase || isFood}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={`form-control text-end ${!it.editable ? 'fw-bold' : ''}`}
                            value={it.value}
                            onChange={e => handleValueChange(ti, ii, e.target.value)}
                            onBlur={() => handleValueBlur(ti, ii)}
                            inputMode="decimal"
                            required
                          />
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-success me-1"
                            onClick={() => insertItemBelow(ti, ii)}
                          >
                            <FaPlus />
                          </button>
                          {(!isBase && !isFood) && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeItem(ti, ii)}
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
            {isDebtor && (
              <div className="mb-2 d-flex align-items-center">
                <label className="me-2">{t('foodObligationQuestion.label')}</label>
                <select className="form-select form-select-sm" style={{ width: 'auto' }} value={form.hasFoodObligation ? 'yes' : 'no'} onChange={handleFoodObligationChange}>
                  <option value="no">{t('foodObligationQuestion.options.no')}</option>
                  <option value="yes">{t('foodObligationQuestion.options.yes')}</option>
                </select>
              </div>
            )}
            <p className="fw-bold">
              {t('table.defaults.tableTotalLabel')}:&nbsp;
              {new Intl.NumberFormat('en-US').format(total)}
            </p>

            {ti > 0 && <button type="button" className="btn btn-outline-danger" onClick={() => removeSubsistenceTable(ti)}><FaMinus className="me-1" />{t('removeSubsistenceTable')}</button>}
          </div>
        );
      })}

      <h5 className="fw-bold">{t('table.defaults.globalTotalLabel')}: {new Intl.NumberFormat('en-US').format(grandTotal)}</h5>

      <div className="mb-3">
        <button
          type="button"
          className="btn btn-outline-primary me-2"
          onClick={() => setShowAdd(true)}
        >
          <FaPlus className="me-1" />{t('addSubsistenceTable')}
        </button>
      </div>

      {showAdd && (
        <div className="border rounded p-3 mb-4 row">
          <h6>{t('addTableForm.title')}</h6>
          <div className="col-md-4 mb-3">
            <label className="form-label">{t('addTableForm.name.label')}</label>
            <input
              type="text"
              className="form-control"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t('addTableForm.name.placeholder')}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">{t('addTableForm.relationShip.label')}</label>
            <select className="form-select" value={newRel} onChange={e => setNewRel(e.target.value)}>
              <option value="">{t('addTableForm.relationShip.placeholder')}</option>
              <option value="ESPOSO">{t('addTableForm.relationShip.options.husband')}</option>
              <option value="ESPOSA">{t('addTableForm.relationShip.options.wife')}</option>
              <option value="PAREJA PERMANENTE">{t('addTableForm.relationShip.options.permanentPartner')}</option>
              <option value="HIJO">{t('addTableForm.relationShip.options.son')}</option>
              <option value="HIJA">{t('addTableForm.relationShip.options.daughter')}</option>
              <option value="MADRE">{t('addTableForm.relationShip.options.mother')}</option>
              <option value="PADRE">{t('addTableForm.relationShip.options.father')}</option>
              <option value="OTRO">{t('addTableForm.relationShip.options.other')}</option>
            </select>
          </div>
          {newRel && newRel !== 'DEBTOR' && (
            <>
              <div className="col-md-2 mb-3">
                <label className="form-label">{t('addTableForm.age.label')}</label>
                <input type="number" className="form-control" value={newAge} onChange={e => setNewAge(e.target.value)} onWheel={(e) => e.target.blur()} />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">{t('addTableForm.gender.label')}</label>
                <select
                  className="form-select"
                  value={newGender}
                  onChange={e => setNewGender(e.target.value)}
                  required
                >
                  <option value="MASCULINO">{t('addTableForm.gender.options.male')}</option>
                  <option value="FEMENINO">{t('addTableForm.gender.options.female')}</option>
                </select>
              </div>
            </>
          )}
          <div className="col-md-2 mb-3">
            <label className="form-label">{t('addTableForm.disability.label')}</label>
            <select className="form-select" value={newDis ? 'yes' : 'no'} onChange={e => setNewDis(e.target.value === 'yes')}>
              <option value="no">{t('addTableForm.disability.options.no')}</option>
              <option value="yes">{t('addTableForm.disability.options.yes')}</option>
            </select>
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-success" onClick={handleAddTable}>{t('addTableForm.buttons.add')}</button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowAdd(false)}>{t('addTableForm.buttons.cancel')}</button>
          </div>
        </div>
      )}

      <div className="card mb-4">
        <div className="row gx-3 align-items-center card-body">
          <div className="col-5 d-flex align-items-center">
            <div style={{ width: '150px', height: '150px' }}>
              <ReactSVG src="/assets/imgs/icons/family_insolvency.svg" beforeInjection={svg => { svg.setAttribute('width', '150px'); svg.setAttribute('height', '150px'); }} />
            </div>
            <div className="ms-4">
              <SubTitleComponent t={t} sub_title="proposedMonthlyValueLabel" />
            </div>
          </div>
          <div className="col-3">
            <div className="input-group input-group-lg">
              <span className="input-group-text">$</span>
              <input
                type="text"
                className="form-control text-end"
                value={form.proposedMonthlyValue}
                onChange={handleProposedMonthlyValueChange}
                onBlur={handleProposedMonthlyValueBlur}
                inputMode="decimal"
                required
                min={1}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="my-3">
        <button
          type="button"
          className="btn btn-outline-info"
          onClick={handleSave}
          disabled={saveMutation.isLoading}
        >
          <MdSaveAs className="me-1" />
          {saveMutation.isLoading ? t('messages.saving') : t('messages.save')}
        </button>
      </div>
    </form>
  );
}

Step10Expenses.propTypes = {
  data: PropTypes.shape({ resources: PropTypes.array }),
  updateData: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func,
  isSubmitting: PropTypes.bool,
};
