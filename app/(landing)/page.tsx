'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/lib/theme-context';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors ${theme === 'dark' ? 'dark-mode' : ''}`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass backdrop-blur-md border-b border-border-light dark:border-border-dark' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">H</span>
            </div>
            <span className="font-bold text-lg text-gradient-primary hidden sm:inline">Havanah</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm hover:text-primary transition-colors">How It Works</a>
            <a href="#testimonials" className="text-sm hover:text-primary transition-colors">Testimonials</a>
            <a href="#pricing" className="text-sm hover:text-primary transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg glass hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.414 5.414a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707zM5 6a1 1 0 100-2H4a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            <Link href="/auth/login" className="btn-secondary px-4 py-2 text-sm hidden sm:inline">
              Sign In
            </Link>
            <Link href="/auth/signup" className="btn-primary px-4 py-2 text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden min-h-screen flex items-center">
        {/* Animated background blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full glass opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full glass opacity-20 animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-96 h-96 rounded-full glass opacity-10 animate-blob" style={{ animationDelay: '4s' }} />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-border-light dark:border-border-dark">
                <span className="inline-block w-2 h-2 rounded-full bg-gradient-primary animate-pulse" />
                <span className="text-xs font-medium">Now available in Gambia 🇬🇲</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="text-gradient-primary">Premium Services</span>
                <br />
                Marketplace
              </h1>

              <p className="text-lg text-text-muted-light dark:text-text-muted-dark max-w-md">
                Connect with trusted service providers and agents. Buy, rent, or book everything you need in Gambia with confidence and ease.
              </p>

              <div className="flex gap-4 pt-4">
                <Link href="/auth/signup?role=user" className="btn-primary px-8 py-4 text-base">
                  Browse Services
                </Link>
                <Link href="/auth/signup?role=agent" className="btn-secondary px-8 py-4 text-base">
                  Become an Agent
                </Link>
              </div>

              <div className="pt-4 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">1000+ Services Listed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">100% Secure Payments</span>
                </div>
              </div>
            </div>

            <div className="relative h-96 md:h-full min-h-96 animate-float">
              <div className="card-glass p-6 h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full glass mb-4 animate-glow">
                    <span className="text-5xl">🎉</span>
                  </div>
                  <h3 className="text-2xl font-bold">Welcome to Havanah</h3>
                  <p className="text-text-muted-light dark:text-text-muted-dark">
                    Your trusted marketplace for premium services in Gambia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gradient-to-b from-transparent to-background-light/50 dark:to-background-dark/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Havanah?</h2>
            <p className="text-lg text-text-muted-light dark:text-text-muted-dark max-w-2xl mx-auto">
              We've built the most trusted platform for connecting service providers and customers in Gambia
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🔒',
                title: 'Secure Transactions',
                description: 'All payments are secure and encrypted. Your financial information is always protected.'
              },
              {
                icon: '⭐',
                title: 'Verified Providers',
                description: 'Every service provider is verified and rated by real customers. Quality you can trust.'
              },
              {
                icon: '🚀',
                title: 'Easy Booking',
                description: 'Book services in minutes. Manage your bookings, messages, and payments in one place.'
              },
              {
                icon: '💰',
                title: 'Best Prices',
                description: 'Compare providers and find the best deals. Transparent pricing with no hidden fees.'
              },
              {
                icon: '📱',
                title: 'Mobile Friendly',
                description: 'Access Havanah on any device. Shop and manage services on the go.'
              },
              {
                icon: '🤝',
                title: '24/7 Support',
                description: 'Our customer support team is always here to help you with any questions.'
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="card-glass p-6 hover:scale-105 transition-transform cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-text-muted-light dark:text-text-muted-dark max-w-2xl mx-auto">
              Get started in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Sign Up',
                description: 'Create your account as a customer or service provider'
              },
              {
                step: '2',
                title: 'Browse or List',
                description: 'Find services or list your own on our marketplace'
              },
              {
                step: '3',
                title: 'Book & Enjoy',
                description: 'Book services securely and enjoy quality results'
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="card-glass p-8 text-center">
                  <div className="w-16 h-16 rounded-full glass flex items-center justify-center text-2xl font-bold text-gradient-primary mb-4 mx-auto">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-text-muted-light dark:text-text-muted-dark">
                    {item.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 text-2xl text-text-muted-light dark:text-text-muted-dark">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-gradient-to-b from-transparent to-background-light/50 dark:to-background-dark/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-text-muted-light dark:text-text-muted-dark max-w-2xl mx-auto">
              Join thousands of satisfied customers on Havanah
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Fatou K.',
                role: 'Customer',
                content: 'Found exactly what I needed on Havanah. Great service providers and easy to use!',
                rating: 5
              },
              {
                name: 'Omar M.',
                role: 'Service Provider',
                content: 'Havanah helped me grow my business. Great platform with reliable customers.',
                rating: 5
              },
              {
                name: 'Aisatou D.',
                role: 'Customer',
                content: 'Secure payments, verified providers, and excellent customer support. Highly recommend!',
                rating: 5
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="card-glass p-6 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-text-muted-light dark:text-text-muted-dark mb-4">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-text-muted-light dark:text-text-muted-dark max-w-2xl mx-auto">
              All prices in Gambian Dalasi (GMD)
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Free',
                price: '0 GMD',
                features: ['Browse Services', 'Create Wishlist', 'Messaging', 'Max 5 Bookings/Month']
              },
              {
                name: 'Premium',
                price: '2,500 GMD',
                period: '/month',
                highlight: true,
                features: ['All Free Features', 'Unlimited Bookings', 'Priority Support', 'Advanced Filters', 'No Transaction Fees']
              },
              {
                name: 'Pro Agent',
                price: '5,000 GMD',
                period: '/month',
                features: ['Unlimited Listings', 'Analytics Dashboard', 'Priority Placement', '24/7 Support', 'Marketing Tools']
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`rounded-lg p-8 transition-all ${
                  plan.highlight
                    ? 'card-glass border-2 border-primary scale-105'
                    : 'card-glass'
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gradient-primary">{plan.price}</span>
                  {plan.period && <span className="text-text-muted-light dark:text-text-muted-dark">{plan.period}</span>}
                </div>
                <button className={plan.highlight ? 'btn-primary w-full py-3 rounded-lg mb-6' : 'btn-secondary w-full py-3 rounded-lg mb-6'}>
                  Get Started
                </button>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 glass opacity-50" />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-5xl font-bold">Ready to Get Started?</h2>
          <p className="text-lg text-text-muted-light dark:text-text-muted-dark">
            Join thousands of users enjoying premium services on Havanah
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/auth/signup?role=user" className="btn-primary px-8 py-4 text-base">
              Browse as Customer
            </Link>
            <Link href="/auth/signup?role=agent" className="btn-secondary px-8 py-4 text-base">
              Join as Provider
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-light dark:border-border-dark py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full glass flex items-center justify-center">
                  <span className="text-sm font-bold text-gradient-primary">H</span>
                </div>
                <span className="font-bold text-gradient-primary">Havanah</span>
              </div>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                Trusted marketplace for premium services in Gambia
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border-light dark:border-border-dark pt-8 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
            <p>&copy; 2024 Havanah. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
