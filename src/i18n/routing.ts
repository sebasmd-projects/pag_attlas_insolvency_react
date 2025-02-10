import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  pathnames: {
    '/': '/',


    '/autenticacion/contrasena-olvidada': {
      es: '/autenticacion/contrasena-olvidada',
      en: '/auth/forgot-password'
    },
    '/autenticacion/iniciar-sesion': {
      es: '/autenticacion/iniciar-sesion',
      en: '/auth/login'
    },
    '/autenticacion/registrarse': {
      es: '/autenticacion/registrarse',
      en: '/auth/register'
    },
    '/autenticacion/restablecer-contrasena': {
      es: '/autenticacion/restablecer-contrasena',
      en: '/auth/reset-password'
    },


    '/equipo': { es: '/equipo', en: '/team' },
  }
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const { Link, getPathname, redirect, usePathname, useRouter } =
  createNavigation(routing);
