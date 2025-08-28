import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';
import { useTranslations } from 'next-intl';
import Image from "next/image";
import { AiOutlineTruck } from "react-icons/ai";
import { FaUserShield } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { GiColombia } from "react-icons/gi";

export default function WhyUsSection() {

    const t = useTranslations('Pages.homePage.sections.whyUsSection');
    const tf = useTranslations('Pages.homePage.sections.whyUsSection.features');

    const stats = [
        { value: tf('feature1.title'), icon: <GiColombia />, label: tf('feature1.description') },
        { value: tf('feature2.title'), icon: <AiOutlineTruck />, label: tf('feature2.description') },
        { value: tf('feature3.title'), icon: <FaUserShield />, label: tf('feature3.description') },
        { value: tf('feature4.title'), icon: <FaPeopleGroup />, label: tf('feature4.description') },
    ];
    return (
        <section id="why-us">
            <div className="container-lg py-5">
                <div className="row g-4 align-items-center">
                    <div className="col-md-6" data-aos="fade-right" data-aos-delay="100">
                        <Image
                            src="/assets/imgs/page/whyUsImg.webp"
                            alt="why us"
                            className="img-fluid"
                            loading="lazy"
                            width={500}
                            height={551}
                        />
                    </div>

                    <div className="col-md-6" >
                        <div className="mb-4">
                            <TitleComponent title={t('title_h1')} />
                            <SubTitleComponent t={t} sub_title={'title_h2'} />

                            <p className="mb-4" style={{
                                fontSize: '1rem',
                                lineHeight: '1.688rem',
                            }}>
                                {t('description_p')}
                            </p>
                        </div>

                        <div className="row g-4 mb-4" data-aos="zoom-in" data-aos-delay="100">
                            {stats.map((stat, index) => (
                                <div key={index} className="col-6">
                                    <div className="h-100">
                                        <h4 className="fw-bold" style={{
                                            fontSize: '1.2rem',
                                            fontWeight: 400,
                                            color: '#0e3692',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {stat.value} {stat.icon}
                                        </h4>
                                        <p style={{
                                            fontSize: '1rem',
                                            lineHeight: '1.688rem',

                                        }}>
                                            {stat.label}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div data-aos="fade-right" data-aos-delay="100">
                            <p className="text-uppercase" style={{
                                fontSize: '1rem',
                                fontWeight: 500,
                                letterSpacing: '0.15rem',
                                margin: '2rem 0'
                            }}>
                                {t('footer_p')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

