'use client';

import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Plane, Text } from '@react-three/drei';
import * as THREE from 'three';

function WindowFrame() {
  const meshRef = useRef(null);
  const { camera } = useThree();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Frame edges */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 2.25, 0.1]} />
        <meshStandardMaterial 
          color="#e8f0f7" 
          metalness={0.3}
          roughness={0.4}
          emissive="#3b82f6"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Glass reflection */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[3.9, 2.15, 0.05]} />
        <meshStandardMaterial 
          color="#ffffff"
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={0.5}
          emissive="#60a5fa"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Inner glow */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[3.85, 2.1, 0.02]} />
        <meshStandardMaterial 
          emissive="#3b82f6"
          emissiveIntensity={0.3}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Top bar */}
      <mesh position={[0, 0.95, 0.12]}>
        <boxGeometry args={[4, 0.2, 0.05]} />
        <meshStandardMaterial 
          color="#f0f4f8"
          metalness={0.2}
          roughness={0.5}
          emissive="#3b82f6"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Glowing particles floating around */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[Math.sin(i) * 2, Math.cos(i) * 1.2, 0.5]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial 
            emissive="#60a5fa"
            emissiveIntensity={0.5}
            color="#3b82f6"
          />
        </mesh>
      ))}
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={1.2} color="#f0f4f8" />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#60a5fa" />
      <pointLight position={[-5, -5, 5]} intensity={0.6} color="#3b82f6" />
      <directionalLight position={[0, 0, 5]} intensity={0.8} color="#ffffff" />
    </>
  );
}

function Scene() {
  const groupRef = useRef(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(Date.now() * 0.0003) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Lights />
      <WindowFrame />
      <OrbitControls 
        autoRotate 
        autoRotateSpeed={2}
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </group>
  );
}

export default function ThreeWindow({ title = 'Window' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Ensure container exists
    if (containerRef.current) {
      containerRef.current.style.position = 'relative';
      containerRef.current.style.width = '100%';
      containerRef.current.style.height = '100%';
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '400px',
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f9feff 0%, #f0f4f8 100%)',
        border: '1px solid rgba(59, 130, 246, 0.1)',
        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15)',
        position: 'relative',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene />
      </Canvas>
      
      {/* Title overlay */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(240, 244, 248, 0.6) 100%)',
        backdrop: 'blur(8px)',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: 600,
        color: '#1a2332',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        textAlign: 'center',
      }}>
        {title}
      </div>
    </div>
  );
}
