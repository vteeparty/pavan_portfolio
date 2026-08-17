import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ParticleField from './ParticleField';
import styles from '../styles/Home.module.css';

const LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pavante/' },
  { label: 'GitHub', href: 'https://github.com/vteeparty' },
  { label: 'Phone', href: 'tel:+16892087688' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className={`${styles.section} ${styles.contactSection}`} id="contact" ref={ref}>
      {/* Ambient particle background */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <ParticleField color="0, 212, 170" opacity={0.15} speed={0.1} />
      </div>

      <div className={`section-container ${styles.contactInner}`}>
        <motion.div
          className={styles.contactContentWrapper}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={fadeUp} custom={0} className={styles.contactAgencyHeader}>
            <span className={styles.contactAgencySub}>08 — San Francisco, CA</span>
            <h2 className={styles.contactAgencyTitle}>Let&apos;s Build.</h2>
          </motion.div>

          <motion.div variants={fadeUp} custom={1} className={styles.contactGiantWrapper}>
            <a href="mailto:vkteeparty@gmail.com" className={styles.contactGiantEmail}>
              vkteeparty@gmail.com
            </a>
          </motion.div>

          <motion.div variants={fadeUp} custom={2} className={styles.contactAgencyLinks}>
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={styles.contactAgencyLink}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className={styles.footer} style={{ position: 'relative', zIndex: 2 }}>
        <p className={styles.footerText}>
          © {new Date().getFullYear()} Pavan Teeparty — Designed & Engineered
        </p>
      </div>
    </section>
  );
}
