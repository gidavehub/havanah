'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/toast/toast';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, loading, error } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      toast.error('Login Failed', 'Invalid email or password. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const loadingId = toast.loading('Signing in with Google', 'Please wait...');
      await loginWithGoogle('user');
      toast.remove(loadingId);
      toast.success('Welcome!', 'Google login successful. Redirecting...');
      setTimeout(() => router.push('/explore'), 1000);
    } catch (err) {
      toast.error('Google Login Failed', 'Unable to sign in with Google. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.brandSection}>
          <div className={styles.logo}>
            <img src="/logo.jpg" alt="Havanah" className={styles.logoImg} />
          </div>
          <h1 className={styles.brandTitle}>Havanah</h1>
          <p className={styles.brandSubtitle}>
            Your gateway to premium real estate and vehicle rentals
          </p>
        </div>

        <div className={styles.features}>
          <div className={styles.featureItem}>
            <span className={styles.featureIcon}>🏠</span>
            <p>Rent or buy properties</p>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.featureIcon}>🚗</span>
            <p>Rent or buy vehicles</p>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.featureIcon}>💬</span>
            <p>Direct messaging with agents</p>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.featureIcon}>✨</span>
            <p>Secure transactions</p>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.subtitle}>Sign in to your account</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <div className={styles.errorAlert}>
                {error}
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                className={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className={styles.rememberMe}>
              <input
                id="remember"
                type="checkbox"
                className={styles.checkbox}
              />
              <label htmlFor="remember" className={styles.checkboxLabel}>
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className={styles.divider}>
            <span>Or continue with</span>
          </div>

          <button
            type="button"
            className={styles.googleBtn}
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <span className={styles.googleIcon}>🔐</span>
            Sign in with Google
          </button>

          <div className={styles.divider}>
            <span>New to Havanah?</span>
          </div>

          <Link href="/auth/signup" className={styles.signupLink}>
            Create an account
          </Link>

          <p className={styles.agentText}>
            Are you an agent?{' '}
            <Link href="/auth/agent-login" className={styles.agentLink}>
              Sign in here
            </Link>
          </p>
        </div>

        <div className={styles.decoration}>
          <div className={styles.glassOrb1}></div>
          <div className={styles.glassOrb2}></div>
        </div>
      </div>
    </div>
  );
}
