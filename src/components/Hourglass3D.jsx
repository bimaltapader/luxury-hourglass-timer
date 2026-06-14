import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Particle stream component (runs in world space to always flow downwards)
function SandStream({ active, progress, isFlipped }) {
  const pointsRef = useRef();
  const count = 350; // High density for realistic flow

  // Initialize particles
  const [positions, particlesData] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const data = [];

    for (let i = 0; i < count; i++) {
      const y = -2.6 + Math.random() * 2.7; // From bottom to neck
      const x = (Math.random() - 0.5) * 0.035;
      const z = (Math.random() - 0.5) * 0.035;
      const speed = 0.055 + Math.random() * 0.035;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      data.push({ speed, index: i, seed: Math.random() * 100 });
    }

    return [pos, data];
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const time = state.clock.getElapsedTime();
    
    // Bottom pile height goes from -2.8 to -1.0
    const bottomLimit = -2.8 + progress * 1.8;
    // Top sand level drops from 2.4 to 0.1
    const topLimit = 2.4 - progress * 2.3;

    for (let i = 0; i < count; i++) {
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      let z = posAttr.getZ(i);
      const seed = particlesData[i].seed;

      if (active && progress < 1) {
        y -= particlesData[i].speed;

        // Reset particle to top neck if it falls below the bottom sand level
        if (y < bottomLimit) {
          y = Math.min(0.1, topLimit); // Reset to neck
          x = (Math.random() - 0.5) * 0.015;
          z = (Math.random() - 0.5) * 0.015;
        }

        // Add subtle flow noise
        x += Math.sin(time * 6 + y * 3 + seed) * 0.002;
        z += Math.cos(time * 6 + y * 3 + seed) * 0.002;

        // Splash Flare Effect: as the particle gets close to the bottom pile, it flares outwards
        const distanceToPile = y - bottomLimit;
        if (distanceToPile < 0.25 && distanceToPile > 0) {
          const splashFactor = (0.25 - distanceToPile) / 0.25;
          x += Math.sin(seed * 9) * 0.15 * splashFactor;
          z += Math.cos(seed * 9) * 0.15 * splashFactor;
        }
      }

      posAttr.setX(i, x);
      posAttr.setY(i, y);
      posAttr.setZ(i, z);
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#A2876A"
        size={0.032}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// The core 3D hourglass model matching the reference image exactly
function HourglassModel({ progress, rotationAngle, active }) {
  const modelGroupRef = useRef();

  // Smooth rotation interpolation
  useFrame(() => {
    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.z = THREE.MathUtils.lerp(
        modelGroupRef.current.rotation.z,
        rotationAngle,
        0.08
      );
    }
  });

  // Glass profile coordinates: creates a classic straight/sloped cone hourglass bulb structure
  const glassPoints = useMemo(() => {
    const points = [];
    // Ascending Y coordinates from -2.8 to 2.8
    points.push(new THREE.Vector2(0.12, -2.8));
    points.push(new THREE.Vector2(1.3, -2.8));   // Flat base touching the bottom plate
    points.push(new THREE.Vector2(1.38, -2.6));  // Base bevel edge
    points.push(new THREE.Vector2(1.32, -2.1));  // Lower bulb outer wall
    points.push(new THREE.Vector2(0.85, -1.15)); // Straight cone slope
    points.push(new THREE.Vector2(0.42, -0.45));
    points.push(new THREE.Vector2(0.15, -0.06));
    points.push(new THREE.Vector2(0.12, 0));     // Neck
    points.push(new THREE.Vector2(0.15, 0.06));
    points.push(new THREE.Vector2(0.42, 0.45));
    points.push(new THREE.Vector2(0.85, 1.15));
    points.push(new THREE.Vector2(1.32, 2.1));   // Upper bulb outer wall
    points.push(new THREE.Vector2(1.38, 2.6));   // Top bevel edge
    points.push(new THREE.Vector2(1.3, 2.8));    // Flat base touching the top plate
    points.push(new THREE.Vector2(0.12, 2.8));
    return points;
  }, []);

  // Top sand profile (slopes down as a flat cone into the neck)
  const topSandPoints = useMemo(() => {
    const points = [];
    points.push(new THREE.Vector2(0.1, 0));
    points.push(new THREE.Vector2(0.18, 0.1));
    points.push(new THREE.Vector2(0.42, 0.42));
    points.push(new THREE.Vector2(0.82, 1.1));
    points.push(new THREE.Vector2(1.22, 1.95));
    points.push(new THREE.Vector2(1.3, 2.4)); // Wall intersection
    points.push(new THREE.Vector2(0.01, 2.38)); // Center flat top surface
    return points;
  }, []);

  // Bottom sand profile (mound with a sharp central peak)
  const bottomSandPoints = useMemo(() => {
    const points = [];
    points.push(new THREE.Vector2(0.1, 0));
    points.push(new THREE.Vector2(1.2, 0.05));
    points.push(new THREE.Vector2(1.28, 0.25));
    points.push(new THREE.Vector2(1.05, 0.6));
    points.push(new THREE.Vector2(0.78, 1.05));
    points.push(new THREE.Vector2(0.48, 1.45));
    points.push(new THREE.Vector2(0.22, 1.74));
    points.push(new THREE.Vector2(0.01, 1.84)); // Sharp peak
    return points;
  }, []);

  // Determine physical orientation
  const isPhysicallyInverted = Math.round(rotationAngle / Math.PI) % 2 !== 0;

  // Sand heights logic
  const topSandHeightScale = 1 - progress;
  const bottomSandHeightScale = progress;

  // Local Top Sand coordinates (Y > 0)
  const localTopScaleY = isPhysicallyInverted ? bottomSandHeightScale : topSandHeightScale;
  // Local Bottom Sand coordinates (Y < 0)
  const localBottomScaleY = isPhysicallyInverted ? topSandHeightScale : bottomSandHeightScale;

  // Red Copper / Rose Metallic frame material matching the reference image exactly
  const copperMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#b24d38", // Rich metallic copper-bronze red
    roughness: 0.22,
    metalness: 0.96,
  }), []);

  const sandMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#A2876A", // Real sand color #A2876A
    roughness: 0.82,
    metalness: 0.02,
    side: THREE.DoubleSide
  }), []);

  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    transmission: 0.98,
    opacity: 1,
    transparent: true,
    roughness: 0.01,
    ior: 1.5,
    thickness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.01,
    depthWrite: false,
  }), []);

  return (
    <group ref={modelGroupRef}>
      {/* --- FRAME STRUCTURE --- */}
      
      {/* --- TOP PLATE (Y = 3.0, rounded cylinder bevel) --- */}
      <group position={[0, 3.0, 0]}>
        {/* Main plate body */}
        <mesh>
          <cylinderGeometry args={[1.7, 1.7, 0.38, 64]} />
          <primitive object={copperMaterial} attach="material" />
        </mesh>
        {/* Beveled edge rings (Torus mapping to round off top/bottom corners of plate) */}
        <mesh position={[0, 0.19, 0]}>
          <torusGeometry args={[1.65, 0.05, 16, 64]} />
          <primitive object={copperMaterial} attach="material" />
        </mesh>
        <mesh position={[0, -0.19, 0]}>
          <torusGeometry args={[1.65, 0.05, 16, 64]} />
          <primitive object={copperMaterial} attach="material" />
        </mesh>
      </group>

      {/* --- BOTTOM PLATE (Y = -3.0, rounded cylinder bevel) --- */}
      <group position={[0, -3.0, 0]}>
        {/* Main plate body */}
        <mesh>
          <cylinderGeometry args={[1.7, 1.7, 0.38, 64]} />
          <primitive object={copperMaterial} attach="material" />
        </mesh>
        {/* Beveled edge rings */}
        <mesh position={[0, 0.19, 0]}>
          <torusGeometry args={[1.65, 0.05, 16, 64]} />
          <primitive object={copperMaterial} attach="material" />
        </mesh>
        <mesh position={[0, -0.19, 0]}>
          <torusGeometry args={[1.65, 0.05, 16, 64]} />
          <primitive object={copperMaterial} attach="material" />
        </mesh>
      </group>

      {/* --- 3 CYLINDRICAL PILLARS (Clean straight rods) --- */}
      {useMemo(() => {
        const pillarAngles = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];
        const radius = 1.48; // Positioned near plate edge
        return pillarAngles.map((angle, idx) => {
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          return (
            <mesh key={idx} position={[x, 0, z]}>
              <cylinderGeometry args={[0.068, 0.068, 5.62, 24]} />
              <primitive object={copperMaterial} attach="material" />
            </mesh>
          );
        });
      }, [copperMaterial])}

      {/* --- GLASS CHAMBER --- */}
      <mesh castShadow receiveShadow>
        <latheGeometry args={[glassPoints, 64]} />
        <primitive object={glassMaterial} attach="material" />
      </mesh>

      {/* --- SAND INSIDE THE GLASS (LOCAL SPACE) --- */}
      
      {/* Local Top Chamber Sand Heap */}
      {localTopScaleY > 0.001 && (
        <mesh position={[0, 0.01, 0]} scale={[Math.pow(localTopScaleY, 0.18), localTopScaleY, Math.pow(localTopScaleY, 0.18)]}>
          <latheGeometry args={[topSandPoints, 48]} />
          <primitive object={sandMaterial} attach="material" />
        </mesh>
      )}

      {/* Local Bottom Chamber Sand Heap */}
      {localBottomScaleY > 0.001 && (
        <mesh position={[0, -2.8, 0]} scale={[Math.pow(localBottomScaleY, 0.3), localBottomScaleY, Math.pow(localBottomScaleY, 0.3)]}>
          <latheGeometry args={[bottomSandPoints, 48]} />
          <primitive object={sandMaterial} attach="material" />
        </mesh>
      )}
    </group>
  );
}

export default function Hourglass3D({ timeLeft, duration, isActive, rotationAngle }) {
  const progress = useMemo(() => {
    return Math.min(1, Math.max(0, (duration - timeLeft) / duration));
  }, [timeLeft, duration]);

  const isFlipped = Math.round(rotationAngle / Math.PI) % 2 !== 0;

  return (
    <div className="w-full h-[55vh] md:h-full relative select-none">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gold-500/10 blur-3xl pointer-events-none animate-pulse-glow" />

      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 7.5]} fov={50} />
        
        {/* Soft studio lighting to show off brushed metal and glass refractions */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[6, 8, 4]}
          intensity={1.9}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight
          position={[-6, 4, -4]}
          intensity={0.8}
          color="#be8a4d"
        />
        {/* Soft Golden Light under the Glass */}
        <pointLight position={[0, 0, 0]} intensity={1.5} distance={6} color="#A2876A" />
        
        {/* The Hourglass Model */}
        <HourglassModel
          progress={progress}
          rotationAngle={rotationAngle}
          active={isActive}
        />

        {/* Sand Stream */}
        <SandStream
          active={isActive}
          progress={progress}
          isFlipped={isFlipped}
        />

        {/* Studio environment reflections */}
        <Environment preset="studio" />

        {/* Interaction Orbit controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={5}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2 + 0.15}
          minPolarAngle={Math.PI / 6}
        />
      </Canvas>
    </div>
  );
}
