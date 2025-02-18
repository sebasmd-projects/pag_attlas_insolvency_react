import { useTranslations } from 'next-intl';
import Image from "next/image";

export default function MainTeamSection() {

    const t = useTranslations('Pages.homePage.sections.mainTeamSection');

    return (
        <section>
            <div className="text-center py-5">
                <div className="mb-4 container-lg">
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
                <div data-aos="zoom-in" data-aos-delay="100">
                    <Image
                        src="/assets/imgs/page/equipo.png"
                        width={1920}
                        height={750}
                        alt="Equipo de trabajo"
                        className="img-fluid"
                    />
                </div>

            </div>
        </section>
    );
}