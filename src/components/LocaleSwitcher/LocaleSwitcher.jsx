'use client';

import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { Dropdown } from 'react-bootstrap';
import { routing, usePathname, useRouter } from '@/i18n/routing';


export default function LocaleSwitcherDropdown() {
  const t = useTranslations('LocaleSwitcher');
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [selectedLocale, setSelectedLocale] = useState(currentLocale);
  const [isPending, startTransition] = useTransition();

  const handleSelect = (newLocale) => {
    setSelectedLocale(newLocale);
    startTransition(() => {
      router.replace({ pathname, params }, { locale: newLocale });
    });
  };

  return (
    <Dropdown>
      <Dropdown.Toggle disabled={isPending} id="locale-switcher-dropdown" variant="light">
        {t('label')}: {selectedLocale}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {routing.locales.map((cur) => (
          <Dropdown.Item key={cur} onClick={() => handleSelect(cur)}>
            {t('locale', { locale: cur })}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
