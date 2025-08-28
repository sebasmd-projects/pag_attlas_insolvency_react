
import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';
import { useTranslations } from 'next-intl';
import Image from "next/image";

export default function FootPrintSection() {
    const t = useTranslations('Pages.homePage.sections.footPrintSection');

    return (
        <section id="main-team" className='container'>
            <div className="py-5">
                <div className="mb-4">
                    <TitleComponent title={t('title')} />
                    <SubTitleComponent t={t} sub_title={'subTitle'} />
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="card" data-aos="zoom-in">
                            <div className="card-body">
                                <div className="mb-4">
                                    <h5 className="card-title">{t('card.title1')}</h5>
                                    <p className="card-text">{t('card.description1')}</p>
                                    <p className="card-text">{t('card.description2')}</p>
                                    <p className="card-text">{t('card.description3')}</p>
                                    <p className="card-text">{t('card.description4')}</p>
                                </div>
                                <div className="mb-4">
                                    <h5 className="card-title">{t('card.title2')}</h5>
                                    <p className="card-text">{t('card.description5')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div data-aos="zoom-in" data-aos-delay="100">
                            <Image
                                src="/assets/imgs/page/huella de carbono.webp"
                                width={600}
                                height={600}
                                alt="Pulmón Verde - Carbono Verde Internacional - Conectando Bosques y Mercados"
                                className="img-fluid"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}