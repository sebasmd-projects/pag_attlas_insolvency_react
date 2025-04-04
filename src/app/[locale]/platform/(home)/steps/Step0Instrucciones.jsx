// src/app/[locale]/platform/(home)/steps/Step0Instrucciones.jsx

'use client';

import { useEffect, useState } from 'react';
import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FaArrowCircleRight } from "react-icons/fa";
import { ReactSVG } from 'react-svg';

export default function Step0Instrucciones({ onNext, isSubmitting }) {

    const t = useTranslations('Platform.pages.home.wizard.steps.step0');
    const wizardButton = useTranslations('Platform.pages.home.wizard.buttons');

    const [form, setForm] = useState({
        accept_terms: false,
    });

    useEffect(() => {
        setForm({
            accept_terms: false,
        });
    }, []);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.accept_terms) return;
        onNext(form);
    };

    return (
        <div className='container my-5'>
            <TitleComponent title={t('title')} />
            <SubTitleComponent t={t} sub_title={'subTitle'} />

            <h3 className="h5 my-5 d-flex align-items-center">
                <span style={{ width: '20px', height: '20px' }} className="mx-5">
                    <ReactSVG src="/assets/imgs/icons/contact.svg" />
                </span>
                <span className="ms-2">
                    {t.rich('description', {
                        link: (chunks) => (
                            <Link href="https://wa.me/573183280176" rel="noopener noreferrer" target="_blank">
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

            <form onSubmit={handleSubmit}>
                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="accept_terms"
                        required
                        checked={form.accept_terms}
                        onChange={(e) =>
                            setForm(prev => ({ ...prev, accept_terms: e.target.checked }))
                        }
                    />
                    <label className="form-check-label" htmlFor="accept_terms">
                        {t('accept_terms')}
                    </label>
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {wizardButton('processing')}
                        </>
                    ) : (
                        <>
                            {wizardButton('next')} <FaArrowCircleRight className='ms-2' />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
