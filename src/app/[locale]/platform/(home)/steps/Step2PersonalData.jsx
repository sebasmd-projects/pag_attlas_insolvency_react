// src/app/[locale]/platform/(home)/steps/Step2PersonalData.jsx

'use client';

import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { MdSaveAs } from "react-icons/md";

import { useStep } from '../hooks/useStep';

import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';



export default function Step2PersonalData({ updateData, onNext }) {

    const buildInitial = (serverData) => ({
        debtor_document_number: serverData?.debtor_document_number ?? '',
        debtor_expedition_city: serverData?.debtor_expedition_city ?? '',
        debtor_first_name: serverData?.debtor_first_name ?? '',
        debtor_last_name: serverData?.debtor_last_name ?? '',
        debtor_is_merchant: serverData?.debtor_is_merchant ?? false,
        debtor_cell_phone: serverData?.debtor_cell_phone ?? '',
        debtor_email: serverData?.debtor_email ?? '',
        debtor_birth_date: serverData?.debtor_birth_date ?? '',
        debtor_age: serverData?.debtor_age ?? '',
        debtor_address: serverData?.debtor_address ?? '',
        debtor_sex: serverData?.debtor_sex ?? '',
    });

    const { form, setForm, t, handleSubmit, handleSave, saveLoading } = useStep({
        stepNumber: 2,
        buildInitial,
        updateData,
        onNext,
    });

    const calculateAge = () => {
        const today = new Date();
        const birth = new Date(form.debtor_birth_date);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };


    const handleChange = useCallback(
        (e) => {
            const { name, type, checked, value } = e.target;
            let newValue = type === 'checkbox' ? checked : value;
            if (['debtor_expedition_city', 'debtor_first_name', 'debtor_last_name'].includes(name)) {
                newValue = newValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
            }
            setForm((prev) => ({ ...prev, [name]: newValue }));
            updateData({ [name]: newValue });
        },
        [form, updateData]
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

                        value={`${calculateAge()}`}
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

            <div className="my-3">
                <button
                    type="button"
                    className="btn btn-outline-info"
                    onClick={handleSave}
                    disabled={saveLoading}
                >
                    <MdSaveAs /> {saveLoading ? t('messages.saving') : t('messages.save')}
                </button>
            </div>

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
    updateData: PropTypes.func.isRequired,
    onNext: PropTypes.func,
};
