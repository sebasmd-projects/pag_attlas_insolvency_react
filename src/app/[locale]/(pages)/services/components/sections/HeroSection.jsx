import CardComponent from '@/components/micro-components/card';
import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';
import { useTranslations } from 'next-intl';
import Image from "next/image";
import { BsStoplights } from "react-icons/bs";
import { FaBalanceScale, FaFileContract, FaHandshake } from "react-icons/fa";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { RiHomeHeartLine } from "react-icons/ri";
import { TbPigMoney } from "react-icons/tb";

export default function ServicesHeroSection() {

    const t = useTranslations('Pages.servicesPage.sections.heroSection');

    const mainFeatures = [
        {
            icon: <BsStoplights size={32} />,
            title: t('features.feature1.title'),
            description: t('features.feature1.description')
        },
        {
            icon: <FaMoneyBillTrendUp size={32} />,
            title: t('features.feature2.title'),
            description: t('features.feature2.description')
        },
        {
            icon: <FaHandshake size={32} />,
            title: t('features.feature3.title'),
            description: t('features.feature3.description')
        },
        {
            icon: <RiHomeHeartLine size={32} />,
            title: t('features.feature4.title'),
            description: t('features.feature4.description')
        }
    ];

    const additionalFeatures = [
        {
            icon: <FaFileContract size={32} />,
            title: t('features.feature5.title'),
            description: t('features.feature5.description')
        },
        {
            icon: <TbPigMoney size={32} />,
            title: t('features.feature6.title'),
            description: t('features.feature6.description')
        },
        {
            icon: <FaBalanceScale size={32} />,
            title: t('features.feature7.title'),
            description: t('features.feature7.description')
        }
    ];

    return (
        <section className="py-5">
            <div className="container-lg">
                <div className="row g-4 align-items-center">
                    {/* Sección de Imágenes */}
                    <div className="col-lg-6 col-md-6 order-2 order-md-1 mt-4 pt-2 mt-sm-0 opt-sm-0">
                        <div className="row align-items-center">
                            <div className="col-lg-6 col-md-6 col-6">
                                <div className="row">
                                    <div className="col-lg-12 col-md-12 mt-4 pt-2">
                                        <div className="card work-desk rounded border-0 shadow-lg overflow-hidden" data-aos="fade-right" data-aos-delay="100">
                                            <Image
                                                src="/assets/imgs/page/306x241.webp" className="img-fluid"
                                                alt="Image"
                                                width={306}
                                                height={241}
                                            />
                                            <div className="img-overlay bg-dark"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-6">
                                <div className="row">
                                    <div className="col-lg-12 col-md-12">
                                        <div className="card work-desk rounded border-0 shadow-lg overflow-hidden" data-aos="fade-down" data-aos-delay="100">
                                            <Image
                                                src="/assets/imgs/page/337x450.avif" className="img-fluid"
                                                alt="Image"
                                                width={337}
                                                height={450}
                                            />
                                            <div className="img-overlay bg-dark"></div>
                                        </div>
                                    </div>

                                    <div className="col-lg-12 col-md-12 mt-4 pt-2">
                                        <div className="card work-desk rounded border-0 shadow-lg overflow-hidden" data-aos="fade-up" data-aos-delay="100">
                                            <Image
                                                src="/assets/imgs/page/600x400.webp" className="img-fluid"
                                                alt="Image"
                                                width={600}
                                                height={400}
                                            />
                                            <div className="img-overlay bg-dark"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección de Contenido */}
                    <div className="col-lg-6 order-lg-2 order-1">
                        <div className="mb-4">
                            <TitleComponent title={t('title_h1')} />
                            <SubTitleComponent t={t} sub_title={'title_h2'} />
                            <p className="text-muted mb-4" style={{ fontSize: '1rem', lineHeight: '1.688rem' }}>
                                {t('description_p')}
                            </p>
                        </div>

                        {/* Características Principales */}
                        <div className="row g-4">
                            {mainFeatures.map((feature, index) => (
                                <div key={index} className="col-md-6" data-aos="zoom-in" data-aos-delay="100">
                                    <CardComponent icon={feature.icon} title={feature.title} description={feature.description} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Características Adicionales */}
                <div className="row g-4 mt-4">
                    {additionalFeatures.map((feature, index) => (
                        <div key={index} className="col-md-4" data-aos="zoom-in-up" data-aos-delay="100">
                            <CardComponent icon={feature.icon} title={feature.title} description={feature.description} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

