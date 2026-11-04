import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedWeatherVisual({ type = 'clear', isDay = 1, size = 'md' }) {
  const isNight = !isDay;

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-36 h-36 sm:w-44 sm:h-44',
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  // Clear Sky / Sunny or Clear Night
  if (type === 'clear') {
    if (isNight) {
      return (
        <div className={`relative flex items-center justify-center ${currentSize}`}>
          {/* Moon */}
          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(186,230,253,0.7)]">
              <path
                d="M50 15 A35 35 0 1 0 85 50 A28 28 0 1 1 50 15 Z"
                fill="url(#moonGrad)"
              />
              <defs>
                <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="60%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Starlight Twinkles */}
          <motion.div
            animate={{ opacity: [0.2, 1, 0.3], scale: [0.7, 1.2, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            className="absolute top-2 right-4 text-cyan-200 text-xs font-bold"
          >
            ✦
          </motion.div>
          <motion.div
            animate={{ opacity: [0.3, 1, 0.4], scale: [0.8, 1.3, 0.9] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-3 left-3 text-sky-200 text-[10px]"
          >
            ✧
          </motion.div>
        </div>
      );
    }

    // Sunny
    return (
      <div className={`relative flex items-center justify-center ${currentSize}`}>
        {/* Sun corona glow */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400/40 via-yellow-400/30 to-orange-500/20 blur-xl"
        />

        {/* Rotating sun rays */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full stroke-amber-400/80 stroke-2">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <line
                key={angle}
                x1="50"
                y1="12"
                x2="50"
                y2="2"
                strokeLinecap="round"
                transform={`rotate(${angle} 50 50)`}
              />
            ))}
          </svg>
        </motion.div>

        {/* Core Sun Body */}
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-orange-500 via-amber-400 to-yellow-300 shadow-[0_0_35px_rgba(251,191,36,0.9)] z-10"
        />
      </div>
    );
  }

  // Partly Cloudy
  if (type === 'partly-cloudy') {
    return (
      <div className={`relative flex items-center justify-center ${currentSize}`}>
        {/* Sun peaking from behind */}
        <motion.div
          animate={{ y: [-2, 2, -2], rotate: 360 }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
          }}
          className="absolute top-1 right-2 sm:right-3 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-orange-400 to-yellow-300 shadow-[0_0_25px_rgba(251,191,36,0.8)]"
        />

        {/* Floating Cloud */}
        <motion.div
          animate={{ y: [0, -5, 0], x: [-3, 3, -3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 top-2"
        >
          <svg viewBox="0 0 100 65" className="w-20 h-14 sm:w-24 sm:h-16 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)]">
            <path
              d="M25,50 a18,18 0 0,1 2,-36 a24,24 0 0,1 46,-4 a18,18 0 0,1 18,18 a16,16 0 0,1 -8,30 z"
              fill="url(#cloudGrad1)"
            />
            <defs>
              <linearGradient id="cloudGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.85" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>
    );
  }

  // Overcast / Cloudy
  if (type === 'cloudy') {
    return (
      <div className={`relative flex items-center justify-center ${currentSize}`}>
        {/* Back cloud */}
        <motion.div
          animate={{ x: [-4, 4, -4], y: [-2, 2, -2] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1 left-2 opacity-70"
        >
          <svg viewBox="0 0 100 65" className="w-18 h-12 sm:w-20 sm:h-14">
            <path
              d="M25,50 a18,18 0 0,1 2,-36 a24,24 0 0,1 46,-4 a18,18 0 0,1 18,18 a16,16 0 0,1 -8,30 z"
              fill="#94a3b8"
            />
          </svg>
        </motion.div>

        {/* Front cloud */}
        <motion.div
          animate={{ x: [4, -4, 4], y: [1, -3, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 top-2 drop-shadow-xl"
        >
          <svg viewBox="0 0 100 65" className="w-22 h-14 sm:w-26 sm:h-16">
            <path
              d="M25,50 a18,18 0 0,1 2,-36 a24,24 0 0,1 46,-4 a18,18 0 0,1 18,18 a16,16 0 0,1 -8,30 z"
              fill="url(#overcastGrad)"
            />
            <defs>
              <linearGradient id="overcastGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f1f5f9" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>
    );
  }

  // Rain / Drizzle
  if (type === 'rain' || type === 'drizzle') {
    return (
      <div className={`relative flex flex-col items-center justify-center ${currentSize}`}>
        {/* Rain Cloud */}
        <motion.div
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10"
        >
          <svg viewBox="0 0 100 60" className="w-20 h-12 sm:w-24 sm:h-14 drop-shadow-lg">
            <path
              d="M25,48 a16,16 0 0,1 2,-32 a22,22 0 0,1 42,-4 a16,16 0 0,1 16,16 a14,14 0 0,1 -6,26 z"
              fill="url(#rainCloudGrad)"
            />
            <defs>
              <linearGradient id="rainCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Falling Rain Drops */}
        <div className="relative w-16 h-6 sm:h-8 flex justify-around px-2 overflow-hidden">
          {[0, 1, 2, 3].map((drop) => (
            <motion.div
              key={drop}
              animate={{ y: [-8, 28], opacity: [0, 1, 0] }}
              transition={{
                duration: type === 'drizzle' ? 0.9 : 0.6,
                repeat: Infinity,
                delay: drop * 0.18,
                ease: 'linear',
              }}
              className="w-0.5 sm:w-1 h-3 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,242,254,0.8)]"
            />
          ))}
        </div>
      </div>
    );
  }

  // Thunderstorm
  if (type === 'thunderstorm') {
    return (
      <div className={`relative flex flex-col items-center justify-center ${currentSize}`}>
        {/* Storm Cloud */}
        <motion.div
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10"
        >
          <svg viewBox="0 0 100 60" className="w-20 h-12 sm:w-24 sm:h-14 drop-shadow-xl">
            <path
              d="M25,48 a16,16 0 0,1 2,-32 a22,22 0 0,1 42,-4 a16,16 0 0,1 16,16 a14,14 0 0,1 -6,26 z"
              fill="url(#stormCloudGrad)"
            />
            <defs>
              <linearGradient id="stormCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Flashing Lightning Bolt */}
        <motion.div
          animate={{
            opacity: [0, 0, 1, 0, 1, 0, 0],
            scale: [0.9, 0.9, 1.1, 1, 1.15, 0.9, 0.9],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-2 z-20"
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-8 sm:h-8 fill-yellow-300 stroke-amber-400 drop-shadow-[0_0_12px_rgba(250,204,21,1)]">
            <path d="M13 2L3 14h8l-2 8 12-12h-9l3-8z" />
          </svg>
        </motion.div>

        {/* Storm Rain Drops */}
        <div className="relative w-16 h-6 flex justify-around px-2">
          {[0, 1, 2].map((drop) => (
            <motion.div
              key={drop}
              animate={{ y: [-4, 22], opacity: [0, 1, 0] }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: drop * 0.15,
                ease: 'linear',
              }}
              className="w-0.5 sm:w-1 h-3 rounded-full bg-indigo-300"
            />
          ))}
        </div>
      </div>
    );
  }

  // Snow
  if (type === 'snow') {
    return (
      <div className={`relative flex flex-col items-center justify-center ${currentSize}`}>
        {/* Frost Cloud */}
        <motion.div
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10"
        >
          <svg viewBox="0 0 100 60" className="w-20 h-12 sm:w-24 sm:h-14 drop-shadow-md">
            <path
              d="M25,48 a16,16 0 0,1 2,-32 a22,22 0 0,1 42,-4 a16,16 0 0,1 16,16 a14,14 0 0,1 -6,26 z"
              fill="url(#snowCloudGrad)"
            />
            <defs>
              <linearGradient id="snowCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Fluttering Snowflakes */}
        <div className="relative w-16 h-6 sm:h-8 flex justify-around px-2 overflow-hidden">
          {[0, 1, 2].map((flake) => (
            <motion.div
              key={flake}
              animate={{
                y: [-6, 26],
                x: [-3, 3, -3],
                rotate: [0, 180, 360],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: flake * 0.6,
                ease: 'easeInOut',
              }}
              className="text-white text-xs drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
            >
              ❄
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Fog / Mist
  return (
    <div className={`relative flex flex-col items-center justify-center ${currentSize}`}>
      <motion.div
        animate={{ x: [-8, 8, -8] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="w-16 sm:w-20 h-1.5 rounded-full bg-slate-300/80 mb-2 blur-[1px]"
      />
      <motion.div
        animate={{ x: [8, -8, 8] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-20 sm:w-24 h-2 rounded-full bg-slate-200/90 mb-2 blur-[1px]"
      />
      <motion.div
        animate={{ x: [-6, 6, -6] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="w-14 sm:w-18 h-1.5 rounded-full bg-slate-300/70 blur-[1px]"
      />
    </div>
  );
}
