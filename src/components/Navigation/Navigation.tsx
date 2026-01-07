// src/components/Navigation/Navigation.tsx

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import LocaleSwitcher from '../LocaleSwitcher/LocaleSwitcher';
import { NavDropdown } from 'react-bootstrap';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';


export default function Navigation() {
  const [expanded, setExpanded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  const t = useTranslations('Navigation');

  const pathname = usePathname();
  const locale = useLocale();

  const homePath = `/${locale}`;

  const navigateToSection = (id: string) => {
    setExpanded(false);

    const isHome = pathname === homePath || pathname === `${homePath}/`;

    if (isHome) {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`${homePath}#${id}`);
    }
  };

  useEffect(() => {
    async function checkTokenInfo() {
      try {
        const res = await fetch('/api/platform/auth/token-info', { cache: 'no-store', credentials: 'include' });

        if (res.ok) {
          setLoggedIn(true);
        } else {
          try {
            await fetch('/api/platform/auth/logout', { method: 'POST', credentials: 'include' });
          }
          catch (logoutError) {
            console.error('Error during automatic logout:', logoutError);
          }
          setLoggedIn(false);
        }
      } catch (error) {
        console.error('Error validating token:', error);
      }
    }
    checkTokenInfo();
  }, [router]);

  const aboutUsItems = [
    {
      key: 'solutions',
      sectionId: 'solutions',
      label: t('aboutUs.subMenu.solutions'),
    },
    {
      key: 'allies',
      sectionId: 'allies',
      label: t('aboutUs.subMenu.allies'),
    },
    {
      key: 'social-responsibility',
      sectionId: 'social-responsibility',
      label: t('aboutUs.subMenu.socialResponsibility'),
    },
    {
      key: 'foot-print',
      sectionId: 'foot-print',
      label: t('aboutUs.subMenu.footPrint'),
    },
    {
      key: 'main-team',
      sectionId: 'main-team',
      label: t('aboutUs.subMenu.mainTeam'),
    },
    {
      key: 'why-us',
      sectionId: 'why-us',
      label: t('aboutUs.subMenu.whyUs'),
    },
  ];


  return (
    <Navbar className="bg-body-tertiary" expand="lg" expanded={expanded} sticky="top">
      <Container>
        <Navbar.Brand as={Link} href="/">
          <Image
            alt="LeyInsolvencia"
            className="img-fluid"
            height="40"
            src="/assets/imgs/page/logo h fundacion attlas.webp"
            width="120"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse className="justify-content-between" id="basic-navbar-nav">
          <Nav className="justify-content-center flex-grow-1" navbarScroll style={{ gap: "1.5rem" }}>
            <NavDropdown id="services-nav-dropdown" title={t('services.menu')}>
              <NavDropdown.Item as={Link} href="/platform" onClick={() => setExpanded(false)}>
                {t('services.subMenu.insolvencyPlatform')}
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/services" onClick={() => setExpanded(false)}>
                {t('services.subMenu.ourServices')}
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/services/financial-education" onClick={() => setExpanded(false)}>
                {t('services.subMenu.financialEducation')}
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown id="about-us-nav-dropdown" title={t('aboutUs.menu')}>

              {aboutUsItems.map((item) => (
                <NavDropdown.Item
                  key={item.key}
                  as="button"
                  onClick={() => navigateToSection(item.sectionId)}
                >
                  {item.label}
                </NavDropdown.Item>
              ))}

              <NavDropdown.Divider />

              <NavDropdown.Item as="button" onClick={() => {
                setExpanded(false);
                router.push(`/${locale}/about-us/frequently-asked-questions`);
              }} >
                {t('aboutUs.subMenu.faq')}
              </NavDropdown.Item>

            </NavDropdown>

            <Nav.Link as="button" href="/#contact" onClick={() => setExpanded(false)}>
              {t('contact.menu')}
            </Nav.Link>

            <div className="d-flex gap-3 align-items-center">
              <Link href="https://propensionesabogados.com" target="_blank">
                <Image
                  alt="LeyInsolvencia"
                  className="img-fluid"
                  height="60"
                  src="/assets/imgs/page/logo-propensiones-h.webp"
                  width="120"
                />
              </Link>
            </div>

            {loggedIn && (
              <Nav.Link
                as="button"
                className="btn btn-outline-danger"
                onClick={async () => {
                  try {
                    await fetch('/api/platform/auth/logout', { method: 'POST' });
                    setLoggedIn(false);
                    router.push('/platform/auth/login');
                  } catch (error) {
                    console.error('Error logging out:', error);
                  }
                }}
              >
                Cerrar sesión
              </Nav.Link>
            )}
          </Nav>

          <div className="d-flex align-items-center">
            <LocaleSwitcher />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
