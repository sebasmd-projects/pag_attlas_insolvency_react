'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface NavButtonProps {
  label: Parameters<ReturnType<typeof useTranslations<'Navigation'>>>[0];
  gradient: string;
  color?: string;
  icon?: React.ElementType;
  href?: string;
  onClick?(): void;
  setExpanded(expanded: boolean): void;
}

export default function NavButton({ color='white', gradient, href="#", icon: Icon, label, onClick, setExpanded, ...props }: NavButtonProps) {
  const t = useTranslations('Navigation');

  function handleClick() {
    setExpanded(false);
    onClick?.();
  }

  return (
    <Link
      className="btn btn-primary-gradient rounded-pill px-4"
      href={href}
      onClick={handleClick}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      style={{ background: gradient, transition: 'transform 0.3s', border: 'none', color }}
      target="_blank"
      {...props}
    >
      {t(label)} {Icon && <Icon />}
    </Link>
  );
}