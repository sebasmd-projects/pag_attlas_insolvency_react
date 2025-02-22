import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  pathnames: {
    '/': '/',

    '/about-us': {
      es: '/nosotros/',
      en: '/about-us/'
    },
    '/about-us/contact': {
      es: '/nosotros/contacto',
      en: '/about-us/contact'
    },
    '/about-us/culture': {
      es: '/nosotros/cultura',
      en: '/about-us/culture'
    },
    '/about-us/frequently-asked-questions': {
      es: '/nosotros/preguntas-frecuentes',
      en: '/about-us/frequently-asked-questions'
    },
    '/about-us/history': {
      es: '/nosotros/historia',
      en: '/about-us/history'
    },


    '/auth/forgot-password': {
      es: '/autenticacion/contrasena-olvidada',
      en: '/auth/forgot-password'
    },
    '/auth/login': {
      es: '/autenticacion/iniciar-sesion',
      en: '/auth/login'
    },
    '/auth/register': {
      es: '/autenticacion/registrarse',
      en: '/auth/register'
    },


    '/free-advice': {
      es: '/asesoria-gratuita',
      en: '/free-advice'
    },


    '/services': {
      es: '/servicios',
      en: '/services'
    },
    '/services/financial-education': {
      es: '/servicios/educacion-financiera',
      en: '/services/financial-education'
    },


    '/documents/legal/complaints-and-queries': {
      es: '/documentos/legales/reclamaciones-y-consultas',
      en: '/documents/legal/complaints-and-queries'
    },
    '/documents/legal/cookies': {
      es: '/documentos/legales/cookies',
      en: '/documents/legal/cookies'
    },
    '/documents/legal/policies-for-the-treatment-of-information': {
      es: '/documentos/legales/politicas-para-el-tratamiento-de-la-informacion',
      en: '/documents/legal/policies-for-the-treatment-of-information'
    },
    '/documents/legal/privacy-notice': {
      es: '/documentos/legales/aviso-de-privacidad',
      en: '/documents/legal/privacy-notice'
    },
    '/documents/legal/processing-of-personal-data': {
      es: '/documentos/legales/tratamiento-de-datos-personales',
      en: '/documents/legal/processing-of-personal-data'
    },
    '/documents/legal/terms-and-conditions': {
      es: '/documentos/legales/terminos-y-condiciones',
      en: '/documents/legal/terms-and-conditions'
    },

  }
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const { Link, getPathname, redirect, usePathname, useRouter } =
  createNavigation(routing);
