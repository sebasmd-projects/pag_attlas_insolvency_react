// src/app/[locale]/platform/(home)/steps/StepTest1.jsx

'use client'

import { useTranslations } from 'next-intl';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import TitleComponent from '@/components/micro-components/title';

export default function StepTest1({ data, updateData, onNext }) {

    const t = useTranslations('Platform.pages.home.wizard.steps.stepTest');

    const initialState = {
        input_field_test: data?.test?.input_field_test || '',
        check_box_field_test: data?.test?.check_box_field_test || false,
    }

    const [form, setForm] = useState(() => (initialState));

    useEffect(() => { setForm(initialState) }, []);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setForm((prev) => {
            const nextState = { ...prev, [name]: newValue };
            updateData({ test: { ...data.test, ...nextState } });
            return nextState;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext({ test: { ...data.test, ...form } });
    };

    return (
        <>
            <TitleComponent title='Step Test' />

            <form onSubmit={handleSubmit} className="row" id="wizard-step-form">
                <div className="col-md-6">
                    <input
                        className="form-control mb-3"
                        name="input_field_test"
                        placeholder='Nombres'
                        value={form.input_field_test}
                        onChange={handleChange}
                        required
                        aria-label='Nombres'
                    />
                </div>

                <div className="col-md-6">
                    <input
                        checked={form.check_box_field_test}
                        className="form-check-input"
                        id="check_box_field_test"
                        name='check_box_field_test'
                        onChange={handleChange}
                        required
                        type="checkbox"
                    />
                </div>
            </form>
        </>
    );
}

StepTest1.propTypes = {
    data: PropTypes.object,
    updateData: PropTypes.func.isRequired,
    onNext: PropTypes.func,
};
