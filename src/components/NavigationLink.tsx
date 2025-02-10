'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { ComponentProps } from 'react';
import { Link } from '@/i18n/routing';

const locales = ['es', 'en'];

export default function NavigationLink({ href, ...rest }: ComponentProps<typeof Link>) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const locale = locales.includes(segments[0]) ? segments[0] : 'es';
  const normalizedPathname = pathname.replace(`/${locale}`, '') || '/';

  const isActive = 
    (href === '/' && locales.some(loc => pathname === `/${loc}`)) || // Home activo según el locale
    (normalizedPathname.startsWith(href) && href !== '/') || // Activa padres excepto home
    normalizedPathname === href; // Activa la ruta exacta
  
  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      className={clsx(
        'inline-block px-2 py-3 transition-colors',
        isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'
      )}
      href={href}
      {...rest}
    />
  );
}
