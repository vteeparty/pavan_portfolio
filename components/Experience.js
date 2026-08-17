import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from '../styles/Home.module.css';

const EXPERIENCES = [
  {
    company: 'Intuit Inc.',
    role: 'Platform & DataOps Engineer',
    location: 'Mountain View, CA',
    date: 'Jun 2026 — Present',
    tech: ['Kafka', 'Argo CD', 'OPA', 'Terraform', 'EKS', 'EMR'],
    achievements: [
      'Tuned Kafka adaptors and consumer groups to cut ingestion lag, with rollouts via Argo CD',
      'Added OPA policy checks to Terraform pipeline for EKS/data platform, blocking overly permissive IAM roles or public S3 buckets',
      'Sized and configured Amazon EMR clusters with autoscaling and SSL, retiring idle clusters to control costs',
      'Built ingestion health dashboards (Kafka, EMR, data APIs) tracking lag, error rates, and throughput',
      'Enforced data quality checks and access controls on feature tables for production ML models',
    ],
  },
  {
    company: 'Silicon Valley Bank',
    role: 'DevSecOps Engineer',
    location: 'Austin, TX',
    date: 'Nov 2023 — May 2026',
    tech: ['Terraform', 'EBS', 'Jenkins', 'GitHub Actions', 'Helm', 'IAM'],
    achievements: [
      'Architected infrastructure automation with Terraform/CloudFormation — 40% faster environment setup',
      'Managed EBS volumes (sizing, snapshots, gp3 migration) for latency-sensitive banking services',
      'Maintained Jenkins and GitHub Actions pipelines with builds, tests, and security checks',
      'Deployed services to Kubernetes clusters using Helm charts across dev/staging',
      'Created scoped IAM roles replacing overly broad permissions for S3, RDS, and CloudWatch',
      'Tightened security groups and NACLs aligning with least-privilege network policies',
    ],
  },
  {
    company: 'Miraki Technologies (Energizer Holdings)',
    role: 'DevOps Support Engineer',
    location: 'Hyderabad, IN',
    date: 'Mar 2020 — Jul 2022',
    tech: ['Azure DevOps', 'Azure VMs', 'Azure Monitor', 'GitHub'],
    achievements: [
      'Managed Azure DevOps CI/CD pipelines — reduced deployment incidents by ~30%',
      'Monitored Azure VMs with Azure Monitor for resource bottlenecks and availability',
      'Investigated build/pipeline failures, shortening MTTR by ~25% during releases',
      'Maintained GitHub-based workflows for code promotions across dev/test/prod',
    ],
  },
  {
    company: 'Miraki Technologies (Savvas Learning)',
    role: 'Production Support Engineer',
    location: 'Hyderabad, IN',
    date: 'Feb 2020 — Sep 2022',
    tech: ['Bash', 'Git', 'AutoSys', 'SQL', 'Jira', 'ServiceNow'],
    achievements: [
      'Enhanced JIL scripts with Bash/Git — cut manual restarts by ~30%',
      'Configured AutoSys job schedules achieving 99.9% job completion rate',
      'Diagnosed failed batch processes via SQL analysis and Jira tracking — reduced repeat failures by ~40%',
      'Managed 200+ ServiceNow tickets/month maintaining 95% SLA adherence',
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className={styles.section} id="experience" ref={ref}>
      <div className="section-container">
        <motion.div
          className={styles.sectionHeader}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          <span className={styles.sectionLabel}>03 — Experience</span>
          <h2 className={styles.sectionTitle}>Where I&apos;ve Built</h2>
          <div className={styles.sectionLine} />
        </motion.div>

        <div className={styles.timeline}>
          {/* Animated Pipeline Path */}
          <div className={styles.timelineLine}>
            <motion.div 
              className={styles.timelineLineProgress}
              initial={{ height: 0 }}
              animate={inView ? { height: '100%' } : { height: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>

          {EXPERIENCES.map((exp, i) => (
            <motion.div
              key={exp.company}
              className={styles.timelineItem}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={fadeUp}
              custom={i + 1}
              whileHover={{ x: 10 }}
            >
              {/* Pipeline Stage Node */}
              <div className={styles.timelineDot}>
                <div className={styles.timelineDotCore} />
              </div>
              <span className={styles.timelineDate}>{exp.date}</span>

              {/* Terminal Window Card */}
              <div className={`${styles.terminalCard}`}>
                <div className={styles.terminalHeader}>
                  <div className={styles.terminalButtons}>
                    <span className={styles.terminalBtnRed} />
                    <span className={styles.terminalBtnYellow} />
                    <span className={styles.terminalBtnGreen} />
                  </div>
                  <div className={styles.terminalTitle}>
                    bash - {exp.company.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                  </div>
                </div>

                <div className={styles.terminalBody}>
                  <h3 className={styles.terminalCompany}>{exp.company}</h3>
                  <div className={styles.terminalMeta}>
                    <span className={styles.terminalRole}>{exp.role}</span>
                    <span className={styles.terminalLocation}>@ {exp.location}</span>
                  </div>

                  <ul className={styles.terminalAchievements}>
                    {exp.achievements.map((ach, j) => (
                      <li key={j}>
                        <span className={styles.terminalPrompt}>$</span> {ach}
                      </li>
                    ))}
                  </ul>

                  <div className={styles.terminalTech}>
                    {exp.tech.map((t) => (
                      <span key={t} className={styles.terminalTechBadge}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
