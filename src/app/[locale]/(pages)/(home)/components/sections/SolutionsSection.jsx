import { useTranslations } from 'next-intl';
import Image from "next/image";
import { FaHeadset } from "react-icons/fa6";
import { GrDocumentPerformance } from "react-icons/gr";
import { MdOutlineDiscount, MdOutlinePriceCheck } from "react-icons/md";

export default function SolutionsSection() {

    const t = useTranslations('Pages.homePage.sections.solutionsSection');

    const features = [
        {
            icon: <FaHeadset size={32} />,
            title: t('features.feature1.title'),
            description: t('features.feature1.description'),
            aosDelay: 100
        },
        {
            icon: <GrDocumentPerformance size={32} />,
            title: t('features.feature2.title'),
            description: t('features.feature2.description'),
            aosDelay: 150
        },
        {
            icon: <MdOutlineDiscount size={32} />,
            title: t('features.feature3.title'),
            description: t('features.feature3.description'),
            aosDelay: 200
        },
        {
            icon: <MdOutlinePriceCheck size={32} />,
            title: t('features.feature4.title'),
            description: t('features.feature4.description'),
            aosDelay: 250
        }
    ];

    return (
        <section>
            <div className="container-lg py-5">
                <div className="row g-4 align-items-center">
                    <div className="col-md-7">
                        <div className="mb-4">
                            <h3 className="text-uppercase mb-3" style={{
                                color: '#0e3692',
                                fontSize: '1rem',
                                fontWeight: 800,
                                letterSpacing: '0.15rem',
                                paddingBottom: '2rem'
                            }}>
                                {t('title_h1')}
                            </h3>
                            <h2 className="display-5 fw-bold" style={{
                                color: '#7fd2cb',
                                fontSize: '2rem',
                                lineHeight: '2.25rem',
                                marginBottom: '1.5rem'
                            }}>
                                {t.rich('title_h2', {
                                    span: (chunks) => (
                                        <span style={{ color: '#0e3692' }}>
                                            {chunks}
                                        </span>
                                    )
                                })}
                            </h2>
                        </div>

                        <div className="row g-4">
                            {features.map((feature, index) => (
                                <div key={index} className="col-12 col-md-6" data-aos="fade-down" data-aos-delay={feature.aosDelay}>
                                    <div className="d-flex flex-column gap-2 p-3 rounded-5" style={{
                                        backgroundColor: '#F2EFFF',
                                        height: '200px'
                                    }}>
                                        <div className="align-self-center">
                                            {feature.icon}
                                        </div>
                                        <h4 className="fw-bold align-self-center" style={{
                                            fontSize: '1.125rem',
                                            fontWeight: 400,
                                            color: '#7fd2cb'
                                        }}>
                                            {feature.title}
                                        </h4>
                                        <p className="text-muted" style={{
                                            fontSize: '1rem',
                                            lineHeight: '1.688rem',
                                        }}>
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-md-5 order-1 order-md-0" data-aos="fade-right" data-aos-delay="100">
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
            </div>
        </section>
    );
}