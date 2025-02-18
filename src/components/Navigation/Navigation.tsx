'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import LocaleSwitcher from '../LocaleSwitcher/LocaleSwitcher';

export default function Navigation() {

  const t = useTranslations('Navigation');

  return (
    <Navbar className="bg-body-tertiary" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href="#home">
          <Image alt="LeyInsolvencia" className='img-fluid' height="40" src="/assets/imgs/page/logo h fundacion attlas.png" width="120" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="d-flex justify-content-between" id="basic-navbar-nav">
          <Nav className="justify-content-center flex-grow-1" navbarScroll style={{ gap: "1.5rem" }} >
            <NavDropdown id="programs-nav-dropdown" title={t('programs.menu')}>
              <Link className="dropdown-item" data-rr-ui-dropdown-item href="#">{t('programs.subMenu.ourPrograms')}</Link>
              <Link className="dropdown-item" data-rr-ui-dropdown-item href="#">{t('programs.subMenu.financialEducation')}</Link>
            </NavDropdown>

            <NavDropdown id="about-us-nav-dropdown" title={t('aboutUs.menu')}>
              <Link className="dropdown-item" data-rr-ui-dropdown-item href="#">{t('aboutUs.subMenu.getToKnowUs')}</Link>
              <Link className="dropdown-item" data-rr-ui-dropdown-item href="#">{t('aboutUs.subMenu.culture')}</Link>
              <Link className="dropdown-item" data-rr-ui-dropdown-item href="#">{t('aboutUs.subMenu.history')}</Link>
              <NavDropdown.Divider />
              <Link className="dropdown-item" data-rr-ui-dropdown-item href="#">{t('aboutUs.subMenu.faq')}</Link>
            </NavDropdown>

            <Nav.Link href="#">{t('contact.menu')}</Nav.Link>

            <div className="d-flex gap-3 align-items-center">
              <Link
                className="btn btn-primary-gradient rounded-pill px-4"
                href="#"
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                style={{
                  background: 'linear-gradient(90deg, #4F46E5 0%, #8B5CF6 100%)',
                  transition: 'transform 0.3s',
                  border: 'none'
                }}
              >
                {t('freeAdvice.menu')}
              </Link>
            </div>
          </Nav>

          <div className="d-flex align-items-center">
            <LocaleSwitcher />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}