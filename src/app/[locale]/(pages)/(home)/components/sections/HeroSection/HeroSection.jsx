'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { GiCalculator } from "react-icons/gi";
import { LuLayoutDashboard } from "react-icons/lu";
import style from './HeroSection.module.css';
import Link from 'next/link';

export default function HeroSection() {

    const t = useTranslations('Pages.homePage.sections.heroSection');

    const [isHoveredB1, setIsHoveredB1] = useState(false);
    const [isHoveredB2, setIsHoveredB2] = useState(false);

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
                        <div className="row">
                            <div className="col-6" data-aos="fade-up" data-aos-delay="100">
                                <Link href="/platform/calculator"
                                    className="btn btn-outline-light btn-lg"
                                    style={{ backgroundColor: isHoveredB1 ? '#f8f9fa' : '#d5dbdb40', transition: 'background-color 0.3s ease' }}
                                    onMouseEnter={() => setIsHoveredB1(true)}
                                    onMouseLeave={() => setIsHoveredB1(false)}
                                >
                                    {t('calculator')} <GiCalculator />
                                </Link>
                            </div>

                            <div className="col-6" data-aos="fade-up" data-aos-delay="100">
                                <div className="btn btn-outline-light btn-lg"
                                    style={{ backgroundColor: isHoveredB2 ? '#f8f9fa' : '#d5dbdb40', transition: 'background-color 0.3s ease' }}
                                    onMouseEnter={() => setIsHoveredB2(true)}
                                    onMouseLeave={() => setIsHoveredB2(false)}
                                >
                                    {t('platform')} <LuLayoutDashboard />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}