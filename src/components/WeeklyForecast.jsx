import React, { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import { formatTemp, formatDay, formatFullDate, formatTime12h, formatWind, getUVInfo } from '../utils/formatters';
import AnimatedWeatherVisual from './AnimatedWeatherVisual';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Droplets,
  Wind,
  Sun,
  Sunrise,
  Sunset,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

export default function WeeklyForecast() {
  const { weatherData, unit } = useWeather();
  const { styles } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState(0); // first day open by default

  if (!weatherData?.daily || weatherData.daily.length === 0) return null;

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  // Find overall min and max across all 7 days for relative temp bar scaling
  const allMins = weatherData.daily.map((d) => d.tempMin);
  const allMaxs = weatherData.daily.map((d) => d.tempMax);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const tempRange = Math.max(1, globalMax - globalMin);

  return (
    <div className={`w-full rounded-3xl p-6 transition-all duration-300 border ${styles.cardBg} ${styles.cardHover}`}>
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className={`w-5 h-5 ${styles.accentColor}`} />
          <h3 className={`text-lg font-bold ${styles.textPrimary}`}>
            7-Day Forecast
          </h3>
          <span className={`text-xs px-2.5 py-0.5 rounded-full border ${styles.badge}`}>
            Daily
          </span>
        </div>
        <span className={`text-xs ${styles.textSecondary}`}>
          Click to expand details
        </span>
      </div>

      {/* Accordion List */}
      <div className="space-y-2.5">
        {weatherData.daily.map((item, index) => {
          const isToday = index === 0;
          const isExpanded = expandedIndex === index;
          const uvInfo = getUVInfo(item.uvMax);

          // Calculate percentage for temperature range bar
          const leftPercent = Math.max(0, Math.min(100, ((item.tempMin - globalMin) / tempRange) * 100));
          const widthPercent = Math.max(15, Math.min(100 - leftPercent, ((item.tempMax - item.tempMin) / tempRange) * 100));

          return (
            <div
              key={item.date || index}
              className={`rounded-2xl transition-all duration-200 border overflow-hidden ${
                isExpanded ? `${styles.cardInner} ring-1 ring-cyan-500/30` : 'bg-black/10 dark:bg-slate-900/30 border-white/5 hover:border-white/10'
              }`}
            >
              {/* Main summary row */}
              <button
                onClick={() => toggleExpand(index)}
                className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left transition-colors"
              >
                {/* Day name & date */}
                <div className="w-24 sm:w-28 shrink-0">
                  <div className={`text-sm sm:text-base font-semibold ${isToday ? styles.accentColor : styles.textPrimary}`}>
                    {formatDay(item.date, isToday)}
                  </div>
                  <div className={`text-xs ${styles.textSecondary}`}>
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>

                {/* Condition Visual & Label */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="shrink-0 w-8 h-8 flex items-center justify-center">
                    <AnimatedWeatherVisual type={item.condition.type} isDay={1} size="sm" />
                  </div>
                  <span className={`text-xs sm:text-sm font-medium truncate hidden md:inline ${styles.textSecondary}`}>
                    {item.condition.label}
                  </span>
                </div>

                {/* Rain probability */}
                <div className="flex items-center gap-1 w-14 shrink-0 text-cyan-400 text-xs font-semibold">
                  {item.precipitationProb > 0 && (
                    <>
                      <Droplets className="w-3 h-3" />
                      <span>{item.precipitationProb}%</span>
                    </>
                  )}
                </div>

                {/* Temperature Min / Range Bar / Max */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs sm:text-sm font-medium text-sky-400 w-8 text-right`}>
                    {formatTemp(item.tempMin, unit)}
                  </span>

                  {/* Visual Bar */}
                  <div className="w-16 sm:w-24 h-2 rounded-full bg-slate-800/40 relative overflow-hidden hidden xs:block">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400 opacity-80"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>

                  <span className={`text-xs sm:text-sm font-bold w-8 ${styles.textPrimary}`}>
                    {formatTemp(item.tempMax, unit)}
                  </span>
                </div>

                {/* Expand / Collapse Icon */}
                <div className="text-slate-400 ml-1">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Collapsible Details Body */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden border-t border-white/5 bg-black/15 dark:bg-slate-950/30 px-4 py-3"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      {/* Precipitation Sum */}
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                          <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Precipitation</span>
                        </div>
                        <div className={`font-semibold ${styles.textPrimary}`}>
                          {item.precipitationSum > 0 ? `${item.precipitationSum} mm` : '0 mm'} ({item.precipitationProb}% chance)
                        </div>
                      </div>

                      {/* UV Max */}
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                          <Sun className="w-3.5 h-3.5 text-amber-400" />
                          <span>Peak UV Index</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`font-semibold ${styles.textPrimary}`}>
                            {item.uvMax}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded border ${uvInfo.bg} ${uvInfo.color}`}>
                            {uvInfo.level}
                          </span>
                        </div>
                      </div>

                      {/* Sunrise & Sunset */}
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                          <Sunrise className="w-3.5 h-3.5 text-orange-400" />
                          <span>Sunrise & Sunset</span>
                        </div>
                        <div className={`font-semibold ${styles.textPrimary}`}>
                          {formatTime12h(item.sunrise)} / {formatTime12h(item.sunset)}
                        </div>
                      </div>

                      {/* Wind Speed Max */}
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                          <Wind className="w-3.5 h-3.5 text-teal-400" />
                          <span>Max Wind Gust</span>
                        </div>
                        <div className={`font-semibold ${styles.textPrimary}`}>
                          {formatWind(item.windSpeedMax, unit)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
