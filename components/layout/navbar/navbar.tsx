'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  motion, 
  useScroll, 
  useMotionValueEvent, 
  AnimatePresence 
} from 'framer-motion';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Building2, 
  Car, 
  Compass, 
  User, 
  LogIn, 
  Sparkles,
  UserCircle
} from 'lucide-react';
import { useAuth } from '@/lib/auth-store';

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // UI States
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  // Handle Scroll Effect
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  // Determine Dashboard Link based on Role
  const dashboardLink = user?.role === 'agent' ? '/agent/dashboard' : '/user/dashboard';

  // Animation Variants
  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.05, color: '#10b981' } // Emerald-500
  };

  const iconVariants = {
    hover: { rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out
        ${isScrolled || pathname !== '/' 
          ? 'h-[70px] bg-white/80 backdrop-blur-lg shadow-md border-b border-gray-100/50' 
          : 'h-[80px] bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.img 
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            src="/logo.jpg" 
            alt="HAVANAH Logo" 
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink href="/explore" icon={Compass} text="Explore" />
          <NavLink href="/explore?type=house" icon={Building2} text="Apartments" />
          <NavLink href="/explore?type=car" icon={Car} text="Cars" />
        </nav>

        {/* Auth Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            // LOGGED IN VIEW
            <div className="flex items-center gap-4">
              <Link href={dashboardLink}>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-black hover:shadow-lg hover:shadow-gray-900/20 transition-all"
                >
                  <LayoutDashboard size={16} /> 
                  <span>Dashboard</span>
                </motion.div>
              </Link>
              <Link href={`/profile/${user.id}`}>
                <motion.div 
                  whileHover={{ scale: 1.1, borderColor: '#10b981' }}
                  className="relative p-0.5 rounded-full border-2 border-gray-100 transition-colors"
                >
                  <img 
                    src={user.photoURL || '/default-avatar.png'} 
                    alt="Profile" 
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                </motion.div>
              </Link>
            </div>
          ) : (
            // LOGGED OUT VIEW
            <div className="flex items-center gap-4">
              <Link href="/auth">
                <motion.div 
                  className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <LogIn size={18} />
                  <span>Log In</span>
                </motion.div>
              </Link>
              <Link href="/auth">
                <motion.div 
                  whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(16, 185, 129, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full text-sm font-bold shadow-md"
                >
                  <Sparkles size={16} />
                  <span>Sign Up</span>
                </motion.div>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="md:hidden p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </motion.button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-[70px] left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-2xl md:hidden overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              <MobileNavLink href="/explore" icon={Compass} text="Explore All" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink href="/explore?type=house" icon={Building2} text="Apartments" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink href="/explore?type=car" icon={Car} text="Cars" onClick={() => setMobileMenuOpen(false)} />
              
              <div className="h-px bg-gray-100 my-2" />
              
              {user ? (
                <>
                  <MobileNavLink href={dashboardLink} icon={LayoutDashboard} text="Dashboard" onClick={() => setMobileMenuOpen(false)} />
                  <MobileNavLink href={`/profile/${user.id}`} icon={UserCircle} text="My Profile" onClick={() => setMobileMenuOpen(false)} />
                </>
              ) : (
                <div className="flex flex-col gap-3 mt-2">
                  <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <motion.div 
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 flex items-center justify-center gap-2 rounded-xl bg-gray-50 border border-gray-200 font-bold text-gray-700"
                    >
                      <LogIn size={18} /> Log In
                    </motion.div>
                  </Link>
                  <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <motion.div 
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20"
                    >
                      <Sparkles size={18} /> Sign Up
                    </motion.div>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// Helper Components for Cleaner Code

function NavLink({ href, icon: Icon, text }: { href: string, icon: any, text: string }) {
  return (
    <Link href={href}>
      <motion.div 
        className="flex items-center gap-2 text-sm font-medium text-gray-600 cursor-pointer group"
        whileHover="hover"
      >
        <motion.span 
          variants={{ hover: { rotate: [0, -15, 15, 0], scale: 1.2 } }}
          className="text-gray-400 group-hover:text-emerald-500 transition-colors"
        >
          <Icon size={18} />
        </motion.span>
        <motion.span 
          variants={{ hover: { x: 3 } }}
          className="group-hover:text-emerald-600 transition-colors"
        >
          {text}
        </motion.span>
      </motion.div>
    </Link>
  );
}

function MobileNavLink({ href, icon: Icon, text, onClick }: { href: string, icon: any, text: string, onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick}>
      <motion.div 
        whileTap={{ scale: 0.98, x: 5 }}
        className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="p-2 bg-emerald-100/50 text-emerald-600 rounded-lg">
          <Icon size={20} />
        </div>
        <span className="text-lg font-medium text-gray-700">{text}</span>
      </motion.div>
    </Link>
  );
}