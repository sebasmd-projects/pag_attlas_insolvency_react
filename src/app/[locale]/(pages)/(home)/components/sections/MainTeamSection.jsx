import { useTranslations } from 'next-intl';
import Image from "next/image";
import TitleComponent from '@/components/micro-components/title';
import SubTitleComponent from '@/components/micro-components/sub_title';

export default function MainTeamSection() {

    const t = useTranslations('Pages.homePage.sections.mainTeamSection');

    return (
        <section id="main-team">
            <div className="text-center py-5">
                <div className="mb-4 container-lg">
                    <TitleComponent title={t('title_h1')} />
                    <SubTitleComponent t={t} sub_title={'title_h2'} />
                </div>

                <div className="position-relative d-inline-block">
                    {/* Insignia */}
                    <div className="position-absolute top-0 start-0 m-2" style={{ width: '200px' }}>
                        <Image
                            src="/assets/imgs/page/diplomado_insolvencia.png"
                            width={200}
                            height={200}
                            alt="Insignia"
                            className="img-fluid"
                        />
                    </div>

                    {/* Imagen del equipo */}
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
