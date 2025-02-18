'use client';

import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/routing';
import style from './Navigation.module.css';

export default function NavigationLink({ path, text }: any) {

  const pathname = usePathname();
  const isHome = path === '/' && /^\/[a-z]{2}$/.test(pathname);
  const isActive = isHome || pathname.endsWith(path);

  return (
    <Link
      key={path}
      aria-current={isActive ? 'page' : undefined}
      className={`${style.navigationLink} ${isActive && style.navigationActiveLink}`}
      href={path}
    >
      {text}
    </Link>
  );
}
