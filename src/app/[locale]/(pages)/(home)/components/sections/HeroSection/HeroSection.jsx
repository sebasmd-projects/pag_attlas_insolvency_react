import Image from 'next/image';
import Link from "next/link";
import style from './HeroSection.module.css';
import { FaWhatsapp } from "react-icons/fa";
import { useTranslations } from 'next-intl';


export default function HeroSection() {

    const t = useTranslations('Pages.homePage.sections.heroSection');

    return (
        <section id="hero" className={style.hero}>
            <div className={style.heroVideoWrapper}>
                <video autoPlay muted loop playsInline className={style.heroVideo}>
                    <source src="/assets/videos/hero-bg-video.mp4" type="video/mp4" />
                    {t('video_tag')}
                </video>
            </div>

            <div className="container">
                <div className="row">
                    <div className="col-lg-10">
                        <h1 data-aos="fade-right" data-aos-delay="100">
                            {t('title_h1')}
                        </h1>
                        <h2 data-aos="fade-right" data-aos-delay="100" className="mt-3">
                            {t('title_h2')}
                        </h2>
                        <h1 data-aos="fade-right" data-aos-delay="100" className="mt-3">
                            {t('description_p')}
                        </h1>
                    </div>
                    <div className="col-lg-5 mt-5 text-center" >
                        <div className="row align-items-center">
                            <div className="col-12" data-aos="fade-up" data-aos-delay="100">
                                <h1></h1>
                            </div>

                            {/* <div className="col-6" data-aos="fade-up" data-aos-delay="100">
                                <div className="btn btn-success btn-lg" data-bs-toggle="modal" data-bs-target="#whatsappModal">
                                    {t('whatsappButton')} <FaWhatsapp />
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}