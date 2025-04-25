// src/app/[locale]/platform/(home)/steps/Step1LegalRequirements.jsx

'use client';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ReactSVG } from 'react-svg';
import { toast } from 'react-toastify';
import { MdSaveAs } from "react-icons/md";

import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';

async function GetStep1() {
    const { data } = await axios.get('/api/platform/insolvency-form/get-data/?step=1');
    return data;
}

export default function Step1LegalRequirements({ data, updateData, onNext }) {
    const t = useTranslations('Platform.pages.home.wizard.steps.step1');
    const queryClient = useQueryClient();

    // 1) Fetch DB data on every mount
    const { data: step1Data } = useQuery({
        queryKey: ['step1Data'],
        queryFn: GetStep1,
        refetchOnMount: true,
    });

    // 2) Local form state
    const [form, setForm] = useState({
        accept_legal_requirements: false,
        accept_terms_and_conditions: false,
    });

    // 3) Init only once per mount
    const initialized = useRef(false);
    useEffect(() => {
        if (step1Data && !initialized.current) {
            const init = {
                accept_legal_requirements: !!step1Data.accept_legal_requirements,
                accept_terms_and_conditions: !!step1Data.accept_terms_and_conditions,
            };
            setForm(init);
            updateData(init);
            initialized.current = true;
        }
    }, [step1Data, updateData]);

    // 4) PATCH step 1 without advancing
    const saveMutation = useMutation({
        mutationFn: () =>
            axios.patch('/api/platform/insolvency-form/?step=1', form),
        onSuccess: () => {
            toast.success(t('messages.saveSuccess'));
            queryClient.invalidateQueries(['step1Data']);
        },
        onError: () => toast.error(t('messages.saveError'))
    });

    const handleSave = () => saveMutation.mutate();

    // 5) Submit form and advance to next step
    const handleSubmit = (e) => {
        e.preventDefault();
        onNext(form);
    };

    // 6) Handle checkbox changes
    const handleChange = ({ target: { name, checked } }) => {
        setForm((prev) => {
            const next = { ...prev, [name]: checked };
            updateData(next);
            return next;
        });
    };

    function commonText({ articleTitle, articleDescription }) {
        return (
            <>
                <h4 className='h6'><strong>{t(articleTitle)}</strong></h4>
                <p>
                    {t.rich(articleDescription, {
                        bold: (chunks) => (
                            <strong>
                                {chunks}
                            </strong>
                        )
                    })}
                </p>
            </>
        )
    }

    return (
        <>
            <TitleComponent title={t('title')} />
            <SubTitleComponent t={t} sub_title={'subTitle'} />

            <h3 className="h5 my-5 d-flex align-items-center">
                <span style={{ width: '20px', height: '20px' }} className="mx-5">
                    <ReactSVG src="/assets/imgs/icons/contact.svg" />
                </span>
                <span className="ms-2">
                    {t.rich('description', {
                        link: (chunks) => (
                            <Link href="https://wa.me/573012283818" rel="noopener noreferrer" target="_blank">
                                {chunks}
                            </Link>
                        )
                    })}
                </span>
            </h3>

            <h4>
                {
                    t.rich('advisor', {
                        u: (chunks) => (
                            <u className="">
                                {chunks}
                            </u>
                        )
                    })
                }
            </h4>

            <ol type='I' className=''>
                <li className="mb-3">
                    {commonText({ articleTitle: 'articles.1.title', articleDescription: 'articles.1.description' })}
                </li>

                <li className="mb-3">
                    {commonText({ articleTitle: 'articles.2.title', articleDescription: 'articles.2.description' })}
                </li>

                <li className="mb-3">
                    {commonText({ articleTitle: 'articles.3.title', articleDescription: 'articles.3.description' })}
                </li>

                <li className="mb-3">
                    {commonText({ articleTitle: 'articles.4.title', articleDescription: 'articles.4.description' })}
                </li>

                <li className="mb-3">
                    {commonText({ articleTitle: 'articles.5.title', articleDescription: 'articles.5.description' })}
                </li>

                <li className="mb-3">
                    {commonText({ articleTitle: 'articles.6.title', articleDescription: 'articles.6.description' })}
                </li>

                <li className="mb-3">
                    {commonText({ articleTitle: 'articles.7.title', articleDescription: 'articles.7.description' })}
                </li>

                <li className="mb-3">
                    {commonText({ articleTitle: 'articles.8.title', articleDescription: 'articles.8.description' })}
                </li>

                <li className="mb-3">
                    {commonText({ articleTitle: 'articles.9.title', articleDescription: 'articles.5.description' })}
                </li>

                <li className="mb-3">
                    {commonText({ articleTitle: 'articles.10.title', articleDescription: 'articles.10.description' })}
                </li>

                <li className="mb-3">
                    {commonText({ articleTitle: 'articles.11.title', articleDescription: 'articles.11.description' })}
                </li>
            </ol>

            <form onSubmit={handleSubmit} id="wizard-step-form">
                <div className="mb-4 card alert alert-success">
                    <div className="mx-5 form-check card-body">
                        <input
                            id="accept_legal_requirements"
                            name="accept_legal_requirements"
                            type="checkbox"
                            className="form-check-input"
                            checked={form.accept_legal_requirements}
                            onChange={handleChange}
                            required
                        />
                        <label className="form-check-label" htmlFor="accept_legal_requirements">
                            {t('accept_terms')}
                        </label>
                    </div>

                    <div className="mx-5 form-check card-body">
                        <input
                            id="accept_terms_and_conditions"
                            name="accept_terms_and_conditions"
                            type="checkbox"
                            className="form-check-input"
                            checked={form.accept_terms_and_conditions}
                            onChange={handleChange}
                            required
                        />
                        <label className="form-check-label" htmlFor="accept_terms_and_conditions">
                            {t.rich('accept_terms_and_conditions', {
                                termsLink: (chunks) => (
                                    <Link
                                        href="/documents/legal/terms-and-conditions"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {chunks}
                                    </Link>
                                ),
                                privacyLink: (chunks) => (
                                    <Link
                                        href="/documents/legal/policies-for-the-treatment-of-information"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {chunks}
                                    </Link>
                                ),
                            })}
                        </label>
                    </div>
                </div>
            </form>

            <div className="my-3">
                <button
                    type="button"
                    className="btn btn-outline-info"
                    onClick={handleSave}
                    disabled={saveMutation.isLoading}
                >
                    <MdSaveAs /> {saveMutation.isLoading ? t('messages.saving') : t('messages.save')}
                </button>
            </div>
        </>
    );
}

Step1LegalRequirements.propTypes = {
    data: PropTypes.object,
    updateData: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
};
