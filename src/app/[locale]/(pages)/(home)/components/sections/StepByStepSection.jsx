import { useTranslations } from 'next-intl';
import Image from "next/image";
import TitleComponent from '@/components/micro-components/title';
import SubTitleComponent from '@/components/micro-components/sub_title';

export default function StepByStepSection() {

    const t = useTranslations('Pages.homePage.sections.stepByStepSection');

    const steps = [
        {
            icon: '/assets/imgs/page/stepBYstep1.svg',
            text: t('features.feature1'),
            aosDelay: 100
        },
        {
            icon: '/assets/imgs/page/stepBYstep2.svg',
            text: t('features.feature2'),
            aosDelay: 150
        },
        {
            icon: '/assets/imgs/page/stepBYstep3.svg',
            text: t('features.feature3'),
            aosDelay: 200
        },
        {
            icon: '/assets/imgs/page/stepBYstep4.svg',
            text: t('features.feature4'),
            aosDelay: 250
        },
        {
            icon: '/assets/imgs/page/stepBYstep5.svg',
            text: t('features.feature5'),
            aosDelay: 250
        }
    ];

    return (
        <section style={{ position: 'relative', backgroundColor: '#F9F9F9' }}>
            <div className="container-lg py-5">
                <div className="align-items-center row g-4">
                    <div className="col-md-5 order-1 order-md-0">
                        <div className="text-end" data-aos="zoom-in" data-aos-delay="100">
                            <Image
                                src="/assets/imgs/page/stepBYstep.png"
                                alt="Pasos"
                                loading="lazy"
                                width={786}
                                height={786}
                                className="img-fluid"
                            />
                        </div>
                    </div>

                    <div className="col-md-7">
                        <div className="mb-4">
                            <TitleComponent title={t('title_h1')} />
                            <SubTitleComponent t={t} sub_title={'title_h2'} />
                        </div>

                        <div className="steps-container" style={{ position: 'relative' }}>
                            {steps.map((step, index) => (
                                <div key={index} className="step-item mb-4" style={{ position: 'relative' }} data-aos="fade-down" data-aos-delay={step.aosDelay}>
                                    <div className="row g-3 align-items-start">
                                        <div className="col-auto">
                                            <div className="position-relative">
                                                <Image
                                                    src={step.icon}
                                                    alt={`Paso ${index + 1}`}
                                                    style={{ width: '50px' }}
                                                    width={50}
                                                    height={50}
                                                />
                                                {index < steps.length - 1 && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        left: '50%',
                                                        top: '100%',
                                                        width: '2px',
                                                        height: '40px',
                                                        backgroundColor: '#876DE0',
                                                        transform: 'translateX(-50%)'
                                                    }}></div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col">
                                            <p className="mb-1" style={{
                                                fontSize: '1rem',
                                                lineHeight: '1.7rem',
                                            }}>
                                                {step.text}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

