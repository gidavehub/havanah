'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/theme-context';
import { useToast } from '@/lib/toast-context';
import { useAuth } from '@/lib/auth-context';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.email || !formData.password) {
        showToast('Please enter email and password', 'error', 3000);
        setIsLoading(false);
        return;
      }

      await signIn(formData.email, formData.password);
      showToast('Welcome back to Havanah! 🎉', 'success', 2000);
      
      // The router will be pushed by the AuthProvider useEffect
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (error: any) {
      const errorMessage = error.code === 'auth/user-not-found' 
        ? 'No account found with this email' 
        : error.code === 'auth/wrong-password'
        ? 'Incorrect password'
        : error.message || 'Login failed. Please try again.';
      showToast(errorMessage, 'error', 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      showToast('Signed in with Google! 🎉', 'success', 2000);
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        showToast(error.message || 'Google sign-in failed', 'error', 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden ${theme === 'dark' ? 'dark-mode' : ''}`}>
      <style jsx>{`
        .login-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 2rem 1rem;
          overflow: hidden;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          background: var(--glass-light);
          backdrop-filter: blur(120px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: blob 7s infinite;
          opacity: 0.3;
        }

        .blob:nth-child(1) {
          top: -10rem;
          right: -10rem;
          width: 20rem;
          height: 20rem;
        }

        .blob:nth-child(2) {
          bottom: -10rem;
          left: -10rem;
          width: 20rem;
          height: 20rem;
          animation-delay: 2s;
          opacity: 0.3;
        }

        .blob:nth-child(3) {
          top: 50%;
          left: 50%;
          width: 20rem;
          height: 20rem;
          animation-delay: 4s;
          opacity: 0.2;
          transform: translate(-50%, -50%);
        }

        .login-wrapper {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 28rem;
        }

        .logo-section {
          margin-bottom: 2rem;
          text-align: center;
        }

        .logo-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          background: var(--glass-light);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          margin-bottom: 1rem;
          animation: float 3s ease-in-out infinite;
        }

        body.dark-mode .logo-badge {
          background: var(--glass-dark);
        }

        .logo-letter {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-title {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-subtitle {
          font-size: 0.875rem;
          color: var(--text-muted-light);
        }

        body.dark-mode .logo-subtitle {
          color: var(--text-muted-dark);
        }

        .login-card {
          background: var(--glass-light);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.5),
                      0 8px 32px 0 rgba(31, 38, 135, 0.15);
          border-radius: 0.5rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          animation: fadeIn 0.5s ease-out;
        }

        @media (min-width: 768px) {
          .login-card {
            padding: 2rem;
          }
        }

        body.dark-mode .login-card {
          background: var(--glass-dark);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.1),
                      0 8px 32px 0 rgba(0, 0, 0, 0.3);
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: var(--text-light);
        }

        body.dark-mode .card-title {
          color: var(--text-dark);
        }

        .form-space {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.group-flex {
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-light);
          margin-bottom: 0.5rem;
        }

        body.dark-mode .form-label {
          color: var(--text-dark);
        }

        .form-label-small {
          font-size: 0.75rem;
          color: var(--primary);
          text-decoration: none;
          transition: color var(--transition-fast);
        }

        .form-label-small:hover {
          color: var(--primary-dark);
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          background: var(--glass-light);
          border: 1px solid var(--border-light);
          color: var(--text-light);
          font-family: 'Manrope', sans-serif;
          font-size: 1rem;
          transition: all var(--transition-fast);
        }

        body.dark-mode .form-input {
          background: var(--glass-dark);
          border-color: var(--border-dark);
          color: var(--text-dark);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(43, 173, 238, 0.1);
        }

        .form-input::placeholder {
          color: var(--text-muted-light);
        }

        body.dark-mode .form-input::placeholder {
          color: var(--text-muted-dark);
        }

        .checkbox-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .checkbox-input {
          width: 1rem;
          height: 1rem;
          cursor: pointer;
          accent-color: var(--primary);
        }

        .checkbox-label {
          font-size: 0.875rem;
          color: var(--text-muted-light);
          cursor: pointer;
          transition: color var(--transition-fast);
        }

        body.dark-mode .checkbox-label {
          color: var(--text-muted-dark);
        }

        .checkbox-wrapper:hover .checkbox-label {
          color: var(--text-light);
        }

        body.dark-mode .checkbox-wrapper:hover .checkbox-label {
          color: var(--text-dark);
        }

        .submit-button {
          width: 100%;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          color: white;
          border: none;
          border-radius: 9999px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1.5rem;
          transition: all var(--transition-fast);
          box-shadow: 0 4px 15px rgba(43, 173, 238, 0.3);
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(43, 173, 238, 0.4);
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading-spinner {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 2px solid white;
          border-top-color: transparent;
          border-radius: 50%;
          animation: rotate-spin 1s linear infinite;
        }

        .divider {
          position: relative;
          margin: 1.5rem 0;
          display: flex;
          align-items: center;
        }

        .divider::before {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border-light);
        }

        body.dark-mode .divider::before {
          background: var(--border-dark);
        }

        .divider-text {
          padding: 0 0.5rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--text-muted-light);
          background: var(--glass-light);
        }

        body.dark-mode .divider-text {
          color: var(--text-muted-dark);
          background: var(--glass-dark);
        }

        .oauth-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .oauth-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          background: var(--glass-light);
          border: 1px solid var(--border-light);
          color: var(--text-light);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        body.dark-mode .oauth-btn {
          background: var(--glass-dark);
          border-color: var(--border-dark);
          color: var(--text-dark);
        }

        .oauth-btn:hover {
          background: rgba(43, 173, 238, 0.1);
          border-color: var(--primary);
        }

        .oauth-icon {
          width: 1rem;
          height: 1rem;
        }

        .signup-link-wrapper {
          text-align: center;
        }

        .signup-text {
          font-size: 0.875rem;
          color: var(--text-muted-light);
        }

        body.dark-mode .signup-text {
          color: var(--text-muted-dark);
        }

        .signup-link {
          color: var(--primary);
          font-weight: 600;
          text-decoration: none;
          transition: color var(--transition-fast);
        }

        .signup-link:hover {
          color: var(--primary-dark);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Animated background blobs */}
      <div className="blob" />
      <div className="blob" />
      <div className="blob" />

      {/* Main container */}
      <div className="login-wrapper">
        {/* Logo and branding */}
        <div className="logo-section">
          <div className="logo-badge">
            <span className="logo-letter">H</span>
          </div>
          <h1 className="logo-title">Havanah</h1>
          <p className="logo-subtitle">Welcome back to your marketplace</p>
        </div>

        {/* Login card */}
        <div className="login-card">
          <h2 className="card-title">Sign in to your account</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-space">
              {/* Email field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="name@example.com"
                  className="form-input"
                />
              </div>

              {/* Password field */}
              <div className="form-group">
                <div className="form-group group-flex">
                  <label htmlFor="password" className="form-label">Password</label>
                  <Link href="/auth/forgot-password" className="form-label-small">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="••••••••"
                  className="form-input"
                />
              </div>

              {/* Remember me */}
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <span className="checkbox-label">Remember me</span>
              </label>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="submit-button"
              >
                {isLoading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <span className="loading-spinner" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="divider">
            <span className="divider-text">Or continue with</span>
          </div>

          {/* OAuth buttons */}
          <div className="oauth-buttons">
            <button 
              type="button" 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="oauth-btn"
            >
              <svg className="oauth-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h5.04c-.24 1.84-.853 3.187-1.85 4.05-1.193 1.04-3.06 2.16-5.19 2.16-3.9 0-7.2-3.16-7.2-7.2s3.3-7.2 7.2-7.2c2.16 0 3.84.96 4.98 2.05l2.46-2.46C18.96 2.48 16.56 0 12.48 0 6.62 0 2 4.6 2 10.56s4.62 10.56 10.48 10.56c3.06 0 5.63-1.08 7.29-2.92s1.77-4.5 1.77-7.32c0-.66-.05-1.29-.15-1.9h-8.91z" />
              </svg>
              Google
            </button>
            <button type="button" className="oauth-btn" disabled>
              <svg className="oauth-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.111.82-.261.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>
        </div>

        {/* Sign up link */}
        <div className="signup-link-wrapper">
          <p className="signup-text">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="signup-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
