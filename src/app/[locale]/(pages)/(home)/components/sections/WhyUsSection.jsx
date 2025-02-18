import { useTranslations } from 'next-intl';
import Image from "next/image";
import { FaMoneyBillTrendUp, FaPeopleGroup, FaRegCalendarCheck } from "react-icons/fa6";
import { GiColombia } from "react-icons/gi";

export default function WhyUsSection() {

    const t = useTranslations('Pages.homePage.sections.whyUsSection');
    const tf = useTranslations('Pages.homePage.sections.whyUsSection.features');

    const stats = [
        { value: tf('feature1.title'), icon: <FaMoneyBillTrendUp />, label: tf('feature1.description') },
        { value: tf('feature2.title'), icon: <FaRegCalendarCheck />, label: tf('feature2.description') },
        { value: tf('feature3.title'), icon: <GiColombia />, label: tf('feature3.description') },
        { value: tf('feature4.title'), icon: <FaPeopleGroup />, label: tf('feature4.description') }
    ];
    return (
        <section style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="container-lg py-5">
                <div className="row g-4 align-items-center">
                    <div className="col-md-6" >
                        <div className="mb-4">
                            <h3 className="text-uppercase mb-3" style={{
                                color: '#7A68EE',
                                fontSize: '1rem',
                                fontWeight: 800,
                                letterSpacing: '0.15rem',
                                paddingBottom: '2rem'
                            }}>
                                {t('title_h1')}
                            </h3>
                            <h2 className="display-5 fw-bold" style={{
                                color: '#2F2F6D',
                                fontSize: '2rem',
                                lineHeight: '2.25rem',
                                marginBottom: '1.5rem'
                            }}>
                                {t.rich('title_h2', {
                                    span: (chunks) => (
                                        <span style={{ color: '#7A68EE' }}>
                                            {chunks}
                                        </span>
                                    )
                                })}
                            </h2>
                            <p className="mb-4" style={{
                                fontSize: '1rem',
                                lineHeight: '1.688rem',
                                color: '#2F2F6D'
                            }}>
                                {t('description_p')}
                            </p>
                        </div>

                        <div className="row g-4 mb-4" data-aos="zoom-in" data-aos-delay="100">
                            {stats.map((stat, index) => (
                                <div key={index} className="col-6">
                                    <div className="h-100">
                                        <h4 className="fw-bold" style={{
                                            fontSize: '1.5rem',
                                            fontWeight: 400,
                                            color: '#2F2F6D',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {stat.value} {stat.icon}
                                        </h4>
                                        <p style={{
                                            fontSize: '1rem',
                                            lineHeight: '1.688rem',
                                            color: '#2F2F6D'
                                        }}>
                                            {stat.label}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div data-aos="fade-right" data-aos-delay="150">
                            <p className="text-uppercase" style={{
                                color: '#2F2F6D',
                                fontSize: '1rem',
                                fontWeight: 500,
                                letterSpacing: '0.15rem',
                                margin: '2rem 0'
                            }}>
                                {t('footer_p')}
                            </p>
                        </div>

                    </div>

                    <div className="col-md-6" data-aos="fade-right" data-aos-delay="200">
                        <div>
                            <Image
                                src="/assets/imgs/page/whyUs.png"
                                alt="Experience"
                                className="img-fluid"
                                loading="lazy"
                                width={684}
                                height={827}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

