'use client';

import React, { useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Text3D, Center, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { 
  Home, Car, Check, MapPin, Shield, DollarSign, Smartphone, 
  Menu, User, Heart, Search, ArrowRight, Zap, Radio
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility: Tailwind Merger ---
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// --- 3D Scene Component (Hero Background) ---
function FloatingGeometries() {
  const ref = useRef<any>();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if(ref.current) ref.current.rotation.x = Math.sin(t / 2);
    if(ref.current) ref.current.rotation.y = Math.sin(t / 4);
  });

  return (
    <group ref={ref}>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <Sphere args={[1, 32, 32]} position={[-2, 1, -2]}>
          <MeshDistortMaterial color="#10B981" speed={2} distort={0.4} roughness={0.2} metalness={0.8} />
        </Sphere>
        <Sphere args={[0.8, 32, 32]} position={[2.5, -1, -1]}>
          <MeshDistortMaterial color="#FBBF24" speed={3} distort={0.5} roughness={0.1} metalness={0.5} />
        </Sphere>
        <Sphere args={[0.5, 32, 32]} position={[0, 2, -3]}>
           <MeshDistortMaterial color="#E5E7EB" speed={1.5} distort={0.6} transparent opacity={0.8} />
        </Sphere>
      </Float>
    </group>
  );
}

// --- Navigation ---
const Navbar = () => (
  <motion.nav 
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    transition={{ type: "spring", stiffness: 100 }}
    className="fixed top-0 w-full z-50 flex justify-center p-6"
  >
    <div className="bg-havana-glass backdrop-blur-xl border border-white/60 shadow-glass-xl px-8 py-4 rounded-full flex items-center gap-12 max-w-4xl w-full justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-tr from-havana-green to-havana-greenLight rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-glow-green">H</div>
        <span className="font-bold text-gray-800 tracking-tighter text-xl">Havanah<span className="text-havana-green">.gm</span></span>
      </div>
      
      <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
        {['Homes', 'Vehicles', 'Agents', 'Pricing'].map((item) => (
          <a key={item} href="#" className="hover:text-havana-green transition-colors relative group">
            {item}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-havana-yellow transition-all duration-300 group-hover:w-full" />
          </a>
        ))}
      </div>

      <div className="flex gap-4">
        <button className="bg-white/80 p-2 rounded-full hover:bg-havana-green/10 text-havana-green transition-all"><Search size={20}/></button>
        <button className="bg-havana-green text-white px-6 py-2 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all text-sm">
          Get App
        </button>
      </div>
    </div>
  </motion.nav>
);

// --- Section 1: 3D Hero ---
const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <Environment preset="city" />
          <FloatingGeometries />
        </Canvas>
      </div>

      <motion.div style={{ y: y1 }} className="relative z-10 text-center max-w-5xl px-4 mt-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="inline-block px-4 py-1.5 mb-6 rounded-full border border-havana-green/30 bg-havana-green/5 text-havana-greenDark font-bold text-xs uppercase tracking-widest backdrop-blur-md"
        >
          Trusted in The Gambia 🇬🇲
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-tight tracking-tight mb-8">
          Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-havana-green to-teal-400">Dream</span> <br/>
          Home or Car <span className="text-transparent bg-clip-text bg-gradient-to-r from-havana-yellow to-orange-400">Today</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          The ultimate marketplace for Brusubi, Senegambia & Beyond. Rent, Buy, and Sell with confidence using Wave, QMoney or AfriMoney.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative bg-havana-green text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-havana-green/30 overflow-hidden"
            >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                Start Browsing
            </motion.button>
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-gray-800 border-2 border-gray-100 px-8 py-4 rounded-2xl text-lg font-bold shadow-lg hover:border-havana-yellow/50 transition-colors"
            >
                Selling? Post Ad
            </motion.button>
        </div>
      </motion.div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-havana-yellow/10 to-transparent pointer-events-none" />
    </section>
  );
};

// --- Section 2: Infinite Horizontal Scroller (Locations & Brands) ---
const InfiniteScrollMarquee = () => {
    return (
        <section className="py-12 bg-white overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10"/>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"/>
            
            <motion.div 
                className="flex gap-16 w-max"
                animate={{ x: [0, -2000] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
            >
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex gap-16 items-center">
                        <span className="text-6xl font-black text-gray-100 uppercase tracking-tighter">Brusubi</span>
                        <div className="w-4 h-4 rounded-full bg-havana-yellow"/>
                        <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-100 uppercase tracking-tighter">Senegambia</span>
                        <div className="w-4 h-4 rounded-full bg-havana-green"/>
                        <span className="text-6xl font-black text-gray-100 uppercase tracking-tighter">Range Rover</span>
                        <div className="w-4 h-4 rounded-full bg-havana-yellow"/>
                        <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-100 uppercase tracking-tighter">Brufut Heights</span>
                        <div className="w-4 h-4 rounded-full bg-havana-green"/>
                        <span className="text-6xl font-black text-gray-100 uppercase tracking-tighter">Toyota</span>
                    </div>
                ))}
            </motion.div>
        </section>
    )
}

// --- Section 3: Exploding Mobile App Experience (Key Request) ---
const PhoneExplosion = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start end", "end start"] });
    
    // Transforms for flying components
    const yNav = useTransform(scrollYProgress, [0.1, 0.4], [300, -380]);
    const xNav = useTransform(scrollYProgress, [0.1, 0.4], [0, 250]);
    const scaleNav = useTransform(scrollYProgress, [0.1, 0.4], [0.5, 1]);

    const yCard = useTransform(scrollYProgress, [0.2, 0.5], [100, 0]);
    const xCard = useTransform(scrollYProgress, [0.2, 0.5], [0, -300]);
    const rotateCard = useTransform(scrollYProgress, [0.2, 0.5], [15, -5]);

    const yChat = useTransform(scrollYProgress, [0.3, 0.6], [100, 150]);
    const xChat = useTransform(scrollYProgress, [0.3, 0.6], [0, 320]);
    
    return (
        <section ref={targetRef} className="h-[200vh] relative bg-gradient-to-b from-gray-50 to-white flex items-center justify-center perspective-1000 overflow-hidden">
            <div className="sticky top-[20vh] h-[80vh] w-full flex items-center justify-center">
                
                {/* Center Phone */}
                <div className="relative w-[300px] h-[600px] bg-black rounded-[40px] shadow-2xl border-[8px] border-gray-900 z-20 overflow-hidden">
                   {/* Notch */}
                   <div className="absolute top-0 w-1/2 left-1/4 h-6 bg-black rounded-b-xl z-30"/>
                   {/* Screen */}
                   <div className="w-full h-full bg-gray-50 overflow-hidden relative pt-12">
                        {/* Internal Phone Animation */}
                        <motion.div style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0])}} className="flex flex-col gap-4 p-4">
                            <div className="h-48 bg-gray-200 rounded-xl animate-pulse"/>
                            <div className="h-20 bg-havana-green/20 rounded-xl"/>
                            <div className="h-20 bg-havana-yellow/20 rounded-xl"/>
                        </motion.div>

                        <motion.div 
                          style={{ 
                            y: useTransform(scrollYProgress, [0.1, 0.3], [600, 0]), 
                            scale: useTransform(scrollYProgress, [0.3, 0.6], [1, 1.2]) 
                          }}
                          className="absolute inset-0 bg-white p-6 pt-16 flex flex-col gap-6"
                        >
                           <h3 className="text-2xl font-bold">New Listings</h3>
                           <div className="aspect-video bg-blue-100 rounded-lg relative overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1600596542815-9ad4dc7553e3?auto=format&fit=crop&q=80&w=1000" className="object-cover w-full h-full" alt="house"/>
                                <span className="absolute top-2 right-2 bg-havana-green text-white text-xs font-bold px-2 py-1 rounded">D200/mo</span>
                           </div>
                           <div className="aspect-video bg-orange-100 rounded-lg relative overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1000" className="object-cover w-full h-full" alt="car"/>
                           </div>
                        </motion.div>
                   </div>
                </div>

                {/* Flying UI Component: Stats */}
                <motion.div style={{ x: xNav, y: yNav, scale: scaleNav }} className="absolute z-10 w-64 p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-glass-xl border border-white">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-500 text-xs font-bold uppercase">Analytics</span>
                        <div className="h-2 w-2 rounded-full bg-havana-green animate-pulse"/>
                     </div>
                     <div className="text-3xl font-bold text-gray-800">1,402</div>
                     <p className="text-sm text-gray-400">Profile Views</p>
                     <div className="mt-4 flex gap-1 h-12 items-end">
                         {[40, 70, 35, 90, 60, 80].map((h, i) => (
                             <motion.div 
                                key={i}
                                animate={{ height: [`${h/2}%`, `${h}%`, `${h/2}%`] }} 
                                transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }}
                                className="flex-1 bg-gradient-to-t from-havana-green to-havana-greenLight rounded-t-sm opacity-80"
                            />
                         ))}
                     </div>
                </motion.div>

                {/* Flying UI Component: Car Card */}
                <motion.div style={{ x: xCard, y: yCard, rotate: rotateCard }} className="absolute z-10 w-72 bg-white rounded-3xl p-3 shadow-2xl border-4 border-white/50">
                    <div className="h-40 rounded-2xl overflow-hidden mb-3 relative group">
                        <img src="https://images.unsplash.com/photo-1606611013016-969c412e4f04?auto=format&fit=crop&q=80&w=500" alt="luxury car" className="w-full h-full object-cover"/>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-bold bg-havana-yellow px-4 py-2 rounded-full">Reserve Now</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-end px-2 pb-2">
                        <div>
                            <h4 className="font-bold text-lg leading-none">Range Rover</h4>
                            <p className="text-xs text-gray-400 mt-1">Brusubi Garage</p>
                        </div>
                        <span className="text-havana-green font-bold text-xl">D2,500<span className="text-xs text-gray-400 font-normal">/day</span></span>
                    </div>
                </motion.div>

                {/* Flying UI Component: Chat */}
                <motion.div style={{ x: xChat, y: yChat }} className="absolute z-30 w-80 bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar"/></div>
                        <div>
                            <div className="font-bold text-sm">Agent Modou</div>
                            <div className="text-xs text-green-500 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-green-500"/> Online</div>
                        </div>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl text-xs text-gray-700">Is the Land Cruiser still available?</div>
                    <div className="bg-havana-green text-white p-3 rounded-tl-xl rounded-bl-xl rounded-br-xl text-xs self-end">Yes! Can we meet at Traffic Lights?</div>
                    <div className="bg-gray-100 p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl text-xs text-gray-700">Perfect, I'll pay via Wave.</div>
                </motion.div>

                <div className="absolute -z-10 w-[800px] h-[800px] bg-gradient-to-r from-havana-greenLight to-blue-50 opacity-50 blur-[100px] rounded-full top-0 left-1/4 animate-pulse"></div>

            </div>
            
            <div className="absolute bottom-20 text-center w-full z-0 opacity-40">
                <h2 className="text-[10vw] font-black leading-none tracking-tighter text-gray-200">EXPERIENCE</h2>
                <h2 className="text-[10vw] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-t from-gray-200 to-white">HAVANA 2.0</h2>
            </div>
        </section>
    );
};

// --- Section 4: Vertical Infinite Scroller (Marketplace Preview) ---
const VerticalScroller = () => {
    const list1 = [
        { title: "Brufut Villa", price: "D7.5M", type: "Home", color: "bg-blue-100" },
        { title: "Lexus 570", price: "D3.2M", type: "Car", color: "bg-gray-200" },
        { title: "Bijilo Land", price: "D450k", type: "Land", color: "bg-green-100" },
        { title: "Toyota Corolla", price: "D300k", type: "Car", color: "bg-red-100" },
        { title: "Kerr Serign Apt", price: "D25k/mo", type: "Rent", color: "bg-purple-100" },
    ];
    
    return (
        <section className="py-24 bg-gray-950 text-white relative overflow-hidden h-[800px] flex items-center">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"/>
            
            <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="flex flex-col justify-center">
                    <span className="text-havana-yellow font-bold tracking-widest text-sm uppercase mb-4">Live Market Activity</span>
                    <h2 className="text-5xl md:text-6xl font-black mb-8">What's Trending in <br/><span className="text-havana-green">Real-time.</span></h2>
                    <p className="text-gray-400 mb-8 max-w-md">Our algorithm matches buyers and sellers across The Gambia instantly. Watch transactions happen.</p>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 bg-gray-900 rounded-lg px-4 py-2 border border-gray-800">
                             <Zap className="text-havana-yellow" size={18}/> <span className="text-xs font-bold">128 Sales Today</span>
                        </div>
                         <div className="flex items-center gap-2 bg-gray-900 rounded-lg px-4 py-2 border border-gray-800">
                             <Radio className="text-havana-green" size={18}/> <span className="text-xs font-bold">2.4k Active Users</span>
                        </div>
                    </div>
                </div>

                <div className="h-[600px] relative flex gap-6 rotate-[-5deg] scale-110 opacity-80 hover:opacity-100 transition-opacity duration-500">
                     <div className="flex flex-col gap-6 w-64 overflow-hidden relative">
                         <div className="absolute top-0 z-20 w-full h-32 bg-gradient-to-b from-gray-950 to-transparent"/>
                         <motion.div 
                            className="flex flex-col gap-6"
                            animate={{ y: [0, -1000] }}
                            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                         >
                            {[...list1, ...list1, ...list1].map((item, idx) => (
                                <div key={idx} className="bg-gray-900 p-4 rounded-2xl border border-gray-800 hover:border-havana-green transition-colors">
                                    <div className={`h-32 ${item.color} rounded-xl mb-3 w-full opacity-50`}/>
                                    <h4 className="font-bold">{item.title}</h4>
                                    <div className="flex justify-between mt-2">
                                        <span className="text-sm text-gray-400">{item.type}</span>
                                        <span className="text-havana-yellow font-bold text-sm">{item.price}</span>
                                    </div>
                                </div>
                            ))}
                         </motion.div>
                         <div className="absolute bottom-0 z-20 w-full h-32 bg-gradient-to-t from-gray-950 to-transparent"/>
                     </div>

                     <div className="flex flex-col gap-6 w-64 overflow-hidden relative mt-20">
                         <div className="absolute top-0 z-20 w-full h-32 bg-gradient-to-b from-gray-950 to-transparent"/>
                         <motion.div 
                            className="flex flex-col gap-6"
                            animate={{ y: [-1000, 0] }}
                            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                         >
                            {[...list1, ...list1, ...list1].reverse().map((item, idx) => (
                                <div key={idx} className="bg-gray-900 p-4 rounded-2xl border border-gray-800 hover:border-havana-green transition-colors">
                                    <div className={`h-32 ${item.color} rounded-xl mb-3 w-full opacity-50`}/>
                                    <h4 className="font-bold">{item.title}</h4>
                                    <div className="flex justify-between mt-2">
                                        <span className="text-sm text-gray-400">{item.type}</span>
                                        <span className="text-havana-yellow font-bold text-sm">{item.price}</span>
                                    </div>
                                </div>
                            ))}
                         </motion.div>
                         <div className="absolute bottom-0 z-20 w-full h-32 bg-gradient-to-t from-gray-950 to-transparent"/>
                     </div>
                </div>
            </div>
        </section>
    );
}

// --- Section 5: Pricing Plans (Glassmorphism & Tilt) ---
const PricingCard = ({ plan, popular = false, delay }: { plan: any, popular?: boolean, delay: number }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [30, -30]);
    const rotateY = useTransform(x, [-100, 100], [-30, 30]);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.8 }}
            style={{ x, y, rotateX, rotateY, z: 100 }}
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                x.set(e.clientX - rect.left - rect.width / 2);
                y.set(e.clientY - rect.top - rect.height / 2);
            }}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            className={cn(
                "relative group flex flex-col p-8 rounded-[2rem] border transition-all duration-300 transform-gpu preserve-3d cursor-pointer h-full",
                popular 
                  ? "bg-gray-900 text-white border-havana-green/50 shadow-glow-green" 
                  : "bg-white border-gray-100 text-gray-800 hover:shadow-xl hover:border-havana-green/30"
            )}
        >
            {popular && (
                <div className="absolute -top-4 right-10 bg-havana-yellow text-black text-xs font-bold px-4 py-1.5 rounded-full z-20 uppercase tracking-widest shadow-lg transform rotate-3">
                    Top Choice
                </div>
            )}

            <div className="mb-8">
                <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold flex items-end gap-1">
                    {plan.price}<span className="text-base font-medium opacity-60">/{plan.period}</span>
                </div>
                {plan.yearly && <div className="text-xs mt-2 text-havana-green font-bold">{plan.yearly}</div>}
            </div>

            <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm opacity-80">
                        <Check size={16} className={popular ? "text-havana-green" : "text-gray-400"} />
                        {feature}
                    </li>
                ))}
            </ul>

            <button className={cn(
                "w-full py-4 rounded-xl font-bold text-sm transition-all transform active:scale-95",
                popular 
                  ? "bg-havana-green text-white shadow-lg hover:bg-white hover:text-black" 
                  : "bg-gray-100 text-gray-800 hover:bg-havana-yellow hover:text-black"
            )}>
                Select Plan
            </button>
        </motion.div>
    )
}

const PricingSection = () => {
    const plans = [
        {
            name: "Normal Plan",
            price: "D200",
            period: "mo",
            yearly: "Or D2,000 / year",
            features: ["Full Platform Access", "Rent Cars & Apts", "Contact 5 Agents/Day", "Basic Support", "Secure Wave Payments"]
        },
        {
            name: "Pro Plan",
            price: "D700",
            period: "mo",
            yearly: "Or D7,000 / year",
            features: ["Unlimited Agent Contacts", "1 Free Listing Post", "Priority Listings", "Priority Support", "Everything in Normal"]
        },
        {
            name: "Pro Plus (Agent)",
            price: "D2,000",
            period: "mo",
            yearly: "Or D20,000 / year",
            features: ["User Trends Data", "Competitor Price Analysis", "Verified Agent Badge", "Banner Ads Eligibility", "Dedicated CRM"]
        }
    ];

    return (
        <section className="py-32 bg-gray-50 perspective-1000">
            <div className="max-w-7xl mx-auto px-6">
                 <motion.div 
                    initial={{ opacity: 0 }} 
                    whileInView={{ opacity: 1 }}
                    className="text-center mb-20"
                 >
                    <h2 className="text-5xl font-black mb-4">Pricing in <span className="text-havana-green">Dalasi</span></h2>
                    <p className="text-gray-500 text-xl">Fair prices for individuals, agents, and dealerships.</p>
                 </motion.div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                     <PricingCard plan={plans[0]} popular={false} delay={0} />
                     <PricingCard plan={plans[1]} popular={false} delay={0.2} />
                     <PricingCard plan={plans[2]} popular={true} delay={0.4} />
                 </div>
            </div>
        </section>
    );
}

// --- Section 6: Local Payments (New Component) ---
const PaymentEcosystem = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
             {/* Abstract Decorators */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-havana-yellow/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"/>
             <div className="absolute bottom-0 left-0 w-96 h-96 bg-havana-green/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"/>

             <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-20">
                 <div className="flex-1">
                     <div className="inline-flex items-center gap-2 text-havana-yellow font-bold uppercase tracking-widest text-xs mb-6 border border-gray-100 px-4 py-2 rounded-full">
                         <Shield size={14}/> Secure Local Transactions
                     </div>
                     <h2 className="text-5xl font-black leading-tight mb-8">
                         Local Payments, <br/>
                         Global Standard.
                     </h2>
                     <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                         Don't carry cash. Havanah is integrated with the payment systems you use everyday in Gambia. Verify identity and pay safely.
                     </p>
                     
                     <div className="flex gap-4">
                        {['Wave', 'AfriMoney', 'QMoney'].map((pay) => (
                             <motion.div 
                                key={pay}
                                whileHover={{ y: -5 }}
                                className="h-16 px-6 bg-white border border-gray-200 shadow-md rounded-xl flex items-center justify-center font-bold text-gray-400 grayscale hover:grayscale-0 hover:border-havana-green/30 transition-all cursor-pointer"
                             >
                                 {pay}
                             </motion.div>
                        ))}
                     </div>
                 </div>

                 <div className="flex-1 relative h-[500px] w-full perspective-1000">
                      {/* Floating credit card/payment abstract visual */}
                      <motion.div 
                        initial={{ rotateY: 20, rotateX: 20 }}
                        animate={{ rotateY: [20, -20, 20], rotateX: [10, 30, 10], y: [-10, 10, -10] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black rounded-[40px] shadow-2xl p-8 flex flex-col justify-between text-white border-2 border-white/10 overflow-hidden"
                      >
                           {/* Shine Effect */}
                           <div className="absolute top-0 -left-1/2 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shimmer"/>
                           
                           <div className="flex justify-between items-start">
                               <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                                    <div className="w-10 h-10 bg-havana-green rounded-full opacity-80"/>
                               </div>
                               <Zap className="text-havana-yellow opacity-80" size={32}/>
                           </div>
                           
                           <div>
                                <div className="text-3xl font-mono tracking-widest mb-2 opacity-80">•••• •••• 4529</div>
                                <div className="flex justify-between items-end mt-8">
                                    <div>
                                        <p className="text-xs uppercase opacity-60">Card Holder</p>
                                        <p className="text-sm font-bold tracking-wider">MODOU LAMIN J.</p>
                                    </div>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-8 opacity-80" alt="MC"/>
                                </div>
                           </div>
                      </motion.div>
                 </div>
             </div>
        </section>
    )
}

// --- Footer ---
const Footer = () => (
    <footer className="bg-gray-50 border-t border-gray-200 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-havana-green rounded-lg flex items-center justify-center text-white font-bold">H</div>
                    <span className="font-bold text-xl">Havanah<span className="text-gray-400">.gm</span></span>
                </div>
                <p className="text-gray-500 max-w-sm mb-8">
                    Reimagining how The Gambia moves and lives. <br/> The only verified marketplace for Cars & Real Estate.
                </p>
                <div className="flex gap-4">
                     {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-havana-green hover:text-white hover:border-transparent transition-all cursor-pointer"><Heart size={16}/></div>)}
                </div>
            </div>
            
            <div>
                <h4 className="font-bold mb-6">Marketplace</h4>
                <ul className="space-y-4 text-sm text-gray-500">
                    <li className="hover:text-havana-green cursor-pointer">Cars for Rent</li>
                    <li className="hover:text-havana-green cursor-pointer">Luxury Villas</li>
                    <li className="hover:text-havana-green cursor-pointer">Brufut Land Sales</li>
                    <li className="hover:text-havana-green cursor-pointer">Commercial Offices</li>
                </ul>
            </div>

            <div>
                 <h4 className="font-bold mb-6">Support</h4>
                 <ul className="space-y-4 text-sm text-gray-500">
                    <li className="hover:text-havana-green cursor-pointer">WhatsApp Agent</li>
                    <li className="hover:text-havana-green cursor-pointer">Privacy Policy</li>
                    <li className="hover:text-havana-green cursor-pointer">Verification Process</li>
                    <li className="hover:text-havana-green cursor-pointer">Terms of Service</li>
                </ul>
            </div>
        </div>
        <div className="border-t border-gray-200 pt-10 text-center text-sm text-gray-400">
            © 2025 Havana Gambia. Operating in Brusubi, Senegambia, and Greater Banjul.
        </div>
    </footer>
);


export default function Page() {
  return (
    <main className="min-h-screen font-sans selection:bg-havana-green selection:text-white">
      <Navbar />
      <HeroSection />
      <InfiniteScrollMarquee />
      <PhoneExplosion />
      <VerticalScroller />
      <PricingSection />
      <PaymentEcosystem />
      <Footer />
    </main>
  );
}