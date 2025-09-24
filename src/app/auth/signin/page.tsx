'use client';
import React, { useState } from 'react';

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('access_token', data.access_token);
        alert('Login successful!');
        // Optionally redirect to dashboard
        // window.location.href = '/dashboard';
      } else {
        // Show error from backend
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#05060a] font-sans text-white flex items-center justify-center">
      {/* Animated Multi-Layer Background */}
      <div className="pointer-events-none absolute inset-0 -z-30">
        {/* Slow animated gradient wash */}
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_25%_20%,rgba(217,70,239,0.18),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(34,211,238,0.18),transparent_65%)] animate-[pulse_10s_ease-in-out_infinite]" />
        {/* Running diagonal lines */}
        <div className="absolute inset-0 mix-blend-overlay opacity-40 bg-[linear-gradient(115deg,rgba(255,255,255,0.08)_2%,transparent_2.5%,transparent_48%,rgba(255,255,255,0.05)_48.5%,rgba(255,255,255,0.05)_52%,transparent_52.5%,transparent_97%,rgba(255,255,255,0.08)_97.5%)] bg-[length:280%_280%] animate-[panLines_18s_linear_infinite]" />
        {/* Moving light beams */}
        <div className="absolute inset-0">
          <div className="absolute -left-1/3 top-1/4 w-[70rem] h-[18rem] bg-gradient-to-r from-fuchsia-600/10 via-violet-500/8 to-cyan-500/10 blur-3xl rotate-[8deg] animate-[moveBeam_22s_linear_infinite]" />
          <div className="absolute -right-1/4 bottom-1/4 w-[60rem] h-[16rem] bg-gradient-to-r from-cyan-500/10 via-fuchsia-500/10 to-violet-500/10 blur-3xl -rotate-[10deg] animate-[moveBeam_26s_linear_infinite_reverse]" />
        </div>
        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_60%,transparent_55%,rgba(0,0,0,0.55))]" />
      </div>

      {/* Center Wrapper (min height ensures no scroll on common breakpoints) */}
      <div className="w-full max-w-sm px-5 relative">
        {/* Glass Card */}
        <div className="group relative w-full rounded-3xl border border-white/15 bg-white/[0.03] backdrop-blur-2xl px-7 py-8 shadow-[0_4px_40px_-8px_rgba(0,0,0,0.75)] transition duration-500
            hover:border-fuchsia-400/40 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_6px_50px_-8px_rgba(168,85,247,0.65)]
            before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 before:transition before:duration-500 hover:before:opacity-100">
          {/* Subtle inner gradient ring */}
          <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10 group-hover:ring-fuchsia-400/40 transition duration-500" />
          {/* Corner glow accents */}
          <div className="pointer-events-none absolute -top-10 -right-8 w-40 h-40 bg-fuchsia-500/25 blur-3xl opacity-60 group-hover:opacity-90 transition" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 w-44 h-44 bg-cyan-500/25 blur-3xl opacity-50 group-hover:opacity-90 transition" />

          {/* Logo / Heading */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center">
              <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-500 shadow-[0_0_20px_-2px_rgba(172,0,200,0.6)]">
                <img 
                  src="/logo1.svg" 
                  alt="Elevate Logo" 
                  className="w-6 h-6"
                />
              </div>
            </div>
            <h1 className="mt-6 text-[2rem] leading-none font-extrabold tracking-tight bg-gradient-to-br from-white via-white to-slate-400 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="mt-3 text-sm text-slate-400">
              Sign in to continue your journey.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-6"
          >
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-medium tracking-wide text-slate-300 uppercase">Email </label>
              <div className="relative group/input rounded-xl bg-white/5/50 border border-white/10 focus-within:border-fuchsia-400/60 focus-within:ring-2 focus-within:ring-fuchsia-500/40 transition
                  shadow-[0_0_0_1px_rgba(255,255,255,0.05)]
                  focus-within:shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_0_22px_-4px_rgba(217,70,239,0.55)] hover:border-white/20">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="enter your email"
                  className="peer w-full bg-transparent px-4 py-3 pr-12 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold tracking-widest text-slate-500 peer-focus:text-fuchsia-300 transition select-none">
                  ID
                </span>
                <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 peer-focus:opacity-100 transition bg-gradient-to-r from-fuchsia-400/10 via-transparent to-cyan-400/10" />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium tracking-wide text-slate-300 uppercase">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="text-[11px] font-medium text-fuchsia-300 hover:text-fuchsia-200 transition"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative group/input rounded-xl bg-white/5/50 border border-white/10 focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-500/40 transition shadow-[0_0_0_1px_rgba(255,255,255,0.05)]
                  focus-within:shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_0_22px_-4px_rgba(34,211,238,0.55)] hover:border-white/20">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="enter your password"
                  className="peer w-full bg-transparent px-4 py-3 pr-12 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold tracking-widest text-slate-500 peer-focus:text-cyan-300 transition select-none">
                  KEY
                </span>
                <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 peer-focus:opacity-100 transition bg-gradient-to-r from-cyan-400/10 via-transparent to-fuchsia-400/10" />
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-[11px] text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded bg-white/5 border-white/15 text-fuchsia-500 focus:ring-fuchsia-500/40 focus:outline-none"
                />
                Remember me
              </label>
              <a
                href="#"
                className="relative text-[11px] font-medium text-cyan-300 hover:text-cyan-200 transition
                  after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-gradient-to-r after:from-cyan-300 after:to-fuchsia-400 after:transition-all hover:after:w-full"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm tracking-wide
                bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500
                shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_4px_14px_-4px_rgba(168,85,247,0.6)]
                hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_0_34px_-6px_rgba(168,85,247,0.85)]
                disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_4px_14px_-4px_rgba(168,85,247,0.6)]
                transition"
            >
              <span className="relative z-10">
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </span>
              {!isSubmitting && (
                <span className="text-base -mr-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
              )}
              {isSubmitting && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-fuchsia-400/0 via-white/10 to-cyan-400/0 transition" />
              <span className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 blur-md bg-gradient-to-r from-fuchsia-600/40 via-violet-600/40 to-cyan-500/40 transition" />
            </button>
          </form>

          {/* Divider for alt sign-in */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <span className="text-[10px] tracking-widest uppercase font-medium text-slate-500">or</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          </div>

          {/* Small provider icons (bottom) */}
          <div className="flex items-center justify-center gap-5">
            <button
              aria-label="Sign in with Google"
              className="group relative w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-fuchsia-400/40 hover:shadow-[0_0_18px_-4px_rgba(217,70,239,0.55)] transition"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path fill="#EA4335" d="M12 10.7v3.6h5.1c-.2 1.2-.9 2.2-2 2.9l3.2 2.5c1.9-1.7 3-4.2 3-7.2 0-.7-.1-1.4-.2-2H12z" />
                <path fill="#34A853" d="M6.6 14.3l-.8.6-2.6 2c1.6 3.2 4.8 5.3 8.8 5.3 2.6 0 4.8-.9 6.4-2.4l-3.2-2.5c-.9.6-2.1 1-3.2 1-2.5 0-4.6-1.7-5.4-4z" />
                <path fill="#4A90E2" d="M3.2 7.9C2.4 9.4 2 11.1 2 12.9c0 1.8.4 3.5 1.2 5l3.4-2.6c-.2-.6-.3-1.2-.3-1.9 0-.6.1-1.3.3-1.9L3.2 7.9z" />
                <path fill="#FBBC05" d="M12 6.4c1.4 0 2.7.5 3.7 1.5l2.8-2.8C16.7 3.2 14.6 2.4 12 2.4 7.9 2.4 4.5 4.6 3.2 7.9l3.4 2.6c.7-2.3 2.9-4.1 5.4-4.1z" />
              </svg>
              <span className="absolute inset-0 rounded-xl ring-1 ring-white/10 group-hover:ring-fuchsia-400/40 transition" />
            </button>
            <button
              aria-label="Sign in with GitHub"
              className="group relative w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-cyan-400/40 hover:shadow-[0_0_18px_-4px_rgba(34,211,238,0.55)] transition"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 .5C5.37.5 0 5.87 0 12.54c0 5.31 3.44 9.81 8.2 11.4.6.12.82-.27.82-.58 0-.29-.01-1.05-.02-2.06-3.34.75-4.04-1.63-4.04-1.63-.55-1.42-1.34-1.8-1.34-1.8-1.09-.77.08-.75.08-.75 1.2.09 1.83 1.25 1.83 1.25 1.07 1.87 2.8 1.33 3.49 1.02.11-.8.42-1.33.76-1.64-2.67-.31-5.47-1.37-5.47-6.1 0-1.35.47-2.45 1.24-3.31-.12-.31-.54-1.56.12-3.26 0 0 1.01-.33 3.3 1.26a11.1 11.1 0 0 1 3-.41c1.02 0 2.05.14 3 .41 2.28-1.59 3.29-1.26 3.29-1.26.66 1.7.24 2.95.12 3.26.77.86 1.23 1.96 1.23 3.31 0 4.74-2.8 5.78-5.48 6.09.43.38.81 1.11.81 2.24 0 1.62-.01 2.93-.01 3.33 0 .32.22.71.82.58 4.75-1.59 8.19-6.09 8.19-11.4C24 5.87 18.63.5 12 .5Z" />
              </svg>
              <span className="absolute inset-0 rounded-xl ring-1 ring-white/10 group-hover:ring-cyan-400/40 transition" />
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-7 text-center text-[12px] text-slate-400">
            Don't have an account?{" "}
            <a
              href="./signup"
              className="relative font-medium text-fuchsia-300 hover:text-fuchsia-200 transition
                after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-gradient-to-r after:from-fuchsia-300 after:to-cyan-400 after:transition-all hover:after:w-full"
            >
              Sign Up
            </a>
          </p>

          {/* Legal */}
          <p className="mt-5 text-center text-[10px] leading-relaxed text-slate-500">
            By signing in you agree to our{" "}
            <a href="#" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2 decoration-cyan-400/30">Terms</a>{" "}
            &{" "}
            <a href="#" className="text-fuchsia-300 hover:text-fuchsia-200 underline underline-offset-2 decoration-fuchsia-400/30">Privacy Policy</a>.
          </p>
        </div>
      </div>

      {/* Keyframes */}
      <style>
        {`
          @keyframes panLines {
            0% { background-position: 0% 0%; }
            100% { background-position: 200% 200%; }
          }
          @keyframes moveBeam {
            0% { transform: translate3d(0,0,0); opacity: .55; }
            50% { transform: translate3d(10%, -6%, 0); opacity: .8; }
            100% { transform: translate3d(0,0,0); opacity: .55; }
          }
          @keyframes moveBeam_reverse {
            0% { transform: translate3d(0,0,0); opacity: .55; }
            50% { transform: translate3d(-12%, 8%, 0); opacity: .85; }
            100% { transform: translate3d(0,0,0); opacity: .55; }
          }
          @keyframes pulse {
            0%,100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
        `}
      </style>
    </div>
  );
}