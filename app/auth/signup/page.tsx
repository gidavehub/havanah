'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/theme-context';
import { useToast } from '@/lib/toast-context';

export default function SignupPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'role' | 'details' | 'verification'>('role');
  const [selectedRole, setSelectedRole] = useState<'user' | 'agent' | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    agencyName: '',
    agencyDescription: '',
    acceptTerms: false,
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return Math.ceil((strength / 5) * 100);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleRoleSelect = (role: 'user' | 'agent') => {
    setSelectedRole(role);
    setStep('details');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      showToast('Please fill in all required fields', 'error', 3000);
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error', 3000);
      return false;
    }
    if (formData.password.length < 8) {
      showToast('Password must be at least 8 characters', 'error', 3000);
      return false;
    }
    if (!formData.acceptTerms) {
      showToast('Please accept the terms and conditions', 'error', 3000);
      return false;
    }
    if (selectedRole === 'agent' && !formData.agencyName) {
      showToast('Please enter your agency name', 'error', 3000);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // TODO: Replace with actual Firebase authentication
      // const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      // await updateProfile(user, { displayName: formData.fullName });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToast('Account created successfully! 🎉', 'success', 2000);

      // Store demo user data
      localStorage.setItem('havanah_user', JSON.stringify({
        email: formData.email,
        fullName: formData.fullName,
        role: selectedRole,
        phone: formData.phone,
        agencyName: selectedRole === 'agent' ? formData.agencyName : undefined,
      }));

      setStep('verification');
      setTimeout(() => router.push('/'), 2000);
    } catch (error: any) {
      showToast(error.message || 'Signup failed. Please try again.', 'error', 3000);
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
          <Link href="/auth/login">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full glass mb-4 animate-float hover:scale-110 transition-transform cursor-pointer">
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">H</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold mb-2 text-gradient-primary">Havanah</h1>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Join our thriving marketplace</p>
        </div>

        {/* Role selection step */}
        {step === 'role' && (
          <div className="card-glass p-8 animate-fade-in">
            <h2 className="text-xl font-semibold mb-6 text-text-light dark:text-text-dark">
              I want to join as a...
            </h2>

            <div className="space-y-3">
              {/* User role */}
              <button
                onClick={() => handleRoleSelect('user')}
                className="w-full p-4 rounded-lg glass border-2 border-border-light dark:border-border-dark hover:border-primary hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-all text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-border-light dark:border-border-dark group-hover:border-primary mt-1 flex-shrink-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-light dark:text-text-dark mb-1">Customer / Buyer</h3>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                      Browse, book, and purchase services and items
                    </p>
                  </div>
                </div>
              </button>

              {/* Agent role */}
              <button
                onClick={() => handleRoleSelect('agent')}
                className="w-full p-4 rounded-lg glass border-2 border-border-light dark:border-border-dark hover:border-primary hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-all text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-border-light dark:border-border-dark group-hover:border-primary mt-1 flex-shrink-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-light dark:text-text-dark mb-1">Service Provider / Agent</h3>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                      List your services and manage your business
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Details entry step */}
        {step === 'details' && (
          <div className="card-glass p-6 sm:p-8 animate-fade-in">
            <button
              onClick={() => setStep('role')}
              className="text-sm text-primary hover:text-primary-dark mb-4 flex items-center gap-1"
            >
              ← Back
            </button>

            <h2 className="text-xl font-semibold mb-6 text-text-light dark:text-text-dark">
              {selectedRole === 'agent' ? 'Agency Details' : 'Your Details'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 rounded-lg glass border border-border-light dark:border-border-dark focus:border-primary focus:ring-1 focus:ring-primary transition-all text-text-light dark:text-text-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
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
                  className="w-full px-4 py-2.5 rounded-lg glass border border-border-light dark:border-border-dark focus:border-primary focus:ring-1 focus:ring-primary transition-all text-text-light dark:text-text-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark text-sm"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+220 XXXX XXXX"
                  className="w-full px-4 py-2.5 rounded-lg glass border border-border-light dark:border-border-dark focus:border-primary focus:ring-1 focus:ring-primary transition-all text-text-light dark:text-text-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark text-sm"
                />
              </div>

              {/* Agency Details (if agent) */}
              {selectedRole === 'agent' && (
                <>
                  <div>
                    <label htmlFor="agencyName" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                      Agency / Business Name
                    </label>
                    <input
                      id="agencyName"
                      type="text"
                      name="agencyName"
                      value={formData.agencyName}
                      onChange={handleInputChange}
                      required
                      placeholder="Your Agency Name"
                      className="w-full px-4 py-2.5 rounded-lg glass border border-border-light dark:border-border-dark focus:border-primary focus:ring-1 focus:ring-primary transition-all text-text-light dark:text-text-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="agencyDescription" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                      Business Description
                    </label>
                    <textarea
                      id="agencyDescription"
                      name="agencyDescription"
                      value={formData.agencyDescription}
                      onChange={handleInputChange}
                      placeholder="Tell us about your business..."
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg glass border border-border-light dark:border-border-dark focus:border-primary focus:ring-1 focus:ring-primary transition-all text-text-light dark:text-text-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark text-sm resize-none"
                    />
                  </div>
                </>
              )}

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg glass border border-border-light dark:border-border-dark focus:border-primary focus:ring-1 focus:ring-primary transition-all text-text-light dark:text-text-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark text-sm"
                />
                {formData.password && (
                  <div className="mt-2 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i < Math.ceil(passwordStrength / 20)
                            ? 'bg-gradient-primary'
                            : 'bg-border-light dark:bg-border-dark'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg glass border border-border-light dark:border-border-dark focus:border-primary focus:ring-1 focus:ring-primary transition-all text-text-light dark:text-text-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark text-sm"
                />
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border border-border-light dark:border-border-dark cursor-pointer accent-primary mt-0.5 flex-shrink-0"
                />
                <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
                  I agree to the{' '}
                  <a href="#" className="text-primary hover:text-primary-dark">
                    Terms of Service
                  </a>
                  {' '}and{' '}
                  <a href="#" className="text-primary hover:text-primary-dark">
                    Privacy Policy
                  </a>
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
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Sign in link */}
            <p className="text-xs text-center text-text-muted-light dark:text-text-muted-dark mt-4">
              Already have an account?{' '}
              <Link 
                href="/auth/login" 
                className="text-primary font-semibold hover:text-primary-dark transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        )}

        {/* Verification step */}
        {step === 'verification' && (
          <div className="card-glass p-8 text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4 animate-float">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
              Account created!
            </h2>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              Welcome to Havanah. Redirecting...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
