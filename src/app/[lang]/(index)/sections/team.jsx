'use client'

import AOS from 'aos';
import { useEffect } from 'react';
import styles from '../css/page.module.css';

export default function TeamSection({ dict }) {
    useEffect(() => {
        AOS.init();
    }, [])

    return (
        <section id='hero' className={`${styles.section} ${styles.hero}`} data-aos='fade-up' data-aos-delay="100">
            <h1>{dict.translations.home.sections.hero.title}</h1>
        </section>
    )
}