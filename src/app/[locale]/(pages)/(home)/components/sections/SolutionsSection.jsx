"use client";

import CardComponent from '@/components/micro-components/card';
import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';
import { useTranslations } from 'next-intl';
import Image from "next/image";
import { ReactSVG } from 'react-svg';

export default function SolutionsSection() {
    const t = useTranslations('Pages.homePage.sections.solutionsSection');

    const features = [
        {
            icon: <ReactSVG src="/assets/imgs/icons/contact.svg" />,
            title: t('features.feature1.title'),
            description: t('features.feature1.description'),
            aosDelay: 50
        },
        {
            icon: <ReactSVG src="/assets/imgs/icons/family.svg" />,
            title: t('features.feature2.title'),
            description: t('features.feature2.description'),
            aosDelay: 60
        },
        {
            icon: <ReactSVG src="/assets/imgs/icons/blearning.svg" />,
            title: t('features.feature3.title'),
            description: t('features.feature3.description'),
            aosDelay: 70
        },
        {
            icon: <ReactSVG src="/assets/imgs/icons/hand_person_hearth.svg" />,
            title: t('features.feature4.title'),
            description: t('features.feature4.description'),
            aosDelay: 80
        }
    ];

    return (
        <section>
            <div className="container-lg py-5">
                <div className="row g-4 align-items-center d-flex">
                    <div className="col-md-7">
                        <div className="mb-4">
                            <TitleComponent title={t('title_h1')} />
                            <SubTitleComponent t={t} sub_title={'title_h2'} />
                            <p
                                className="mb-4"
                                style={{
                                    fontSize: '1rem',
                                    lineHeight: '1.688rem',
                                }}
                            >
                                {t('description_p')}
                            </p>
                        </div>

                        <div className="row g-4">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="col-12 col-md-6"
                                    data-aos="fade-down"
                                    data-aos-delay={feature.aosDelay}
                                >
                                    <CardComponent
                                        icon={feature.icon}
                                        title={feature.title}
                                        description={feature.description}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-md-5 d-flex justify-content-center align-items-center order-1 order-md-0" data-aos="fade-right" data-aos-delay="100">
                        <Image
                            src="/assets/imgs/page/solutions-img.png"
                            alt="Financial solutions"
                            className="img-fluid rounded-2"
                            loading="lazy"
                            width={600}
                            height={600}
                        />
                    </div>
                    
                    <div className="col-md-5 d-flex justify-content-center align-items-center order-1 order-md-0" data-aos="fade-right" data-aos-delay="100">
                        <Image
                            src="/assets/imgs/page/solutions-img.png"
                            alt="Financial solutions"
                            className="img-fluid rounded-2"
                            loading="lazy"
                            width={600}
                            height={600}
                        />
                    </div>

                    <div className="col-6">
                        <div className="d-flex justify-content-center">
                            <h5>
                                {t('onu_desa')}
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
