// ==============================================================================
// MAHAKALI PRODUCTION - Interactive 3D Cinematic Hero Canvas (Three.js & R3F)
// Pure Monochrome Chrome & Obsidian Optics with Smooth Cursor Parallax Damping
// ==============================================================================

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ------------------------------------------------------------------------------
// 3D Aperture Rings & Optical Elements (Pure Monochrome Chrome & Obsidian)
// ------------------------------------------------------------------------------
function ApertureRingAssembly() {
  const groupRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const midRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const coreLensRef = useRef<THREE.Mesh>(null);

  // Smooth mouse parallax interpolation
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Damped parallax rotation towards mouse coordinates
    const targetX = (state.pointer.x * Math.PI) / 6;
    const targetY = (-state.pointer.y * Math.PI) / 6;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetY, 0.05);

    // Continuous slow cinematic axial spin
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.15;
    }
    if (midRingRef.current) {
      midRingRef.current.rotation.z -= delta * 0.22;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z += delta * 0.35;
    }
    if (coreLensRef.current) {
      coreLensRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Outer Obsidian Cinema Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[3.2, 0.06, 32, 100]} />
        <meshStandardMaterial
          color="#121215"
          metalness={0.95}
          roughness={0.2}
          emissive="#18181B"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Outer Chrome Accent Trim Ring */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[3.05, 0.025, 24, 100]} />
        <meshStandardMaterial
          color="#FFFFFF"
          metalness={1.0}
          roughness={0.1}
          emissive="#27272A"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Middle Aperture Stepper Ring */}
      <mesh ref={midRingRef}>
        <torusGeometry args={[2.4, 0.05, 24, 80]} />
        <meshStandardMaterial
          color="#18181B"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>

      {/* Inner Chrome Aperture Iris */}
      <mesh ref={innerRingRef} rotation={[0, 0, Math.PI / 6]}>
        <torusGeometry args={[1.7, 0.04, 32, 70]} />
        <meshStandardMaterial
          color="#D4D4D8"
          metalness={0.98}
          roughness={0.15}
          emissive="#27272A"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Central Camera Prime Glass Element */}
      <mesh ref={coreLensRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshPhysicalMaterial
          color="#09090B"
          transmission={0.9}
          opacity={1}
          transparent
          roughness={0.05}
          ior={1.6}
          thickness={1.5}
          specularIntensity={1}
          specularColor={new THREE.Color('#FFFFFF')}
        />
      </mesh>

      {/* Circular Optical Aperture Blades (8 Blades) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 8;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 1.25, Math.sin(angle) * 1.25, -0.05]}
            rotation={[0, 0, angle + 0.4]}
          >
            <boxGeometry args={[0.7, 0.03, 0.015]} />
            <meshStandardMaterial
              color="#A1A1AA"
              metalness={0.95}
              roughness={0.18}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ------------------------------------------------------------------------------
// Cinematic Bokeh & Floating Silver Dust Particles
// ------------------------------------------------------------------------------
function CinematicParticles({ count = 180 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    return [pos];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.02) * 0.04;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#FFFFFF"
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ------------------------------------------------------------------------------
// Studio Lighting Rig (Pure Monochrome White/Silver)
// ------------------------------------------------------------------------------
function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.4} color="#18181B" />
      <directionalLight position={[5, 6, 4]} intensity={2.2} color="#FFFFFF" />
      <directionalLight position={[-6, -4, -4]} intensity={1.4} color="#A1A1AA" />
      <pointLight position={[0, 0, 3]} intensity={1.5} color="#FFFFFF" distance={8} />
    </>
  );
}

// ------------------------------------------------------------------------------
// Hero3DCanvas Master Container
// ------------------------------------------------------------------------------
export const Hero3DCanvas: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const supported = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      setHasWebGL(supported);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return (
      <div className="absolute inset-0 bg-[#09090B] flex items-center justify-center">
        <div className="w-80 h-80 rounded-full border border-white/10 opacity-30 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full h-full absolute inset-0 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#09090B', 0);
        }}
      >
        <StudioLighting />
        <ApertureRingAssembly />
        <CinematicParticles count={140} />
      </Canvas>
    </div>
  );
};
