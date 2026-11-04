import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredTheme, saveStoredTheme } from '../utils/storage';

const ThemeContext = createContext();

export const BRAND_THEMES = {
  SKYCAST: 'skycast',
  WEATHERLY: 'weatherly',
  CLOUDCHECK: 'cloudcheck',
};

export const THEME_CONFIGS = {
  skycast: {
    id: 'skycast',
    name: 'SkyCast',
    subtitle: 'Cosmic HUD & Deep Space',
    badge: 'Futuristic',
    dark: true,
  },
  weatherly: {
    id: 'weatherly',
    name: 'Weatherly',
    subtitle: 'Minimal & Pastel Airy',
    badge: 'Clean Minimal',
    dark: false,
  },
  cloudcheck: {
    id: 'cloudcheck',
    name: 'CloudCheck',
    subtitle: 'Atmospheric Dynamic UI',
    badge: 'Weather Reactive',
    dark: true, // adaptive
  },
};

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => getStoredTheme(BRAND_THEMES.SKYCAST));
  const [currentCondition, setCurrentCondition] = useState('clear');

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    saveStoredTheme(newTheme);
  };

  // Sync dark class on <html> for tailwind dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (theme === BRAND_THEMES.SKYCAST) {
      root.classList.add('dark');
      root.classList.remove('theme-weatherly');
    } else if (theme === BRAND_THEMES.WEATHERLY) {
      root.classList.remove('dark');
      root.classList.add('theme-weatherly');
    } else {
      // CloudCheck - adaptive: rain, storm, night are dark; clear sunny daytime is brighter
      root.classList.add('dark');
    }
  }, [theme, currentCondition]);

  /**
   * Helper tokens for components based on active theme and condition
   */
  const getThemeStyles = () => {
    if (theme === BRAND_THEMES.SKYCAST) {
      return {
        cardBg: 'bg-[#0B132B]/60 backdrop-blur-xl border border-cyan-500/20 shadow-2xl shadow-cyan-950/40',
        cardHover: 'hover:border-cyan-400/40 transition-all duration-300',
        cardInner: 'bg-slate-900/40 border border-cyan-500/10',
        textPrimary: 'text-slate-100',
        textSecondary: 'text-slate-400',
        textMuted: 'text-slate-500',
        accentGradient: 'from-cyan-400 via-sky-500 to-indigo-500',
        accentColor: 'text-cyan-400',
        accentBg: 'bg-cyan-500',
        accentBorder: 'border-cyan-500/30',
        accentGlow: 'neon-glow-cyan',
        badge: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
        tabActive: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(0,242,254,0.3)]',
        tabInactive: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40',
      };
    }

    if (theme === BRAND_THEMES.WEATHERLY) {
      return {
        cardBg: 'bg-white/75 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-300/30',
        cardHover: 'hover:border-blue-300/80 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300',
        cardInner: 'bg-slate-50/80 border border-slate-200/50',
        textPrimary: 'text-slate-800',
        textSecondary: 'text-slate-500',
        textMuted: 'text-slate-400',
        accentGradient: 'from-blue-600 via-indigo-600 to-sky-500',
        accentColor: 'text-blue-600',
        accentBg: 'bg-blue-600',
        accentBorder: 'border-blue-500/30',
        accentGlow: 'shadow-md shadow-blue-200/60',
        badge: 'bg-blue-50 border-blue-200 text-blue-700',
        tabActive: 'bg-white text-blue-700 shadow-md font-semibold border-slate-200/60',
        tabInactive: 'text-slate-600 hover:text-slate-900 hover:bg-white/40',
      };
    }

    // CloudCheck - Dynamic condition styles
    switch (currentCondition) {
      case 'thunderstorm':
        return {
          cardBg: 'bg-purple-950/40 backdrop-blur-xl border border-purple-400/30 shadow-2xl shadow-purple-950/50',
          cardHover: 'hover:border-purple-400/60 transition-all duration-300',
          cardInner: 'bg-purple-900/30 border border-purple-400/20',
          textPrimary: 'text-purple-50',
          textSecondary: 'text-purple-200/70',
          textMuted: 'text-purple-300/50',
          accentGradient: 'from-violet-400 via-fuchsia-400 to-indigo-400',
          accentColor: 'text-violet-400',
          accentBg: 'bg-violet-500',
          accentBorder: 'border-violet-400/40',
          accentGlow: 'neon-glow-purple',
          badge: 'bg-purple-500/20 border-purple-400/40 text-purple-200',
          tabActive: 'bg-purple-500/30 text-purple-200 border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
          tabInactive: 'text-purple-200/60 hover:text-purple-100 hover:bg-purple-900/30',
        };
      case 'rain':
      case 'drizzle':
        return {
          cardBg: 'bg-sky-950/40 backdrop-blur-xl border border-teal-400/20 shadow-2xl shadow-slate-950/50',
          cardHover: 'hover:border-teal-400/40 transition-all duration-300',
          cardInner: 'bg-slate-900/40 border border-teal-500/10',
          textPrimary: 'text-teal-50',
          textSecondary: 'text-teal-200/70',
          textMuted: 'text-teal-300/50',
          accentGradient: 'from-teal-400 via-cyan-400 to-blue-500',
          accentColor: 'text-teal-300',
          accentBg: 'bg-teal-500',
          accentBorder: 'border-teal-400/30',
          accentGlow: 'neon-glow-cyan',
          badge: 'bg-teal-500/20 border-teal-400/30 text-teal-200',
          tabActive: 'bg-teal-500/20 text-teal-200 border-teal-400/40 shadow-[0_0_15px_rgba(45,212,191,0.3)]',
          tabInactive: 'text-teal-200/60 hover:text-teal-100 hover:bg-sky-900/30',
        };
      case 'snow':
        return {
          cardBg: 'bg-slate-900/50 backdrop-blur-xl border border-sky-200/30 shadow-2xl shadow-sky-950/40',
          cardHover: 'hover:border-sky-200/60 transition-all duration-300',
          cardInner: 'bg-slate-800/40 border border-sky-200/10',
          textPrimary: 'text-sky-50',
          textSecondary: 'text-sky-200/70',
          textMuted: 'text-sky-300/50',
          accentGradient: 'from-sky-200 via-cyan-200 to-blue-400',
          accentColor: 'text-sky-200',
          accentBg: 'bg-sky-400',
          accentBorder: 'border-sky-300/40',
          accentGlow: 'shadow-[0_0_20px_rgba(186,230,253,0.3)]',
          badge: 'bg-sky-400/20 border-sky-300/40 text-sky-100',
          tabActive: 'bg-sky-500/20 text-sky-100 border-sky-300/40 shadow-[0_0_15px_rgba(186,230,253,0.3)]',
          tabInactive: 'text-sky-200/60 hover:text-white hover:bg-sky-900/30',
        };
      case 'clear':
      default:
        return {
          cardBg: 'bg-slate-900/55 backdrop-blur-xl border border-amber-500/25 shadow-2xl shadow-amber-950/30',
          cardHover: 'hover:border-amber-400/45 transition-all duration-300',
          cardInner: 'bg-amber-950/20 border border-amber-500/15',
          textPrimary: 'text-amber-50',
          textSecondary: 'text-amber-100/70',
          textMuted: 'text-amber-200/50',
          accentGradient: 'from-amber-400 via-orange-400 to-rose-400',
          accentColor: 'text-amber-400',
          accentBg: 'bg-amber-500',
          accentBorder: 'border-amber-400/40',
          accentGlow: 'neon-glow-amber',
          badge: 'bg-amber-500/20 border-amber-400/40 text-amber-200',
          tabActive: 'bg-amber-500/20 text-amber-200 border-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.3)]',
          tabInactive: 'text-amber-100/60 hover:text-white hover:bg-amber-950/30',
        };
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        currentCondition,
        setCurrentCondition,
        styles: getThemeStyles(),
        themeConfig: THEME_CONFIGS[theme],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
