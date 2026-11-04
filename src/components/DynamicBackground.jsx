import React from 'react';
import { useTheme, BRAND_THEMES } from '../context/ThemeContext';
import { motion } from 'framer-motion';

export default function DynamicBackground() {
  const { theme, currentCondition } = useTheme();

  if (theme === BRAND_THEMES.SKYCAST) {
    return (
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#050814]">
        {/* Deep cosmic nebula orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-cyan-600/15 blur-[140px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 -right-32 w-[650px] h-[650px] rounded-full bg-purple-600/15 blur-[160px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-700/10 blur-[130px]"
        />

        {/* Futuristic grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 242, 254, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 242, 254, 0.4) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Ambient starry noise */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]" />
      </div>
    );
  }

  if (theme === BRAND_THEMES.WEATHERLY) {
    return (
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#F6F8FB]">
        {/* Soft pastel light gradients */}
        <div className="absolute top-0 left-0 right-0 h-[450px] bg-gradient-to-b from-blue-100/60 via-sky-50/40 to-transparent" />
        <motion.div
          animate={{ scale: [1, 1.08, 1], x: [0, 15, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 right-10 w-96 h-96 rounded-full bg-blue-200/30 blur-[90px]"
        />
        <motion.div
          animate={{ scale: [1.08, 1, 1.08], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 -left-20 w-[420px] h-[420px] rounded-full bg-indigo-100/40 blur-[100px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>
    );
  }

  // CloudCheck - Dynamic condition-reactive background
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-colors duration-1000">
      {currentCondition === 'clear' && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/60 via-slate-900 to-[#0c1427]">
          {/* Sunburst radiance */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full bg-amber-500/25 blur-[120px]"
          />
          <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-orange-600/15 blur-[130px]" />
        </div>
      )}

      {(currentCondition === 'rain' || currentCondition === 'drizzle') && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1b2b] via-[#091522] to-[#050b12]">
          <motion.div
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 inset-x-0 h-96 bg-cyan-600/10 blur-[100px]"
          />
          {/* Subtle rain streaks in background */}
          <div className="absolute inset-0 opacity-15 [background:radial-gradient(circle,rgba(56,189,248,0.3)_1px,transparent_1px)] [background-size:20px_40px]" />
        </div>
      )}

      {currentCondition === 'thunderstorm' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#170e2b] via-[#0f091d] to-[#06040c]">
          <motion.div
            animate={{
              opacity: [0.15, 0.35, 0.15, 0.6, 0.15],
              scale: [1, 1.05, 1, 1.1, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-10 left-1/3 w-[500px] h-[500px] rounded-full bg-purple-600/25 blur-[140px]"
          />
          <div className="absolute -bottom-20 right-10 w-96 h-96 rounded-full bg-indigo-700/20 blur-[120px]" />
        </div>
      )}

      {currentCondition === 'snow' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e1d2e] via-[#0b1724] to-[#070e17]">
          <motion.div
            animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-sky-300/15 blur-[130px]"
          />
          <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle,rgba(255,255,255,0.4)_1.5px,transparent_1.5px)] [background-size:32px_32px]" />
        </div>
      )}

      {(currentCondition === 'cloudy' || currentCondition === 'partly-cloudy' || currentCondition === 'fog') && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#101827] via-[#0b121e] to-[#060910]">
          <motion.div
            animate={{ x: [-20, 20, -20] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-10 left-10 w-[600px] h-[400px] rounded-full bg-slate-500/15 blur-[140px]"
          />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-900/10 blur-[120px]" />
        </div>
      )}
    </div>
  );
}
