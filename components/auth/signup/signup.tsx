'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/toast/toast';
import { FaGoogle, FaArrowLeft, FaUser, FaBriefcase, FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './signup.module.css';

export default function SignupPage() {
  const router = useRouter();
  const { register, loginWithGoogle, error, loading } = useAuth();
  const toast = useToast();
  const [userType, setUserType] = useState<'user' | 'agent'>('user');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Error', 'Passwords do not match');
      return;
    }
    try {
      const loadingId = toast.loading('Creating Account', 'Setting up your profile...');
      await register(formData.email, formData.password, userType, formData.fullName, formData.phoneNumber);
      toast.remove(loadingId);
      toast.success('Account Created!', 'Welcome to Havanah!');
      setTimeout(() => router.push(userType === 'agent' ? '/agent/dashboard' : '/explore'), 1000);
    } catch (err) {
      toast.error('Registration Failed', error || 'Please try again.');
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const loadingId = toast.loading('Google Signup', 'Please wait...');
      await loginWithGoogle(userType);
      toast.remove(loadingId);
      toast.success('Success!', 'Redirecting...');
      setTimeout(() => router.push('/explore'), 1000);
    } catch (err) {
      toast.error('Failed', 'Google signup failed.');
    }
  };

  return (
    <div className={styles.container}>
      {/* Animated Background Blobs */}
      <motion.div 
        className={styles.blob1}
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <motion.div 
        className={styles.blob2}
        animate={{ scale: [1, 1.1, 1], rotate: [0, -60, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <motion.div 
        className={styles.formWrapper}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className={styles.header}>
          <Link href="/" className={styles.backLink}>
            <FaArrowLeft /> Back to Home
          </Link>
          <h2 className={styles.title}>Create Account</h2>
          <p className={styles.subtitle}>Join our premium community today</p>
        </div>

        {/* Custom Switcher */}
        <div className={styles.switcherContainer}>
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
              <FaUser className={styles.switchIcon} /> User
            </button>
            <button 
              type="button"
              className={`${styles.switchBtn} ${userType === 'agent' ? styles.activeText : ''}`}
              onClick={() => setUserType('agent')}
            >
              <FaBriefcase className={styles.switchIcon} /> Agent
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorAlert}>{error}</div>}

          <div className={styles.gridGroup}>
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input name="fullName" type="text" placeholder="John Doe" required onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.inputGroup}>
              <label>Phone</label>
              <input name="phoneNumber" type="tel" placeholder="(555) 123-4567" onChange={handleChange} className={styles.input} />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input name="email" type="email" placeholder="you@example.com" required onChange={handleChange} className={styles.input} />
          </div>

          <div className={styles.gridGroup}>
            <div className={styles.inputGroup}>
              <label>Password</label>
              <input name="password" type="password" placeholder="••••••••" required onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.inputGroup}>
              <label>Confirm</label>
              <input name="confirmPassword" type="password" placeholder="••••••••" required onChange={handleChange} className={styles.input} />
            </div>
          </div>

          <div className={styles.terms}>
             <div className={styles.checkboxWrapper}>
                <input id="terms" type="checkbox" required className={styles.checkbox} />
                <FaCheck className={styles.checkIcon} />
             </div>
             <label htmlFor="terms">I accept the <a href="#">Terms</a> & <a href="#">Privacy Policy</a></label>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={styles.submitBtn}
            disabled={loading}
            type="submit"
          >
            {loading ? 'Creating Profile...' : 'Create Account'}
          </motion.button>
        </form>

        <div className={styles.divider}><span>Or continue with</span></div>

        <motion.button
          type="button"
          className={styles.googleBtn}
          whileHover={{ y: -2 }}
          onClick={handleGoogleSignup}
        >
          <FaGoogle /> Google
        </motion.button>

        <p className={styles.loginLink}>
          Already a member? <Link href="/auth/login">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}