import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certs' },
  { id: 'contact', label: 'Contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // Intersection Observer for active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
    );

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileOpen(false);
    }
  };

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navInner}>
          <div className={styles.navLogo}>PT</div>

          <div className={styles.navLinks}>
            {NAV_ITEMS.map(({ id, label }) => (
              <button
                key={id}
                className={`${styles.navLink} ${activeSection === id ? styles.navLinkActive : ''}`}
                onClick={() => scrollTo(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            className={styles.navMobileToggle}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.open : ''}`}>
        <button
          className={styles.mobileClose}
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>
        {NAV_ITEMS.map(({ id, label }) => (
          <button
            key={id}
            className={styles.mobileMenuLink}
            onClick={() => scrollTo(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}
