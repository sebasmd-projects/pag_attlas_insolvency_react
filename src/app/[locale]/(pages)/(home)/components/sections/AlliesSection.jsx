'use client';

import { useTranslations } from 'next-intl';
import TitleComponent from '@/components/micro-components/title';
import SubTitleComponent from '@/components/micro-components/sub_title';
import Image from "next/image";

export default function AlliesSection() {

    const t = useTranslations('Pages.homePage.sections.allies');

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
            src: "/assets/imgs/page/aegis_app.webp", alt: "Logo AEGIS App"
        },
        {
            src: "/assets/imgs/page/calma_app.webp", alt: "Logo CALMA App"
        }
    ];

    return (
        <section id="allies">
            <div className="container py-5 text-center">
                <TitleComponent title={t('title')} />
                <SubTitleComponent t={t} sub_title={'sub_title'} />

                <div className="row mt-4 justify-content-center align-items-center">
                    {allies.map((ally, index) => (
                        <div className="col-4 col-md-3 mb-4" key={index}>
                            <div className="allies-logo-box">
                                <Image
                                    src={ally.src}
                                    alt={ally.alt}
                                    width={900}
                                    height={222}
                                    className={`img-fluid rounded shadow-sm allies-logo ${ally.src.includes("flag") ? "allies-flag" : ""
                                        }`}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <SubTitleComponent t={t} sub_title={'sub_title_apps'} />

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
