'use client'

import { useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import ContentSection from './components/sections/Content';
import FilterSection from './components/sections/Filters';
import HeaderSection from './components/sections/Header';
import GetFinancialEducation from './components/fetchFinancialEducation';


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

    if (isLoading) return <div>Loading...</div>;

    if (error) return <div>Error loading content</div>;

    // Filter sections available in current locale
    const localeSections = data.sections.filter(section =>
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
        const localizedDescription = isEnglish ?
            (section.description_en ?? section.description) : section.description;
        const rawCategory = isEnglish ?
            (section.category_en ?? section.category) :
            (section.category ?? section.category_en);
        const categories = rawCategory ? (Array.isArray(rawCategory) ? rawCategory : [rawCategory]) : [];

        const matchesCategory = selectedCategory === t('all_category') ||
            categories.includes(selectedCategory);
        const matchesSearch = localizedTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (localizedDescription || '').toLowerCase().includes(searchQuery.toLowerCase());

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