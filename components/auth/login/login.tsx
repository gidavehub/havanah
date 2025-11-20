'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/toast/toast';
import { FaGoogle, FaBuilding, FaCarSide, FaComments, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, loading, error } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning('Incomplete Form', 'Please fill in all fields');
      return;
    }
    try {
      const loadingId = toast.loading('Logging in', 'Verifying your credentials...');
      await login(email, password);
      toast.remove(loadingId);
      toast.success('Welcome Back!', 'Login successful. Redirecting...');
      setTimeout(() => router.push('/explore'), 1000);
    } catch (err) {
      toast.error('Login Failed', 'Invalid email or password.');
    }
  };

  const handleGoogleLogin = async () => {
    // ... (Keep existing logic)
    try {
      const loadingId = toast.loading('Signing in with Google', 'Please wait...');
      await loginWithGoogle('user');
      toast.remove(loadingId);
      toast.success('Welcome!', 'Redirecting...');
      setTimeout(() => router.push('/explore'), 1000);
    } catch (err) {
      toast.error('Login Failed', 'Unable to sign in with Google.');
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15, delayChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundShapes}>
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className={styles.shape1} 
        />
        <motion.div 
          animate={{ y: [0, 30, 0], rotate: [0, -5, 0] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className={styles.shape2} 
        />
      </div>

      {/* Left Panel - Branding */}
      <motion.div 
        className={styles.leftPanel}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.brandContent}>
          <div className={styles.logoWrapper}>
            <img src="/logo.jpg" alt="Havanah" className={styles.logoImg} />
          </div>
          <h1 className={styles.brandTitle}>Havanah</h1>
          <p className={styles.brandSubtitle}>
            Experience the future of premium real estate and vehicle rentals.
          </p>

          <div className={styles.features}>
            {[
              { icon: <FaBuilding />, text: "Premium Properties" },
              { icon: <FaCarSide />, text: "Luxury Vehicles" },
              { icon: <FaComments />, text: "Instant Agent Chat" },
              { icon: <FaShieldAlt />, text: "Secure Transactions" },
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className={styles.featureItem}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
              >
                <span className={styles.featureIcon}>{feature.icon}</span>
                <p>{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Panel - 3D Form */}
      <div className={styles.rightPanel} onMouseMove={handleMouseMove} onMouseLeave={() => { x.set(0); y.set(0); }}>
        <motion.div 
          className={styles.formCard}
          style={{ rotateX, rotateY, z: 100 }}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <h2 className={styles.title}>Welcome Back</h2>
            <p className={styles.subtitle}>Please enter your details.</p>
          </motion.div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <motion.div variants={itemVariants} className={styles.errorAlert}>{error}</motion.div>}

            <motion.div variants={itemVariants} className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </motion.div>

            <motion.div variants={itemVariants} className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                id="password"
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </motion.div>

            <motion.div variants={itemVariants} className={styles.rememberRow}>
              <div className={styles.rememberMe}>
                <input id="remember" type="checkbox" className={styles.checkbox} />
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link href="/auth/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Signing In...' : <>Sign In <FaArrowRight /></>}
            </motion.button>
          </form>

          <motion.div variants={itemVariants} className={styles.divider}>
            <span>or</span>
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
            whileTap={{ scale: 0.98 }}
            type="button"
            className={styles.googleBtn}
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <FaGoogle className={styles.googleIcon} />
            Sign in with Google
          </motion.button>

          <motion.p variants={itemVariants} className={styles.footerText}>
            Don't have an account? <Link href="/auth/signup" className={styles.link}>Sign up</Link>
          </motion.p>
          
          <motion.p variants={itemVariants} className={styles.agentText}>
            Agent Access: <Link href="/auth/agent-login" className={styles.link}>Log in here</Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}