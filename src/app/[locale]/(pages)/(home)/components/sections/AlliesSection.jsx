'use client';

import { useTranslations, useLocale } from 'next-intl';
import TitleComponent from '@/components/micro-components/title';
import SubTitleComponent from '@/components/micro-components/sub_title';
import Image from "next/image";

export default function AlliesSection() {

    const t = useTranslations('Pages.homePage.sections.allies');
    const locale = useLocale();


    // Lista de imágenes de aliados
    const allies = [
        { src: "/assets/imgs/page/recovery_repatriation_h.webp", alt: "Logo recovery repatriation foundation" },
        { src: "/assets/imgs/page/flag.webp", alt: "Colombia EEUU" },
        { src: "/assets/imgs/page/propensiones_h.webp", alt: "Logo propensiones abogados" },
    ];

    const propensiones_apps = [
        {
            src: "/assets/imgs/page/hermes_app.webp", alt: "Logo HERMES App"
        },
        {
            src: "/assets/imgs/page/calma_app.webp", alt: "Logo CALMA App"
        }
    ];

    const groupImage = locale === 'es'
        ? "/assets/imgs/page/group_es.png"
        : "/assets/imgs/page/group_en.png";

    return (
        <section id="allies">
            <div className="container py-5 text-center">
                <TitleComponent title={t('title')} aos="fade-right" />
                <SubTitleComponent t={t} sub_title={'sub_title'} aos="fade-right" aosDelay="100" />

                

                <div className="row mt-4 justify-content-center align-items-center">
                    {allies.map((ally, index) => (
                        <div className="col-4 col-md-3 mb-4" key={index}>
                            <div className="allies-logo-box">
                                <Image
                                    data-aos="zoom-in"
                                    data-aos-delay={index * 100}
                                    src={ally.src}
                                    alt={ally.alt}
                                    width={900}
                                    height={222}
                                    className={`img-fluid rounded shadow-sm allies-logo ${ally.src.includes("flag") ? "allies-flag" : ""}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>

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
            </div>
        </section>
    );
}
