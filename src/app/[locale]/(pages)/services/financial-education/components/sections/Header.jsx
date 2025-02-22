import { useTranslations } from 'next-intl';

export default function HeaderSection() {

    const translation = useTranslations('Pages.servicesPage.financialEducation');

    return (
        <div className="row mb-5 text-center">
            <div className='col'>
                <h3 style={{ color: '#0e3692', fontSize: '1rem', fontWeight: 800, letterSpacing: '0.15rem', paddingBottom: '2rem' }} data-aos="zoom-in" data-aos-delay="100">
                    {translation('title_h1')}
                </h3>
                <h2 className="display-5 fw-bold" style={{ color: '#7fd2cb', fontSize: '2rem', lineHeight: '2.25rem' }} data-aos="zoom-in" data-aos-delay="100">
                    {translation.rich('title_h2', { span: (chunks) => <span style={{ color: '#0e3692' }}>{chunks}</span> })}
                </h2>
            </div>
        </div>
    );
}