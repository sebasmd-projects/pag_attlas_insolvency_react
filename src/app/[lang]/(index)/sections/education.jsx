'use client'

import AOS from 'aos';
import Image from 'next/image';
import { useEffect } from 'react';
import styles from '../css/page.module.css';

export default function EducationSection({ dict }) {
    useEffect(() => {
        AOS.init();
    }, [])

    const education_data = dict.translations.home.sections.education;

    return (
        <section id='education' className={`${styles.section} ${styles.education} ${styles.lightBackground} container`} data-aos='fade-up' data-aos-delay="100">
            <div className={`${styles.sectionTitle} container`} data-aos="fade-up">
                <h3 style={{ color: '#95D0C8' }}>{education_data.title}</h3>
            </div>


            <div className="row">
                <div className="col-md-4" data-aos='fade-up' data-aos-delay="100">
                    <Image
                        src="https://fundacionlm.org/wp-content/uploads/2022/12/4-1024x576.png"
                        alt={education_data.altImgs[0]}
                        className='img-fluid'
                        width={1024}
                        height={576}
                    />
                </div>
                <div className="col-md-4" data-aos='fade-up' data-aos-delay="200">
                    <Image
                        src="https://fundacionlm.org/wp-content/uploads/2022/12/4-1024x576.png"
                        alt={education_data.altImgs[1]}
                        className='img-fluid'
                        width={1024}
                        height={576}
                    />
                </div>
                <div className="col-md-4" data-aos='fade-up' data-aos-delay="300">
                    <Image
                        src="https://fundacionlm.org/wp-content/uploads/2022/12/4-1024x576.png"
                        alt={education_data.altImgs[2]}
                        className='img-fluid'
                        width={1024}
                        height={576}
                    />
                </div>
            </div>
        </section>
    )
}