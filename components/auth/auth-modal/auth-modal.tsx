'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose } from 'react-icons/md';
import { FaGoogle, FaArrowRight, FaUser, FaBriefcase, FaCheck } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/toast/toast';
import styles from './auth-modal.module.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const { login, register, loginWithGoogle, error, loading } = useAuth();
  const toast = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'user' | 'agent'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Reset form when switching modes
  useEffect(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setPhoneNumber('');
  }, [isLogin]);

  const handleLogin = async (e: React.FormEvent) => {
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
      setTimeout(() => {
        onClose();
        router.push('/explore');
      }, 1000);
    } catch (err) {
      toast.error('Login Failed', 'Invalid email or password.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      toast.warning('Incomplete Form', 'Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Error', 'Passwords do not match');
      return;
    }
    try {
      const loadingId = toast.loading('Creating Account', 'Setting up your profile...');
      await register(email, password, userType, fullName, phoneNumber);
      toast.remove(loadingId);
      toast.success('Account Created!', 'Welcome to Havanah!');
      setTimeout(() => {
        onClose();
        router.push(userType === 'agent' ? '/agent/dashboard' : '/explore');
      }, 1000);
    } catch (err) {
      toast.error('Registration Failed', error || 'Please try again.');
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const loadingId = toast.loading('Signing with Google', 'Please wait...');
      await loginWithGoogle(userType);
      toast.remove(loadingId);
      toast.success('Success!', 'Welcome to Havanah!');
      setTimeout(() => {
        onClose();
        router.push('/explore');
      }, 1000);
    } catch (err) {
      toast.error('Failed', 'Google authentication failed.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Close Button */}
            <button
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close modal"
            >
              <MdClose />
            </button>

            {/* Logo */}
            <motion.div
              className={styles.logoSection}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <img src="/logo.jpg" alt="HAVANA" className={styles.logo} />
            </motion.div>

            {/* Tab Toggle */}
            <motion.div
              className={styles.tabToggle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <button
                className={`${styles.tab} ${isLogin ? styles.active : ''}`}
                onClick={() => setIsLogin(true)}
              >
                Sign In
              </button>
              <button
                className={`${styles.tab} ${!isLogin ? styles.active : ''}`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
              <motion.div
                className={styles.tabIndicator}
                initial={false}
                animate={{ x: isLogin ? 0 : '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            </motion.div>

            {/* Sign In Form */}
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.form
                  key="login"
                  onSubmit={handleLogin}
                  className={styles.form}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <motion.h3
                    className={styles.formTitle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Welcome Back
                  </motion.h3>

                  <motion.div
                    className={styles.formGroup}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </motion.div>

                  <motion.div
                    className={styles.formGroup}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label>Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </motion.div>

                  <motion.button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    {loading ? 'Signing In...' : <>Sign In <FaArrowRight /></>}
                  </motion.button>

                  <motion.div
                    className={styles.divider}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span>or</span>
                  </motion.div>

                  <motion.button
                    type="button"
                    className={styles.googleBtn}
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                  >
                    <FaGoogle /> Sign in with Google
                  </motion.button>
                </motion.form>
              ) : (
                <motion.form
                  key="signup"
                  onSubmit={handleSignup}
                  className={styles.form}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <motion.h3
                    className={styles.formTitle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Create Account
                  </motion.h3>

                  {/* User Type Switcher */}
                  <motion.div
                    className={styles.userTypeSwitcher}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <button
                      type="button"
                      className={`${styles.typeBtn} ${userType === 'user' ? styles.typeActive : ''}`}
                      onClick={() => setUserType('user')}
                    >
                      <FaUser /> User
                    </button>
                    <button
                      type="button"
                      className={`${styles.typeBtn} ${userType === 'agent' ? styles.typeActive : ''}`}
                      onClick={() => setUserType('agent')}
                    >
                      <FaBriefcase /> Agent
                    </button>
                  </motion.div>

                  <motion.div
                    className={styles.formGroup}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </motion.div>

                  <motion.div
                    className={styles.formGroup}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </motion.div>

                  <motion.div
                    className={styles.formGroup}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label>Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </motion.div>

                  <motion.div
                    className={styles.formGroup}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                  >
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </motion.div>

                  <motion.div
                    className={styles.formGroup}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label>Phone (Optional)</label>
                    <input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={loading}
                    />
                  </motion.div>

                  <motion.button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </motion.button>

                  <motion.div
                    className={styles.divider}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <span>or</span>
                  </motion.div>

                  <motion.button
                    type="button"
                    className={styles.googleBtn}
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 }}
                  >
                    <FaGoogle /> Sign up with Google
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
