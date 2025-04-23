// src/i18n/routing.ts

import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  pathnames: {
    '/': '/',

    // About us
    '/about-us/frequently-asked-questions': {
      es: '/nosotros/preguntas-frecuentes',
      en: '/about-us/frequently-asked-questions'
    },

    // Services
    '/services': {
      es: '/servicios',
      en: '/services'
    },
    '/services/financial-education': {
      es: '/servicios/educacion-financiera',
      en: '/services/financial-education'
    },

    // Documents
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

    // Consultants
    '/consultants/auth/register': {
      es: '/consultores/auth/registro',
      en: '/consultants/auth/register',
    },

    // Platform
    '/platform': {
      es: '/plataforma',
      en: '/platform'
    },
    '/platform/auth/login': {
      es: '/plataforma/auth/iniciar-sesion',
      en: '/platform/auth/login'
    },
    '/platform/auth/register': {
      es: '/plataforma/auth/registro',
      en: '/platform/auth/register'
    },
    '/platform/calculator': {
      es: '/plataforma/calculadora',
      en: '/platform/calculator'
    },
    
  }
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const { Link, getPathname, redirect, usePathname, useRouter } = createNavigation(routing);
