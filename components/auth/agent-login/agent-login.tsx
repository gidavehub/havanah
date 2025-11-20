'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/toast/toast';
import styles from './agent-login.module.css';

export default function AgentLoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, error, loading } = useAuth();
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
      const loadingId = toast.loading('Agent Login', 'Verifying your credentials...');
      await login(email, password);
      toast.remove(loadingId);
      toast.success('Welcome Agent!', 'Login successful. Redirecting...');
      setTimeout(() => router.push('/agent/dashboard'), 1000);
    } catch (err) {
      toast.error('Login Failed', error || 'Invalid credentials. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const loadingId = toast.loading('Agent Login', 'Signing in with Google...');
      await loginWithGoogle('agent');
      toast.remove(loadingId);
      toast.success('Welcome Agent!', 'Google login successful. Redirecting...');
      setTimeout(() => router.push('/agent/dashboard'), 1000);
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
            Grow your business with our powerful agent platform
          </p>
        </div>

        <div className={styles.features}>
          <div className={styles.featureItem}>
            <span className={styles.featureIcon}>📊</span>
            <p>Manage your listings</p>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.featureIcon}>💰</span>
            <p>Track payments & revenue</p>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.featureIcon}>🎯</span>
            <p>Advanced analytics</p>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.featureIcon}>🤝</span>
            <p>Client management tools</p>
          </div>
        </div>

        <div className={styles.pricing}>
          <h3>Agent Plans</h3>
          <div className={styles.planItem}>
            <span className={styles.planName}>Basic</span>
            <span className={styles.planPrice}>$200/mo</span>
          </div>
          <div className={styles.planItem}>
            <span className={styles.planName}>Pro</span>
            <span className={styles.planPrice}>$500/mo</span>
          </div>
          <div className={styles.planItem}>
            <span className={styles.planName}>Premium</span>
            <span className={styles.planPrice}>$1,000/mo</span>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <h2 className={styles.title}>Agent Login</h2>
          <p className={styles.subtitle}>Access your agent dashboard</p>

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
                placeholder="agent@example.com"
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
            <span>Don't have an account?</span>
          </div>

          <Link href="/auth/signup" className={styles.signupLink}>
            Register as Agent
          </Link>

          <p className={styles.userText}>
            Are you a user?{' '}
            <Link href="/auth/login" className={styles.userLink}>
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
