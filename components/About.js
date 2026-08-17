import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import styles from '../styles/Home.module.css';

const METRICS = [
  { value: '6+', label: 'Years Experience' },
  { value: '5', label: 'Certifications' },
  { value: '99.9%', label: 'Job Completion' },
  { value: '40%', label: 'Faster Deploys' },
];

const INFO_CARDS = [
  {
    icon: '☁️',
    title: 'Cloud Infrastructure',
    desc: 'AWS & Azure certified. Architecting EC2, RDS, IAM, EKS, and multi-cloud environments.',
  },
  {
    icon: '⚙️',
    title: 'CI/CD & Automation',
    desc: 'Jenkins, GitHub Actions, Azure DevOps. Terraform and CloudFormation for IaC.',
  },
  {
    icon: '🛡️',
    title: 'Security & Compliance',
    desc: 'IAM policies, VPC security groups, OPA policy-as-code, SAST scanning, KMS encryption.',
  },
  {
    icon: '📊',
    title: 'Monitoring & Observability',
    desc: 'CloudWatch, Splunk, Grafana, Prometheus. Building proactive incident dashboards.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

// ── Interactive 3D Abstract Core ──
function AbstractCore() {
  const groupRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      // Gentle floating
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.1;

      // React to mouse pointer
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, (pointer.y * Math.PI) / 4, 0.1);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, (pointer.x * Math.PI) / 4, 0.1);
    }

    // Rotate rings
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.5;
    if (ring2Ref.current) ring2Ref.current.rotation.x = t * 0.3;
    if (ring3Ref.current) ring3Ref.current.rotation.y = -t * 0.2;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#00d4aa" />
      <pointLight position={[-10, -10, -5]} intensity={1} color="#6366f1" />

      {/* Black & White World Globe */}
      <group
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
        scale={hovered ? 1.1 : 1}
      >
        {/* Solid Black Core */}
        <Sphere args={[1, 32, 32]}>
          <meshBasicMaterial color="#0b0f19" />
        </Sphere>
        {/* White Wireframe Grid (Globe look) */}
        <Sphere args={[1.01, 24, 24]}>
          <meshBasicMaterial color="#ffffff" wireframe={true} transparent opacity={hovered ? 0.9 : 0.4} />
        </Sphere>
      </group>

      {/* Orbiting Tech Rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.5, 0.015, 16, 100]} />
        <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={1} />
        {/* Orbiting dot */}
        <mesh position={[1.5, 0, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </mesh>

      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.8, 0.015, 16, 100]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.5} />
        <mesh position={[1.8, 0, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#22d3ee" />
        </mesh>
      </mesh>

      <mesh ref={ring3Ref} rotation={[0, Math.PI / 4, Math.PI / 2]}>
        <torusGeometry args={[2.1, 0.01, 16, 100]} />
        <meshStandardMaterial color="#f59e0b" transparent opacity={0.3} />
        <mesh position={[2.1, 0, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      </mesh>
    </group>
  );
}

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className={styles.section} id="about" ref={ref}>
      <div className="section-container">
        <motion.div
          className={styles.sectionHeader}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          <span className={styles.sectionLabel}>01 — About</span>
          <h2 className={styles.sectionTitle}>Who I Am</h2>
          <div className={styles.sectionLine} />
        </motion.div>

        {/* Top Split: 3D Visual & Bio/Metrics */}
        <div className={styles.aboutTopSplit}>

          {/* 3D Visual representation of "Cloud Engineering" */}
          <motion.div
            className={styles.aboutVisualContainer}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <Canvas camera={{ position: [0, 0, 6.5], fov: 45 }}>
              <AbstractCore />
            </Canvas>
          </motion.div>

          {/* Bio and Metrics */}
          <div className={styles.aboutBioContent}>
            <motion.p
              className={styles.aboutText}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={fadeUp}
              custom={1}
            >
              DevOps & Cloud Engineer with{' '}
              <span className={styles.aboutHighlight}>6 years</span> of experience
              building and supporting{' '}
              <span className={styles.aboutHighlight}>AWS and Azure</span> infrastructure
              across banking and enterprise environments. I specialize in{' '}
              <span className={styles.aboutHighlight}>Terraform</span>,{' '}
              <span className={styles.aboutHighlight}>CI/CD pipelines</span>,{' '}
              <span className={styles.aboutHighlight}>Kubernetes</span>, and{' '}
              <span className={styles.aboutHighlight}>monitoring systems</span> — orchestrating
              chaos into reliable, secure, and scalable cloud systems.
            </motion.p>

            <div className={styles.aboutMetricsGrid}>
              {METRICS.map((m, i) => (
                <motion.div
                  key={m.label}
                  className={`${styles.metricCard} glass-card`}
                  initial="hidden"
                  animate={inView ? 'visible' : 'hidden'}
                  variants={fadeUp}
                  custom={i + 2}
                  whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0, 212, 170, 0.2)' }}
                >
                  <div className={styles.metricValue}>{m.value}</div>
                  <div className={styles.metricLabel}>{m.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
