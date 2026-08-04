import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Line, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Animated data packet that flows along a path
function DataPacket({ start, end, speed = 1, color = '#00d4ff' }: {
  start: [number, number, number];
  end: [number, number, number];
  speed?: number;
  color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const curve = useMemo(() => {
    const mid: [number, number, number] = [
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2 + 0.5,
      (start[2] + end[2]) / 2,
    ];
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...end)
    );
  }, [start, end]);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = ((clock.getElapsedTime() * speed) % 1);
      const pos = curve.getPoint(t);
      ref.current.position.copy(pos);
    }
  });

  return (
    <Sphere ref={ref} args={[0.06, 8, 8]}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
    </Sphere>
  );
}

// Network node (router or switch)
function NetworkNode({ position, type = 'router', color = '#00d4ff' }: {
  position: [number, number, number];
  type?: 'router' | 'switch' | 'server';
  color?: string;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() + position[0]) * 0.05;
    }
  });

  return (
    <group ref={ref} position={position}>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
        {/* Main body */}
        <mesh>
          <boxGeometry args={type === 'server' ? [0.4, 0.6, 0.3] : [0.5, 0.15, 0.5]} />
          <meshStandardMaterial
            color={color}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Glow ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.35, 0.02, 8, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1}
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* Status light */}
        <mesh position={[0, type === 'server' ? 0.35 : 0.12, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={3}
          />
        </mesh>
      </Float>
    </group>
  );
}

// Connection line between nodes
function Connection({ start, end, color = '#00d4ff' }: {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
}) {
  const points = useMemo(() => [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end),
  ], [start, end]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={1.5}
      transparent
      opacity={0.4}
    />
  );
}

// Background particles
function Particles({ count = 100 }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.02;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.01) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00d4ff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Main scene
function Scene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock, pointer }) => {
    if (groupRef.current) {
      // Smooth mouse parallax
      groupRef.current.rotation.y += (pointer.x * 0.3 - groupRef.current.rotation.y) * 0.02;
      groupRef.current.rotation.x += (-pointer.y * 0.2 - groupRef.current.rotation.x) * 0.02;
      // Slow auto-rotation
      groupRef.current.rotation.y += 0.001;
    }
  });

  // Node positions
  const nodes: { pos: [number, number, number]; type: 'router' | 'switch' | 'server'; color: string }[] = [
    { pos: [0, 0, 0], type: 'router', color: '#00d4ff' },
    { pos: [-2, 0.5, -1], type: 'switch', color: '#7c3aed' },
    { pos: [2, 0.3, -1], type: 'switch', color: '#7c3aed' },
    { pos: [-1.5, -0.8, 1], type: 'server', color: '#10b981' },
    { pos: [1.5, -0.6, 1], type: 'server', color: '#10b981' },
    { pos: [0, 1.2, -0.5], type: 'router', color: '#f59e0b' },
    { pos: [-2.5, -0.3, 0.5], type: 'switch', color: '#7c3aed' },
    { pos: [2.5, 0, 0.5], type: 'switch', color: '#7c3aed' },
  ];

  // Connections between nodes
  const connections: { start: [number, number, number]; end: [number, number, number] }[] = [
    { start: [0, 0, 0], end: [-2, 0.5, -1] },
    { start: [0, 0, 0], end: [2, 0.3, -1] },
    { start: [0, 0, 0], end: [0, 1.2, -0.5] },
    { start: [-2, 0.5, -1], end: [-1.5, -0.8, 1] },
    { start: [2, 0.3, -1], end: [1.5, -0.6, 1] },
    { start: [-2, 0.5, -1], end: [-2.5, -0.3, 0.5] },
    { start: [2, 0.3, -1], end: [2.5, 0, 0.5] },
    { start: [0, 1.2, -0.5], end: [-2, 0.5, -1] },
    { start: [0, 1.2, -0.5], end: [2, 0.3, -1] },
  ];

  return (
    <group ref={groupRef}>
      {/* Ambient + directional light */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[0, 2, 0]} intensity={1} color="#00d4ff" distance={10} />
      <pointLight position={[-3, -1, 2]} intensity={0.5} color="#7c3aed" distance={8} />

      {/* Network nodes */}
      {nodes.map((node, i) => (
        <NetworkNode key={i} position={node.pos} type={node.type} color={node.color} />
      ))}

      {/* Connections */}
      {connections.map((conn, i) => (
        <Connection key={i} start={conn.start} end={conn.end} />
      ))}

      {/* Data packets flowing along connections */}
      {connections.map((conn, i) => (
        <DataPacket
          key={`packet-${i}`}
          start={conn.start}
          end={conn.end}
          speed={0.3 + i * 0.1}
          color={i % 2 === 0 ? '#00d4ff' : '#7c3aed'}
        />
      ))}

      {/* Background particles */}
      <Particles count={150} />

      {/* Central glow sphere */}
      <Sphere args={[0.8, 32, 32]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.2}
          transparent
          opacity={0.1}
          distort={0.3}
          speed={2}
          roughness={0.5}
        />
      </Sphere>
    </group>
  );
}

// Exported component
export default function NetworkHero() {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
