'use client';
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useCallback, useRef, memo, JSX } from 'react';
import { Space_Mono } from "next/font/google";

const NAV_LINKS = ["Home", "Features", "Developer", "Contact"];

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

const DEVELOPERS = [
  {
    name: "Sahil Raj Dubey",
    role: "Full Stack Developer & UI/UX Designer",
    description: "Expert in React, Next.js, and modern web technologies. Passionate about creating intuitive user experiences and scalable applications.",
    avatar: "/sahil.jpg",
    skills: ["React", "Next.js", "Node.js", "UI/UX"],
    github: "https://github.com/sahilrajdubey",
    linkedin: "https://linkedin.com/in/sahil-raj-dubey"
  },
  {
    name: "Ashish Tiwari",
    role: "Backend Developer & DevOps Engineer",
    description: "Specializes in cloud architecture, microservices, and database optimization. Ensures robust and scalable backend infrastructure.",
    avatar: "/ash.jpg",
    skills: ["Python", "Flask", "Kubernetes" , "MongoDB"],
    github: "https://github.com/Ashish-2028 ",
    linkedin: "https://www.linkedin.com/in/ashish-kumar-66908a378/"
  },
  {
    name: "Aditi Garg",
    role: "Data Analytics & Data Visualiser ",
    description: " Expert in data analytics., data visualisation using python",
    avatar: "/adi.png", 
    skills: ["Python", "Data analytics"],
    github: "https://github.com/Aditi160106",
    linkedin: "https://www.linkedin.com/in/aditi-garg-4306bb387?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
  },
  {
    name: "Vanshika Nohar",
    role: "Server-side Developer",
    description: "Deployment , Ensures quality through comprehensive testing and optimization.",
    avatar: "/van.png",
    skills: ["Python", "Server", "Testing"],
    github: " https://github.com/vanshikanohar16-commits",
    linkedin: "https://www.linkedin.com/in/vanshika-nohar-6288b0378?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
  }
];

// Types
type Feature = {
  title: string;
  desc: string;
  icon: JSX.Element;
  accent: string;
};

type Developer = {
  name: string;
  role: string;
  description: string;
  avatar: string;
  skills: string[];
  github: string;
  linkedin: string;
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
       <a href="/auth/signin">Learn more</a>
        <span className="inline-block group-hover:translate-x-1 transition-transform">&rarr;</span>
      </button>
      <div className="pointer-events-none absolute -inset-px rounded-xl ring-1 ring-inset ring-white/10 group-hover:ring-fuchsia-400/40 transition" />
    </div>
  );
});

// Developer Card
const DeveloperCard = React.memo(function DeveloperCard({ developer }: { developer: Developer }) {
  return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 flex flex-col gap-5 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-fuchsia-500/10 hover:border-fuchsia-400/40 hover:-translate-y-2">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-br from-fuchsia-500/10 via-violet-500/5 to-cyan-500/10 pointer-events-none" />
      
      {/* Profile Section */}
      <div className="flex flex-col items-center text-center">
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-fuchsia-400/50 transition-colors">
          <div className="w-full h-full bg-gradient-to-br from-fuchsia-500/30 to-cyan-500/30 flex items-center justify-center text-2xl font-bold text-white">
            {developer.name.split(' ').map(n => n[0]).join('')}
          </div>
          {/* Replace with actual image when available */}
          {<Image 
            src={developer.avatar} 
            alt={developer.name}
            fill
            className="object-cover"
          /> }
        </div>
        <h3 className="mt-4 text-lg font-semibold text-white">{developer.name}</h3>
        <p className="text-sm text-fuchsia-300 font-medium">{developer.role}</p>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-300 leading-relaxed text-center">{developer.description}</p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 justify-center">
        {developer.skills.map(skill => (
          <span key={skill} className="px-3 py-1 text-xs font-medium bg-white/10 border border-white/20 rounded-full text-slate-300">
            {skill}
          </span>
        ))}
      </div>

      {/* Social Links */}
      <div className="flex gap-3 justify-center mt-auto">
        <a
          href={developer.github}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 hover:border-fuchsia-400/40 transition-colors flex items-center justify-center text-slate-300 hover:text-white"
          aria-label={`${developer.name}'s GitHub`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
        <a
          href={developer.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 hover:border-cyan-400/40 transition-colors flex items-center justify-center text-slate-300 hover:text-white"
          aria-label={`${developer.name}'s LinkedIn`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
      </div>

      <div className="pointer-events-none absolute -inset-px rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-fuchsia-400/40 transition" />
    </div>
  );
});

export default function App() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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

        <div className="flex items-center gap-3">
  <img
    src="/logo1.svg" 
    alt="Elevate Logo" 
    width={24}
    height={24}
    className="w-6 h-6"
  />
  <span className="text-sm md:text-base font-semibold tracking-wide text-slate-100">ELEVATE</span>
</div>
         
             
            </div>
            <ul className="hidden lg:flex items-center gap-8 text-sm">
              {NAV_LINKS.map(link => (
                <li key={link}>
                  <button
                    onClick={() => scrollToSection(link.toLowerCase())}
                    className="relative text-slate-300 hover:text-white transition group"
                  >
                    <span>{link}</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-fuchsia-400 to-cyan-400 transition-all duration-300 group-hover:w-full" />
                  </button>
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
                { label: "Active  Users", value: "12K+" },
                { label: "Skill Tracks", value: "150+" },
                { label: "Avg Growth", value: "84%" }
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
           {/* Modified Adaptive Intelligence Card with Navigation */}
           
<div 
  onClick={() => {

    window.location.href = './auth/workinprogress';

  }}
  className="group relative md:col-span-2 xl:col-span-1 rounded-xl border border-white/10 bg-gradient-to-br from-fuchsia-500/10 via-violet-500/5 to-cyan-500/10 backdrop-blur-sm p-8 flex flex-col gap-5 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-fuchsia-500/20"
>
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
  <div className="mt-auto flex items-center justify-between">
    <span className="text-xs font-medium px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 transition">
      Learn about AI Engine
    </span>
    <svg 
      className="w-5 h-5 text-fuchsia-400 transform group-hover:translate-x-1 transition-transform" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  </div>
  <div className="pointer-events-none absolute -inset-px rounded-xl ring-1 ring-inset ring-white/10 group-hover:ring-fuchsia-400/40 transition" />
</div> 
          </div>
        </div>
      </section>

      {/* Developer Team Section */}
      <section id="developer" className="py-28 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-400 max-w-2xl mx-auto">
              The passionate developers and designers behind ELEVATE, working together to create the future of skill development.
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DEVELOPERS.map((developer) => (
              <DeveloperCard key={developer.name} developer={developer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
     
      {/* Contact Section */}
      <section id="contact" className="py-28 relative border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Get In Touch
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-400 max-w-2xl mx-auto">
              Have questions or want to collaborate? We'd love to hear from you. Reach out and let's build something amazing together.
            </p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-2">
           {/* Contact Form */}
<div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-10 transition-all duration-500 hover:shadow-xl hover:shadow-fuchsia-500/10 hover:border-fuchsia-400/40 hover:-translate-y-2 max-w-md mx-auto lg:mx-0">
  <h3 className="text-lg font-semibold text-white mb-5">Send us a message</h3>
  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
    <div>
      <label className="block text-xs font-medium text-slate-300 mb-1">Name</label>
      <input
        type="text"
        className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 focus:border-transparent transition"
        placeholder="Your name"
      />
    </div>
    <div>
      <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
      <input
        type="email"
        className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 focus:border-transparent transition"
        placeholder="your@email.com"
      />
    </div>
    <div>
      <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
      <input
        type="text"
        className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 focus:border-transparent transition"
        placeholder="What's this about?"
      />
    </div>
    <div>
      <label className="block text-xs font-medium text-slate-300 mb-1">Message</label>
      <textarea
        rows={3}
        className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 focus:border-transparent transition resize-none"
        placeholder="Tell us more..."
      />
    </div>
    <button className="w-full group relative inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.15)] hover:shadow-[0_0_20px_-2px_rgba(168,85,247,0.7)] transition">
      <span className="relative z-10">Send Message</span>
      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-fuchsia-400/0 via-white/10 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition" />
    </button>
  </form>
</div>
</div>
          
          {/* Footer */}
<div className="mt-16 pt-2 border-t border-white/10 flex flex-col md:flex-row items-center justify-center gap-6">
  <p className="text-xs text-slate-600">
    &copy; {new Date().getFullYear()} ELEVATE. All rights reserved.
  </p>
</div>
        </div>
      </section>
    </div>
  );
}