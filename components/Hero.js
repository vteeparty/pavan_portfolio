import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import styles from '../styles/Home.module.css';

// Dynamic import to avoid SSR issues with Three.js
const InfrastructureScene = dynamic(() => import('./InfrastructureScene'), {
  ssr: false,
  loading: () => null,
});

const FIRST_NAME = 'PAVAN';
const LAST_NAME = 'TEEPARTY';

function AnimatedChar({ char, index, delay }) {
  return (
    <motion.span
      initial={{ y: 80, opacity: 0, rotateX: -40 }}
      animate={{ y: 0, opacity: 1, rotateX: 0 }}
      transition={{
        duration: 0.8,
        delay: delay + index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ display: 'inline-block' }}
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className={styles.hero} id="hero">
      {/* 3D Canvas Background */}
      <div className={styles.heroCanvas}>
        <InfrastructureScene />
      </div>

      {/* Gradient overlays for readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(6,8,13,0.7) 70%)',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div className={styles.heroContent}>
        {/* Name */}
        <div className={styles.heroNameWrapper}>
          <h1 className={styles.heroName}>
            {FIRST_NAME.split('').map((char, i) => (
              <AnimatedChar key={`f-${i}`} char={char} index={i} delay={0.3} />
            ))}
            <br />
            {LAST_NAME.split('').map((char, i) => (
              <AnimatedChar key={`l-${i}`} char={char} index={i} delay={0.6} />
            ))}
          </h1>
        </div>

        {/* Role */}
        <motion.p
          className={styles.heroRole}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {'// DevOps & Cloud Engineer'}
        </motion.p>

        {/* Tagline */}
        <motion.p
          className={styles.heroTagline}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          Building resilient, scalable cloud infrastructure.
          Automating everything between commit and production.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className={styles.heroCta}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <a href="#architecture" className={`${styles.ctaButton} ${styles.ctaPrimary}`}>
            Explore Architecture
          </a>
          <a href="#contact" className={`${styles.ctaButton} ${styles.ctaSecondary}`}>
            Get in Touch
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {mounted && (
        <motion.div
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          <span className={styles.scrollLine} />
          <span className={styles.scrollText}>scroll</span>
        </motion.div>
      )}
    </section>
  );
}
