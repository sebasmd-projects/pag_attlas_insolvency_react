'use client';

import { BsWhatsapp } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import styles from './WhatsAppButton.module.css';

export default function WhatsAppButton() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={styles.actionButtons}>
            <a
                href="https://wa.me/573012283818"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.whatsappButton} ${isScrolled ? styles.scrolled : ''}`}
            >
                <span>Línea salvavidas</span>
                <BsWhatsapp className={styles.whatsappIcon} />
            </a>
        </div>
    );
}