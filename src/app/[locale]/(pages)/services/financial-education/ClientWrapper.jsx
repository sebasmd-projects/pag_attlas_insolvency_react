'use client'

import { useEffect, useState } from 'react';
import ContentSection from './components/sections/Content';
import FilterSection from './components/sections/Filters';
import HeaderSection from './components/sections/Header';

export default function ClientWrapper({ localeSections, categoriesForButtons, translations, isEnglish }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(translations.allCategory);

    // Resetear categoría al cambiar idioma
    useEffect(() => {
        setSelectedCategory(translations.allCategory);
    }, [translations.allCategory]);

    // Filtrar secciones
    const filteredSections = localeSections.filter(section => {
        const title = isEnglish ? section.title_en : section.title;
        const description = isEnglish ?
            (section.description_en ?? section.description) :
            section.description;
        const categories = (isEnglish ?
            (section.category_en ?? section.category) :
            (section.category ?? section.category_en)) || [];

        return (
            title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedCategory === translations.allCategory ||
                categories.includes(selectedCategory))
        );
    });

    return (
        <div className="container py-5">
            <HeaderSection />
            <FilterSection
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categoriesForButtons={categoriesForButtons}
                searchPlaceholder={translations.searchPlaceholder}
            />
            <ContentSection
                filteredSections={filteredSections}
                isEnglish={isEnglish}
            />
        </div>
    );
}