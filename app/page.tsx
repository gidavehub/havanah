"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { 
  ChevronDown, 
  Check, 
  Menu, 
  X, 
  ArrowRight, 
  Globe, 
  Lock, 
  ShoppingBag, 
  MessageCircle, 
  BarChart3,
  MapPin,
  Car,
  Home
} from "lucide-react";

// --- COMPONENTS ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <Link href="/">
              <Image 
                src="/logo.jpg" 
                alt="Havana Logo" 
                width={120} 
                height={40} 
                className="h-8 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6 text-[15px] font-medium text-[#474747]">
              <div className="group relative cursor-pointer flex items-center gap-1 hover:text-blue-500 transition">
                Rentals <ChevronDown size={14} />
              </div>
              <div className="group relative cursor-pointer flex items-center gap-1 hover:text-blue-500 transition">
                Sales <ChevronDown size={14} />
              </div>
              <Link href="#pricing" className="hover:text-blue-500 transition">Pricing</Link>
              <Link href="#" className="hover:text-blue-500 transition">Agents</Link>
              <div className="group relative cursor-pointer flex items-center gap-1 hover:text-blue-500 transition">
                Support <ChevronDown size={14} />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth" className="text-[14px] font-medium text-[#242930] hover:text-blue-500">
                Log in
              </Link>
              <Link href="/auth" className="bg-[#181c1f] text-white text-[14px] font-medium px-4 py-2 rounded-lg hover:bg-black transition shadow-lg shadow-gray-200">
                Join Now
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-4">
          <div className="flex flex-col space-y-4 font-medium text-[#474747]">
            <Link href="#" className="block py-2">Rentals</Link>
            <Link href="#" className="block py-2">Sales</Link>
            <Link href="#pricing" className="block py-2">Pricing</Link>
            <Link href="#" className="block py-2">Agents</Link>
            <div className="pt-4 flex flex-col gap-3">
              <Link href="/auth" className="w-full text-center py-3 border rounded-lg">Log in</Link>
              <Link href="/auth" className="w-full text-center py-3 bg-[#181c1f] text-white rounded-lg">Join Now</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-white via-[#f6f9ff] to-[#edf3ff]">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Trusted Badge */}
        <div className="relative mb-8">
          <div className="flex items-center gap-2 bg-white/50 border border-gray-200 rounded-full px-4 py-1">
             <div className="flex -space-x-2">
                 <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold">W</div>
                 <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center text-[10px] font-bold">A</div>
                 <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center text-[10px] font-bold">Q</div>
             </div>
             <span className="text-xs font-bold text-[#00d66b]">Trusted in The Gambia</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#050505] mb-6">
          Find Your Dream<br /> Car or Home Today
        </h1>
        
        <p className="text-lg md:text-xl text-[#707c8c] max-w-2xl mb-10 leading-relaxed">
          The ultimate marketplace for buying and renting vehicles and properties in The Gambia. <br className="hidden md:block"/>
          Secure local payments. Verified Agents.
        </p>

        <Link href="/auth" className="bg-[#050505] text-white text-lg font-medium px-8 py-4 rounded-xl hover:scale-105 transition transform shadow-xl shadow-gray-300">
          Start Exploring
        </Link>

        {/* Hero Visual Mockup Cluster */}
        <div className="mt-20 relative w-full max-w-4xl">
            {/* Main Visual */}
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
               <Image 
                  src="https://images.unsplash.com/photo-1560518883-ce09059ee971?q=80&w=1200&auto=format&fit=crop"
                  width={1004} height={812} 
                  alt="Havana Dashboard showing property"
                  className="w-full h-auto drop-shadow-2xl"
                  priority
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent">
                  <div className="absolute bottom-6 left-6 text-white text-left">
                     <p className="font-bold text-xl">Recent Listing: Luxury Villa</p>
                     <p className="text-sm opacity-90">Brusubi, The Gambia</p>
                  </div>
               </div>
            </div>
            
            {/* Floating Elements (Simulated) */}
            <div className="absolute -left-8 md:-left-12 top-1/4 bg-white p-3 rounded-2xl shadow-lg hidden md:flex items-center gap-3 animate-bounce duration-[3000ms]">
                 <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <Car size={20} />
                 </div>
                 <div>
                    <p className="text-xs font-bold">Range Rover Sport</p>
                    <p className="text-[10px] text-gray-500">Listed 2m ago</p>
                 </div>
            </div>
        </div>
      </div>
    </section>
  );
};

const FeatureSection1 = () => {
  return (
    <section className="py-24 bg-[#fbfbfc]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Simplify Renting & Buying</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Large Left Card */}
          <div className="md:col-span-7 bg-gradient-to-b from-[#edf3ff] to-[#d1e0ff] rounded-[32px] p-8 md:p-12 flex flex-col justify-between min-h-[400px] md:min-h-[500px] overflow-hidden relative group">
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Direct Communication</h3>
              <p className="text-[#707c8c] text-lg mb-6 max-w-md">
                Chat directly with agents or sellers via our secure platform or WhatsApp to schedule viewings for apartments or test drives.
              </p>
              <Link href="#" className="text-[#242930] font-medium hover:text-blue-600 underline decoration-blue-400 underline-offset-4">
                See how it works
              </Link>
            </div>
            <div className="absolute bottom-0 right-0 w-3/4 translate-y-10 translate-x-10 transition group-hover:translate-y-5">
                {/* Replaced phone with a UI Mockup containing a car listing */}
                <Image src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=600" width={585} height={747} alt="Car on Mobile" className="w-full h-auto rounded-t-3xl border-8 border-white shadow-xl" />
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {/* Top Card */}
            <div className="bg-gradient-to-b from-[#edf3ff] to-[#d1e0ff] rounded-[32px] p-8 flex-1 relative overflow-hidden">
                <h3 className="text-xl font-bold mb-2">Local Payments</h3>
                <p className="text-[#707c8c] mb-4 text-sm">Secure checkout with Wave, AfriMoney & QMoney.</p>
                <div className="flex gap-2 mt-4">
                   {/* Local Payment Icons placeholders */}
                   <div className="h-8 w-16 bg-blue-500 rounded shadow-sm flex items-center justify-center text-[8px] font-bold text-white">WAVE</div>
                   <div className="h-8 w-16 bg-purple-600 rounded shadow-sm flex items-center justify-center text-[8px] font-bold text-white">AFRI</div>
                   <div className="h-8 w-16 bg-yellow-400 rounded shadow-sm flex items-center justify-center text-[8px] font-bold text-black">QMONEY</div>
                </div>
            </div>

            {/* Bottom Card */}
            <div className="bg-gradient-to-b from-[#edf3ff] to-[#d1e0ff] rounded-[32px] p-8 flex-1">
                <h3 className="text-xl font-bold mb-6">Marketplace Features</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/50 p-3 rounded-xl flex items-center gap-2 text-sm font-medium"><ShoppingBag size={16}/> Buy/Sell</div>
                    <div className="bg-white/50 p-3 rounded-xl flex items-center gap-2 text-sm font-medium"><BarChart3 size={16}/> Listings</div>
                    <div className="bg-white/50 p-3 rounded-xl flex items-center gap-2 text-sm font-medium"><Lock size={16}/> Verified</div>
                    <div className="bg-white/50 p-3 rounded-xl flex items-center gap-2 text-sm font-medium"><MessageCircle size={16}/> Booking</div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const APISection = () => {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Pro Plus Tools</h2>
            <p className="text-xl text-[#707c8c]">Advanced features for serious agents, dealerships, and property managers.</p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Card 1 */}
             <div className="bg-gradient-to-b from-[#effaed] to-[#dbf7d7] rounded-[32px] p-8 h-[400px] flex flex-col items-center text-center relative overflow-hidden">
                <h3 className="text-2xl font-bold mb-3">Market Outreach</h3>
                <p className="text-[#707c8c] text-sm">Reach out to potential buyers based on user data trends.</p>
                <div className="absolute bottom-0 w-full left-0 flex justify-center">
                    <div className="bg-white p-4 rounded-t-xl w-3/4 shadow-lg border-t border-l border-r border-green-100">
                        <div className="flex gap-2 items-center text-left mb-2">
                             <div className="w-8 h-8 rounded-full bg-green-200"></div>
                             <div>
                                 <div className="h-2 w-24 bg-gray-200 rounded mb-1"></div>
                                 <div className="h-2 w-16 bg-gray-100 rounded"></div>
                             </div>
                        </div>
                        <div className="h-10 bg-gray-50 rounded-lg w-full"></div>
                    </div>
                </div>
             </div>
  
             {/* Card 2 */}
             <div className="bg-gradient-to-b from-[#effaed] to-[#dbf7d7] rounded-[32px] p-8 h-[400px] flex flex-col items-center text-center relative overflow-hidden">
                <h3 className="text-2xl font-bold mb-3">Competitor Pricing</h3>
                <p className="text-[#707c8c] text-sm">View real-time pricing of other cars and houses in your area.</p>
                <div className="absolute bottom-8 w-3/4 bg-white rounded-xl shadow-lg p-4 text-left">
                    <div className="flex justify-between items-end mb-2 h-24">
                        <div className="w-4 h-12 bg-gray-200 rounded-t"></div>
                        <div className="w-4 h-16 bg-gray-200 rounded-t"></div>
                        <div className="w-4 h-24 bg-green-500 rounded-t relative"><span className="absolute -top-6 left-0 text-[10px] font-bold">You</span></div>
                        <div className="w-4 h-20 bg-gray-200 rounded-t"></div>
                    </div>
                </div>
             </div>
  
             {/* Card 3 */}
             <div className="bg-gradient-to-b from-[#effaed] to-[#dbf7d7] rounded-[32px] p-8 h-[400px] flex flex-col items-center text-center relative overflow-hidden">
                <h3 className="text-2xl font-bold mb-3">Verified Agent Badge</h3>
                <p className="text-[#707c8c] text-sm">Gain trust with the Pro Plus verification badge on all listings.</p>
                <div className="mt-8 flex gap-4">
                    <div className="bg-white p-4 rounded-full shadow-lg border-2 border-green-400">
                        <Check size={32} className="text-green-500" strokeWidth={3} />
                    </div>
                </div>
                <div className="mt-4 bg-white/50 px-3 py-1 rounded-full text-xs font-bold text-green-700">OFFICIAL AGENT</div>
             </div>
          </div>
        </div>
      </section>
    );
};

const IndustrySection = () => {
    // Modified to be Rent/Car/House categories
    const industries = [
        { name: "Luxury Cars", img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=500&q=80" },
        { name: "Apartments", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=500&q=80" },
        { name: "Family Homes", img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=500&q=80" },
        { name: "Land for Sale", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=500&q=80" },
        { name: "Commercial", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=80" },
        { name: "Explore All", img: "", isText: true },
    ];

    return (
        <section className="py-24 bg-[#fbfbfc]">
             <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Browsing Made Easy</h2>
                    <p className="text-xl text-[#707c8c]">From rentals in Senegambia to land in Brufut.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {industries.map((ind, idx) => (
                        ind.isText ? (
                            <Link key={idx} href="#" className="bg-[#eef0f4] rounded-3xl flex items-center justify-between p-8 group hover:bg-gray-200 transition">
                                <span className="text-xl font-semibold text-[#242930]">{ind.name}</span>
                                <div className="bg-white p-3 rounded-full shadow-sm">
                                    <ArrowRight size={20} />
                                </div>
                            </Link>
                        ) : (
                            <Link key={idx} href="#" className="relative h-64 rounded-3xl overflow-hidden group shadow-sm hover:shadow-md transition">
                                <Image src={ind.img} alt={ind.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-6 left-6">
                                    <span className="text-white text-xl font-bold">{ind.name}</span>
                                </div>
                            </Link>
                        )
                    ))}
                </div>
             </div>
        </section>
    )
}

const AllInOneSection = () => {
    return (
        <section className="py-24 bg-white">
             <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Manage Your Rental Business</h2>
                </div>
                
                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Large Left Card */}
                    <div className="md:col-span-2 bg-gradient-to-b from-[#f5edff] to-[#e9d6ff] rounded-[32px] p-8 min-h-[500px] relative overflow-hidden">
                        <h3 className="text-2xl font-bold mb-2">Beautiful Inventory Display</h3>
                        <p className="text-gray-600 mb-8">Showcase every detail of your vehicle or property.</p>
                        <div className="absolute bottom-0 left-0 w-full h-3/4 pl-8">
                            {/* Visual Mockup using nice car image */}
                            <Image src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800" width={600} height={400} alt="Listing Dashboard" className="shadow-2xl rounded-tl-xl border-4 border-white" />
                        </div>
                    </div>

                    {/* Right Column Stack */}
                    <div className="flex flex-col gap-6">
                        {/* Domain Card */}
                        <div className="bg-gradient-to-b from-[#f5edff] to-[#e9d6ff] rounded-[32px] p-8 flex-1 flex flex-col items-center justify-center text-center">
                            <h3 className="text-xl font-bold mb-4">Branded Profile</h3>
                            <div className="bg-white rounded-full py-2 px-6 flex items-center gap-2 shadow-sm">
                                <Lock size={14} className="text-gray-400"/>
                                <span className="font-mono text-sm text-gray-600">havana.gm/brand</span>
                            </div>
                        </div>

                         {/* Analytics Card */}
                         <div className="bg-gradient-to-b from-[#f5edff] to-[#e9d6ff] rounded-[32px] p-8 flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden">
                            <h3 className="text-xl font-bold mb-4 z-10 relative">Customer Insights</h3>
                            <div className="absolute bottom-0 w-full opacity-50 flex justify-center">
                                {/* Simple Chart simulation */}
                                <div className="flex items-end gap-1 h-24">
                                   <div className="w-4 h-8 bg-purple-300"></div>
                                   <div className="w-4 h-12 bg-purple-400"></div>
                                   <div className="w-4 h-16 bg-purple-500"></div>
                                   <div className="w-4 h-10 bg-purple-300"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                     {/* Bottom Row */}
                     <div className="bg-[#f2f3f5] rounded-[32px] p-8 h-80 flex flex-col justify-center">
                        <h3 className="text-xl font-bold">Inventory</h3>
                        <p className="text-gray-500 text-sm">Manage multiple houses and cars from one place</p>
                     </div>
                     <div className="bg-[#f2f3f5] rounded-[32px] p-8 h-80 flex flex-col justify-center">
                        <h3 className="text-xl font-bold">Promotion</h3>
                        <p className="text-gray-500 text-sm">Banner ads for Pro Plus members</p>
                     </div>
                     <div className="bg-[#f2f3f5] rounded-[32px] p-8 h-80 flex flex-col justify-center">
                        <h3 className="text-xl font-bold">Security</h3>
                        <p className="text-gray-500 text-sm">Vetted users and ID verification</p>
                     </div>
                </div>
             </div>
        </section>
    )
}

const PricingSection = () => {
    const [isYearly, setIsYearly] = useState(true);

    return (
        <section id="pricing" className="py-24 bg-gradient-to-b from-[#fbfbfc] to-[#f0f0f2]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-8">Membership Plans</h2>
                    <div className="inline-flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                        <button 
                            onClick={() => setIsYearly(true)}
                            className={`px-6 py-2 text-sm font-medium rounded-lg transition ${isYearly ? 'bg-[#242930] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            Yearly <span className="font-normal opacity-80">(Best Value)</span>
                        </button>
                        <button 
                            onClick={() => setIsYearly(false)}
                            className={`px-6 py-2 text-sm font-medium rounded-lg transition ${!isYearly ? 'bg-[#242930] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            Monthly
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Normal Plan */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-[#242930]">Normal</h3>
                            <p className="text-gray-500 text-sm">Standard Access</p>
                        </div>
                        <div className="mb-8">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-[#242930]">D{isYearly ? '2,000' : '200'}</span>
                                <span className="text-gray-400 text-sm">/ {isYearly ? 'year' : 'month'}</span>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4 mb-8">
                             <div className="text-sm text-gray-600 flex gap-2"><Check size={16} className="text-green-500"/> Full platform access</div>
                             <div className="text-sm text-gray-600 flex gap-2"><Check size={16} className="text-green-500"/> Rent cars & apartments</div>
                             <div className="text-sm text-gray-600 flex gap-2"><Check size={16} className="text-green-500"/> Contact up to 5 agents/day</div>
                             <div className="text-sm text-gray-600 flex gap-2"><Check size={16} className="text-green-500"/> Basic support</div>
                        </div>
                        <Link href="/auth" className="w-full block text-center py-3 bg-[#242930] text-white rounded-xl font-medium hover:bg-black transition">Get started</Link>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-white rounded-3xl p-8 border-2 border-blue-100 shadow-lg relative overflow-hidden flex flex-col transform md:-translate-y-4">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-[#242930]">Pro</h3>
                            <p className="text-gray-500 text-sm">For Active Users</p>
                        </div>
                        <div className="mb-8">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-[#1b91f2]">D{isYearly ? '7,000' : '700'}</span>
                                <span className="text-gray-400 text-sm">/ {isYearly ? 'year' : 'month'}</span>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4 mb-8">
                             <p className="text-sm font-bold text-gray-900">Everything in Normal, plus:</p>
                             <div className="text-sm text-gray-600 flex gap-2"><Check size={16} className="text-blue-500"/> Unlimited agent contacts</div>
                             <div className="text-sm text-gray-600 flex gap-2"><Check size={16} className="text-blue-500"/> List 1 item for sale free</div>
                             <div className="text-sm text-gray-600 flex gap-2"><Check size={16} className="text-blue-500"/> Priority listings</div>
                             <div className="text-sm text-gray-600 flex gap-2"><Check size={16} className="text-blue-500"/> Priority Support</div>
                        </div>
                        <Link href="/auth" className="w-full block text-center py-3 bg-[#1b91f2] text-white rounded-xl font-medium hover:bg-blue-600 transition">Upgrade to Pro</Link>
                        <p className="text-center text-xs text-gray-400 mt-3">Cancel any time</p>
                    </div>

                     {/* Pro Plus Plan */}
                     <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col">
                        <div className="absolute top-0 right-0 bg-purple-100 px-4 py-1 rounded-bl-xl text-purple-700 text-xs font-bold">AGENTS</div>
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-[#242930]">Pro Plus</h3>
                            <p className="text-gray-500 text-sm">For Agents & Dealerships</p>
                        </div>
                        <div className="mb-8">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-[#8c34eb]">D{isYearly ? '20,000' : '2,000'}</span>
                                <span className="text-gray-400 text-sm">/ {isYearly ? 'year' : 'month'}</span>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4 mb-8">
                             <p className="text-sm font-bold text-gray-900">For high volume sellers:</p>
                             <div className="text-sm text-gray-600 flex gap-2"><Check size={16} className="text-purple-500"/> Access to User Data/Trends</div>
                             <div className="text-sm text-gray-600 flex gap-2"><Check size={16} className="text-purple-500"/> Outreach Marketing Tools</div>
                             <div className="text-sm text-gray-600 flex gap-2"><Check size={16} className="text-purple-500"/> Competitor Price Analysis</div>
                             <div className="text-sm text-gray-600 flex gap-2"><Check size={16} className="text-purple-500"/> Agent Badge & Branding</div>
                             <div className="text-sm text-gray-600 flex gap-2"><Check size={16} className="text-purple-500"/> Banner Ad Eligibility</div>
                        </div>
                        <Link href="/auth" className="w-full block text-center py-3 bg-[#8c34eb] text-white rounded-xl font-medium hover:bg-purple-600 transition">Get Pro Plus</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

const Footer = () => {
    return (
        <footer className="bg-[#242930] text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-20 border-b border-gray-700 pb-12">
                     <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-[#00d66b] font-bold">
                            <span className="w-2 h-2 bg-[#00d66b] rounded-full"></span> Operating in The Gambia
                        </div>
                        <h2 className="text-4xl font-bold">Rent, Buy, and Sell <br/> <span className="text-white/50">with Confidence.</span></h2>
                     </div>
                     <div className="mt-8 md:mt-0">
                        <Link href="/auth" className="bg-[#36383b] border border-[#4e4f52] px-8 py-4 rounded-xl text-lg font-medium hover:bg-[#4e4f52] transition">
                            Create Account
                        </Link>
                     </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
                    <div className="flex flex-col gap-4">
                        <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider">Marketplace</h3>
                        <Link href="#pricing" className="text-gray-300 hover:text-white">Pricing</Link>
                        <Link href="#" className="text-gray-300 hover:text-white">Browse Cars</Link>
                        <Link href="#" className="text-gray-300 hover:text-white">Browse Houses</Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider">Agents</h3>
                        <Link href="/auth" className="text-gray-300 hover:text-white">Join as Pro Plus</Link>
                        <Link href="#" className="text-gray-300 hover:text-white">Advertising</Link>
                        <Link href="#" className="text-gray-300 hover:text-white">Success Stories</Link>
                    </div>
                     <div className="flex flex-col gap-4">
                        <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider">Company</h3>
                        <Link href="#" className="text-gray-300 hover:text-white">About Havana</Link>
                        <Link href="#" className="text-gray-300 hover:text-white">Terms of Service</Link>
                        <Link href="#" className="text-gray-300 hover:text-white">Privacy Policy</Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider">Contact</h3>
                        <Link href="#" className="text-gray-300 hover:text-white">WhatsApp Support</Link>
                        <Link href="#" className="text-gray-300 hover:text-white">Email Us</Link>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-8 gap-4">
                    <div className="text-gray-500 text-sm">© 2025 Havana Gambia. All rights reserved.</div>
                    <div className="flex items-center gap-2 bg-[#2f3338] px-3 py-2 rounded-lg text-sm text-gray-300">
                        <Globe size={16} />
                        <span>English</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

// --- MAIN PAGE COMPONENT ---

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <FeatureSection1 />
      <APISection />
      <IndustrySection />
      <AllInOneSection />
      <PricingSection />
      <Footer />
    </main>
  );
}