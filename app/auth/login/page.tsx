'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/theme-context';
import { useToast } from '@/lib/toast-context';

export default function LoginPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { showToast } = useToast();
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
      // TODO: Replace with actual Firebase authentication
      // const { user } = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Temporary success handling for demo
      await new Promise(resolve => setTimeout(resolve, 800));
      
      showToast('Welcome back to Havanah! 🎉', 'success', 2000);

      // Store demo auth state
      localStorage.setItem('havanah_user', JSON.stringify({
        email: formData.email,
        role: 'user',
        rememberMe: formData.rememberMe,
      }));

      router.push('/');
    } catch (error: any) {
      showToast(error.message || 'Login failed. Please try again.', 'error', 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden ${theme === 'dark' ? 'dark-mode' : ''}`}>
      {/* Animated background blobs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full glass opacity-30 animate-blob" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full glass opacity-30 animate-blob" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full glass opacity-20 animate-blob" style={{ animationDelay: '4s' }} />

      {/* Main container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo and branding */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full glass mb-4 animate-float">
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">H</span>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gradient-primary">Havanah</h1>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Welcome back to your marketplace</p>
        </div>

        {/* Login card */}
        <div className="card-glass p-6 sm:p-8 mb-6 animate-fade-in">
          <h2 className="text-xl font-semibold mb-6 text-text-light dark:text-text-dark">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div className="group">
              <label htmlFor="email" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2 group-focus-within:text-primary transition-colors">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-lg glass border border-border-light dark:border-border-dark focus:border-primary focus:ring-1 focus:ring-primary transition-all text-text-light dark:text-text-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark"
              />
            </div>

            {/* Password field */}
            <div className="group">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-sm font-medium text-text-light dark:text-text-dark group-focus-within:text-primary transition-colors">
                  Password
                </label>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-xs text-primary hover:text-primary-dark transition-colors"
                >
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
                className="w-full px-4 py-3 rounded-lg glass border border-border-light dark:border-border-dark focus:border-primary focus:ring-1 focus:ring-primary transition-all text-text-light dark:text-text-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark"
              />
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border border-border-light dark:border-border-dark cursor-pointer accent-primary"
              />
              <span className="text-sm text-text-muted-light dark:text-text-muted-dark group-hover:text-text-light dark:group-hover:text-text-dark transition-colors">
                Remember me
              </span>
            </label>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 rounded-lg font-medium mt-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-light dark:border-border-dark" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-background-light dark:bg-background-dark text-text-muted-light dark:text-text-muted-dark">
                Or continue with
              </span>
            </div>
          </div>

          {/* OAuth buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg glass border border-border-light dark:border-border-dark hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h5.04c-.24 1.84-.853 3.187-1.85 4.05-1.193 1.04-3.06 2.16-5.19 2.16-3.9 0-7.2-3.16-7.2-7.2s3.3-7.2 7.2-7.2c2.16 0 3.84.96 4.98 2.05l2.46-2.46C18.96 2.48 16.56 0 12.48 0 6.62 0 2 4.6 2 10.56s4.62 10.56 10.48 10.56c3.06 0 5.63-1.08 7.29-2.92s1.77-4.5 1.77-7.32c0-.66-.05-1.29-.15-1.9h-8.91z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg glass border border-border-light dark:border-border-dark hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.111.82-.261.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>
        </div>

        {/* Sign up link */}
        <div className="text-center">
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Don't have an account?{' '}
            <Link 
              href="/auth/signup" 
              className="text-primary font-semibold hover:text-primary-dark transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
