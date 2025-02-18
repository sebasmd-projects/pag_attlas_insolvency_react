import { FaFacebookF, FaInstagram, FaPhone, FaXTwitter, FaYoutube } from "react-icons/fa6";


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

const legalLinks = [
    { text: 'Términos y condiciones', url: '/' },
    { text: 'Políticas de Cookies', url: '/' },
    { text: 'Aviso de Privacidad', url: '/' },
    { text: 'Tratamiento de datos personales', url: '/' },
    { text: 'Políticas para el tratamiento de la información', url: '/' },
    { text: 'Formulario de Reclamos y Consultas', url: '/' }
];

const cellPhones = [
    { number: '+573244750710' },
    { number: '+573156399722' }
]

export default function Footer() {
    return (
        <footer className="pt-5" style={{ backgroundColor: '#444289' }}>
            <div className="container-lg text-white">
                <div className="row justify-content-between">
                    <div className="col-md-3">
                        <div className="mb-4">
                            <h5 className="mb-3" style={{ fontSize: '1.125rem', fontWeight: 800 }}>
                                Nuestras redes sociales:
                            </h5>
                            <div className="d-flex gap-3" style={{ fontSize: '1.5rem' }}>
                                {socialLinks.map((social, index) => (
                                    <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="d-flex align-items-center">
                            <ul style={{ listStyle: 'none' }} className="gap-2">
                                {cellPhones.map((cellPhone, index) => (
                                    <li key={index} className="d-flex align-items-center gap-2">
                                        <FaPhone className="text-white" />
                                        <a href={`tel:${cellPhone.number}`} className="text-white text-decoration-none">
                                            {cellPhone.number}
                                        </a>
                                    </li>
                                ))}
                            </ul>


                        </div>
                    </div>

                    <div className="col-md-2">
                        <h5 className="mb-3" style={{ fontSize: '1.125rem', fontWeight: 800 }}>FAQS</h5>
                        <div>
                            <a
                                href="/"
                                className="d-block text-white text-decoration-none mb-2"
                                style={{ fontSize: '1rem' }}
                            >
                                Preguntas frecuentes
                            </a>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <h5 className="mb-3" style={{ fontSize: '1.125rem', fontWeight: 800 }}>LEGAL</h5>
                        <div className="d-flex flex-column gap-2">
                            {legalLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white text-decoration-none"
                                    style={{ fontSize: '1rem' }}
                                >
                                    {link.text}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="text-center py-4 mt-4" style={{ borderTop: '1px solid #876DE0' }}>
                    <p className="mb-2" style={{ fontSize: '1rem', lineHeight: '1.5rem' }}>
                        © Copyright Propensiones Abogados & Fundación ATTLAS Todos los derechos reservados.
                    </p>
                    <p className="mb-0" style={{ fontSize: '1rem' }}>
                        Diseñado por <a href="https://sebasmoralesd.com/" className="text-decoration-none">Sebastián Morales</a> &amp; <a href="https://www.linkedin.com/in/carlos-andres-morales-valencia-5873b2189/" className="text-decoration-none">Carlos Morales</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
