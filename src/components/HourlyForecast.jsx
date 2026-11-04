import React, { useRef } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import { formatTemp, formatHour, formatWind } from '../utils/formatters';
import AnimatedWeatherVisual from './AnimatedWeatherVisual';
import {
  Clock,
  Droplets,
  Wind,
  ChevronLeft,
  ChevronRight,
  Sun,
  CloudRain,
  Cloud,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
} from 'lucide-react';

export default function HourlyForecast() {
  const { weatherData, unit } = useWeather();
  const { styles } = useTheme();
  const scrollRef = useRef(null);

  if (!weatherData?.hourly || weatherData.hourly.length === 0) return null;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={`w-full rounded-3xl p-6 relative overflow-hidden transition-all duration-300 border ${styles.cardBg} ${styles.cardHover}`}>
      {/* Header with scroll arrows */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${styles.accentColor}`} />
          <h3 className={`text-lg font-bold ${styles.textPrimary}`}>
            24-Hour Forecast
          </h3>
          <span className={`text-xs px-2.5 py-0.5 rounded-full border ${styles.badge}`}>
            Hourly
          </span>
        </div>

        {/* Scroll navigation arrows */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="p-1.5 rounded-xl border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="p-1.5 rounded-xl border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto pb-3 pt-2 no-scrollbar scroll-smooth"
      >
        {weatherData.hourly.map((item, index) => {
          const isNow = index === 0;
          return (
            <div
              key={item.time || index}
              className={`flex-shrink-0 w-24 sm:w-28 p-3 rounded-2xl flex flex-col items-center justify-between transition-all duration-200 border ${
                isNow
                  ? `${styles.badge} bg-gradient-to-b from-cyan-500/15 to-transparent font-semibold shadow-lg`
                  : `${styles.cardInner} hover:border-cyan-400/30`
              }`}
            >
              {/* Time */}
              <span className={`text-xs font-medium ${isNow ? styles.accentColor : styles.textSecondary}`}>
                {formatHour(item.time, isNow)}
              </span>

              {/* Weather Visual */}
              <div className="my-2.5 flex items-center justify-center">
                <AnimatedWeatherVisual
                  type={item.condition.type}
                  isDay={new Date(item.time).getHours() >= 6 && new Date(item.time).getHours() < 20 ? 1 : 0}
                  size="sm"
                />
              </div>

              {/* Temperature */}
              <span className={`text-lg sm:text-xl font-bold font-display ${styles.textPrimary}`}>
                {formatTemp(item.temp, unit)}
              </span>

              {/* Precipitation Probability */}
              <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-cyan-400">
                <Droplets className="w-3 h-3 text-cyan-400" />
                <span>{item.precipitationProb}%</span>
              </div>

              {/* Wind Speed */}
              <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                <Wind className="w-2.5 h-2.5" />
                <span>{formatWind(item.windSpeed, unit).split(' ')[0]}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
