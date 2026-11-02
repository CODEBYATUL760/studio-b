// ==============================================================================
// MAHAKALI PRODUCTION - Scroll-Controlled 3D Camera Scrub (<CinematicStoryScroller />)
// GSAP ScrollTrigger Timeline Driving 3D Camera Path & Splitting Editorial Typography
// ==============================================================================

import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles as SparklesIcon, Film, Camera, Award } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';

gsap.registerPlugin(ScrollTrigger);

// ------------------------------------------------------------------------------
// Virtual 3D Scene along the Camera Scrub Path
// ------------------------------------------------------------------------------
function CameraScrubScene({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const cameraGroupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    const progress = scrollProgress.current;

    // Smooth camera scrub along Z and Y coordinates
    const targetZ = THREE.MathUtils.lerp(7, 1.5, progress);
    const targetY = THREE.MathUtils.lerp(0, -1.8, progress);
    const targetRotX = THREE.MathUtils.lerp(0, 0.45, progress);
    const targetRotY = THREE.MathUtils.lerp(0, Math.PI * 0.75, progress);

    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.08);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.08);
    state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, targetRotX, 0.08);
    state.camera.rotation.y = THREE.MathUtils.lerp(state.camera.rotation.y, targetRotY, 0.08);

    // Continuous ambient motion
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.15;
    }
  });

  return (
    <group ref={cameraGroupRef}>
      {/* Ambient Deep Light */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 8, 5]} intensity={2.2} color="#FFE082" />
      <directionalLight position={[-6, -4, -4]} intensity={1.5} color="#3B82F6" />

      {/* Floating 3D Geometric Gold Rings */}
      <mesh ref={ring1Ref} position={[0, 0, -2]}>
        <torusGeometry args={[3.6, 0.04, 32, 100]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.98} roughness={0.15} />
      </mesh>

      <mesh ref={ring2Ref} position={[0, 0, -4]} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.8, 0.05, 32, 80]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.95} roughness={0.2} />
      </mesh>

      {/* Inner Central Lens Core */}
      <mesh position={[0, 0, -6]}>
        <icosahedronGeometry args={[1.6, 2]} />
        <meshStandardMaterial
          color="#0F1117"
          wireframe
          metalness={0.9}
          roughness={0.1}
          emissive="#D4AF37"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Floating Golden Dust */}
      <Sparkles count={80} scale={12} size={3} speed={0.3} color="#D4AF37" opacity={0.7} />
    </group>
  );
}

// ------------------------------------------------------------------------------
// Master Component with GSAP ScrollTrigger Pinned Timeline
// ------------------------------------------------------------------------------
export const CinematicStoryScroller: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef<number>(0);
  const [hasWebGL, setHasWebGL] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);

  const act1Ref = useRef<HTMLDivElement>(null);
  const act2Ref = useRef<HTMLDivElement>(null);
  const act3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Scrub timeline linked to vertical scroll
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;

          // Act I
          if (act1Ref.current) {
            const p1 = Math.max(0, 1 - self.progress * 3);
            act1Ref.current.style.opacity = `${p1}`;
            act1Ref.current.style.transform = `translateY(${-self.progress * 80}px)`;
          }

          // Act II
          if (act2Ref.current) {
            const p2 = Math.sin(self.progress * Math.PI);
            act2Ref.current.style.opacity = `${self.progress > 0.25 && self.progress < 0.75 ? p2 : 0}`;
            act2Ref.current.style.transform = `translateY(${(0.5 - self.progress) * 100}px)`;
          }

          // Act III
          if (act3Ref.current) {
            const p3 = Math.max(0, (self.progress - 0.65) * 3);
            act3Ref.current.style.opacity = `${p3}`;
            act3Ref.current.style.transform = `translateY(${(1 - self.progress) * 60}px)`;
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-studio-950 overflow-hidden text-slate-100 flex items-center justify-center border-t border-b border-studio-800"
    >
      {/* 3D WebGL Background Canvas */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {hasWebGL ? (
          <Canvas
            camera={{ position: [0, 0, 7], fov: 45 }}
            gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
            dpr={isMobile ? [1, 1.25] : [1, 1.5]}
          >
            <CameraScrubScene scrollProgress={scrollProgress} />
          </Canvas>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[500px] h-[500px] rounded-full border border-gold-500/20 animate-spin-slow" />
          </div>
        )}
      </div>

      {/* Radial Atmospheric Lighting Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gold-500/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Act I: Beyond Ordinary. Beyond Imagination. */}
      <div
        ref={act1Ref}
        className="absolute z-10 max-w-4xl mx-auto text-center px-4 transition-all duration-300 pointer-events-none"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-studio-900/90 border border-gold-500/40 text-gold-400 text-xs font-mono uppercase tracking-[0.25em] mb-4 backdrop-blur-md">
          <SparklesIcon className="w-3.5 h-3.5 text-gold-400" />
          <span>The Manifesto &bull; Part I</span>
        </div>
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black font-display uppercase tracking-tight text-white leading-tight">
          Beyond Ordinary. <br />
          <span className="gold-gradient-text drop-shadow-[0_0_35px_rgba(212,175,55,0.4)]">
            Beyond Imagination.
          </span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mt-4 font-light">
          Scroll to travel through the optical aperture of Vishal Giri’s visual philosophy.
        </p>
      </div>

      {/* Act II: Every Frame Has A Story. Every Story Has An Emotion. */}
      <div
        ref={act2Ref}
        style={{ opacity: 0 }}
        className="absolute z-10 max-w-4xl mx-auto text-center px-4 transition-all duration-300 pointer-events-none"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-studio-900/90 border border-gold-500/40 text-gold-400 text-xs font-mono uppercase tracking-[0.25em] mb-4 backdrop-blur-md">
          <Film className="w-3.5 h-3.5 text-gold-400" />
          <span>Cinematic Realism &bull; Part II</span>
        </div>
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black font-display uppercase tracking-tight text-white leading-tight">
          Every Frame Has A Story. <br />
          <span className="gold-gradient-text drop-shadow-[0_0_35px_rgba(212,175,55,0.4)]">
            Every Story Has Emotion.
          </span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mt-4 font-light">
          Natural unforced glances, synchronized drone sweeps, and prime optical bokeh captured on
          Sony FX3 full-frame cinema glass.
        </p>
      </div>

      {/* Act III: Curated in Shujalpur & Mastered for Generations */}
      <div
        ref={act3Ref}
        style={{ opacity: 0 }}
        className="absolute z-10 max-w-4xl mx-auto text-center px-4 transition-all duration-300 pointer-events-none"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-studio-900/90 border border-gold-500/40 text-gold-400 text-xs font-mono uppercase tracking-[0.25em] mb-4 backdrop-blur-md">
          <Award className="w-3.5 h-3.5 text-gold-400" />
          <span>Heirlooms Preserved &bull; Part III</span>
        </div>
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black font-display uppercase tracking-tight text-white leading-tight">
          Curated in Shujalpur. <br />
          <span className="gold-gradient-text drop-shadow-[0_0_35px_rgba(212,175,55,0.4)]">
            Mastered for Generations.
          </span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mt-4 font-light">
          {BRAND_CONFIG.brandName} &bull; Soni Plaza, Near by Railway Station, Shujalpur (MP).
        </p>
      </div>

      {/* Bottom Scroll HUD Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-500 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping" />
        <span>3D Camera Scrub Engine &bull; Scroll to Advance</span>
      </div>
    </div>
  );
};
