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


    '/programs': {
      es: '/programas',
      en: '/programs'
    }
  }
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const { Link, getPathname, redirect, usePathname, useRouter } =
  createNavigation(routing);
