import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import dynamic from 'next/dynamic';
import styles from '../styles/Home.module.css';

// Dynamic import to avoid SSR issues with Three.js
const InfrastructureScene = dynamic(() => import('./InfrastructureScene'), {
  ssr: false,
  loading: () => null,
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Infrastructure() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className={`${styles.section} grid-bg`} id="infrastructure" ref={ref}>
      <div className="section-container">
        <motion.div
          className={styles.sectionHeader}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          <span className={styles.sectionLabel}>05 — Cloud Infrastructure</span>
          <h2 className={styles.sectionTitle}>Infrastructure topology</h2>
          <div className={styles.sectionLine} />
        </motion.div>

        <motion.p
          className={styles.archIntro}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp}
          custom={1}
        >
          A high-level view of the resilient, scalable cloud infrastructure that underpins the applications. Hover over the nodes to explore the components.
        </motion.p>

        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp}
          custom={2}
          style={{ position: 'relative' }}
        >
          <div className={styles.archVisual}>
            <InfrastructureScene showNodes={true} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
