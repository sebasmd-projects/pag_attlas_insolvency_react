'use client'

import { useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import GetFinancialEducation from './components/fetchFinancialEducation';
import ContentSection from './components/sections/Content';
import FilterSection from './components/sections/Filters';
import HeaderSection from './components/sections/Header';

function ContentSectionSkeleton() {
    return (
        <>
            <div className="mb-4 g-3 row">
                <div className="col-md-8">
                    <input placeholder="..." className="form-control" type="search" readOnly />
                </div>
                <div className="col-md-4">
                    <div className="flex-wrap hstack gap-2">
                        <button type="button" className="btn btn-primary btn-sm">...</button>
                        <button type="button" className="btn btn-outline-primary btn-sm">...</button>
                        <button type="button" className="btn btn-outline-primary btn-sm">...</button>
                        <button type="button" className="btn btn-outline-primary btn-sm">...</button>
                        <button type="button" className="btn btn-outline-primary btn-sm">...</button>
                        <button type="button" className="btn btn-outline-primary btn-sm">...</button>
                    </div>
                </div>
            </div>
            <Row>
                {[1, 2, 3].map((_, index) => (
                    <div key={index} className="d-flex flex-column flex-md-row gap-4 mb-5">
                        <Col md={6} className={index % 2 !== 0 ? 'order-md-2' : ''}>
                            <div style={{ aspectRatio: '16 / 9', backgroundColor: '#e0e0e0', borderRadius: '0.5rem' }} />
                        </Col>
                        <Col md={6} className={index % 2 !== 0 ? 'order-md-1' : ''}>
                            <div style={{ height: '100%', backgroundColor: '#f5f5f5', borderRadius: '0.5rem', padding: '1rem' }}>
                                <div style={{ height: '24px', width: '60%', backgroundColor: '#e0e0e0', marginBottom: '1rem' }} />
                                <div style={{ height: '16px', width: '80%', backgroundColor: '#e0e0e0', marginBottom: '0.5rem' }} />
                                <div style={{ height: '16px', width: '90%', backgroundColor: '#e0e0e0', marginBottom: '0.5rem' }} />
                                <div style={{ height: '16px', width: '70%', backgroundColor: '#e0e0e0', marginBottom: '1rem' }} />
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {[1, 2, 3].map((_, i) => (
                                        <div key={i} style={{ height: '24px', width: '60px', backgroundColor: '#e0e0e0', borderRadius: '0.25rem' }} />
                                    ))}
                                </div>
                            </div>
                        </Col>
                    </div>
                ))}
            </Row>
        </>
    );
}

export default function FinancialEducationPage() {
    const t = useTranslations('Pages.servicesPage.financialEducation');
    const locale = useLocale();
    const isEnglish = locale === 'en';

    const [searchQuery, setSearchQuery] = useState('');

    const [selectedCategory, setSelectedCategory] = useState(t('all_category'));

    // Reset filter when language changes
    useEffect(() => setSelectedCategory(t('all_category')), [locale]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['financialEducation', locale],
        queryFn: () => GetFinancialEducation()
    });

    const sanitizeHTML = (dirtyHTML) => ({
        __html: DOMPurify.sanitize(dirtyHTML)
    });

    if (isLoading) return (
        <div className="container text-center py-5">
            <HeaderSection translation={t} />
            <ContentSectionSkeleton />
        </div>
    );

    if (error) return (
        <div className="container text-center py-5">
            <HeaderSection translation={t} />
            <ContentSectionSkeleton />
        </div>
    );

    // Filter sections available in current locale
    const localeSections = data.filter(section =>
        isEnglish ? section.title_en !== undefined : section.title !== undefined
    );

    // Generate localized categories for filtering
    const categoriesForButtons = [
        t('all_category'),
        ...new Set(
            localeSections.flatMap(section => {
                const category = isEnglish ?
                    (section.category_en ?? section.category) :
                    (section.category ?? section.category_en);
                return category ? (Array.isArray(category) ? category : [category]) : [];
            })
        )
    ];

    // Filter sections based on search and category
    const filteredSections = localeSections.filter(section => {
        const localizedTitle = isEnglish ? section.title_en : section.title;
        const localizedDescription = isEnglish ? section.description_en : section.description;
        const rawCategory = isEnglish ? section.category_en : section.category;
        const categories = rawCategory ? (Array.isArray(rawCategory) ? rawCategory : [rawCategory]) : [];

        const matchesCategory = selectedCategory === t('all_category') ||
            categories.includes(selectedCategory);

        const matchesSearch = (localizedTitle || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) || (localizedDescription || '')
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });



    return (
        <div className="container py-5">
            <HeaderSection translation={t} />
            <FilterSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categoriesForButtons={categoriesForButtons} />
            <ContentSection filteredSections={filteredSections} isEnglish={isEnglish} sanitizeHTML={sanitizeHTML} />
        </div>
    );
};