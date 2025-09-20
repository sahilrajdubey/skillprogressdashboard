import React, { useState } from 'react';

/**
 * Sign In Page (signin.tsx)
 * - Premium dark neon / glassmorphism theme
 * - TailwindCSS utility classes only (no external CSS)
 * - Consistent with Skill Progress Dashboard landing page aesthetic
 */

const STARS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() > 0.85 ? 'w-1.5 h-1.5' : 'w-1 h-1',
  opacity: Math.random() > 0.8 ? 'opacity-70' : 'opacity-30',
  delay: `${Math.random() * 6}s`,
  duration: `${6 + Math.random() * 8}s`
}));

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [providerLoading, setProviderLoading] = useState<string | null>(null);

  const handleProvider = (provider: string) => {
    setProviderLoading(provider);
    // Integrate OAuth / SSO here
    setTimeout(() => setProviderLoading(null), 1400);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#05060a] text-white font-sans selection:bg-fuchsia-500/40 selection:text-white flex items-center justify-center px-5 py-16">
      {/* Backdrop Layers */}
      <div className="pointer-events-none absolute inset-0 -z-30">
        {/* Soft radial gradients */}
        <div className="absolute -top-32 -left-40 w-[42rem] h-[42rem] rounded-full bg-fuchsia-600/10 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-48 w-[40rem] h-[40rem] rounded-full bg-cyan-600/10 blur-3xl animate-[pulse_9s_linear_infinite]" />
        <div className="absolute bottom-0 left-1/3 w-[30rem] h-[30rem] rounded-full bg-violet-600/10 blur-3xl animate-[pulse_12s_linear_infinite]" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,128,0.12),transparent_65%),radial-gradient(circle_at_80%_70%,rgba(0,200,255,0.10),transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.6),transparent_50%)]" />
      </div>

      {/* Star / Particle Field */}
      <div className="absolute inset-0 -z-20 opacity-70">
        {STARS.map(s => (
          <span
            key={s.id}
            className={`absolute rounded-full bg-gradient-to-br from-fuchsia-300/80 via-cyan-300/80 to-violet-400/80 shadow-[0_0_8px_-1px_rgba(255,255,255,0.7)] ${s.size} ${s.opacity}`}
            style={{
              top: s.top,
              left: s.left,
              animation: `floatY ${s.duration} ease-in-out infinite`,
              animationDelay: s.delay,
              filter: 'drop-shadow(0 0 4px rgba(236,72,153,0.35))'
            }}
          />
        ))}
      </div>

      {/* Decorative grid / wireframe */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.15] mix-blend-overlay">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] bg-[size:58px_58px]" />
      </div>

      {/* Sign In Card */}
      <div className="group relative w-full max-w-md">
        <div
          className="relative flex flex-col gap-7 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl px-8 py-10 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_40px_-15px_rgba(0,0,0,0.7)] transition duration-500
          hover:shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_30px_60px_-18px_rgba(147,51,234,0.50)] hover:-translate-y-1.5
          before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/10 before:to-white/0 before:opacity-0 before:transition before:duration-500 group-hover:before:opacity-100"
        >
          {/* Glow / Accent Blobs */}
            <div className="pointer-events-none absolute -top-24 -right-10 w-60 h-60 rounded-full bg-fuchsia-500/20 blur-3xl group-hover:opacity-90 opacity-70 transition" />
            <div className="pointer-events-none absolute -bottom-28 -left-16 w-56 h-56 rounded-full bg-cyan-500/20 blur-3xl group-hover:opacity-90 opacity-70 transition" />
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/15 group-hover:ring-fuchsia-400/40 transition duration-500" />

          {/* Header */}
          <div className="flex flex-col gap-2 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center font-bold tracking-wider text-sm shadow-[0_0_18px_-4px_rgba(168,85,247,0.8)] relative">
              SPD
              <span className="absolute inset-0 rounded-2xl ring-1 ring-white/15" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight bg-gradient-to-br from-white via-white to-slate-400 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-400">
              Sign in to continue your journey.
            </p>
          </div>

            {/* Social Auth */}
            <div className="mt-2 flex flex-col gap-3">
              {[
                { name: 'Google', icon: 'G', gradient: 'from-white/70 to-white/5 text-slate-900', ring: 'group-hover:ring-fuchsia-400/40' },
                { name: 'GitHub', icon: 'GH', gradient: 'from-[#161b21]/90 to-[#0d1117]/70 text-white', ring: 'group-hover:ring-cyan-400/40' }
              ].map(btn => (
                <button
                  key={btn.name}
                  onClick={() => handleProvider(btn.name)}
                  disabled={!!providerLoading}
                  className={`group relative inline-flex items-center justify-center gap-3 w-full px-5 py-3 rounded-xl
                  bg-gradient-to-br ${btn.gradient} font-medium text-sm
                  border border-white/10 shadow shadow-black/40
                  hover:scale-[1.015] active:scale-[.985] transition disabled:opacity-50`}
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 text-xs font-semibold">
                    {btn.icon}
                  </span>
                  <span className="tracking-wide">
                    {providerLoading === btn.name ? `Connecting ${btn.name}...` : `Continue with ${btn.name}`}
                  </span>
                  <span className={`absolute inset-0 rounded-xl ring-1 ring-white/10 transition ${btn.ring}`} />
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-1">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">or email</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Handle authentication
            }}
            className="flex flex-col gap-5"
          >
            {/* Email / Username */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium tracking-wide text-slate-300">Email / Username</label>
              <div
                className="relative group/input rounded-xl bg-white/5 border border-white/10 focus-within:border-fuchsia-400/60 focus-within:ring-2 focus-within:ring-fuchsia-500/40
                transition shadow-[0_0_0_1px_rgba(255,255,255,0.08)] focus-within:shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_0_25px_-4px_rgba(168,85,247,0.8)]
                hover:border-white/20"
              >
                <input
                  type="text"
                  required
                  placeholder="you@example.com"
                  className="peer w-full bg-transparent px-4 py-3 pr-10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest text-slate-500 peer-focus:text-fuchsia-300 transition">
                  ID
                </div>
                <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 peer-focus:opacity-100 transition bg-gradient-to-r from-fuchsia-400/10 via-white/0 to-cyan-400/10" />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium tracking-wide text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="text-[11px] text-fuchsia-300 hover:text-fuchsia-200 font-medium transition"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div
                className="relative group/input rounded-xl bg-white/5 border border-white/10 focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-500/40
                transition shadow-[0_0_0_1px_rgba(255,255,255,0.08)] focus-within:shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_0_25px_-4px_rgba(34,211,238,0.8)]
                hover:border-white/20"
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="peer w-full bg-transparent px-4 py-3 pr-10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest text-slate-500 peer-focus:text-cyan-300 transition">
                  KEY
                </div>
                <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 peer-focus:opacity-100 transition bg-gradient-to-r from-cyan-400/10 via-white/0 to-fuchsia-400/10" />
              </div>
            </div>

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
                className="text-[11px] font-medium text-cyan-300 hover:text-cyan-200 transition relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-gradient-to-r after:from-cyan-300 after:to-fuchsia-400 after:transition-all hover:after:w-full"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="group relative mt-2 inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm
              bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 text-white
              shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_6px_18px_-6px_rgba(168,85,247,0.6)]
              hover:shadow-[0_0_0_1px_rgba(255,255,255,0.25),0_0_38px_-6px_rgba(168,85,247,0.9)]
              transition group-hover:translate-y-0.5"
            >
              <span className="relative z-10 tracking-wide">Sign In</span>
              <span className="text-base -mr-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-fuchsia-400/0 via-white/10 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition" />
              <span className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 blur-md bg-gradient-to-r from-fuchsia-600/40 via-violet-600/40 to-cyan-500/40 transition" />
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-[12px] text-slate-400 mt-2">
            Don’t have an account?{' '}
            <a
              href="/signup"
              className="relative font-medium text-fuchsia-300 hover:text-fuchsia-200 transition
              after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-gradient-to-r after:from-fuchsia-300 after:to-cyan-400 after:transition-all hover:after:w-full"
            >
              Sign Up
            </a>
          </p>

          {/* Legal Note */}
          <p className="text-center mt-6 text-[10px] leading-relaxed text-slate-500">
            Protected by adaptive security. By signing in you agree to our{' '}
            <a href="#" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2 decoration-cyan-400/30">Terms</a>{' '}&
            {' '}<a href="#" className="text-fuchsia-300 hover:text-fuchsia-200 underline underline-offset-2 decoration-fuchsia-400/30">Privacy Policy</a>.
          </p>
        </div>
      </div>

      {/* Accessibly hidden animation keyframes (using inline style) */}
      <style>
        {`
          @keyframes floatY {
            0%,100% { transform: translateY(0); opacity: 0.8;}
            50% { transform: translateY(-18px); opacity: 1;}
          }
        `}
      </style>
    </div>
  );
}