'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/toast/toast';
import Navbar from '@/components/layout/navbar/navbar';
import { FaGoogle, FaUser, FaBriefcase, FaCheck, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import styles from './auth.module.css';

type AuthMode = 'signin' | 'signup';

export default function AuthPage() {
  const router = useRouter();
  const { login, register, loginWithGoogle, loading, error } = useAuth();
  const toast = useToast();
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [userType, setUserType] = useState<'user' | 'agent'>('user');
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup state
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
  });

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

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleSigninSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.warning('Incomplete Form', 'Please fill in all fields');
      return;
    }
    try {
      const loadingId = toast.loading('Logging in', 'Verifying your credentials...');
      await login(loginEmail, loginPassword);
      toast.remove(loadingId);
      toast.success('Welcome Back!', 'Login successful. Redirecting...');
      setTimeout(() => router.push('/explore'), 1000);
    } catch (err) {
      toast.error('Login Failed', 'Invalid email or password.');
    }
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Error', 'Passwords do not match');
      return;
    }
    if (!signupData.email || !signupData.password || !signupData.fullName) {
      toast.warning('Incomplete Form', 'Please fill in all required fields');
      return;
    }
    try {
      const loadingId = toast.loading('Creating Account', 'Setting up your profile...');
      await register(signupData.email, signupData.password, userType, signupData.fullName, signupData.phoneNumber);
      toast.remove(loadingId);
      toast.success('Account Created!', 'Welcome to Havanah!');
      setTimeout(() => router.push(userType === 'agent' ? '/agent/dashboard' : '/explore'), 1000);
    } catch (err) {
      toast.error('Registration Failed', error || 'Please try again.');
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const loadingId = toast.loading(authMode === 'signin' ? 'Signing in' : 'Signing up', 'Please wait...');
      await loginWithGoogle(userType);
      toast.remove(loadingId);
      toast.success('Success!', 'Redirecting...');
      setTimeout(() => router.push('/explore'), 1000);
    } catch (err) {
      toast.error('Failed', authMode === 'signin' ? 'Google signin failed.' : 'Google signup failed.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: 'spring' as const, stiffness: 100 } 
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      
      <div className={styles.container} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        {/* Background Animation */}
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

        {/* Centered Auth Card */}
        <motion.div 
          className={styles.authCard}
          style={{ rotateX, rotateY, z: 100 }}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Logo */}
          <motion.div 
            className={styles.logoSection}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <img src="/logo.jpg" alt="HAVANA" className={styles.logo} />
          </motion.div>

          {/* Toggle Switch */}
          <motion.div 
            className={styles.toggleContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.toggleBg}>
              <motion.div 
                className={styles.toggleIndicator}
                initial={false}
                animate={{ x: authMode === 'signin' ? 0 : '100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <button 
                type="button"
                className={`${styles.toggleBtn} ${authMode === 'signin' ? styles.activeToggle : ''}`}
                onClick={() => setAuthMode('signin')}
              >
                Sign In
              </button>
              <button 
                type="button"
                className={`${styles.toggleBtn} ${authMode === 'signup' ? styles.activeToggle : ''}`}
                onClick={() => setAuthMode('signup')}
              >
                Sign Up
              </button>
            </div>
          </motion.div>

          {/* Sign In Form */}
          <AnimatePresence mode="wait">
            {authMode === 'signin' && (
              <motion.div 
                key="signin"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                variants={containerVariants}
              >
                <motion.h2 variants={itemVariants} className={styles.title}>Welcome Back</motion.h2>
                <motion.p variants={itemVariants} className={styles.subtitle}>Sign in to your account</motion.p>

                <form onSubmit={handleSigninSubmit} className={styles.form}>
                  {error && <motion.div variants={itemVariants} className={styles.errorAlert}>{error}</motion.div>}

                  <motion.div variants={itemVariants} className={styles.formGroup}>
                    <label htmlFor="signin-email">Email</label>
                    <input
                      id="signin-email"
                      type="email"
                      className={styles.input}
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={loading}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className={styles.formGroup}>
                    <label htmlFor="signin-password">Password</label>
                    <input
                      id="signin-password"
                      type="password"
                      className={styles.input}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={loading}
                    />
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className={styles.googleBtn}
                  onClick={handleGoogleAuth}
                  disabled={loading}
                >
                  <FaGoogle /> Sign in with Google
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sign Up Form */}
          <AnimatePresence mode="wait">
            {authMode === 'signup' && (
              <motion.div 
                key="signup"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                variants={containerVariants}
              >
                <motion.h2 variants={itemVariants} className={styles.title}>Create Account</motion.h2>
                <motion.p variants={itemVariants} className={styles.subtitle}>Join our community today</motion.p>

                {/* Account Type Switcher */}
                <motion.div variants={itemVariants} className={styles.accountTypeSwitcher}>
                  <div className={styles.switcherBg}>
                    <motion.div 
                      className={styles.activeIndicator}
                      initial={false}
                      animate={{ x: userType === 'user' ? 0 : '100%' }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <button 
                      type="button"
                      className={`${styles.switchBtn} ${userType === 'user' ? styles.activeText : ''}`}
                      onClick={() => setUserType('user')}
                    >
                      <FaUser /> User
                    </button>
                    <button 
                      type="button"
                      className={`${styles.switchBtn} ${userType === 'agent' ? styles.activeText : ''}`}
                      onClick={() => setUserType('agent')}
                    >
                      <FaBriefcase /> Agent
                    </button>
                  </div>
                </motion.div>

                <form onSubmit={handleSignupSubmit} className={styles.form}>
                  {error && <motion.div variants={itemVariants} className={styles.errorAlert}>{error}</motion.div>}

                  <motion.div variants={itemVariants} className={styles.formGroup}>
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      className={styles.input}
                      placeholder="John Doe"
                      value={signupData.fullName}
                      onChange={handleSignupChange}
                      disabled={loading}
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className={styles.formGroup}>
                    <label htmlFor="signup-email">Email</label>
                    <input
                      id="signup-email"
                      name="email"
                      type="email"
                      className={styles.input}
                      placeholder="you@example.com"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      disabled={loading}
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className={styles.formGroup}>
                    <label htmlFor="phoneNumber">Phone (Optional)</label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      className={styles.input}
                      placeholder="(555) 123-4567"
                      value={signupData.phoneNumber}
                      onChange={handleSignupChange}
                      disabled={loading}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className={styles.twoColumn}>
                    <div className={styles.formGroup}>
                      <label htmlFor="signup-password">Password</label>
                      <input
                        id="signup-password"
                        name="password"
                        type="password"
                        className={styles.input}
                        placeholder="••••••••"
                        value={signupData.password}
                        onChange={handleSignupChange}
                        disabled={loading}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="confirm-password">Confirm</label>
                      <input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        className={styles.input}
                        placeholder="••••••••"
                        value={signupData.confirmPassword}
                        onChange={handleSignupChange}
                        disabled={loading}
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className={styles.submitBtn}
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </motion.button>
                </form>

                <motion.div variants={itemVariants} className={styles.divider}>
                  <span>or</span>
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className={styles.googleBtn}
                  onClick={handleGoogleAuth}
                  disabled={loading}
                >
                  <FaGoogle /> Sign up with Google
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
