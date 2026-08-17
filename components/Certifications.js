import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaAws, FaLinux } from 'react-icons/fa';
import { SiTerraform } from 'react-icons/si';
import { VscAzure, VscAzureDevops } from 'react-icons/vsc';
import styles from '../styles/Home.module.css';

const CERTS = [
  { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', icon: <FaAws />, color: '#FF9900' },
  { name: 'Azure Administrator Associate', issuer: 'Microsoft', icon: <VscAzure />, color: '#0089D6' },
  { name: 'Azure DevOps Expert', issuer: 'Microsoft', icon: <VscAzureDevops />, color: '#0078D7' },
  { name: 'Terraform Associate', issuer: 'HashiCorp', icon: <SiTerraform />, color: '#844FBA' },
  { name: 'Linux Foundation Certified SysAdmin', issuer: 'Linux Foundation', icon: <FaLinux />, color: '#FCC624' },
];

const fadeUp = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Certifications() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className={styles.section} id="certifications" ref={ref}>
      <div className="section-container">
        <motion.div
          className={styles.sectionHeader}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
          }}
        >
          <span className={styles.sectionLabel}>07 — Certifications</span>
          <h2 className={styles.sectionTitle}>Credentials</h2>
          <div className={styles.sectionLine} />
        </motion.div>

        <div className={styles.certsGrid}>
          {CERTS.map((cert, i) => (
            <motion.div
              key={cert.name}
              className={styles.certBadgeCard}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -10, scale: 1.05 }}
            >
              <div 
                className={styles.certBadgeHexagon} 
                style={{ '--cert-color': cert.color }}
              >
                <div className={styles.certBadgeIconWrapper}>
                  {cert.icon}
                </div>
              </div>
              <div className={styles.certBadgeInfo}>
                <h3 className={styles.certBadgeName}>{cert.name}</h3>
                <p className={styles.certBadgeIssuer}>{cert.issuer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
