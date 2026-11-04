import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import { formatTemp, formatFullDate, formatWind, getUVInfo, formatPressure, formatTime12h } from '../utils/formatters';
import AnimatedWeatherVisual from './AnimatedWeatherVisual';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  ArrowUp,
  ArrowDown,
  Droplets,
  Wind,
  Sun,
  Gauge,
  Navigation,
  RefreshCw,
} from 'lucide-react';

export default function CurrentWeatherCard() {
  const { weatherData, unit, activeLocation, useCurrentLocation, isLocating } = useWeather();
  const { styles } = useTheme();

  if (!weatherData) return null;

  const { location, current } = weatherData;
  const uvInfo = getUVInfo(current.uvIndex);
  const isCurrentLoc = activeLocation?.isCurrentLocation || location.isCurrentLocation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`w-full rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300 border ${styles.cardBg} ${styles.cardHover}`}
    >
      {/* Background ambient lighting */}
      <div
        className={`absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br ${styles.accentGradient} opacity-15 blur-3xl pointer-events-none`}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Side: Location, Date/Time, Large Temperature */}
        <div className="flex-1 w-full text-center lg:text-left">
          {/* Location & Time badge */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-3">
            <div className="flex items-center gap-1.5 text-base sm:text-lg font-bold">
              <MapPin className={`w-5 h-5 ${styles.accentColor}`} />
              <span className={styles.textPrimary}>
                {location.name}
              </span>
              {(location.country || location.admin1) && (
                <span className={`text-sm font-normal ${styles.textSecondary}`}>
                  {[location.admin1, location.country].filter(Boolean).join(', ')}
                </span>
              )}
            </div>

            {/* Current Location Badge */}
            {isCurrentLoc && (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                <Navigation className="w-3 h-3 text-emerald-400" />
                <span>Your Location</span>
              </span>
            )}

            {/* Quick sync location button */}
            <button
              onClick={useCurrentLocation}
              disabled={isLocating}
              title="Update current location weather"
              className="p-1 rounded-lg border border-white/10 hover:bg-white/10 text-slate-400 hover:text-cyan-300 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-cyan-400' : ''}`} />
            </button>

            <span className="hidden sm:inline text-slate-500">•</span>

            <div className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${styles.badge}`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{formatFullDate(location.localTime)}</span>
            </div>
          </div>

          {/* Condition Title */}
          <div className="mb-4">
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight capitalize ${styles.textPrimary}`}>
              {current.condition.label}
            </h2>
            <p className={`text-sm mt-0.5 ${styles.textSecondary}`}>
              {current.condition.description}
            </p>
          </div>

          {/* Large Temperature Display & Range */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
            <div className="flex items-baseline">
              <span className={`text-6xl sm:text-8xl font-black tracking-tighter font-display ${styles.textPrimary}`}>
                {formatTemp(current.temp, unit).replace('°', '')}
              </span>
              <span className={`text-3xl sm:text-4xl font-light ml-1 ${styles.accentColor}`}>
                °{unit}
              </span>
            </div>

            <div className={`flex flex-col justify-center space-y-1 text-sm border-l sm:pl-5 ${styles.textSecondary} border-white/10`}>
              <div className="flex items-center gap-2">
                <span className="font-medium text-xs">Feels like</span>
                <span className={`font-semibold ${styles.textPrimary}`}>
                  {formatTemp(current.feelsLike, unit)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center text-xs text-rose-400">
                  <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                  {formatTemp(current.tempMax, unit)}
                </span>
                <span className="flex items-center text-xs text-sky-400">
                  <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
                  {formatTemp(current.tempMin, unit)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center / Right: Interactive Weather Visual with glowing aura */}
        <div className="flex flex-col items-center justify-center relative px-6 py-2">
          <AnimatedWeatherVisual
            type={current.condition.type}
            isDay={current.isDay}
            size="lg"
          />
        </div>
      </div>

      {/* Bottom Quick-Metrics Row */}
      <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Humidity */}
        <div className={`p-3.5 rounded-2xl border transition-all ${styles.cardInner}`}>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span>Humidity</span>
          </div>
          <div className={`text-lg sm:text-xl font-bold ${styles.textPrimary}`}>
            {current.humidity}%
          </div>
          <div className={`text-[11px] truncate ${styles.textSecondary}`}>
            Dew point: {formatTemp(current.dewPoint, unit)}
          </div>
        </div>

        {/* Wind Speed */}
        <div className={`p-3.5 rounded-2xl border transition-all ${styles.cardInner}`}>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <Wind className="w-4 h-4 text-teal-400" />
            <span>Wind Speed</span>
          </div>
          <div className={`text-lg sm:text-xl font-bold ${styles.textPrimary}`}>
            {formatWind(current.windSpeed, unit)}
          </div>
          <div className={`text-[11px] truncate ${styles.textSecondary}`}>
            Direction: {current.windDirection}°
          </div>
        </div>

        {/* UV Index */}
        <div className={`p-3.5 rounded-2xl border transition-all ${styles.cardInner}`}>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <Sun className="w-4 h-4 text-amber-400" />
            <span>UV Index</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-lg sm:text-xl font-bold ${styles.textPrimary}`}>
              {uvInfo.rating}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${uvInfo.bg} ${uvInfo.color}`}>
              {uvInfo.level}
            </span>
          </div>
          <div className={`text-[11px] truncate ${styles.textSecondary}`}>
            {uvInfo.advice}
          </div>
        </div>

        {/* Air Pressure */}
        <div className={`p-3.5 rounded-2xl border transition-all ${styles.cardInner}`}>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <Gauge className="w-4 h-4 text-purple-400" />
            <span>Pressure</span>
          </div>
          <div className={`text-lg sm:text-xl font-bold ${styles.textPrimary}`}>
            {formatPressure(current.pressure)}
          </div>
          <div className={`text-[11px] truncate ${styles.textSecondary}`}>
            {current.pressure > 1015 ? 'High (Clear)' : 'Standard'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
