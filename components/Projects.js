import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from '../styles/Home.module.css';

const PROJECTS = [
  {
    number: '01',
    title: 'Cloud Infrastructure Automation',
    company: 'Silicon Valley Bank',
    description: 'Architected end-to-end infrastructure automation using Terraform and AWS CloudFormation. Provisioned EC2, RDS, and IAM resources while eliminating configuration drift across critical banking workloads. Migrated EBS volumes to gp3 for cost/performance optimization.',
    techs: ['Terraform', 'CloudFormation', 'EC2', 'RDS', 'IAM', 'EBS', 'gp3'],
    impact: '40% faster environment setup',
    architecture: 'Terraform → State → AWS Provider → VPC → Subnets → EC2 + RDS + IAM → CloudWatch',
  },
  {
    number: '02',
    title: 'Data Platform Operations',
    company: 'Intuit Inc.',
    description: 'Built and operated data platform infrastructure: tuned Kafka ingestion, configured EMR autoscaling clusters, enforced OPA policy checks in Terraform pipelines, and created observability dashboards tracking lag, error rates, and throughput.',
    techs: ['Kafka', 'EMR', 'EKS', 'OPA', 'Argo CD', 'Terraform', 'Grafana'],
    impact: 'Zero policy violations in production',
    architecture: 'Kafka → EMR → Feature Tables → ML Models → Monitoring → Alerts',
  },
  {
    number: '03',
    title: 'CI/CD Pipeline Engineering',
    company: 'Miraki (Energizer Holdings)',
    description: 'Managed Azure DevOps CI/CD pipelines for manufacturing and retail applications. Investigated and resolved build failures with dev teams, maintained GitHub-based code promotion workflows, and supported Azure storage for artifact traceability.',
    techs: ['Azure DevOps', 'Azure VMs', 'Azure Monitor', 'GitHub', 'Jira'],
    impact: '~30% fewer deployment incidents',
    architecture: 'Git → Azure Pipeline → Build → Test → Release → Azure VMs → Monitor',
  },
  {
    number: '04',
    title: 'Production Batch Operations',
    company: 'Miraki (Savvas Learning)',
    description: 'Engineered AutoSys job scheduling with dependencies and calendars, achieving 99.9% job completion. Built Bash scripts and SQL queries for automated validation, and managed 200+ monthly ServiceNow tickets with 95% SLA adherence.',
    techs: ['AutoSys', 'Bash', 'SQL', 'ServiceNow', 'Jira', 'Git'],
    impact: '99.9% job completion rate',
    architecture: 'Schedule → AutoSys → Job Dependencies → SQL Validation → Alerting → ServiceNow',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

function ProjectFlow({ flowString }) {
  const nodes = flowString.split(' → ');
  return (
    <div className={styles.projectFlowContainer}>
      {nodes.map((node, idx) => (
        <div key={idx} className={styles.projectFlowNodeWrapper}>
          <motion.div 
            className={styles.projectFlowNode}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <div className={styles.projectFlowNodeBg} />
            <span className={styles.projectFlowNodeText}>{node}</span>
          </motion.div>
          {idx < nodes.length - 1 && (
            <motion.div 
              className={styles.projectFlowArrow}
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: 30 }}
              transition={{ duration: 0.4, delay: idx * 0.1 + 0.2 }}
              viewport={{ once: true }}
            >
              <div className={styles.projectFlowArrowLine}>
                <div className={styles.projectFlowArrowPulse} />
              </div>
              <div className={styles.projectFlowArrowHead} />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className={styles.section} id="projects" ref={ref}>
      <div className="section-container">
        <motion.div
          className={styles.sectionHeader}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          <span className={styles.sectionLabel}>06 — Projects</span>
          <h2 className={styles.sectionTitle}>What I&apos;ve Built</h2>
          <div className={styles.sectionLine} />
        </motion.div>

        <div className={styles.projectsList}>
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.number}
              className={`${styles.projectCardWide} glass-card`}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={fadeUp}
              custom={i + 1}
            >
              <div className={styles.projectCardGlow} />

              <div className={styles.projectContent}>
                <span className={styles.projectNumber}>{project.number}</span>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectCompany}>{project.company}</p>
                <p className={styles.projectDesc}>{project.description}</p>

                <div className={styles.projectMetaRow}>
                  <span className={styles.projectMetaLabel}>Impact</span>
                  <span className={styles.projectImpact}>{project.impact}</span>
                </div>

                <div className={styles.projectMetaRow} style={{ marginTop: 'var(--space-md)' }}>
                  <span className={styles.projectMetaLabel}>Technologies</span>
                  <div className={styles.projectTechTags}>
                    {project.techs.map(t => (
                      <span key={t} className={styles.projectTechTag}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.projectVisual}>
                <div className={styles.projectVisualHeader}>
                  <span className={styles.projectMetaLabel}>Architecture Flow</span>
                </div>
                <ProjectFlow flowString={project.architecture} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
