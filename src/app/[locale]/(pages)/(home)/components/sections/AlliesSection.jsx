'use client';

import { useTranslations } from 'next-intl';
import TitleComponent from '@/components/micro-components/title';
import SubTitleComponent from '@/components/micro-components/sub_title';
import Image from "next/image";

export default function AlliesSection() {

    const t = useTranslations('Pages.homePage.sections.allies');

    // Lista de imágenes de aliados
    const allies = [
        { src: "/assets/imgs/page/brand1.webp", alt: "Aliado 1" },
        { src: "/assets/imgs/page/brand2.webp", alt: "Aliado 2" },
        { src: "/assets/imgs/page/brand3.webp", alt: "Aliado 3" },
        { src: "/assets/imgs/page/brand4.webp", alt: "Aliado 4" },
    ];

    return (
        <section id="allies">
            <div className="container py-5 text-center">
                <TitleComponent title={t('title')} />
                <SubTitleComponent t={t} sub_title={'sub_title'} />

                <div className="row mt-4 justify-content-center">
                    {allies.map((ally, index) => (
                        <div className="col-3 mb-4" key={index} data-aos="zoom-in" data-aos-delay={index * 100}>
                            <Image
                                src={ally.src}
                                alt={ally.alt}
                                width={900}
                                height={222}
                                className="img-fluid rounded shadow-sm"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
