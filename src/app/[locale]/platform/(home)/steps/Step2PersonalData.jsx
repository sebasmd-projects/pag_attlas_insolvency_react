// src/app/[locale]/platform/(home)/steps/Step2PersonalData.jsx

'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';

import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';

async function GetStep2() {
    const { data } = await axios.get('/api/platform/insolvency-form/get-data/?step=2');
    return data;
}

export default function Step2PersonalData({ data, updateData, onNext }) {

    const t = useTranslations('Platform.pages.home.wizard.steps.step2');

    const { data: step2Data } = useQuery({
        queryKey: ['step2Data'],
        queryFn: () => GetStep2()
    });

    // 1) Estado local, arranca vacío; lo rellenaremos en el useEffect
    const [form, setForm] = useState({
        debtor_document_number: '',
        debtor_expedition_city: '',
        debtor_first_name: '',
        debtor_last_name: '',
        debtor_is_merchant: false,
        debtor_cell_phone: '',
        debtor_email: '',
        debtor_birth_date: '',
        debtor_age: '',
        debtor_address: '',
        debtor_sex: '',
    });

    const initialized = useRef(false);
    useEffect(() => {
        if (step2Data && !initialized.current) {
            // 2) Construimos el objeto inicial combinando step2Data > props.data > string vacío
            const init = {
                debtor_document_number: step2Data.debtor_document_number ?? data.debtor_document_number ?? '',
                debtor_expedition_city: step2Data.debtor_expedition_city ?? data.debtor_expedition_city ?? '',
                debtor_first_name: step2Data.debtor_first_name ?? data.debtor_first_name ?? '',
                debtor_last_name: step2Data.debtor_last_name ?? data.debtor_last_name ?? '',
                debtor_is_merchant: step2Data.debtor_is_merchant ?? data.debtor_is_merchant ?? false,
                debtor_cell_phone: step2Data.debtor_cell_phone ?? data.debtor_cell_phone ?? '',
                debtor_email: step2Data.debtor_email ?? data.debtor_email ?? '',
                debtor_birth_date: step2Data.debtor_birth_date ?? data.debtor_birth_date ?? '',
                debtor_age: step2Data.debtor_age ?? data.debtor_age ?? '',
                debtor_address: step2Data.debtor_address ?? data.debtor_address ?? '',
                debtor_sex: step2Data.debtor_sex ?? data.debtor_sex ?? '',
            };
            setForm(init);
            updateData(init);
            initialized.current = true;
        }
    }, [step2Data, data, updateData]);

    // 3) Normalización de texto para ciertos campos
    const normalizeText = (str) =>
        str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

    // 4) handleChange persiste inmediatamente y actualiza solo el campo cambiado
    const handleChange = useCallback(
        (e) => {
            const { name, type, checked, value } = e.target;
            let newValue = type === 'checkbox' ? checked : value;

            if (
                ['debtor_expedition_city', 'debtor_first_name', 'debtor_last_name'].includes(
                    name
                )
            ) {
                newValue = normalizeText(newValue);
            }

            setForm((prev) => {
                const next = { ...prev, [name]: newValue };
                updateData(next);
                return next;
            });
        },
        [updateData]
    );

    // 5) handleSubmit avanza al siguiente paso
    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            onNext(form);
        },
        [form, onNext]
    );

    return (
        <>
            <TitleComponent title={t('title')} />
            <SubTitleComponent t={t} sub_title={'subTitle'} />

            <form onSubmit={handleSubmit} className="row" id="wizard-step-form">
                {/* Document Number */}
                <div className="col-md-6">
                    <label className="form-label">{t('form.document_number')}</label>
                    <input
                        aria-label={t('form.document_number')}
                        className="form-control mb-3"
                        disabled
                        id="debtor_document_number"
                        name="debtor_document_number"
                        onChange={handleChange}
                        placeholder={t('form.document_number')}
                        required
                        type='text'
                        value={form.debtor_document_number}
                    />
                </div>

                {/* Expedition City */}
                <div className="col-md-6">
                    <label className="form-label">{t('form.expedition_city')}</label>
                    <input
                        aria-label={t('form.expedition_city')}
                        className="form-control mb-3"
                        id="debtor_expedition_city"
                        name="debtor_expedition_city"
                        onChange={handleChange}
                        placeholder={t('form.expedition_city')}
                        required
                        type='text'
                        value={form.debtor_expedition_city}
                    />
                </div>

                {/* First Name */}
                <div className="col-md-6">
                    <label className="form-label">{t('form.first_name')}</label>
                    <input
                        aria-label={t('form.first_name')}
                        className="form-control mb-3"
                        id="debtor_first_name"
                        name="debtor_first_name"
                        onChange={handleChange}
                        placeholder={t('form.first_name')}
                        required
                        type='text'
                        value={form.debtor_first_name}
                    />
                </div>

                {/* Last Name */}
                <div className="col-md-6">
                    <label className="form-label">{t('form.last_name')}</label>
                    <input
                        aria-label={t('form.last_name')}
                        className="form-control mb-3"
                        id="debtor_last_name"
                        name="debtor_last_name"
                        onChange={handleChange}
                        placeholder={t('form.last_name')}
                        required
                        type='text'
                        value={form.debtor_last_name}
                    />
                </div>

                {/* Cell Phone */}
                <div className="col-md-4">
                    <label className="form-label">{t('form.cell_phone')}</label>
                    <input
                        aria-label={t('form.cell_phone')}
                        className="form-control mb-3"
                        id="debtor_cell_phone"
                        name="debtor_cell_phone"
                        onChange={handleChange}
                        pattern="[0-9]*"
                        placeholder={t('form.cell_phone')}
                        required
                        type='tel'
                        value={form.debtor_cell_phone}
                    />
                </div>

                {/* Email */}
                <div className="col-md-5">
                    <label className="form-label">{t('form.email')}</label>
                    <input
                        aria-label={t('form.email')}
                        className="form-control mb-3"
                        id="debtor_email"
                        name="debtor_email"
                        onChange={handleChange}
                        placeholder={t('form.email')}
                        required
                        type='email'
                        value={form.debtor_email}
                    />
                </div>

                {/* Gender */}
                <div className="col-md-3">
                    <label className="form-label">{t('form.gender')}</label>
                    <select
                        className="form-select"
                        id='debtor_sex'
                        name="debtor_sex"
                        value={form.debtor_sex}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona una opción</option>
                        <option value="MASCULINO">MASCULINO</option>
                        <option value="FEMENINO">FEMENINO</option>
                    </select>
                </div>

                {/* Debtor Address */}
                <div className="col-md-6">
                    <label className="form-label">{t('form.debtor_address')}</label>
                    <input
                        aria-label={t('form.debtor_address')}
                        className="form-control mb-3"
                        id="debtor_address"
                        name="debtor_address"
                        onChange={handleChange}
                        placeholder={t('form.debtor_address')}
                        required
                        type='text'
                        value={form.debtor_address}
                    />
                </div>

                {/* Age */}
                <div className="col-md-3">
                    <label className="form-label">{t('form.debtor_age')}</label>
                    <input
                        aria-label={t('form.debtor_age')}
                        className="form-control mb-3"
                        disabled
                        id="debtor_age"
                        name="debtor_age"
                        onChange={handleChange}
                        placeholder={t('form.debtor_age')}
                        required
                        value={form.debtor_age}
                    />
                </div>

                {/* Is Merchant */}
                <div className="col-md-3 align-self-center">
                    <div className='form-check form-switch form-check-reverse mt-4'>
                        <label className="form-label" htmlFor='debtor_is_merchant'>{t('form.is_merchant.title')}</label>
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id='debtor_is_merchant'
                            name="debtor_is_merchant"
                            value={form.debtor_is_merchant}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </form>

            <div className="card my-3">
                <div className="card-body">
                    <h5 className="card-title">{t('exampleTitle')}</h5>
                    <p className="card-text">
                        {t.rich('example', {
                            firstName: (chunks) => <span>{form.debtor_first_name || '________'}</span>,
                            lastName: (chunks) => <span>{form.debtor_last_name || '________'}</span>,
                            documentNumber: (chunks) => <span>{form.debtor_document_number || '________'}</span>,
                            expeditionCity: (chunks) => <span>{form.debtor_expedition_city || '________'}</span>,
                            isMerchant: (chunks) => <span>{form.debtor_is_merchant ? '' : 'NO'}</span>,
                            cellPhone: (chunks) => <span>{form.debtor_cell_phone || '________'}</span>,
                            email: (chunks) => <span>{form.debtor_email || '________'}</span>
                        })}
                    </p>
                </div>
            </div>
        </>
    );
}

Step2PersonalData.propTypes = {
    data: PropTypes.object,
    updateData: PropTypes.func.isRequired,
    onNext: PropTypes.func,
};
