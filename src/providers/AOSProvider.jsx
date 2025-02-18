'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AOSProvider({ children }) {

  const pathname = usePathname();

  useEffect(() => {
    import('aos').then((AOS) =>
      AOS.init({
        duration: 1200,
        once: false,
      })
    );
  }, []);

  useEffect(() => {
    import('aos').then((AOS) =>
      AOS.refresh()
    );

  }, [pathname]);

  return <>{children}</>;
}