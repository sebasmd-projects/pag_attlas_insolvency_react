'use client'

import AOS from 'aos';
import { useEffect, useState } from 'react';
import styles from '../css/page.module.css';
import WhatsAppModal from './components/WhatsAppModal';

export default function HeroSection({ dict }) {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        AOS.init();
    }, [])

    const hero_data = dict.translations.home.sections.hero;

    return (
        <>
            <section id='hero' className={`${styles.section} ${styles.hero} ${styles.darkBackground}`}>
                <video autoPlay muted loop playsInline className={`${styles.heroVideo}`}>
                    <source
                        src="https://propensionesabogados.com/static/assets/video/hero-bg-video.mp4"
                        type="video/mp4"
                    />
                    {hero_data.video}
                </video>

                <div className="container">
                    <div className="row">
                        <div className="col-lg-10">
                            <h1 data-aos="fade-right" data-aos-delay="100">
                                {hero_data.title}
                            </h1>
                            <h2 data-aos="fade-right" data-aos-delay="200" style={{ color: '#FED100' }}>
                                {hero_data.subtitle}
                            </h2>
                        </div>
                        <div className="col-lg-5 mt-5 text-center" data-aos="fade-up" data-aos-delay="300">
                            <div className="row align-items-center">
                                <div className="col-6">
                                    <a className="btn " href="https://attlasconciliacion.propensionesabogados.com/" target="_blank" style={{ backgroundColor: '#fff' }}>
                                        <img src="https://propensionesabogados.com/static/assets/imgs/hero/attlas-horizontal-logo.png" alt={hero_data.altLogo} className="img-fluid" style={{ maxHeight: '90px' }} />
                                    </a>
                                </div>

                                <div className="col-6">
                                    <button
                                        className="btn btn-success btn-lg"
                                        onClick={() => setIsOpen(true)}
                                    >
                                        {hero_data.whatsAppButton}<i className="bi bi-whatsapp mx-1 py-5"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {isOpen && <WhatsAppModal isOpen={isOpen} hero_data={hero_data} setIsOpen={setIsOpen} />}
        </>
    )
}