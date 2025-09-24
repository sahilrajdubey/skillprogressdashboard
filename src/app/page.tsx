'use client';
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useCallback, useRef, memo, JSX } from 'react';



const NAV_LINKS = ["Home", "Features", "Courses", "Contact"];

const FEATURES = [
  {
    title: "Skill Tracking",
    desc: "Visualize your growth with dynamic progress charts and AI-powered proficiency scoring.",
    icon: (
      <svg className="w-8 h-8 text-fuchsia-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 15l4-4 4 4 4-8" />
      </svg>
    ),
    accent: "from-fuchsia-500/20 to-fuchsia-500/5"
  },
  {
    title: "Courses & Material",
    desc: "Curated paths, adaptive recommendations, and integrated micro-learning units.",
    icon: (
      <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10M4 18h6" />
      </svg>
    ),
    accent: "from-cyan-500/20 to-cyan-500/5"
  },
  {
    title: "Gamification",
    desc: "XP, streaks, badges, and seasonal challenges to keep you motivated and consistent.",
    icon: (
      <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="m12 17 5.196 3.09-1.414-5.91L20 9.545l-6-.545L12 3 10 9l-6 .545 4.218 4.635-1.414 5.91z" />
      </svg>
    ),
    accent: "from-violet-500/20 to-violet-500/5"
  },
  {
    title: "Roadmap & Planner",
    desc: "Strategic milestones, timeline planning, and priority guidance tailored to your goals.",
    icon: (
      <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 4h14M5 8h10M5 12h14M5 16h8M5 20h14" />
      </svg>
    ),
    accent: "from-emerald-500/20 to-emerald-500/5"
  },
  {
    title: "Analytics & Insights",
    desc: "Deep performance analytics, skill gaps, trends, and outcome predictions.",
    icon: (
      <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 19h16M4 13l4-4 4 4 6-6" />
      </svg>
    ),
    accent: "from-amber-500/20 to-amber-500/5"
  }
];

const TESTIMONIALS = [
  {
    name: "Aarav Patel",
    role: "Full Stack Developer",
    message: "This dashboard transformed how I structure my learning. The analytics showed blind spots I didn't know I had.",
    avatar: "🧑‍💻"
  },
  {
    name: "Sophia Lee",
    role: "Data Scientist",
    message: "The roadmap planner and adaptive recommendations sped up my ML journey dramatically.",
    avatar: "👩‍🔬"
  },
  {
    name: "Marcus Brown",
    role: "Cloud Architect",
    message: "Gamification features kept my streaks alive and boosted my daily skill retention rate.",
    avatar: "☁️"
  },
  {
    name: "Elena Garcia",
    role: "Cybersecurity Analyst",
    message: "The insights module gave me measurable growth metrics I could share with my mentor.",
    avatar: "🛡️"
  }
];

// Types
type Feature = {
  title: string;
  desc: string;
  icon: JSX.Element;
  accent: string;
};
type Testimonial = {
  name: string;
  role: string;
  message: string;
  avatar: string;
};

// Feature Card
const FeatureCard = React.memo(function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div
      className="group relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 flex flex-col gap-4 overflow-hidden transition duration-500 hover:shadow-xl hover:shadow-fuchsia-500/10 hover:border-fuchsia-400/40 hover:-translate-y-1"
      aria-label={feature.title}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-br pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
        data-accent={feature.accent}
      />
      <div className={`w-14 h-14 rounded-lg flex items-center justify-center bg-gradient-to-br ${feature.accent} border border-white/10`}>
        {feature.icon}
      </div>
      <h3 className="text-lg font-semibold tracking-wide text-white">{feature.title}</h3>
      <p className="text-sm text-slate-300 leading-relaxed">{feature.desc}</p>
      <button className="mt-auto self-start inline-flex items-center gap-1 text-xs font-medium text-fuchsia-300 group-hover:text-fuchsia-200 transition">
        Learn more
        <span className="inline-block group-hover:translate-x-1 transition-transform">&rarr;</span>
      </button>
      <div className="pointer-events-none absolute -inset-px rounded-xl ring-1 ring-inset ring-white/10 group-hover:ring-fuchsia-400/40 transition" />
    </div>
  );
});

// Testimonial Card
const TestimonialCard = React.memo(function TestimonialCard({ t, active }: { t: Testimonial; active: boolean }) {
  return (
    <div
      className={`flex flex-col justify-between rounded-2xl p-6 md:p-8 bg-white/5 backdrop-blur-md border border-white/10 w-full shrink-0
        transition-all duration-700 ease-[cubic-bezier(.4,0,.2,1)]
        ${active ? 'opacity-100 scale-100' : 'opacity-40 scale-95'}`}
      role="group"
      aria-roledescription="slide"
      aria-label={`${t.name} testimonial`}
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-fuchsia-500/30 to-cyan-500/30 flex items-center justify-center text-2xl">
          {t.avatar}
        </div>
        <div>
          <p className="font-semibold text-white">{t.name}</p>
          <p className="text-xs text-slate-400">{t.role}</p>
        </div>
      </div>
      <p className="mt-5 text-sm md:text-base text-slate-300 leading-relaxed">
        “{t.message}”
      </p>
      <div className="mt-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
});

export default function App() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextTestimonial = useCallback(() => {
    setTestimonialIndex(i => (i + 1) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(nextTestimonial, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [nextTestimonial]);

  const goTo = (idx: number) => {
    setTestimonialIndex(idx);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <div className="min-h-screen w-full bg-[#05060a] text-white selection:bg-fuchsia-500/40 selection:text-white overflow-x-hidden font-sans">
      {/* Background Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -left-32 w-[38rem] h-[38rem] rounded-full bg-fuchsia-600/10 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-[40rem] h-[40rem] rounded-full bg-cyan-600/10 blur-3xl animate-[pulse_9s_linear_infinite]" />
        <div className="absolute bottom-0 left-1/3 w-[28rem] h-[28rem] rounded-full bg-violet-600/10 blur-3xl animate-[pulse_11s_linear_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,128,0.10),transparent_60%),radial-gradient(circle_at_80%_60%,rgba(0,200,255,0.08),transparent_60%)]" />
      </div>

      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <nav className="flex items-center justify-between h-16 md:h-20 rounded-full mt-4 bg-white/5 backdrop-blur-xl border border-white/10 px-5 md:px-8 shadow-lg shadow-black/30">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-500 shadow-[0_0_20px_-2px_rgba(172,0,200,0.6)]">
               
<div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-500 shadow-[0_0_20px_-2px_rgba(172,0,200,0.6)]">
  <Image 
    src="/logo1.svg" 
    alt="Elevate Logo" 
    width={24}
    height={24}
    className="w-6 h-6"
  />
</div>
              </div>
              <span className="text-sm md:text-base font-semibold tracking-wide text-slate-100">ELEVATE  </span>
            </div>
            <ul className="hidden lg:flex items-center gap-8 text-sm">
              {NAV_LINKS.map(link => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="relative text-slate-300 hover:text-white transition group"
                  >
                    <span>{link}</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-fuchsia-400 to-cyan-400 transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="hidden md:flex items-center gap-3">
              <Link href="./auth/signin">
                <button className="text-xs font-medium px-4 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 transition">
                  Sign In
                </button>
              </Link>
              <Link href="./auth/signup">
              <button className="text-xs font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 hover:shadow-[0_0_0_2px_rgba(255,255,255,0.15),0_0_24px_-2px_rgba(168,85,247,0.7)] transition shadow-lg">
                Get Started
              </button>
               </Link>
            </div>
           
            <button
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-slate-200"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" stroke="currentColor" strokeWidth="1.5" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h14M4 18h10" />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="pt-36 md:pt-44 pb-28 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 text-[10px] uppercase tracking-wider font-semibold text-fuchsia-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-ping" />
              <span>Next-Gen Learning Intelligence</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] bg-gradient-to-br from-white via-white to-slate-400 text-transparent bg-clip-text">
              Track. Learn. Grow.
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-lg">
              Master your skills with an adaptive dashboard that quantifies progress, reveals insight, and accelerates growth through intelligent feedback loops.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="group relative inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.15)] hover:shadow-[0_0_20px_-2px_rgba(168,85,247,0.7)] transition">
                <span className="relative z-10">Get Started</span>
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-fuchsia-400/0 via-white/10 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition" />
              </button>
              <button className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-medium text-sm border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 transition">
                <span>Explore Features</span>
                <span className="text-fuchsia-300 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-xs">
              {[
                { label: "Active Learners", value: "12K+" },
                { label: "Skill Tracks", value: "150+" },
                { label: "Avg Growth", value: "34%" }
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="text-lg font-semibold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Abstract Dashboard Illustration */}
          <div className="flex-1 w-full relative">
            <div className="relative mx-auto max-w-md aspect-[4/5] md:aspect-[4/4.2] rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl shadow-fuchsia-900/30">
              <div className="absolute -top-24 -right-20 w-72 h-72 bg-fuchsia-500/30 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-cyan-500/30 rounded-full blur-3xl" />
              <div className="absolute inset-0 p-6 flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="flex-1 rounded-xl bg-white/10 border border-white/15 p-4 backdrop-blur-lg">
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">Progress</p>
                    <div className="mt-2 h-2 w-full bg-slate-700/40 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-full" />
                    </div>
                    <p className="mt-2 text-xs text-slate-300">JavaScript Track 75%</p>
                  </div>
                  <div className="w-20 rounded-xl bg-white/10 border border-white/15 p-3 backdrop-blur-lg flex flex-col items-center justify-center">
                    <p className="text-[9px] text-slate-400">Streak</p>
                    <p className="mt-1 text-base font-bold text-fuchsia-300">21</p>
                    <span className="text-[9px] text-slate-500">days</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {[50, 80, 34].map((v, i) => (
                    <div key={i} className="rounded-lg bg-white/10 border border-white/10 p-3">
                      <p className="text-[9px] text-slate-400 mb-1">Skill {i + 1}</p>
                      <div className="h-1.5 w-full bg-slate-600/40 rounded">
                        <div className="h-full rounded bg-gradient-to-r from-fuchsia-400 to-cyan-400" style={{ width: `${v}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-auto rounded-xl bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 border border-white/10 p-4">
                  <p className="text-[10px] uppercase tracking-wide text-slate-300">Weekly Velocity</p>
                  <div className="mt-2 flex items-end gap-1 h-20">
                    {[40, 55, 50, 70, 65, 90, 80].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-gradient-to-t from-slate-600/40 to-fuchsia-400/70"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-14">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Powerful Capabilities
              </h2>
              <p className="mt-3 text-slate-400 max-w-lg text-sm md:text-base">
                Everything you need to architect a smarter skill journey — measurable, motivating, and meaningful.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["A", "B", "C", "D"].map(tag => (
                  <div key={tag} className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 text-[10px] flex items-center justify-center font-bold border border-white/20">
                    {tag}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Trusted by learners worldwide</p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {FEATURES.map(f => <FeatureCard key={f.title} feature={f} />)}
            <div className="group relative md:col-span-2 xl:col-span-1 rounded-xl border border-white/10 bg-gradient-to-br from-fuchsia-500/10 via-violet-500/5 to-cyan-500/10 backdrop-blur-sm p-8 flex flex-col gap-5 overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-[conic-gradient(at_50%_50%,rgba(217,70,239,0.15),transparent_60%)]" />
              <h3 className="text-lg font-semibold tracking-wide">Adaptive Intelligence</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Our predictive engine continuously recalibrates your roadmap using performance deltas, retention metrics, and skill synergy modeling.
              </p>
              <ul className="grid grid-cols-2 gap-3 text-[11px] mt-1">
                {["AI Difficulty Tuning", "Retention Modeling", "Path Optimization", "Feedback Looping"].map(x => (
                  <li key={x} className="flex items-center gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-fuchsia-400 to-cyan-400" />
                    {x}
                  </li>
                ))}
              </ul>
              <button className="mt-auto self-start text-xs font-medium px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 transition">
                Learn about AI Engine
              </button>
              <div className="pointer-events-none absolute -inset-px rounded-xl ring-1 ring-inset ring-white/10 group-hover:ring-fuchsia-400/40 transition" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="analytics" className="py-28 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Proven Impact
              </h2>
              <p className="mt-3 text-sm md:text-base text-slate-400 max-w-lg">
                Learners across disciplines accelerate skill acquisition and stay engaged longer with our methodology.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTestimonialIndex(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center justify-center"
                aria-label="Previous testimonial"
              >
                <span className="text-lg">&larr;</span>
              </button>
              <button
                onClick={() => setTestimonialIndex(i => (i + 1) % TESTIMONIALS.length)}
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center justify-center"
                aria-label="Next testimonial"
              >
                <span className="text-lg">&rarr;</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div
              className="flex gap-6 transition-transform duration-700"
              style={{ transform: `translateX(-${testimonialIndex * 100}%)`, width: `${TESTIMONIALS.length * 100}%` }}
              role="region"
              aria-roledescription="carousel"
              aria-label="User testimonials"
            >
              {TESTIMONIALS.map((t, idx) => (
                <div key={t.name} className="w-full flex-shrink-0">
                  <TestimonialCard t={t} active={idx === testimonialIndex} />
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-center gap-3">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition
                    ${testimonialIndex === idx
                      ? 'bg-gradient-to-r from-fuchsia-400 to-cyan-400 shadow-[0_0_0_4px_rgba(255,255,255,0.05)]'
                      : 'bg-white/15 hover:bg-white/30'}`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 relative">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-fuchsia-500/10 via-violet-500/10 to-cyan-500/10 backdrop-blur-xl p-10 md:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)] opacity-60" />
            <div className="relative max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
                Elevate How You Learn & Measure Progress
              </h2>
              <p className="mt-5 text-base md:text-lg text-slate-200/80">
                Start building consistent momentum today with a dashboard engineered for clarity, motivation, and smart acceleration.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button className="group relative inline-flex items-center justify-center px-10 py-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_-4px_rgba(168,85,247,0.8)] transition">
                  <span className="relative z-10">Create Your Dashboard</span>
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-fuchsia-400/0 via-white/10 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition" />
                </button>
                <button className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-medium text-sm border border-white/20 bg-white/10 hover:bg-white/15 text-slate-100 transition">
                  <span>Preview Demo</span>
                  <span className="text-cyan-300">&rarr;</span>
                </button>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-10 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-fuchsia-500/30 to-cyan-500/30 blur-3xl opacity-60 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-16 pb-10 border-t border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center font-bold text-sm">
                  SPD
                </div>
                <span className="font-semibold text-slate-100">Skill Progress Dashboard</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Accelerating skill mastery through measurable progress, adaptive insights, and motivating user experience.
              </p>
              <div className="flex gap-3 pt-2">
                {["twitter", "github", "linkedin", "discord"].map(s => (
                  <a
                    key={s}
                    href="#"
                    aria-label={s}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition"
                  >
                    <span className="text-xs capitalize">{s[0].toUpperCase()}</span>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-white mb-4">Platform</p>
              <ul className="space-y-2 text-sm">
                {["Overview", "Features", "Roadmap", "Pricing", "Changelog"].map(x => (
                  <li key={x}>
                    <a className="text-slate-400 hover:text-white transition" href="#">{x}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-white mb-4">Resources</p>
              <ul className="space-y-2 text-sm">
                {["Blog", "Guides", "API Docs", "Community", "Support"].map(x => (
                  <li key={x}>
                    <a className="text-slate-400 hover:text-white transition" href="#">{x}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-white mb-4">Contact</p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Email: support@skillprogress.io</li>
                <li>Help Center</li>
                <li>Status & Uptime</li>
                <li>Security Portal</li>
              </ul>
              <div className="mt-5">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Subscribe</p>
                <form onSubmit={(e)=>e.preventDefault()} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40"
                  />
                  <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-xs font-semibold hover:shadow-[0_0_18px_-3px_rgba(168,85,247,0.7)] transition">
                    Go
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} Skill Progress Dashboard. All rights reserved.
            </p>
            <ul className="flex flex-wrap gap-6 text-xs text-slate-500">
              {["Privacy", "Terms", "Security", "Cookies", "Legal"].map(x => (
                <li key={x}>
                  <a className="hover:text-slate-300 transition" href="#">{x}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}