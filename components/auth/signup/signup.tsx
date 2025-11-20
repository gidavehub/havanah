'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/toast/toast';
import styles from './signup.module.css';

export default function SignupPage() {
  const router = useRouter();
  const { register, loginWithGoogle, error, loading } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
  });
  const [userType, setUserType] = useState<'user' | 'agent'>('user');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName) {
      toast.warning('Incomplete Form', 'Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Password Mismatch', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Weak Password', 'Password must be at least 6 characters');
      return;
    }

    try {
      const loadingId = toast.loading('Creating Account', 'Setting up your profile...');
      await register(formData.email, formData.password, userType, formData.fullName, formData.phoneNumber);
      toast.remove(loadingId);
      toast.success('Account Created!', `Welcome to Havanah! Redirecting...`);
      setTimeout(() => router.push(userType === 'agent' ? '/agent/dashboard' : '/explore'), 1000);
    } catch (err) {
      toast.error('Registration Failed', error || 'Unable to create account. Please try again.');
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const loadingId = toast.loading('Creating Account', 'Signing up with Google...');
      await loginWithGoogle(userType);
      toast.remove(loadingId);
      toast.success('Account Created!', 'Welcome to Havanah! Redirecting...');
      setTimeout(() => router.push(userType === 'agent' ? '/agent/dashboard' : '/explore'), 1000);
    } catch (err) {
      toast.error('Google Signup Failed', 'Unable to sign up with Google. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <Link href="/" className={styles.backLink}>
            ← Back
          </Link>

          <h2 className={styles.title}>Create Your Account</h2>
          <p className={styles.subtitle}>Join Havanah today</p>

          {/* User Type Selection */}
          <div className={styles.typeSelector}>
            <button
              type="button"
              className={`${styles.typeBtn} ${userType === 'user' ? styles.active : ''}`}
              onClick={() => setUserType('user')}
            >
              <span className={styles.typeIcon}>👤</span>
              <span>I'm a User</span>
            </button>
            <button
              type="button"
              className={`${styles.typeBtn} ${userType === 'agent' ? styles.active : ''}`}
              onClick={() => setUserType('agent')}
            >
              <span className={styles.typeIcon}>🏢</span>
              <span>I'm an Agent</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <div className={styles.errorAlert}>
                {error}
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="fullName" className={styles.label}>
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                className={styles.input}
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className={styles.input}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phoneNumber" className={styles.label}>
                Phone Number <span className={styles.optional}>(Optional)</span>
              </label>
              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                className={styles.input}
                placeholder="+1 (555) 123-4567"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                className={styles.input}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                className={styles.input}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className={styles.terms}>
              <input
                id="terms"
                type="checkbox"
                className={styles.checkbox}
              />
              <label htmlFor="terms" className={styles.checkboxLabel}>
                I agree to the{' '}
                <a href="#" className={styles.link}>
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className={styles.link}>
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className={styles.divider}>
            <span>Or sign up with</span>
          </div>

          <button
            type="button"
            className={styles.googleBtn}
            onClick={handleGoogleSignup}
            disabled={loading}
          >
            <span className={styles.googleIcon}>🔐</span>
            Sign up with Google
          </button>

          <p className={styles.loginText}>
            Already have an account?{' '}
            <Link href="/auth/login" className={styles.loginLink}>
              Sign in
            </Link>
          </p>
        </div>

        <div className={styles.decoration}>
          <div className={styles.glassOrb1}></div>
          <div className={styles.glassOrb2}></div>
          <div className={styles.glassOrb3}></div>
        </div>
      </div>
    </div>
  );
}
