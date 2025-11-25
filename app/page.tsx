"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Check, 
  Menu, 
  X, 
  Car, 
  BarChart3, 
  Users, 
  ShieldCheck, 
  Smartphone, 
  Globe, 
  Zap,
  MessageCircle
} from "lucide-react";
import Link from "next/link";

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Car size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Havanah</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600">Features</Link>
          <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600">Pricing</Link>
          <Link href="#faq" className="text-sm font-medium text-slate-600 hover:text-blue-600">FAQ</Link>
          <Link href="/login" className="text-sm font-medium text-slate-900">Log in</Link>
          <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
            Start Selling
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-6 space-y-4">
          <Link href="#features" className="block text-base font-medium text-slate-600">Features</Link>
          <Link href="#pricing" className="block text-base font-medium text-slate-600">Pricing</Link>
          <Link href="/login" className="block text-base font-medium text-slate-900">Log in</Link>
          <button className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white">
            Start Selling Cars
          </button>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 lg:pt-48 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          The #1 Car Marketplace in The Gambia
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl"
        >
          Sell Cars Faster <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            With Havanah
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600"
        >
          Manage your car inventory, analyze competitor pricing, and reach thousands of buyers in The Gambia directly through our platform and WhatsApp.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex items-center justify-center gap-x-6"
        >
          <button className="rounded-xl bg-slate-900 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-slate-800 transition-all hover:scale-105 duration-200">
            Start Free Trial
          </button>
          <button className="text-base font-semibold leading-6 text-slate-900 flex items-center gap-2">
            View Inventory <span aria-hidden="true">→</span>
          </button>
        </motion.div>
      </div>
      
      {/* Abstract Mockup Representation */}
      <div className="mt-16 relative mx-auto max-w-5xl px-6 lg:px-8">
        <div className="rounded-2xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 lg:-m-4 lg:rounded-3xl lg:p-4">
           <div className="bg-white rounded-xl shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
              <div className="text-center">
                <Car size={64} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-400 font-medium">Havanah Dashboard Dashboard Preview</p>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      title: "Inventory Management",
      desc: "Upload car details, prices, and images effortlessly. Manage your stock from one dashboard.",
      icon: <Car className="text-blue-600" />,
    },
    {
      title: "Market Intelligence",
      desc: "View competitor pricing and market trends to price your vehicles competitively.",
      icon: <BarChart3 className="text-purple-600" />,
    },
    {
      title: "Direct Outreach",
      desc: "Tools to reach out to potential buyers who are actively searching for cars.",
      icon: <MessageCircle className="text-green-600" />,
    },
    {
      title: "Agent Badging",
      desc: "Get verified with an Agent Badge to build trust and credibility with buyers.",
      icon: <ShieldCheck className="text-orange-600" />,
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            All-in-One Auto Dealer Software
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            From local dealerships to individual sellers, Havanah provides the tools to close deals faster.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.title} className="relative pl-16 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="absolute left-4 top-8 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50">
                    {feature.icon}
                  </div>
                  {feature.title}
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">
                  {feature.desc}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Pricing</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Plans for every stage of your dealership
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Choose the plan that fits your inventory size and growth goals. Prices in Gambian Dalasis (GMD).
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          
          {/* Basic Plan */}
          <div className="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-slate-200 xl:p-10 hover:shadow-lg transition-shadow">
            <div>
              <div className="flex items-center justify-between gap-x-4">
                <h3 className="text-lg font-semibold leading-8 text-slate-900">Basic</h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">For individual sellers just starting out.</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-slate-900">D200</span>
                <span className="text-sm font-semibold leading-6 text-slate-600">/month</span>
              </p>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-600">
                {['Standard inventory listing', 'Basic dashboard access', 'WhatsApp order link', 'Direct buyer chat'].map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-blue-600" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <a href="#" className="mt-8 block rounded-md bg-slate-50 px-3 py-2 text-center text-sm font-semibold leading-6 text-blue-600 ring-1 ring-inset ring-blue-200 hover:ring-blue-300 hover:bg-blue-100 transition-all">
              Get started
            </a>
          </div>

          {/* Pro Plan */}
          <div className="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-slate-200 xl:p-10 hover:shadow-lg transition-shadow relative">
             <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold leading-5 text-white shadow-sm">
                Most Popular
             </div>
            <div>
              <div className="flex items-center justify-between gap-x-4">
                <h3 className="text-lg font-semibold leading-8 text-slate-900">Pro</h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">For growing dealerships needing more visibility.</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-slate-900">D700</span>
                <span className="text-sm font-semibold leading-6 text-slate-600">/month</span>
              </p>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-600">
                {['Everything in Basic', 'Higher listing limits', 'Basic analytics', 'Priority support', 'Verified Seller tag'].map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-blue-600" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <a href="#" className="mt-8 block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 transition-all">
              Get started
            </a>
          </div>

          {/* Pro+ Plan */}
          <div className="flex flex-col justify-between rounded-3xl bg-slate-900 p-8 ring-1 ring-slate-900 xl:p-10 hover:shadow-xl transition-shadow">
            <div>
              <div className="flex items-center justify-between gap-x-4">
                <h3 className="text-lg font-semibold leading-8 text-white">Pro Plus</h3>
                <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-semibold leading-5 text-purple-400 ring-1 ring-inset ring-purple-500/20">
                    Agent Elite
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">Ultimate tools for market domination.</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-white">D2,000</span>
                <span className="text-sm font-semibold leading-6 text-slate-300">/month</span>
              </p>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-300">
                {[
                    'Everything in Pro',
                    'Access to full User Data',
                    'Competitor Pricing Intelligence',
                    'Automated Marketing Outreach Tools',
                    'Official Agent Badge',
                    'Custom Brand Registration',
                    'Eligible for Banner Ads promotion'
                ].map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-white" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <a href="#" className="mt-8 block rounded-md bg-white/10 px-3 py-2 text-center text-sm font-semibold leading-6 text-white hover:bg-white/20 transition-all">
              Contact Sales
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const faqs = [
    { q: "What is Havanah?", a: "Havanah is the premier car sales platform in The Gambia, allowing dealers and individuals to sell cars efficiently using advanced tools and WhatsApp integration." },
    { q: "How does the Pro+ Plan work?", a: "The Pro+ plan (D2,000) gives you elite status. You get deep market data, competitor insights, and tools to actively reach out to potential buyers, plus premium branding options." },
    { q: "Can I cancel my subscription?", a: "Yes, you can cancel your subscription at any time. Your features will remain active until the end of your billing period." },
    { q: "How do I get the Agent Badge?", a: "The Agent Badge is exclusive to Pro+ subscribers who have completed our verification process, signaling trust to all potential buyers." },
  ];

  return (
    <section id="faq" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="mx-auto mt-16 max-w-2xl space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-slate-200 pb-8">
              <h3 className="text-lg font-semibold leading-7 text-slate-900">{faq.q}</h3>
              <p className="mt-4 text-base leading-7 text-slate-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-900 py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-white mb-4">
                <Car size={24} />
                <span className="text-xl font-bold">Havanah</span>
            </div>
            <p className="text-sm">
              The #1 Automotive Marketplace in The Gambia. <br/>Sell smarter, faster, and better.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-white">Product</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Inventory</Link></li>
                <li><Link href="#" className="hover:text-white">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white">Market Data</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Company</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">About</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
                <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm">
          &copy; {new Date().getFullYear()} Havanah Pte Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      
      {/* Ticker / Marquee (Simplified with CSS Grid/Flex for React) */}
      <div className="bg-white py-10 overflow-hidden border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
           <p className="text-center text-sm font-semibold text-slate-500 mb-8">TRUSTED BY TOP DEALERSHIPS</p>
           <div className="flex justify-center gap-8 opacity-50 grayscale">
             {/* Placeholders for Car Brands/Dealers */}
             <div className="font-bold text-xl">BANJUL MOTORS</div>
             <div className="font-bold text-xl">SENEGAMBIA CARS</div>
             <div className="font-bold text-xl">KOLOLI AUTO</div>
             <div className="font-bold text-xl">SERREKUNDA DRIVES</div>
           </div>
        </div>
      </div>

      <Features />
      
      {/* Review Section Highlight */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
              "Havanah helped me sell 5 cars in my first week."
            </h2>
            <div className="flex items-center justify-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-xl">
                    A
                </div>
                <div className="text-left">
                    <div className="text-white font-semibold">Alieu Jallow</div>
                    <div className="text-blue-200 text-sm">Local Dealer, Banjul</div>
                </div>
            </div>
        </div>
      </section>

      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}