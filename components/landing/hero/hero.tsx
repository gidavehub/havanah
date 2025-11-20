'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import styles from './hero.module.css';

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Create a simple 3D car model (box-based supercar representation)
    const carGroup = new THREE.Group();
    
    // Main body
    const bodyGeometry = new THREE.BoxGeometry(2, 0.8, 4);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.8,
      roughness: 0.2,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.4;
    carGroup.add(body);

    // Cabin
    const cabinGeometry = new THREE.BoxGeometry(1.6, 0.5, 1.5);
    const cabinMaterial = new THREE.MeshStandardMaterial({
      color: 0x059669,
      metalness: 0.7,
      roughness: 0.3,
    });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.y = 0.9;
    cabin.position.z = -0.5;
    carGroup.add(cabin);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      metalness: 0.9,
      roughness: 0.1,
    });

    const wheelPositions = [
      [-0.7, 0.3, 1],
      [0.7, 0.3, 1],
      [-0.7, 0.3, -1],
      [0.7, 0.3, -1],
    ];

    wheelPositions.forEach((pos) => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(...(pos as [number, number, number]));
      carGroup.add(wheel);
    });

    scene.add(carGroup);
    carRef.current = carGroup;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (carRef.current) {
        carRef.current.rotation.y += 0.005;
        carRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.3;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <motion.div
          className={styles.leftContent}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Premium <span className={styles.gradient}>Rentals</span> & Sales
          </motion.h1>

          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Discover the finest selection of luxury vehicles and premium properties. Rent or buy with confidence on Havanah.
          </motion.p>

          <motion.div
            className={styles.ctaButtons}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <button className={styles.btnPrimary}>Explore Now</button>
            <button className={styles.btnSecondary}>Learn More</button>
          </motion.div>

          <motion.div
            className={styles.stats}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <div className={styles.stat}>
              <div className={styles.statNumber}>50K+</div>
              <div className={styles.statLabel}>Listings</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>100K+</div>
              <div className={styles.statLabel}>Happy Users</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>99%</div>
              <div className={styles.statLabel}>Satisfaction</div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.rightContent}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* 3D Car Canvas */}
          <div className={styles.canvasWrapper}>
            <canvas ref={canvasRef} className={styles.canvas}></canvas>
          </div>

          {/* macOS Window Mockup */}
          <motion.div
            className={styles.macWindow}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className={styles.macHeader}>
              <div className={styles.macButtons}>
                <div className={styles.macButtonRed}></div>
                <div className={styles.macButtonYellow}></div>
                <div className={styles.macButtonGreen}></div>
              </div>
              <span className={styles.macTitle}>Havanah Rental</span>
            </div>
            <div className={styles.macContent}>
              <div className={styles.mockupContent}>
                <div className={styles.mockupImage}>
                  <img src="/placeholder-car.jpg" alt="Supercar" />
                </div>
                <div className={styles.mockupDetails}>
                  <h3>2024 Luxury Supercar</h3>
                  <p className={styles.price}>$250/day</p>
                  <button className={styles.rentBtn}>Rent Now</button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className={styles.decoration}>
        <motion.div
          className={styles.orb}
          style={{ top: '10%', right: '10%', background: 'rgba(16, 185, 129, 0.1)' }}
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        ></motion.div>
        <motion.div
          className={styles.orb}
          style={{ bottom: '10%', left: '5%', background: 'rgba(251, 191, 36, 0.1)' }}
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        ></motion.div>
      </div>
    </section>
  );
}
