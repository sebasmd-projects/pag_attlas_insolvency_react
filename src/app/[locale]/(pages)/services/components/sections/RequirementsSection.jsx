import { useTranslations } from 'next-intl';
import Image from "next/image";
import { FaHandHoldingUsd, FaShieldAlt, FaUsers } from "react-icons/fa";
import { FaUnlockKeyhole } from "react-icons/fa6";
import TitleComponent from '@/components/micro-components/title';
import SubTitleComponent from '@/components/micro-components/sub_title';

export default function RequirementsSection() {

    const t = useTranslations('Pages.servicesPage.sections.requirementsSection');
    const tf = useTranslations('Pages.servicesPage.sections.requirementsSection.features');

    const stats = [
        {
            value: tf('feature1.title'),
            icon: <FaUsers className="text-primary" />,
            label: tf('feature1.description')
        },
        {
            value: tf('feature2.title'),
            icon: <FaShieldAlt className="text-primary" />,
            label: tf('feature2.description')
        },
        {
            value: tf('feature3.title'),
            icon: <FaUnlockKeyhole className="text-primary" />,
            label: tf('feature3.description')
        },
        {
            value: tf('feature4.title'),
            icon: <FaHandHoldingUsd className="text-primary" />,
            label: tf('feature4.description')
        }
    ];

    return (
        <section className="py-5">
            <div className="container-lg">
                <div className="row g-4 align-items-center">
                    <div className="col-md-8">
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

                        <div className="row g-4">
                            {stats.map((stat, index) => (
                                <div key={index} className="col-md-6" data-aos="zoom-in" data-aos-delay="100">
                                    <div className="card h-100 p-3 border-0 shadow-sm" style={{ backgroundColor: '#F2EFFF' }}>
                                        <div className="card-body">
                                            <div className="d-flex align-items-center mb-3">
                                                <span className="icon-wrapper me-3">
                                                    {stat.icon}
                                                </span>
                                                <h3 className="h5 mb-0">{stat.value}</h3>
                                            </div>
                                            <div className="text-muted" style={{ whiteSpace: 'pre-line' }}>
                                                {stat.label}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                    <div className="col-md-4">
                        <Image
                            src="/assets/imgs/page/whyUs.png"
                            alt="Financial Protection"
                            className="img-fluid rounded-3"
                            loading="lazy"
                            width={600}
                            height={400}
                            data-aos="fade-left" data-aos-delay="100"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}