'use client'

import CardComponent from '@/components/micro-components/card';
import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';
import { useQuery } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import Image from "next/image";
import { useState } from "react";
import { MdQuestionAnswer } from "react-icons/md";
import OtherFAQComponent from './components/otherFAQContent';
import InputSearchComponent from './components/searchInput';
import SkeletonLoaderComponent from './components/skeletonLoader';
import { GetMainFAQ, GetOtherFAQ } from './fetchFAQ';

export default function FAQPage() {
    const t = useTranslations('Pages.aboutUs.pages.faq.sections');
    const locale = useLocale();
    const [searchTerm, setSearchTerm] = useState("");
    const [openItems, setOpenItems] = useState([]);
    const { data: mainData, isLoading: mainLoading, error: mainError } = useQuery({ queryKey: ['mainFAQ', locale], queryFn: () => GetMainFAQ() });
    const { data: otherData, isLoading: otherLoading, error: otherError } = useQuery({ queryKey: ['otherFAQ', locale], queryFn: () => GetOtherFAQ() });
    const filterFAQs = (data) => data?.filter(faq => faq.language === locale && (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))) || [];
    const filteredOtherFAQs = filterFAQs(otherData);
    const toggleItem = (id) => setOpenItems(openItems.includes(id) ? openItems.filter(item => item !== id) : [...openItems, id]);

    if (mainLoading || otherLoading) {
        return <SkeletonLoaderComponent t={t} />;
    }

    if (mainError || otherError) {
        return <SkeletonLoaderComponent t={t} />;
    }

    return (
        <section className="container-lg py-5">
            <div className="row g-4 align-items-center">
                <div className="col-md-7">
                    <div className="mb-4">
                        <TitleComponent title={t('heroSection.title_h1')} />
                        <SubTitleComponent t={t} sub_title={'heroSection.title_h2'} />
                    </div>
                    <div className="row g-4">
                        {mainData.map((faq) => (
                            <div key={faq.id} className="col-12 col-md-6">
                                <CardComponent icon={<MdQuestionAnswer />} title={faq.question} description={faq.answer} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-md-4">
                    <Image
                        src="/assets/imgs/page/solutions-img.png"
                        alt="Financial solutions"
                        className="img-fluid rounded-5"
                        loading="lazy"
                        width={600}
                        height={600}
                    />
                </div>
            </div>

            <div className="row g-4 pt-5">
                <div className="col-12">
                    <InputSearchComponent t={t} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    <OtherFAQComponent t={t} filteredOtherFAQs={filteredOtherFAQs} openItems={openItems} toggleItem={toggleItem} />
                </div>
            </div>
        </section>
    );
}
