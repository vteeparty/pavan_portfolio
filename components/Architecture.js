import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from '../styles/Home.module.css';

// ── Architecture Node Definitions ──
const ARCH_NODES = [
  {
    id: 'developer',
    label: 'Developer',
    x: 0.08,
    y: 0.38,
    color: '#22d3ee',
    description: 'Engineer writes code and pushes to Git',
    techs: ['VS Code', 'Git', 'GitHub Copilot'],
  },
  {
    id: 'git',
    label: 'Git Repository',
    x: 0.2,
    y: 0.25,
    color: '#22d3ee',
    description: 'Source code version control and collaboration',
    techs: ['GitHub', 'Git', 'Branch Strategy'],
  },
  {
    id: 'ci',
    label: 'CI Pipeline',
    x: 0.33,
    y: 0.18,
    color: '#00d4aa',
    description: 'Continuous integration: build, test, lint',
    techs: ['Jenkins', 'GitHub Actions', 'Azure DevOps'],
  },
  {
    id: 'security',
    label: 'Security Scan',
    x: 0.33,
    y: 0.45,
    color: '#f59e0b',
    description: 'SAST, dependency scanning, policy-as-code',
    techs: ['OPA', 'SAST', 'Dependency Scan'],
  },
  {
    id: 'artifacts',
    label: 'Build Artifacts',
    x: 0.46,
    y: 0.3,
    color: '#6366f1',
    description: 'Container images and deployment packages',
    techs: ['Docker', 'ECR', 'S3'],
  },
  {
    id: 'terraform',
    label: 'Terraform / IaC',
    x: 0.46,
    y: 0.6,
    color: '#00d4aa',
    description: 'Infrastructure provisioning and state management',
    techs: ['Terraform', 'CloudFormation', 'HCL'],
  },
  {
    id: 'cd',
    label: 'CD Pipeline',
    x: 0.58,
    y: 0.22,
    color: '#00d4aa',
    description: 'Continuous deployment to target environments',
    techs: ['Argo CD', 'Helm', 'Kubectl'],
  },
  {
    id: 'k8s',
    label: 'Kubernetes',
    x: 0.7,
    y: 0.35,
    color: '#6366f1',
    description: 'Container orchestration, scaling, self-healing',
    techs: ['EKS', 'AKS', 'Helm Charts', 'Pods'],
  },
  {
    id: 'services',
    label: 'Microservices',
    x: 0.72,
    y: 0.58,
    color: '#6366f1',
    description: 'Application business logic and APIs',
    techs: ['REST APIs', 'gRPC', 'Service Mesh'],
  },
  {
    id: 'database',
    label: 'Data Layer',
    x: 0.85,
    y: 0.68,
    color: '#ef4444',
    description: 'Persistent storage and caching',
    techs: ['PostgreSQL', 'Aurora', 'Redis', 'S3'],
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    x: 0.88,
    y: 0.25,
    color: '#f59e0b',
    description: 'Observability, alerting, and incident response',
    techs: ['CloudWatch', 'Grafana', 'Prometheus', 'Splunk'],
  },
  {
    id: 'clients',
    label: 'End Users',
    x: 0.88,
    y: 0.48,
    color: '#22d3ee',
    description: 'Traffic served to end users via CDN/LB',
    techs: ['CloudFront', 'ALB', 'Route 53'],
  },
];

// ── Connections ──
const ARCH_CONNECTIONS = [
  ['developer', 'git'],
  ['git', 'ci'],
  ['ci', 'security'],
  ['ci', 'artifacts'],
  ['security', 'artifacts'],
  ['artifacts', 'cd'],
  ['terraform', 'k8s'],
  ['terraform', 'cd'],
  ['cd', 'k8s'],
  ['k8s', 'services'],
  ['services', 'database'],
  ['k8s', 'monitoring'],
  ['services', 'monitoring'],
  ['services', 'clients'],
  ['monitoring', 'clients'],
];

// ── Story Steps ──
const STORY_STEPS = [
  { id: 0, title: 'Code Commit', desc: 'Developer pushes code to Git', highlight: ['developer', 'git'], flowPath: ['developer', 'git'] },
  { id: 1, title: 'CI Triggered', desc: 'Pipeline builds and tests', highlight: ['git', 'ci', 'security'], flowPath: ['git', 'ci', 'security'] },
  { id: 2, title: 'Security Scan', desc: 'SAST, OPA, and dependency checks', highlight: ['ci', 'security', 'artifacts'], flowPath: ['ci', 'security', 'artifacts'] },
  { id: 3, title: 'Build Artifacts', desc: 'Container images pushed to registry', highlight: ['artifacts', 'cd'], flowPath: ['artifacts', 'cd'] },
  { id: 4, title: 'Infra Provisioned', desc: 'Terraform applies infrastructure', highlight: ['terraform', 'k8s', 'cd'], flowPath: ['terraform', 'k8s'] },
  { id: 5, title: 'Deploy to K8s', desc: 'Argo CD deploys to cluster', highlight: ['cd', 'k8s', 'services'], flowPath: ['cd', 'k8s', 'services'] },
  { id: 6, title: 'Monitoring Active', desc: 'Metrics, logs, and alerts flow', highlight: ['services', 'monitoring', 'k8s'], flowPath: ['services', 'monitoring'] },
  { id: 7, title: 'Traffic Served', desc: 'End users access the application', highlight: ['services', 'clients'], flowPath: ['services', 'clients'] },
];

// ── Canvas Visualization ──
function ArchitectureCanvas({ mode, activeStep, hoveredNode, setHoveredNode, setTooltipPos }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const w = () => canvas.width / dpr;
    const h = () => canvas.height / dpr;

    const getNodePos = (node) => ({
      x: node.x * w(),
      y: node.y * h(),
    });

    // Initialize flow particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 30; i++) {
        const connIdx = Math.floor(Math.random() * ARCH_CONNECTIONS.length);
        particlesRef.current.push({
          connIdx,
          t: Math.random(),
          speed: 0.003 + Math.random() * 0.005,
        });
      }
    };
    initParticles();

    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    // Mouse handling
    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      let found = null;
      ARCH_NODES.forEach((node) => {
        const pos = getNodePos(node);
        const dx = pos.x - mx;
        const dy = pos.y - my;
        if (Math.sqrt(dx * dx + dy * dy) < 30) {
          found = node.id;
        }
      });

      setHoveredNode(found);
      if (found) {
        const node = ARCH_NODES.find(n => n.id === found);
        const pos = getNodePos(node);
        setTooltipPos({ x: pos.x, y: pos.y - 50 });
      }
    };

    canvas.addEventListener('mousemove', handleMouse);

    const animate = () => {
      timeRef.current += 0.016;
      const width = w();
      const height = h();
      ctx.clearRect(0, 0, width, height);

      const storyHighlight = mode === 'story' && STORY_STEPS[activeStep]
        ? STORY_STEPS[activeStep].highlight
        : null;

      // Draw connections
      ARCH_CONNECTIONS.forEach(([fromId, toId]) => {
        const from = ARCH_NODES.find(n => n.id === fromId);
        const to = ARCH_NODES.find(n => n.id === toId);
        const fromPos = getNodePos(from);
        const toPos = getNodePos(to);

        let alpha = 0.12;
        let lineWidth = 1;
        let color = '100, 150, 180';

        // Highlight logic
        if (hoveredNode) {
          const isRelated = fromId === hoveredNode || toId === hoveredNode;
          alpha = isRelated ? 0.5 : 0.04;
          lineWidth = isRelated ? 2 : 0.5;
          if (isRelated) {
            const nodeColor = ARCH_NODES.find(n => n.id === hoveredNode)?.color || '#00d4aa';
            const rgb = hexToRgb(nodeColor);
            color = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
          }
        }

        if (storyHighlight) {
          const isInStory = storyHighlight.includes(fromId) && storyHighlight.includes(toId);
          alpha = isInStory ? 0.6 : 0.04;
          lineWidth = isInStory ? 2.5 : 0.5;
          if (isInStory) color = '0, 212, 170';
        }

        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.strokeStyle = `rgba(${color}, ${alpha})`;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      });

      // Draw flow particles
      particlesRef.current.forEach((p) => {
        p.t += p.speed;
        if (p.t > 1) {
          p.t = 0;
          p.connIdx = Math.floor(Math.random() * ARCH_CONNECTIONS.length);
        }

        const [fromId, toId] = ARCH_CONNECTIONS[p.connIdx];
        const from = ARCH_NODES.find(n => n.id === fromId);
        const to = ARCH_NODES.find(n => n.id === toId);
        const fromPos = getNodePos(from);
        const toPos = getNodePos(to);

        const px = fromPos.x + (toPos.x - fromPos.x) * p.t;
        const py = fromPos.y + (toPos.y - fromPos.y) * p.t;

        let particleAlpha = 0.5;
        if (storyHighlight) {
          const isInStory = storyHighlight.includes(fromId) && storyHighlight.includes(toId);
          particleAlpha = isInStory ? 0.9 : 0.1;
        }

        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 170, ${particleAlpha})`;
        ctx.fill();
      });

      // Draw nodes
      ARCH_NODES.forEach((node) => {
        const pos = getNodePos(node);
        const rgb = hexToRgb(node.color);
        const isHovered = hoveredNode === node.id;
        const isInStory = storyHighlight ? storyHighlight.includes(node.id) : true;

        let nodeAlpha = 1;
        let nodeScale = 1;
        let glowSize = 0;

        if (hoveredNode) {
          // Check if connected to hovered
          const connected = ARCH_CONNECTIONS.some(
            ([a, b]) => (a === hoveredNode && b === node.id) || (b === hoveredNode && a === node.id)
          );
          nodeAlpha = isHovered || connected ? 1 : 0.2;
          nodeScale = isHovered ? 1.4 : connected ? 1.1 : 0.8;
          glowSize = isHovered ? 25 : 0;
        }

        if (storyHighlight) {
          nodeAlpha = isInStory ? 1 : 0.15;
          nodeScale = isInStory ? 1.2 : 0.7;
          glowSize = isInStory ? 20 : 0;
        }

        // Glow
        if (glowSize > 0) {
          const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowSize);
          gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`);
          gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Outer ring
        const pulse = Math.sin(timeRef.current * 2 + ARCH_NODES.indexOf(node)) * 0.15 + 0.85;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 14 * nodeScale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.1 * nodeAlpha * pulse})`;
        ctx.fill();

        // Inner dot
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 6 * nodeScale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${nodeAlpha})`;
        ctx.fill();

        // Core bright center
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 2.5 * nodeScale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.8 * nodeAlpha})`;
        ctx.fill();

        // Label
        ctx.font = `${10 * nodeScale}px "JetBrains Mono", monospace`;
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${nodeAlpha * 0.9})`;
        ctx.textAlign = 'center';
        ctx.fillText(node.label, pos.x, pos.y + 22 * nodeScale);
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouse);
    };
  }, [mode, activeStep, hoveredNode, setHoveredNode, setTooltipPos]);

  return <canvas ref={canvasRef} className={styles.archCanvas} />;
}

// ── Main Architecture Section ──
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Architecture() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [mode, setMode] = useState('explore');
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Auto-advance story mode
  useEffect(() => {
    if (mode !== 'story') return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STORY_STEPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [mode]);

  const hoveredNodeData = ARCH_NODES.find(n => n.id === hoveredNode);

  return (
    <section className={`${styles.section} grid-bg`} id="architecture" ref={ref}>
      <div className="section-container">
        <motion.div
          className={styles.sectionHeader}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          <span className={styles.sectionLabel}>04 — Architecture</span>
          <h2 className={styles.sectionTitle}>How I Think</h2>
          <div className={styles.sectionLine} />
        </motion.div>

        <motion.p
          className={styles.archIntro}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp}
          custom={1}
        >
          I don&apos;t just write scripts and configure pipelines — I design systems.
          This is how a typical DevOps pipeline flows from commit to production.
        </motion.p>

        {/* Mode Toggle */}
        <motion.div
          className={styles.archModeToggle}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp}
          custom={2}
        >
          <button
            className={`${styles.archModeBtn} ${mode === 'explore' ? styles.archModeBtnActive : ''}`}
            onClick={() => setMode('explore')}
          >
            Explore
          </button>
          <button
            className={`${styles.archModeBtn} ${mode === 'story' ? styles.archModeBtnActive : ''}`}
            onClick={() => { setMode('story'); setActiveStep(0); }}
          >
            Story Mode
          </button>
        </motion.div>

        {/* Visualization */}
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp}
          custom={3}
          style={{ position: 'relative' }}
        >
          <div className={styles.archVisual}>
            <ArchitectureCanvas
              mode={mode}
              activeStep={activeStep}
              hoveredNode={hoveredNode}
              setHoveredNode={setHoveredNode}
              setTooltipPos={setTooltipPos}
            />

            {/* Tooltip */}
            {hoveredNodeData && mode === 'explore' && (
              <div
                className={`${styles.archNodeTooltip} ${hoveredNodeData ? styles.visible : ''}`}
                style={{
                  left: Math.min(tooltipPos.x - 120, (typeof window !== 'undefined' ? window.innerWidth : 1000) - 280),
                  top: tooltipPos.y - 20,
                }}
              >
                <div className={styles.archTooltipTitle}>{hoveredNodeData.label}</div>
                <div className={styles.archTooltipDesc}>{hoveredNodeData.description}</div>
                <div className={styles.archTooltipTechs}>
                  {hoveredNodeData.techs.map(t => (
                    <span key={t} className={styles.archTooltipTech}>{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Story Steps */}
          {mode === 'story' && (
            <div className={styles.storySteps} style={{ position: 'relative', marginTop: 'var(--space-xl)' }}>
              {STORY_STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`${styles.storyStep} ${activeStep === step.id ? styles.storyStepActive : ''}`}
                  onClick={() => setActiveStep(step.id)}
                >
                  <span className={styles.storyStepNumber}>
                    {String(step.id + 1).padStart(2, '0')}
                  </span>
                  <div className={styles.storyStepContent}>
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
