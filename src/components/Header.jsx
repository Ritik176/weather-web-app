import React from 'react';
import { useTheme, BRAND_THEMES, THEME_CONFIGS } from '../context/ThemeContext';
import { useWeather } from '../context/WeatherContext';
import { motion } from 'framer-motion';
import {
  Sparkles,
  CloudSun,
  Palette,
  KeyRound,
  Zap,
  Feather,
  Sun,
  Activity,
} from 'lucide-react';

export default function Header({ onOpenApiKeyModal }) {
  const { theme, setTheme, styles } = useTheme();
  const { unit, toggleUnit, weatherData } = useWeather();

  const brandList = [
    {
      id: BRAND_THEMES.SKYCAST,
      label: 'SkyCast',
      sub: 'Deep Space',
      icon: Zap,
      accent: 'from-cyan-400 to-blue-500',
    },
    {
      id: BRAND_THEMES.WEATHERLY,
      label: 'Weatherly',
      sub: 'Pastel Light',
      icon: Feather,
      accent: 'from-blue-500 to-indigo-500',
    },
    {
      id: BRAND_THEMES.CLOUDCHECK,
      label: 'CloudCheck',
      sub: 'Adaptive UI',
      icon: Activity,
      accent: 'from-amber-400 to-pink-500',
    },
  ];

  return (
    <header className="w-full pt-4 pb-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-tr ${styles.accentGradient} shadow-lg shadow-cyan-500/20`}
          >
            <CloudSun className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-2xl font-extrabold tracking-tight font-display ${styles.textPrimary}`}>
                {THEME_CONFIGS[theme].name}
              </h1>
              <span
                className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${styles.badge}`}
              >
                {THEME_CONFIGS[theme].badge}
              </span>
            </div>
            <p className={`text-xs ${styles.textSecondary}`}>
              {THEME_CONFIGS[theme].subtitle}
            </p>
          </div>
        </div>

        {/* Brand Theme Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/20 dark:bg-slate-900/40 backdrop-blur-md border border-white/10 dark:border-slate-800/60 shadow-inner">
          {brandList.map((brand) => {
            const Icon = brand.icon;
            const isActive = theme === brand.id;
            return (
              <button
                key={brand.id}
                onClick={() => setTheme(brand.id)}
                className={`relative px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive ? styles.tabActive : styles.tabInactive
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeThemeHighlight"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r opacity-20 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 ${isActive ? styles.accentColor : 'opacity-70'}`} />
                <span className="hidden xs:inline">{brand.label}</span>
                <span className="xs:hidden">{brand.label.slice(0, 4)}</span>
              </button>
            );
          })}
        </div>

        {/* Right Action Bar: °C/°F toggle + API settings */}
        <div className="flex items-center gap-2">
          {/* Temperature Unit Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-black/20 dark:bg-slate-900/40 backdrop-blur-md border border-white/10 dark:border-slate-800/60 text-xs font-semibold">
            <button
              onClick={() => unit !== 'C' && toggleUnit()}
              className={`px-3 py-1 rounded-lg transition-all ${
                unit === 'C'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : `${styles.textSecondary} hover:${styles.textPrimary}`
              }`}
            >
              °C
            </button>
            <button
              onClick={() => unit !== 'F' && toggleUnit()}
              className={`px-3 py-1 rounded-lg transition-all ${
                unit === 'F'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : `${styles.textSecondary} hover:${styles.textPrimary}`
              }`}
            >
              °F
            </button>
          </div>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiKeyModal}
            title="Configure OpenWeatherMap API Key"
            className={`p-2 rounded-xl transition-all border ${
              styles.cardBg
            } ${styles.cardHover} ${styles.textSecondary} hover:${styles.textPrimary}`}
          >
            <KeyRound className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
