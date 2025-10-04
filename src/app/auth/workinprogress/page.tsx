'use client';
import Link from "next/link";
import { motion } from "framer-motion";

export default function UnderMaintenance() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-4">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950">
        {/* Animated Orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Glassmorphism Popup Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative z-10 max-w-lg w-full"
      >
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-40 transition duration-1000" />
        
        {/* Main Card */}
        <div className="relative bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl p-8 md:p-12">
          {/* Shimmer Effect */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
          </div>

          {/* Content */}
          <div className="relative space-y-6 text-center">
            {/* Icon with Animation */}
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 2,
                ease: "easeInOut"
              }}
              className="inline-block text-7xl md:text-8xl"
            >
              🚧
            </motion.div>

            {/* Heading */}
            <div className="space-y-3">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white dark:text-white">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Page Under Maintenance
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-base md:text-lg text-slate-200 dark:text-slate-300 font-medium leading-relaxed px-4">
                We're working hard to make it better. Please check back soon!
              </p>
            </div>

            {/* Decorative Dots */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
                className="w-2 h-2 rounded-full bg-purple-400"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                className="w-2 h-2 rounded-full bg-pink-400"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                className="w-2 h-2 rounded-full bg-blue-400"
              />
            </div>

            {/* Back to Home Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="pt-4"
            >
              <Link href="/">
                <button className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base text-white overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50">
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 transition-transform duration-300 group-hover:scale-105" />
                  
                  {/* Animated Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  {/* Button Content */}
                  <span className="relative flex items-center gap-2">
                    <svg 
                      className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                  </span>
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Bottom Accent Line */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full" />
        </div>
      </motion.div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        @keyframes shimmer {
          to {
            transform: translateX(100%);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
}