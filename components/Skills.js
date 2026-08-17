import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from '../styles/Home.module.css';

const SKILL_CATEGORIES = [
  {
    name: 'Cloud Platforms',
    icon: '☁️',
    color: '#00d4aa',
    skills: ['AWS EC2', 'S3', 'RDS', 'IAM', 'CloudWatch', 'CloudFormation', 'Azure VMs', 'Azure DevOps', 'Azure Monitor'],
  },
  {
    name: 'CI/CD & Automation',
    icon: '🔄',
    color: '#6366f1',
    skills: ['Jenkins', 'GitHub Actions', 'Azure DevOps Pipelines', 'Argo CD', 'Build & Release'],
  },
  {
    name: 'Infrastructure as Code',
    icon: '📐',
    color: '#22d3ee',
    skills: ['Terraform', 'CloudFormation', 'Bash Automation', 'YAML', 'JSON'],
  },
  {
    name: 'Containers & Orchestration',
    icon: '🐳',
    color: '#f59e0b',
    skills: ['Docker', 'Kubernetes', 'EKS', 'AKS', 'Helm Charts'],
  },
  {
    name: 'Monitoring & Observability',
    icon: '📊',
    color: '#ef4444',
    skills: ['CloudWatch', 'Splunk', 'Grafana', 'Prometheus', 'Incident Mgmt', 'RCA'],
  },
  {
    name: 'Scripting & Languages',
    icon: '💻',
    color: '#a855f7',
    skills: ['Python', 'Bash', 'Shell', 'PowerShell', 'SQL'],
  },
  {
    name: 'Databases',
    icon: '🗄️',
    color: '#ec4899',
    skills: ['Oracle', 'MySQL', 'PostgreSQL', 'Amazon Aurora', 'SQL Server', 'pgvector'],
  },
  {
    name: 'Security & Networking',
    icon: '🛡️',
    color: '#f59e0b',
    skills: ['IAM Policies', 'SSH/TLS/SSL', 'AWS KMS', 'VPC/NACLs', 'OPA', 'SAST'],
  },
  {
    name: 'DevOps Tools & ITSM',
    icon: '🔧',
    color: '#14b8a6',
    skills: ['Git', 'GitHub', 'ServiceNow', 'Jira', 'AutoSys', 'Cron'],
  },
];

// ── Structured Constellation ──
function SkillConstellation() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const nodesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
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
      layoutNodes();
    };

    const w = () => canvas.width / dpr;
    const h = () => canvas.height / dpr;

    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    // Layout: categories arranged in a circle, skills orbit each category
    const layoutNodes = () => {
      const width = w();
      const height = h();
      const cx = width / 2;
      const cy = height / 2;
      const catCount = SKILL_CATEGORIES.length;
      // Use an elliptical layout but constrain it so nodes never exceed the canvas
      // Subtracting 120px padding to account for orbit radius + text labels
      const maxRadiusX = Math.max(10, width / 2 - 120);
      const maxRadiusY = Math.max(10, height / 2 - 100);
      const radiusX = Math.min(width * 0.35, maxRadiusX);
      const radiusY = Math.min(height * 0.35, maxRadiusY);

      nodesRef.current = [];

      SKILL_CATEGORIES.forEach((cat, catIdx) => {
        const catAngle = (catIdx / catCount) * Math.PI * 2 - Math.PI / 2;
        const catX = cx + Math.cos(catAngle) * radiusX;
        const catY = cy + Math.sin(catAngle) * radiusY;

        // Category hub node
        nodesRef.current.push({
          x: catX,
          y: catY,
          baseX: catX,
          baseY: catY,
          label: cat.name,
          color: cat.color,
          isHub: true,
          catIdx,
          size: 5,
          orbitAngle: 0,
          orbitRadius: 0,
          orbitSpeed: 0,
        });

        // Skill nodes orbiting this category
        const skillCount = cat.skills.length;
        const orbitRadius = 40 + skillCount * 4;

        cat.skills.forEach((skill, skillIdx) => {
          const skillAngle = (skillIdx / skillCount) * Math.PI * 2;
          const sx = catX + Math.cos(skillAngle) * orbitRadius;
          const sy = catY + Math.sin(skillAngle) * orbitRadius;

          nodesRef.current.push({
            x: sx,
            y: sy,
            baseX: sx,
            baseY: sy,
            hubX: catX,
            hubY: catY,
            label: skill,
            color: cat.color,
            isHub: false,
            catIdx,
            size: 2.5,
            orbitAngle: skillAngle,
            orbitRadius: orbitRadius,
            orbitSpeed: 0.0003 + Math.random() * 0.0004,
          });
        });
      });
    };

    // Call resize immediately to set the correct canvas dimensions before layout
    resize();

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener('mousemove', handleMouse);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      timeRef.current += 1;
      const width = w();
      const height = h();
      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;
      const time = timeRef.current;

      // Find which category is hovered (by proximity to hub)
      let hoveredCat = -1;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      nodes.forEach((node) => {
        if (!node.isHub) return;
        const dx = node.x - mx;
        const dy = node.y - my;
        if (Math.sqrt(dx * dx + dy * dy) < 60) {
          hoveredCat = node.catIdx;
        }
      });

      // Also check if mouse is near any skill node
      if (hoveredCat === -1) {
        nodes.forEach((node) => {
          if (node.isHub) return;
          const dx = node.x - mx;
          const dy = node.y - my;
          if (Math.sqrt(dx * dx + dy * dy) < 25) {
            hoveredCat = node.catIdx;
          }
        });
      }

      // Update orbit positions for skill nodes
      nodes.forEach((node) => {
        if (node.isHub) {
          // Gentle float for hubs
          node.x = node.baseX + Math.sin(time * 0.008 + node.catIdx) * 3;
          node.y = node.baseY + Math.cos(time * 0.006 + node.catIdx * 1.3) * 3;
          return;
        }

        // Slowly orbit
        node.orbitAngle += node.orbitSpeed;
        const hubNode = nodes.find(n => n.isHub && n.catIdx === node.catIdx);
        if (hubNode) {
          node.x = hubNode.x + Math.cos(node.orbitAngle) * node.orbitRadius;
          node.y = hubNode.y + Math.sin(node.orbitAngle) * node.orbitRadius;
        }
      });

      // Draw connections: hub-to-hub (faint) for adjacent categories
      const hubs = nodes.filter(n => n.isHub);
      for (let i = 0; i < hubs.length; i++) {
        const j = (i + 1) % hubs.length;
        const a = hubs[i];
        const b = hubs[j];
        const rgb = hexToRgb(a.color);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.06)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Draw connections: hub-to-skills and skill-to-skill rings
      const cats = Array.from(new Set(nodes.filter(n => !n.isHub).map(n => n.catIdx)));
      
      cats.forEach(catIdx => {
        const hub = nodes.find(n => n.isHub && n.catIdx === catIdx);
        const skills = nodes.filter(n => !n.isHub && n.catIdx === catIdx);
        if (!hub || skills.length === 0) return;

        const isActive = hoveredCat === catIdx;
        const rgb = hexToRgb(hub.color);
        const alpha = isActive ? 0.3 : 0.07;

        // Hub to skill lines
        skills.forEach((node) => {
          ctx.beginPath();
          ctx.moveTo(hub.x, hub.y);
          ctx.lineTo(node.x, node.y);
          ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
          ctx.lineWidth = isActive ? 1 : 0.5;
          ctx.stroke();
        });

        // Skill to skill ring (interlinking)
        if (skills.length > 1) {
          ctx.beginPath();
          ctx.moveTo(skills[0].x, skills[0].y);
          for (let i = 1; i < skills.length; i++) {
            ctx.lineTo(skills[i].x, skills[i].y);
          }
          ctx.lineTo(skills[0].x, skills[0].y); // Close ring
          ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${isActive ? 0.15 : 0.04})`;
          ctx.lineWidth = isActive ? 1 : 0.5;
          ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach((node) => {
        const rgb = hexToRgb(node.color);
        const isActive = hoveredCat === node.catIdx;
        const isDimmed = hoveredCat !== -1 && !isActive;

        const dx = node.x - mx;
        const dy = node.y - my;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        const isNearMouse = distToMouse < 30;

        let alpha = isDimmed ? 0.15 : isActive ? 1 : 0.6;
        let size = node.size;

        if (node.isHub) {
          size = isActive ? 7 : 5;

          // Hub glow
          const glowRadius = isActive ? 35 : 18;
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowRadius);
          gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${isActive ? 0.2 : 0.06})`);
          gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
          ctx.beginPath();
          ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        } else {
          size = isNearMouse ? 4 : isActive ? 3.5 : isDimmed ? 1.5 : 2.5;

          // Skill glow on hover
          if (isNearMouse) {
            const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 20);
            gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`);
            gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
            ctx.beginPath();
            ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
          }
        }

        // Draw dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
        ctx.fill();

        // Bright center for hubs
        if (node.isHub) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${isActive ? 0.9 : 0.5})`;
          ctx.fill();
        }

        // Labels
        if (node.isHub) {
          ctx.font = `${isActive ? 'bold ' : ''}11px "JetBrains Mono", monospace`;
          ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${isActive ? 1 : 0.6})`;
          ctx.textAlign = 'center';
          ctx.fillText(node.label, node.x, node.y + size + 14);
        } else if (isNearMouse || (isActive && node.size > 2)) {
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9)`;
          ctx.textAlign = 'center';
          ctx.fillText(node.label, node.x, node.y - size - 6);
        }
      });

      // Ambient floating particles
      for (let i = 0; i < 40; i++) {
        const px = (Math.sin(time * 0.001 + i * 7.3) * 0.5 + 0.5) * width;
        const py = (Math.cos(time * 0.0008 + i * 5.1) * 0.5 + 0.5) * height;
        ctx.beginPath();
        ctx.arc(px, py, 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 170, ${0.08 + Math.sin(time * 0.003 + i) * 0.04})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouse);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', cursor: 'crosshair' }} />;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className={`${styles.section} grid-bg`} id="skills" ref={ref}>
      <div className="section-container">
        <motion.div
          className={styles.sectionHeader}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          <span className={styles.sectionLabel}>02 — Skills</span>
          <h2 className={styles.sectionTitle}>Technology Ecosystem</h2>
          <div className={styles.sectionLine} />
        </motion.div>

        {/* Interactive constellation */}
        <motion.div
          className={styles.skillsCanvas}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <SkillConstellation />
        </motion.div>

        {/* Category cards have been removed in favor of the interactive constellation canvas */}
      </div>
    </section>
  );
}
