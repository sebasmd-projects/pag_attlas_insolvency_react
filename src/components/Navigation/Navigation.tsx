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
import NavButton from './components/NavButton';
import { NavDropdown } from 'react-bootstrap';
import { useTranslations } from 'next-intl';
import { MdCastForEducation } from 'react-icons/md';
import { BiDonateHeart } from "react-icons/bi";
import { LuLayoutDashboard } from "react-icons/lu";

export default function Navigation() {
  const [expanded, setExpanded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  const t = useTranslations('Navigation');

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
              <NavDropdown.Item as={Link} href="#" onClick={() => setExpanded(false)}>
                {t('aboutUs.subMenu.getToKnowUs')}
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} href="#" onClick={() => setExpanded(false)}>
                {t('aboutUs.subMenu.culture')}
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} href="#" onClick={() => setExpanded(false)}>
                {t('aboutUs.subMenu.history')}
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} href="/about-us/frequently-asked-questions" onClick={() => setExpanded(false)}>
                {t('aboutUs.subMenu.faq')}
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} href="/about-us/contact" onClick={() => setExpanded(false)}>
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
