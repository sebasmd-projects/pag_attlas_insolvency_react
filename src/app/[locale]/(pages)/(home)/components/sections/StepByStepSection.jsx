import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';
import { useTranslations } from 'next-intl';
import Image from "next/image";
import { PiNumberFive, PiNumberFour, PiNumberOne, PiNumberThree, PiNumberTwo } from "react-icons/pi";

export default function StepByStepSection() {

    const t = useTranslations('Pages.homePage.sections.stepByStepSection');

    const steps = [
        {
            icon: <PiNumberOne size={20} color="#876DE0" />,
            text: t('features.feature1'),
            aosDelay: 20
        },
        {
            icon: <PiNumberTwo size={20} color="#876DE0" />,
            text: t('features.feature2'),
            aosDelay: 30
        },
        {
            icon: <PiNumberThree size={20} color="#876DE0" />,
            text: t('features.feature3'),
            aosDelay: 40
        },
        {
            icon: <PiNumberFour size={20} color="#876DE0" />,
            text: t('features.feature4'),
            aosDelay: 50
        },
        {
            icon: <PiNumberFive size={20} color="#876DE0" />,
            text: t('features.feature5'),
            aosDelay: 60
        }
    ];

    return (
        <section style={{ position: 'relative', backgroundColor: '#F9F9F9' }}>
            <div className="container-lg py-5">
                <div className="align-items-center row g-4">
                    <div className="col-md-5 order-1 order-md-0">
                        <div className="text-end" data-aos="zoom-in" data-aos-delay="100">
                            <Image
                                src="/assets/imgs/page/stepBYstepImg.png"
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
                                                {step.icon}
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

