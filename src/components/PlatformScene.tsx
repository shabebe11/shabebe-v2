"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { SpotLight } from "@react-three/drei";
import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";

// Colours match the site tokens
const BG = "#111110";
const CHALK = "#EDEBE4";

const PLATFORM = 2.44;
const WOOD = 1.22;
const RUBBER = (PLATFORM - WOOD) / 2;
const PLATFORM_TOP = 0.011;

const PLATE_RADIUS = 0.225;
const PLATES_PER_SIDE = [
  { colour: "#E24B4A", width: 0.027 },
  { colour: "#E24B4A", width: 0.027 },
  { colour: "#E24B4A", width: 0.027 },
  { colour: "#378ADD", width: 0.022 },
];

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(REDUCED_MOTION);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

function Platform() {
  return (
    <group>
      {/* frame the platform sits in */}
      <mesh position={[0, -0.03, 0]} receiveShadow>
        <boxGeometry args={[PLATFORM + 0.08, 0.05, PLATFORM + 0.08]} />
        <meshStandardMaterial color="#1c1b19" roughness={0.9} />
      </mesh>
      {/* plywood centre strip */}
      <mesh position={[0, 0.001, 0]} receiveShadow>
        <boxGeometry args={[WOOD, 0.02, PLATFORM]} />
        <meshStandardMaterial color="#6b5236" roughness={0.75} />
      </mesh>
      {/* rubber sides */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (WOOD / 2 + RUBBER / 2), 0.001, 0]} receiveShadow>
          <boxGeometry args={[RUBBER, 0.02, PLATFORM]} />
          <meshStandardMaterial color="#111110" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.055, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#0d0d0c" roughness={1} />
    </mesh>
  );
}

function Rod({
  x,
  radius,
  length,
  colour,
  metal = false,
}: {
  x: number;
  radius: number;
  length: number;
  colour: string;
  metal?: boolean;
}) {
  return (
    <mesh position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, length, 48]} />
      <meshStandardMaterial color={colour} metalness={metal ? 0.9 : 0.1} roughness={metal ? 0.35 : 0.55} />
    </mesh>
  );
}

function Barbell() {
  const sleeveStart = 0.655;
  const sleeveLength = 0.445;

  return (
    <group position={[0, PLATFORM_TOP + PLATE_RADIUS, 0]}>
      <Rod x={0} radius={0.014} length={sleeveStart * 2} colour="#8f8e8a" metal />
      {[-1, 1].map((side) => {
        let offset = sleeveStart + 0.03;
        return (
          <group key={side}>
            <Rod x={side * (sleeveStart + 0.015)} radius={0.04} length={0.03} colour="#8f8e8a" metal />
            <Rod
              x={side * (sleeveStart + 0.03 + sleeveLength / 2)}
              radius={0.025}
              length={sleeveLength}
              colour="#a3a29d"
              metal
            />
            {PLATES_PER_SIDE.map((plate, i) => {
              const x = side * (offset + plate.width / 2);
              offset += plate.width + 0.002;
              return <Rod key={i} x={x} radius={PLATE_RADIUS} length={plate.width} colour={plate.colour} />;
            })}
            <Rod x={side * (offset + 0.02)} radius={0.04} length={0.04} colour="#8f8e8a" metal />
          </group>
        );
      })}
    </group>
  );
}

function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function useChalkTexture() {
  return useMemo(() => {
    const random = seeded(7);
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    for (let i = 0; i < 48; i++) {
      const angle = random() * Math.PI * 2;
      const distance = random() * size * 0.2;
      const x = size / 2 + Math.cos(angle) * distance;
      const y = size / 2 + Math.sin(angle) * distance;
      const radius = size * (0.07 + random() * 0.2);
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(255,255,255,${0.08 + random() * 0.1})`);
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);
}

const CLOUD_BOTTOM = 0.05;
const CLOUD_TOP = 1.6;

function cloudFade(y: number) {
  const t = THREE.MathUtils.clamp((y - CLOUD_BOTTOM) / (CLOUD_TOP - CLOUD_BOTTOM), 0, 1);
  return Math.sin(t * Math.PI);
}

function ChalkCloud({ reduced }: { reduced: boolean }) {
  const texture = useChalkTexture();
  const sprites = useRef<(THREE.Sprite | null)[]>([]);
  const puffs = useMemo(() => {
    const random = seeded(21);
    return Array.from({ length: 46 }, () => {
      const spread = Math.sqrt(random());
      const angle = random() * Math.PI * 2;
      return {
        x: Math.cos(angle) * spread * 1.9,
        y: CLOUD_BOTTOM + random() * (CLOUD_TOP - CLOUD_BOTTOM),
        z: Math.sin(angle) * spread * 0.9 - 0.3,
        scale: 0.7 + random() * 1.3,
        opacity: 0.05 + random() * 0.07,
        rise: 0.015 + random() * 0.03,
        drift: (random() - 0.5) * 0.03,
        spin: (random() - 0.5) * 0.08,
        rotation: random() * Math.PI * 2,
      };
    });
  }, []);

  useFrame((_, delta) => {
    if (reduced) return;
    sprites.current.forEach((sprite, i) => {
      if (!sprite) return;
      const puff = puffs[i];
      sprite.position.y += puff.rise * delta;
      sprite.position.x += puff.drift * delta;
      if (sprite.position.y > CLOUD_TOP) {
        sprite.position.y = CLOUD_BOTTOM;
        sprite.position.x = puff.x;
      }
      sprite.material.rotation += puff.spin * delta;
      sprite.material.opacity = puff.opacity * cloudFade(sprite.position.y);
    });
  });

  return (
    <group>
      {puffs.map((puff, i) => (
        <sprite
          key={i}
          ref={(el) => {
            sprites.current[i] = el;
          }}
          position={[puff.x, puff.y, puff.z]}
          scale={[puff.scale, puff.scale, 1]}
        >
          <spriteMaterial
            map={texture}
            color={CHALK}
            opacity={puff.opacity * cloudFade(puff.y)}
            rotation={puff.rotation}
            transparent
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  );
}

function BackLight({ reduced }: { reduced: boolean }) {
  const light = useRef<THREE.SpotLight>(null);
  const { scene } = useThree();
  const base = 22;

  useEffect(() => {
    const l = light.current;
    if (!l) return;
    l.target.position.set(0, 0.2, 0.6);
    scene.add(l.target);
    return () => {
      scene.remove(l.target);
    };
  }, [scene]);

  useFrame(({ clock }) => {
    if (!light.current || reduced) return;
    light.current.intensity = base + Math.sin(clock.elapsedTime * 0.6) * 1.2;
  });

  return (
    <SpotLight
      ref={light}
      position={[0, 2.6, -3.2]}
      angle={0.42}
      penumbra={0.8}
      distance={10}
      intensity={base}
      color={CHALK}
      attenuation={6}
      anglePower={5}
      opacity={0.6}
      castShadow
      volumetric
    />
  );
}

export default function PlatformScene() {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        shadows="percentage"
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.55, 5.6], fov: 35 }}
        onCreated={({ camera }) => camera.lookAt(0, 1.3, 0)}
        frameloop={reduced ? "demand" : "always"}
      >
        <color attach="background" args={[BG]} />
        <fog attach="fog" args={[BG, 5, 12]} />
        <ambientLight intensity={0.05} />
        <directionalLight position={[-2, 2, 4]} intensity={0.08} color={CHALK} />

        <BackLight reduced={reduced} />
        <Platform />
        <Barbell />
        <Floor />

        <ChalkCloud reduced={reduced} />
      </Canvas>

      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at center, transparent 35%, ${BG} 100%)` }}
      />
    </div>
  );
}
