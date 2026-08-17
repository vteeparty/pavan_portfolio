import { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Stars } from '@react-three/drei';
// import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// ── Infrastructure Node Definitions ──
const INFRA_NODES = [
  { id: 'clients', label: 'CLIENTS', pos: [0, 3.5, 0], color: '#22d3ee', tier: 0 },
  { id: 'cdn', label: 'CDN / LB', pos: [-2, 2, 0.5], color: '#22d3ee', tier: 1 },
  { id: 'gateway', label: 'API GATEWAY', pos: [0, 1.5, 0], color: '#6366f1', tier: 1 },
  { id: 'auth', label: 'AUTH', pos: [2.5, 2, -0.5], color: '#f59e0b', tier: 1 },
  { id: 'cicd', label: 'CI/CD', pos: [-3.5, 0.5, 1], color: '#00d4aa', tier: 2 },
  { id: 'k8s', label: 'KUBERNETES', pos: [0, 0, 0], color: '#6366f1', tier: 2 },
  { id: 'services', label: 'SERVICES', pos: [2.5, 0, 0.5], color: '#6366f1', tier: 2 },
  { id: 'monitoring', label: 'MONITORING', pos: [3.5, 0.5, -1], color: '#f59e0b', tier: 2 },
  { id: 'terraform', label: 'TERRAFORM', pos: [-3, -1, -0.5], color: '#00d4aa', tier: 3 },
  { id: 'database', label: 'DATABASE', pos: [-1, -2, 0], color: '#ef4444', tier: 3 },
  { id: 'cache', label: 'CACHE', pos: [1.2, -2, 0.5], color: '#f59e0b', tier: 3 },
  { id: 'storage', label: 'STORAGE', pos: [3, -2, -0.5], color: '#ef4444', tier: 3 },
  { id: 'cloud', label: 'AWS / AZURE', pos: [0, -3.5, 0], color: '#00d4aa', tier: 4 },
];

// ── Connections between nodes ──
const CONNECTIONS = [
  ['clients', 'cdn'], ['clients', 'gateway'],
  ['cdn', 'gateway'], ['gateway', 'auth'],
  ['gateway', 'k8s'], ['gateway', 'services'],
  ['cicd', 'k8s'], ['cicd', 'terraform'],
  ['k8s', 'services'], ['services', 'monitoring'],
  ['k8s', 'monitoring'], ['k8s', 'database'],
  ['k8s', 'cache'], ['services', 'database'],
  ['services', 'cache'], ['services', 'storage'],
  ['terraform', 'cloud'], ['database', 'cloud'],
  ['cache', 'cloud'], ['storage', 'cloud'],
  ['monitoring', 'cloud'],
];

// ── Background Grid ──
function TechGrid() {
  return (
    <group position={[0, -4.5, 0]}>
      <gridHelper args={[40, 40, '#00d4aa', '#1a2030']} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial color="#06080d" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

// ── Single Glowing Node ──
function InfraNode({ position, color, label, index }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const innerRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const floatY = Math.sin(t * 0.5 + index * 0.7) * 0.08;
    const floatX = Math.cos(t * 0.3 + index * 0.5) * 0.04;
    meshRef.current.position.y = position[1] + floatY;
    meshRef.current.position.x = position[0] + floatX;

    const scale = hovered ? 1.4 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);

    if (innerRef.current) {
      innerRef.current.rotation.x = t * 0.5;
      innerRef.current.rotation.y = t * 0.8;
    }

    if (glowRef.current) {
      glowRef.current.material.opacity = hovered ? 0.2 : (0.08 + Math.sin(t * 1.5 + index) * 0.04);
      glowRef.current.scale.setScalar(hovered ? 1.2 : 1);
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerLeave={() => { setHovered(false); document.body.style.cursor = 'default'; }}
      >
        <icosahedronGeometry args={[0.2, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 3 : 1.5}
          roughness={0.2}
          metalness={0.9}
          wireframe={true}
        />
        <mesh ref={innerRef}>
          <octahedronGeometry args={[0.1, 0]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
        </mesh>
      </mesh>

      {/* Outer glow sphere */}
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} depthWrite={false} />
      </mesh>

      {/* Label */}
      <Text
        position={[position[0], position[1] - 0.45, position[2]]}
        fontSize={0.12}
        color={hovered ? "#ffffff" : "#94a3b8"}
        anchorX="center"
        anchorY="top"
        outlineWidth={hovered ? 0.01 : 0}
        outlineColor={color}
      >
        {label}
      </Text>
    </group>
  );
}

// ── Connection Lines with flowing particles ──
function ConnectionLines() {
  const linesRef = useRef();
  const particlesRef = useRef();
  const particleData = useRef([]);

  const { linePositions, lineColors } = useMemo(() => {
    const positions = [];
    const colors = [];
    const nodeMap = {};
    INFRA_NODES.forEach(n => { nodeMap[n.id] = n; });

    CONNECTIONS.forEach(([fromId, toId]) => {
      const from = nodeMap[fromId];
      const to = nodeMap[toId];
      if (!from || !to) return;
      positions.push(from.pos[0], from.pos[1], from.pos[2]);
      positions.push(to.pos[0], to.pos[1], to.pos[2]);
      colors.push(0, 0.4, 0.6, 0, 0.4, 0.6); // Slightly brighter base line
    });

    return {
      linePositions: new Float32Array(positions),
      lineColors: new Float32Array(colors),
    };
  }, []);

  // Flowing particles along edges
  const FLOW_COUNT = 100;
  const flowPositions = useMemo(() => {
    const arr = new Float32Array(FLOW_COUNT * 3);
    const nodeMap = {};
    INFRA_NODES.forEach(n => { nodeMap[n.id] = n; });

    particleData.current = [];
    for (let i = 0; i < FLOW_COUNT; i++) {
      const connIdx = Math.floor(Math.random() * CONNECTIONS.length);
      const [fromId, toId] = CONNECTIONS[connIdx];
      const from = nodeMap[fromId];
      const to = nodeMap[toId];
      particleData.current.push({
        fromPos: from.pos,
        toPos: to.pos,
        t: Math.random(),
        speed: 0.2 + Math.random() * 0.6, // Faster particles
      });
      arr[i * 3] = from.pos[0];
      arr[i * 3 + 1] = from.pos[1];
      arr[i * 3 + 2] = from.pos[2];
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!particlesRef.current) return;
    const positions = particlesRef.current.geometry.attributes.position;
    const dt = 0.01;

    particleData.current.forEach((p, i) => {
      p.t += dt * p.speed;
      if (p.t > 1) {
        p.t = 0;
        // Pick a new random connection
        const connIdx = Math.floor(Math.random() * CONNECTIONS.length);
        const [fromId, toId] = CONNECTIONS[connIdx];
        const nodeMap = {};
        INFRA_NODES.forEach(n => { nodeMap[n.id] = n; });
        p.fromPos = nodeMap[fromId].pos;
        p.toPos = nodeMap[toId].pos;
        p.speed = 0.2 + Math.random() * 0.6;
      }

      positions.array[i * 3] = p.fromPos[0] + (p.toPos[0] - p.fromPos[0]) * p.t;
      positions.array[i * 3 + 1] = p.fromPos[1] + (p.toPos[1] - p.fromPos[1]) * p.t;
      positions.array[i * 3 + 2] = p.fromPos[2] + (p.toPos[2] - p.fromPos[2]) * p.t;
    });

    positions.needsUpdate = true;
  });

  return (
    <group>
      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.25}
          linewidth={1}
        />
      </lineSegments>

      {/* Flowing data particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[flowPositions, 3]}
            count={FLOW_COUNT}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#22d3ee"
          size={0.06}
          transparent
          opacity={1}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// ── Massive Deep Background Structure ──
function DeepBackground() {
  const ref = useRef();
  
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.02;
    ref.current.rotation.x = clock.getElapsedTime() * 0.01;
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <icosahedronGeometry args={[40, 1]} />
      <meshBasicMaterial 
        color="#00d4aa" 
        wireframe 
        transparent 
        opacity={0.4} 
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ── Ambient floating particles ──
function AmbientParticles({ count = 800 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.015;
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.008) * 0.08;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00d4aa"
        size={0.02}
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ── Camera Controller with Mouse Tracking ──
function CameraController({ showNodes }) {
  const { camera } = useThree();
  const scrollY = useRef(0);

  useEffect(() => {
    if (showNodes) return;
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showNodes]);

  useFrame((state) => {
    const targetX = state.pointer.x * 1.5;
    const scrollOffset = showNodes ? 0 : scrollY.current * 0.005;
    const lookOffset = showNodes ? 0 : scrollY.current * 0.002;
    
    const targetY = state.pointer.y * 1 - scrollOffset + 0.5;
    camera.position.x += (targetX - camera.position.x) * 0.03;
    camera.position.y += (targetY - camera.position.y) * 0.03;
    camera.lookAt(0, -lookOffset, 0);
  });

  return null;
}

// ── Main Scene ──
function Scene({ showNodes }) {
  return (
    <>
      <color attach="background" args={['#030508']} />
      
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#00d4aa" />
      <pointLight position={[-5, -3, 3]} intensity={1} color="#6366f1" />
      <pointLight position={[0, 3, -5]} intensity={1.2} color="#22d3ee" />

      <CameraController showNodes={showNodes} />
      
      {!showNodes && (
        <>
          <TechGrid />
          <DeepBackground />
          <Stars radius={80} depth={50} count={5000} factor={8} saturation={0} fade speed={2} />
        </>
      )}

      {/* Infrastructure Nodes */}
      {showNodes && INFRA_NODES.map((node, i) => (
        <InfraNode
          key={node.id}
          position={node.pos}
          color={node.color}
          label={node.label}
          index={i}
        />
      ))}

      {/* Connections + Data Flow */}
      {showNodes && <ConnectionLines />}

      {/* Ambient particles */}
      {!showNodes && <AmbientParticles count={1500} />}
    </>
  );
}

// ── Exported Canvas Component ──
export default function InfrastructureScene({ showNodes = false }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Canvas
      camera={{ position: [0, 0.5, 8], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false }}
    >
      <Suspense fallback={null}>
        <Scene showNodes={showNodes} />
      </Suspense>
    </Canvas>
  );
}
