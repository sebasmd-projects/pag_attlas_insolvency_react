// src/app/[locale]/platform/insolvency/wizard/steps/Step0Instrucciones.jsx

'use client';
import TitleComponent from '@/components/micro-components/title';
import SubTitleComponent from '@/components/micro-components/sub_title';
import { useTranslations } from 'next-intl';

export default function Step0Instrucciones({ onNext, isSubmitting }) {

    const t = useTranslations('Platform.pages.home.wizard.steps.step0');

    function commonText({ articleTitle, articleDescription, articleTitleExample, articleExample, articleExampleHeaders, articleExampleItems }) {
        return (
            <>
                <h4 className='h6'>{t(articleTitle)}</h4>
                <p>
                    {t.rich(articleDescription, {
                        bold: (chunks) => (
                            <strong>
                                {chunks}
                            </strong>
                        )
                    })}
                </p>

                {
                    articleTitleExample && (
                        <p>
                            {t.rich(articleTitleExample, {
                                bold: (chunks) => (
                                    <strong>
                                        {chunks}
                                    </strong>
                                )
                            })}
                        </p>
                    )
                }

                <p className='card'>
                    <span className='card-body'>
                        {t.rich(articleExample, {
                            bold: (chunks) => (
                                <strong>
                                    {chunks}
                                </strong>
                            ),
                            p: (chunks) => (
                                <p>
                                    {chunks}
                                </p>
                            ),
                        })}
                    </span>
                </p>

                {articleExampleHeaders && articleExampleItems && (
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                {articleExampleHeaders.map((header, index) => (
                                    <th key={index}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {articleExampleItems.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((value, colIndex) => (
                                        <td key={colIndex}>{value}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </>
        )
    }

    return (
        <div>
            <TitleComponent title={t('title')} />
            <SubTitleComponent t={t} sub_title={'subTitle'} />

            <h3 className='h5'>Ten en cuenta que los datos recopilados serán utilizados de la siguiente forma:</h3>

            <ol type='I'>
                <li>
                    {commonText({ articleTitle: 'articles.1.title', articleDescription: 'articles.1.description', articleExample: 'articles.1.example' })}
                </li>

                <li>
                    {commonText({ articleTitle: 'articles.2.title', articleDescription: 'articles.2.description', articleExample: 'articles.2.example' })}
                </li>

                <li>
                    {commonText({ articleTitle: 'articles.3.title', articleDescription: 'articles.3.description', articleTitleExample: "articles.3.accompaniment", articleExample: 'articles.3.example' })}
                </li>

                <li>
                    {commonText({ articleTitle: 'articles.4.title', articleDescription: 'articles.4.description', articleTitleExample: "articles.4.accompaniment", articleExample: 'articles.4.example' })}
                </li>

                <li>
                    {commonText({ articleTitle: 'articles.5.title', articleDescription: 'articles.5.description', articleExampleHeaders: 'articles.5.exampleHeaders' })}
                </li>

                <li>
                    {commonText({ articleTitle: 'articles.6.title', articleDescription: 'articles.6.description', articleExample: 'articles.6.example' })}
                </li>

                <li>
                    {commonText({ articleTitle: 'articles.7.title', articleDescription: 'articles.7.description', articleExample: 'articles.7.example' })}
                </li>

                <li>
                    {commonText({ articleTitle: 'articles.8.title', articleDescription: 'articles.8.description', articleExample: 'articles.8.example' })}
                </li>

                <li>
                    {commonText({ articleTitle: 'articles.9.title', articleDescription: 'articles.5.description', articleExample: 'articles.9.example' })}
                </li>

                <li>
                    {commonText({ articleTitle: 'articles.10.title', articleDescription: 'articles.10.description', articleExample: 'articles.10.example' })}
                </li>

            </ol>

            <button
                type="button"
                className="btn btn-primary"
                onClick={() => onNext({})}
                disabled={isSubmitting}
            >
                Siguiente
            </button>
        </div>
    );
}
