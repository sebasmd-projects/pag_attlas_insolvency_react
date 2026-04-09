'use client';

import { useTranslations, useLocale } from 'next-intl';
import TitleComponent from '@/components/micro-components/title';
import SubTitleComponent from '@/components/micro-components/sub_title';
import Image from "next/image";

export default function AlliesSection() {

    const t = useTranslations('Pages.homePage.sections.allies');
    const locale = useLocale();

    const groupImage = locale === 'es'
        ? "/assets/imgs/page/group_es.png"
        : "/assets/imgs/page/group_en.png";

    const propensiones_apps = [
        {
            src: "/assets/imgs/page/hermes_app.webp", alt: "Logo HERMES App"
        },
        {
            src: "/assets/imgs/page/calma_app.webp", alt: "Logo CALMA App"
        }
    ];

    return (
        <section id="allies">
            <div className="container py-5 text-center">
                <TitleComponent title={t('title')} aos="fade-right" />
                <SubTitleComponent t={t} sub_title={'sub_title'} aos="fade-right" aosDelay="100" />

                <div className="row my-4 justify-content-center align-items-center">
                    <Image
                        data-aos="zoom-in"
                        data-aos-delay="100"
                        src={groupImage}
                        alt="Logo grupo propensiones"
                        width={900}
                        height={222}
                        className="img-fluid rounded shadow-sm allies-logo"
                    />
                </div>

                <SubTitleComponent t={t} sub_title={'sub_title_apps'} aos="fade-right" aosDelay="100" />

                <div className="row mt-4 justify-content-center">
                    <div className="col-3 mb-4" data-aos="zoom-in" data-aos-delay={1 * 100}>
                        <Image
                            src="/assets/imgs/page/gea_app.webp"
                            alt="Logo GEA"
                            width={900}
                            height={222}
                            className="img-fluid rounded shadow-sm"
                        />
                    </div>
                </div>

                <div className="row mt-4 justify-content-center">
                    {propensiones_apps.map((ally, index) => (
                        <div className="col-3 mb-4" key={index} data-aos="zoom-in" data-aos-delay={index * 100}>
                            <Image
                                src={ally.src}
                                alt={ally.alt}
                                width={750}
                                height={185}
                                className="img-fluid rounded shadow-sm"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
