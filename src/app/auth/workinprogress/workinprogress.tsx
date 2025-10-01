/**
 * ELEVATE WorkInProgress Component
 * 
 * INTEGRATION:
 * 1. npm install framer-motion recharts (optional)
 * 2. Ensure Tailwind CSS is configured
 * 3. Import: import WorkInProgress from './workinprogress'
 * 4. Use: <WorkInProgress />
 * 
 * CUSTOMIZATION:
 * - Modify THEME_COLORS object for color scheme
 * - Update MOCK_DATA arrays for content
 * - Toggle ENABLE_ANIMATIONS for motion preferences
 */

'use client';
import React, { useState, useEffect, useCallback, useRef, memo, JSX } from 'react';

// --- CONFIGURATION ---
const ENABLE_ANIMATIONS = true; // Set to false for CSS-only animations
const THEME_COLORS = {
  primary: 'fuchsia',
  secondary: 'cyan', 
  accent: 'violet',
  background: '#05060a',
  gradients: {
    main: 'from-fuchsia-600 via-violet-600 to-cyan-500',
    text: 'from-white via-white to-slate-400',
    feature: 'from-fuchsia-500/20 to-fuchsia-500/5'
  }
};

// --- TYPES ---
interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
  gradient: string;
}

interface PricingPlan {
  id: string;
  name: string;
  price: { monthly: number; yearly: number };
  features: string[];
  popular?: boolean;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

interface DashboardMetric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

interface FormState {
  email: string;
  name: string;
  message: string;
  isSubmitting: boolean;
  success: boolean;
  error: string;
}

// --- MOCK DATA ---
const MOCK_FEATURES: FeatureCard[] = [
  {
    id: '1',
    title: 'Advanced Analytics',
    description: 'Deep insights into your performance with AI-powered recommendations and trend analysis.',
    icon: (
      <svg className="w-8 h-8 text-fuchsia-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 15l4-4 4 4 4-8" />
      </svg>
    ),
    color: 'fuchsia',
    gradient: 'from-fuchsia-500/20 to-fuchsia-500/5'
  },
  {
    id: '2',
    title: 'Real-time Collaboration',
    description: 'Work together seamlessly with live editing, comments, and synchronized workspaces.',
    icon: (
      <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    color: 'cyan',
    gradient: 'from-cyan-500/20 to-cyan-500/5'
  },
  {
    id: '3',
    title: 'Smart Automation',
    description: 'Intelligent workflows that adapt to your patterns and optimize your productivity automatically.',
    icon: (
      <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.611L5 14.5" />
      </svg>
    ),
    color: 'violet',
    gradient: 'from-violet-500/20 to-violet-500/5'
  },
  {
    id: '4',
    title: 'Enterprise Security',
    description: 'Bank-grade encryption, compliance standards, and advanced access controls for your data.',
    icon: (
      <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    color: 'emerald',
    gradient: 'from-emerald-500/20 to-emerald-500/5'
  }
];

const MOCK_PRICING: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: { monthly: 0, yearly: 0 },
    features: ['5 Projects', 'Basic Analytics', 'Community Support', '1GB Storage']
  },
  {
    id: 'pro',
    name: 'Professional',
    price: { monthly: 29, yearly: 290 },
    features: ['Unlimited Projects', 'Advanced Analytics', 'Priority Support', '100GB Storage', 'Team Collaboration'],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: { monthly: 99, yearly: 990 },
    features: ['Everything in Pro', 'Custom Integrations', 'Dedicated Support', 'Unlimited Storage', 'SSO & Compliance']
  }
];

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Product Manager',
    company: 'TechCorp',
    content: 'This platform has transformed how our team collaborates. The insights we get are incredible.',
    avatar: '/api/placeholder/64/64',
    rating: 5
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    role: 'Engineering Lead',
    company: 'InnovateLab',
    content: 'The automation features saved us hundreds of hours. Best investment we\'ve made this year.',
    avatar: '/api/placeholder/64/64',
    rating: 5
  },
  {
    id: '3',
    name: 'Emily Watson',
    role: 'Startup Founder',
    company: 'NextGen Solutions',
    content: 'From zero to hero in weeks. The learning curve is minimal and the results are immediate.',
    avatar: '/api/placeholder/64/64',
    rating: 4
  }
];

const MOCK_DASHBOARD_DATA: DashboardMetric[] = [
  { label: 'Total Users', value: '127,391', change: 12.5, trend: 'up' },
  { label: 'Revenue', value: '$2.4M', change: 8.2, trend: 'up' },
  { label: 'Conversion Rate', value: '3.7%', change: -2.1, trend: 'down' },
  { label: 'Active Projects', value: 1247, change: 15.3, trend: 'up' }
];

// --- ANIMATED COUNTER HOOK ---
const useAnimatedCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;
      
      if (progress < 1) {
        setCount(Math.floor(end * progress));
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return { count, ref };
};

// --- MAIN COMPONENT ---
export default function WorkInProgress(): JSX.Element {
  const [darkMode, setDarkMode] = useState(true);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [formState, setFormState] = useState<FormState>({
    email: '', name: '', message: '', isSubmitting: false, success: false, error: ''
  });

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % MOCK_TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Theme persistence
  useEffect(() => {
    const saved = localStorage.getItem('elevate-theme');
    if (saved) setDarkMode(saved === 'dark');
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('elevate-theme', newMode ? 'dark' : 'light');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState(prev => ({ ...prev, isSubmitting: true, error: '' }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!formState.email.includes('@')) {
      setFormState(prev => ({ ...prev, isSubmitting: false, error: 'Please enter a valid email' }));
      return;
    }
    
    setFormState(prev => ({ ...prev, isSubmitting: false, success: true }));
    setTimeout(() => setFormState(prev => ({ ...prev, success: false, email: '', name: '', message: '' })), 3000);
  };

  // --- NAV COMPONENT ---
  const Navigation = memo(() => (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <nav className="flex items-center justify-between h-16 md:h-20 rounded-full mt-4 bg-white/5 backdrop-blur-xl border border-white/10 px-5 md:px-8 shadow-lg shadow-black/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center">
              <span className="text-sm font-bold text-white">W</span>
            </div>
            <span className="text-sm md:text-base font-semibold tracking-wide text-slate-100">WorkInProgress</span>
          </div>
          
          <ul className="hidden lg:flex items-center gap-8 text-sm">
            {['Features', 'Pricing', 'Testimonials', 'Dashboard'].map(link => (
              <li key={link}>
                <button className="relative text-slate-300 hover:text-white transition group">
                  <span>{link}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-fuchsia-400 to-cyan-400 transition-all duration-300 group-hover:w-full" />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {darkMode ? '🌙' : '☀️'}
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 hover:shadow-[0_0_24px_-2px_rgba(168,85,247,0.7)] transition shadow-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="lg:hidden w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-200 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </header>
  ));

  // --- HERO SECTION ---
  const HeroSection = memo(() => {
    const { count: userCount } = useAnimatedCounter(127391);
    const { count: projectCount } = useAnimatedCounter(2847);
    
    return (
      <section className="pt-36 md:pt-44 pb-28 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 text-[10px] uppercase tracking-wider font-semibold text-fuchsia-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-ping" />
            <span>Work In Progress - Version 2.0</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] bg-gradient-to-br from-white via-white to-slate-400 text-transparent bg-clip-text mb-6">
            Build. Ship. Scale.
            <br />
            <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Faster Than Ever
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-8">
            The ultimate development platform that transforms ideas into production-ready applications with AI-powered workflows, real-time collaboration, and enterprise-grade infrastructure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => setShowModal(true)}
              className="group relative inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_-2px_rgba(168,85,247,0.8)] transition"
            >
              Start Building Now
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-sm border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1M9 10v5a2 2 0 002 2h2a2 2 0 002-2v-5" />
              </svg>
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {[
              { label: 'Active Users', value: userCount.toLocaleString() },
              { label: 'Projects Built', value: projectCount.toLocaleString() },
              { label: 'Uptime', value: '99.9%' },
              { label: 'Countries', value: '150+' }
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-wide text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  });

  // --- FEATURES SECTION ---
  const FeaturesSection = memo(() => (
    <section className="py-28 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Powerful features designed to accelerate your development workflow and help you ship faster.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {MOCK_FEATURES.map((feature, index) => (
            <div
              key={feature.id}
              className={`group relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 flex flex-col gap-4 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-${feature.color}-500/10 hover:border-${feature.color}-400/40 hover:-translate-y-2 ${
                ENABLE_ANIMATIONS ? 'animate-fade-in-up' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-lg flex items-center justify-center bg-gradient-to-br ${feature.gradient} border border-white/10`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed flex-1">{feature.description}</p>
              <button className="mt-auto self-start inline-flex items-center gap-1 text-xs font-medium text-fuchsia-300 hover:text-fuchsia-200 transition">
                Learn more
                <span className="inline-block group-hover:translate-x-1 transition-transform">&rarr;</span>
              </button>
              <div className="pointer-events-none absolute -inset-px rounded-xl ring-1 ring-inset ring-white/10 group-hover:ring-fuchsia-400/40 transition" />
            </div>
          ))}
        </div>
      </div>
    </section>
  ));

  // --- PRICING SECTION ---
  const PricingSection = memo(() => (
    <section className="py-28 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
            Choose the plan that fits your needs. Upgrade or downgrade at any time.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-lg bg-white/5 border border-white/10">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                !isYearly ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                isYearly ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs bg-fuchsia-500/20 text-fuchsia-300 px-1.5 py-0.5 rounded">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {MOCK_PRICING.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border backdrop-blur-sm p-8 ${
                plan.popular
                  ? 'border-fuchsia-400/40 bg-gradient-to-br from-fuchsia-500/10 to-violet-500/10 scale-105'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              } transition-all duration-300 hover:-translate-y-1`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">
                  ${isYearly ? plan.price.yearly : plan.price.monthly}
                </span>
                <span className="text-slate-400 ml-1">
                  {plan.price.monthly === 0 ? '' : `/${isYearly ? 'year' : 'month'}`}
                </span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                    <svg className="w-4 h-4 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                className={`w-full py-3 rounded-lg font-semibold text-sm transition ${
                  plan.popular
                    ? 'bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white hover:shadow-lg hover:shadow-fuchsia-500/25'
                    : 'border border-white/20 bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                {plan.price.monthly === 0 ? 'Get Started Free' : 'Upgrade Now'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  ));

  // --- TESTIMONIALS SECTION ---
  const TestimonialsSection = memo(() => (
    <section className="py-28 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-4">
            Loved by Developers
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            See what our users are saying about their experience with our platform.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
            >
              {MOCK_TESTIMONIALS.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < testimonial.rating ? 'text-amber-400' : 'text-slate-600'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <blockquote className="text-lg text-slate-200 mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </blockquote>
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-400 to-cyan-400 flex items-center justify-center text-sm font-bold text-white">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-white">{testimonial.name}</p>
                        <p className="text-sm text-slate-400">{testimonial.role}, {testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {MOCK_TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition ${
                  index === currentTestimonial
                    ? 'bg-gradient-to-r from-fuchsia-400 to-cyan-400'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  ));

  // --- DASHBOARD SECTION ---
  const DashboardSection = memo(() => (
    <section className="py-28 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Analytics Dashboard</h2>
            <p className="text-slate-400">Real-time insights and performance metrics</p>
          </div>
          <button
            onClick={() => setShowSidebar(true)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white hover:bg-white/15 transition"
          >
            View Details
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {MOCK_DASHBOARD_DATA.map((metric, index) => {
            const { count } = useAnimatedCounter(
              typeof metric.value === 'string' ? parseInt(metric.value.replace(/[^\d]/g, '')) : metric.value,
              1500
            );
            
            return (
              <div key={metric.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-slate-400">{metric.label}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    metric.trend === 'up' ? 'bg-emerald-500/20 text-emerald-300' :
                    metric.trend === 'down' ? 'bg-red-500/20 text-red-300' :
                    'bg-slate-500/20 text-slate-300'
                  }`}>
                    {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'} {Math.abs(metric.change)}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {typeof metric.value === 'string' && metric.value.includes('$') ? `$${count.toLocaleString()}` :
                   typeof metric.value === 'string' && metric.value.includes('%') ? `${count}%` :
                   count.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mock Table */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {[
                  { user: 'John Doe', action: 'Created new project', status: 'completed', time: '2 min ago' },
                  { user: 'Sarah Chen', action: 'Updated dashboard', status: 'pending', time: '5 min ago' },
                  { user: 'Mike Ross', action: 'Deployed to production', status: 'completed', time: '12 min ago' },
                  { user: 'Emma Wilson', action: 'Added team member', status: 'completed', time: '18 min ago' }
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-400 to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
                          {row.user.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm text-white">{row.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{row.action}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        row.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-amber-500/20 text-amber-300'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  ));

  // --- NEWSLETTER FORM ---
  const NewsletterSection = memo(() => (
    <section className="py-28 relative">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <div className="bg-gradient-to-br from-fuchsia-500/10 via-violet-500/10 to-cyan-500/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Get the latest updates, feature releases, and developer insights delivered to your inbox.
          </p>
          
          <form onSubmit={handleFormSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={formState.email}
                onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 focus:border-transparent transition"
                required
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={formState.isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-fuchsia-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formState.isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            
            {formState.error && (
              <p className="text-red-400 text-sm mt-3" role="alert">{formState.error}</p>
            )}
            
            {formState.success && (
              <p className="text-emerald-400 text-sm mt-3" role="alert">Successfully subscribed!</p>
            )}
          </form>
        </div>
      </div>
    </section>
  ));

  // --- SKELETON LOADER ---
  const SkeletonCard = () => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
      <div className="w-12 h-12 bg-white/10 rounded-lg mb-4"></div>
      <div className="h-4 bg-white/10 rounded mb-2"></div>
      <div className="h-3 bg-white/10 rounded mb-1"></div>
      <div className="h-3 bg-white/10 rounded w-3/4"></div>
    </div>
  );

  // --- MODAL COMPONENT ---
  const Modal = memo(() => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setShowModal(false);
      };
      
      const handleClickOutside = (e: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
          setShowModal(false);
        }
      };

      if (showModal) {
        document.addEventListener('keydown', handleEscape);
        document.addEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'unset';
      };
    }, [showModal]);

    if (!showModal) return null;

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div ref={modalRef} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4 relative">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-slate-300 hover:text-white"
            aria-label="Close modal"
          >
            ×
          </button>
          
          <h3 id="modal-title" className="text-xl font-bold text-white mb-4">Get Started Today</h3>
          <p className="text-slate-300 mb-6">
            Join thousands of developers already using our platform to build amazing applications.
          </p>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={formState.name}
                onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={formState.email}
                onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40"
                placeholder="Enter your email"
                required
              />
            </div>
            <button
              type="submit"
              disabled={formState.isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    );
  });

  // --- SIDEBAR COMPONENT ---
  const Sidebar = memo(() => {
    if (!showSidebar) return null;

    return (
      <div className="fixed inset-0 z-40">
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowSidebar(false)}
        />
        <div className="absolute right-0 top-0 h-full w-80 bg-white/10 backdrop-blur-xl border-l border-white/20 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Dashboard Details</h3>
            <button
              onClick={() => setShowSidebar(false)}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-slate-300"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                {['Export Data', 'Generate Report', 'Schedule Backup', 'View Logs'].map(action => (
                  <button
                    key={action}
                    className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-slate-300 hover:text-white transition"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-3">System Status</h4>
              <div className="space-y-3">
                {[
                  { service: 'API Gateway', status: 'operational', uptime: '99.9%' },
                  { service: 'Database', status: 'operational', uptime: '100%' },
                  { service: 'CDN', status: 'degraded', uptime: '98.7%' },
                  { service: 'Analytics', status: 'operational', uptime: '99.8%' }
                ].map(item => (
                  <div key={item.service} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{item.service}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{item.uptime}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        item.status === 'operational' ? 'bg-emerald-400' :
                        item.status === 'degraded' ? 'bg-amber-400' : 'bg-red-400'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  // --- FOOTER ---
  const Footer = memo(() => (
    <footer className="py-20 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center">
                <span className="text-sm font-bold text-white">W</span>
              </div>
              <span className="text-lg font-semibold text-white">WorkInProgress</span>
            </div>
            <p className="text-slate-400 max-w-md mb-6">
              The ultimate development platform for modern teams. Build, ship, and scale faster than ever.
            </p>
            <div className="flex gap-4">
              {['GitHub', 'Twitter', 'LinkedIn', 'Discord'].map(social => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition flex items-center justify-center text-slate-300 hover:text-white"
                  aria-label={social}
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {['Features', 'Pricing', 'Security', 'Enterprise'].map(link => (
                <li key={link}>
                  <a href="#" className="hover:text-white transition">{link}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {['Documentation', 'Help Center', 'Contact', 'Status'].map(link => (
                <li key={link}>
                  <a href="#" className="hover:text-white transition">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} WorkInProgress. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  ));

  // --- MAIN RENDER ---
  return (
    <div className={`min-h-screen w-full text-white selection:bg-fuchsia-500/40 selection:text-white overflow-x-hidden font-sans transition-all duration-300 ${
      darkMode ? 'bg-[#05060a]' : 'bg-slate-900'
    }`}>
      {/* Background Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -left-32 w-[38rem] h-[38rem] rounded-full bg-fuchsia-600/10 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-[40rem] h-[40rem] rounded-full bg-cyan-600/10 blur-3xl animate-[pulse_9s_linear_infinite]" />
        <div className="absolute bottom-0 left-1/3 w-[28rem] h-[28rem] rounded-full bg-violet-600/10 blur-3xl animate-[pulse_11s_linear_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,128,0.10),transparent_60%),radial-gradient(circle_at_80%_60%,rgba(0,200,255,0.08),transparent_60%)]" />
      </div>

      <Navigation />
      <main>
        <HeroSection />
        
        {showSkeleton ? (
          <section className="py-28">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            </div>
          </section>
        ) : (
          <>
            <FeaturesSection />
            <PricingSection />
            <TestimonialsSection />
            <DashboardSection />
            <NewsletterSection />
          </>
        )}
      </main>
      <Footer />
      
      <Modal />
      <Sidebar />

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}