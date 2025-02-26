'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import { FaWhatsapp } from "react-icons/fa";
import LocaleSwitcher from '../LocaleSwitcher/LocaleSwitcher';

export default function Navigation() {
  const t = useTranslations('Navigation');
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar className="bg-body-tertiary" expand="lg" expanded={expanded} sticky="top">
      <Container>
        <Navbar.Brand as={Link} href="/">
          <Image
            alt="LeyInsolvencia"
            className="img-fluid"
            height="40"
            src="/assets/imgs/page/logo h fundacion attlas.png"
            width="120"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse className="justify-content-between" id="basic-navbar-nav">
          <Nav className="justify-content-center flex-grow-1" navbarScroll style={{ gap: "1.5rem" }}>
            <NavDropdown id="services-nav-dropdown" title={t('services.menu')}>
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
              <NavDropdown.Item as={Link} href="#" onClick={() => setExpanded(false)}>
                {t('aboutUs.subMenu.faq')}
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} href="/about-us/contact" onClick={() => setExpanded(false)}>
              {t('contact.menu')}
            </Nav.Link>

            <div className="d-flex gap-3 align-items-center">
              <Link
                className="btn btn-primary-gradient rounded-pill px-4"
                href="https://wa.me/573156399722"
                onClick={() => setExpanded(false)}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                style={{
                  background: 'linear-gradient(90deg, #4F46E5 0%, #8B5CF6 100%)',
                  transition: 'transform 0.3s',
                  border: 'none'
                }}
                target='_blank'
              >
                {t('freeAdvice.menu')} <FaWhatsapp />
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
