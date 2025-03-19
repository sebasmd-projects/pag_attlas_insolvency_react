import { useTranslations } from 'next-intl';
import { FaFacebookF, FaInstagram, FaPhone, FaXTwitter, FaYoutube } from "react-icons/fa6";
import Link from 'next/link';

const socialLinks = [
    {
        url: 'https://www.facebook.com/',
        icon: <FaFacebookF />,
        alt: 'Facebook'
    },
    {
        url: 'https://twitter.com/',
        icon: <FaXTwitter />,
        alt: 'X'
    },
    {
        url: 'https://www.instagram.com/',
        icon: <FaInstagram />,
        alt: 'Instagram'
    },
    {
        url: 'https://www.youtube.com/',
        icon: <FaYoutube />,
        alt: 'YouTube'
    }
];

const cellPhones = [
    { number: '+57 318 328 01 76' },
    { number: '+57 315 639 97 22' },
    { number: '+57 324 475 07 10' },
]

export default function Footer() {

    const t = useTranslations('Footer');

    const legalLinks = [
        { text: t('legalLinks.complaintsAndClaims'), url: '/documents/legal/complaints-and-queries' },
        { text: t('legalLinks.cookiesPolicy'), url: '/documents/legal/cookies' },
        { text: t('legalLinks.policiesForTheTreatmentOfInformation'), url: '/documents/legal/policies-for-the-treatment-of-information' },
        { text: t('legalLinks.privacyPolicy'), url: '/documents/legal/privacy-notice' },
        { text: t('legalLinks.processingOfPersonalData'), url: '/documents/legal/processing-of-personal-data' },
        { text: t('legalLinks.t&c'), url: '/documents/legal/terms-and-conditions' }
    ];

    return (
        <footer className="pt-5" style={{ backgroundColor: '#0e3692' }}>
            <div className="container-lg" style={{ color: '#7fd2cb' }}>
                <div className="row justify-content-between">
                    <div className="col-md-3">
                        <div className="mb-4">
                            <h5 className="mb-3" style={{ fontSize: '1.125rem', fontWeight: 800 }}>
                                {t('socialLinksTitle')}
                            </h5>
                            <div className="d-flex gap-3" style={{ fontSize: '1.5rem' }}>
                                {socialLinks.map((social, index) => (
                                    <Link key={index} href={social.url} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }} alt={social.alt}>
                                        {social.icon}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="d-flex align-items-center">
                            <ul style={{ listStyle: 'none' }} className="gap-2">
                                {cellPhones.map((cellPhone, index) => (
                                    <li key={index} className="d-flex align-items-center gap-2">
                                        <FaPhone className="text-white" />
                                        <Link href={`tel:${cellPhone.number}`} className="text-white text-decoration-none">
                                            {cellPhone.number}
                                        </Link>
                                    </li>
                                ))}
                            </ul>


                        </div>
                    </div>

                    <div className="col-md-2">
                        <h5 className="mb-3" style={{ fontSize: '1.125rem', fontWeight: 800 }}>FAQS</h5>
                        <div>
                            <Link
                                href="/about-us/frequently-asked-questions"
                                className="d-block text-white text-decoration-none mb-2"
                                style={{ fontSize: '1rem' }}
                            >
                                {t('faqTitle')}
                            </Link>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <h5 className="mb-3" style={{ fontSize: '1.125rem', fontWeight: 800 }}>LEGAL</h5>
                        <div className="d-flex flex-column gap-2">
                            {legalLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white text-decoration-none"
                                    style={{ fontSize: '1rem' }}
                                >
                                    {link.text}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="text-center py-4 mt-4 text-white" style={{ borderTop: '1px solid #7fd2cb' }}>
                    <p className="mb-2" style={{ fontSize: '1rem', lineHeight: '1.5rem' }}>
                        {new Date().getFullYear()} © {t('copyText')}
                    </p>
                    <p className="mb-0" style={{ fontSize: '1rem' }}>
                        {t.rich('designText', {
                            link1: (chunks) => (
                                <Link
                                    href="https://sebasmoralesd.com/"
                                    className="text-decoration-none color-primary"
                                    style={{ color: '#7fd2cb' }}
                                    target="_blank"
                                >
                                    {chunks}
                                </Link>
                            ),
                            link2: (chunks) => (
                                <Link
                                    href="https://www.linkedin.com/in/carlos-andres-morales-valencia-5873b2189/"
                                    className="text-decoration-none color-primary"
                                    style={{ color: '#7fd2cb' }}
                                    target="_blank"
                                >
                                    {chunks}
                                </Link>
                            )
                        })}
                    </p>
                </div>
            </div>
        </footer>
    );
}
