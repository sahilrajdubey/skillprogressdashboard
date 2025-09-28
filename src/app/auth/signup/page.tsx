'use client';
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: formData.fullName,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Signup successful!');
        // Redirect to signin page
        router.push('/auth/signin');
      } else {
        // Show error from backend
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  return (
    <div className={`min-h-screen w-full bg-[#05060a] text-white selection:bg-fuchsia-500/40 selection:text-white overflow-hidden font-sans transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Enhanced Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        {/* Subtle gradient orbs */}
        <div className="absolute -top-20 -left-32 w-[32rem] h-[32rem] rounded-full bg-fuchsia-600/5 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-32 w-[35rem] h-[35rem] rounded-full bg-cyan-600/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[25rem] h-[25rem] rounded-full bg-violet-600/5 blur-3xl animate-pulse" />
        
        {/* Tech grid pattern */}
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:50px_50px]" />
        
        {/* Floating dots */}
        <div className="absolute inset-0">
          <div className="absolute w-1 h-1 bg-fuchsia-400/20 rounded-full top-[10%] left-[15%] animate-pulse" />
          <div className="absolute w-1 h-1 bg-cyan-400/20 rounded-full top-[25%] right-[20%] animate-pulse" />
          <div className="absolute w-1 h-1 bg-violet-400/20 rounded-full bottom-[30%] left-[10%] animate-pulse" />
          <div className="absolute w-1 h-1 bg-pink-400/20 rounded-full bottom-[15%] right-[15%] animate-pulse" />
          <div className="absolute w-1 h-1 bg-emerald-400/20 rounded-full top-[60%] left-[80%] animate-pulse" />
          <div className="absolute w-1 h-1 bg-amber-400/20 rounded-full top-[80%] left-[30%] animate-pulse" />
        </div>
        
        {/* Diagonal lines */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-fuchsia-400/30 to-transparent top-[15%]" />
          <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent top-[85%]" />
        </div>
        
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-fuchsia-500/3 to-transparent" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-cyan-500/3 to-transparent" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-violet-500/3 to-transparent" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-pink-500/3 to-transparent" />
      </div>

      {/* Main Content Container */}
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <div className="w-full max-w-sm">
          {/* Clean Signup Card */}
          <div className="relative group">
            {/* Subtle glow effects */}
            <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-600 rounded-xl blur-lg opacity-15 group-hover:opacity-25 transition-all duration-1000" />
            
            {/* Main card */}
            <div className="relative rounded-xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.06] p-6 shadow-2xl shadow-black/40 overflow-hidden">
              {/* Card Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/[0.01] via-violet-500/[0.005] to-cyan-500/[0.01]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.03),transparent_50%)]" />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Header with Logo */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
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
                    <span className="text-base font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                 
                    </span>
                  </div>
                  
                  <h1 className="text-2xl font-bold tracking-tight mb-2 bg-gradient-to-br from-white via-white to-slate-400 bg-clip-text text-transparent">
                    Create Account
                  </h1>
                  <p className="text-slate-400 text-xs">
                    Start your journey with{" "}
                    <span className="text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text font-semibold">
                      intelligent learning
                    </span>
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs text-center">
                    {error}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name Input */}
                  <div className="group">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400 group-focus-within:text-fuchsia-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 focus:border-fuchsia-400/40 transition-all duration-300 backdrop-blur-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="group">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400 group-focus-within:text-fuchsia-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 focus:border-fuchsia-400/40 transition-all duration-300 backdrop-blur-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="group">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400 group-focus-within:text-fuchsia-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create password"
                        className="w-full pl-9 pr-9 py-2.5 rounded-lg bg-white/[0.02] border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 focus:border-fuchsia-400/40 transition-all duration-300 backdrop-blur-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {showPassword ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L8.464 11.293" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="group">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400 group-focus-within:text-fuchsia-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm password"
                        className="w-full pl-9 pr-9 py-2.5 rounded-lg bg-white/[0.02] border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 focus:border-fuchsia-400/40 transition-all duration-300 backdrop-blur-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {showConfirmPassword ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L8.464 11.293" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 text-white shadow-xl shadow-fuchsia-500/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-fuchsia-500/30 overflow-hidden mt-5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isSubmitting ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Creating...
                        </>
                      ) : (
                        <>
                          Create Account
                          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-400/0 via-white/20 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </button>
                </form>

                {/* Sign In Link */}
                <div className="mt-5 text-center">
                  <p className="text-slate-400 text-xs">
                    Already have an account?{" "}
                    <Link 
                      href="/auth/signin" 
                      className="relative text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text font-semibold group"
                    >
                      <span>Sign In</span>
                      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-fuchsia-400 to-cyan-400 transition-all duration-300 group-hover:w-full rounded-full" />
                    </Link>
                  </p>
                </div>

                {/* Terms */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    By creating an account, you agree to our{" "}
                    <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
                    {" "}and{" "}
                    <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
                  </p>
                </div>
              </div>
              
              {/* Card Border Effect */}
              <div className="absolute -inset-px rounded-xl ring-1 ring-white/5 group-hover:ring-fuchsia-400/15 transition-all duration-500 pointer-events-none" />
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="mt-4 text-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-xs"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}