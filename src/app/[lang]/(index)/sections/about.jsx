'use client'

import AOS from 'aos';
import { useEffect } from 'react';
import styles from '../css/page.module.css';

export default function AboutSection({ dict }) {
    useEffect(() => {
        AOS.init();
    }, [])

    const about_data = dict.translations.home.sections.about;

    return (
        <section id='about' className={`${styles.section} ${styles.about} ${styles.darkBackground}`} data-aos='fade-up' data-aos-delay="100">
            <h1></h1>
        </section >
    )
}