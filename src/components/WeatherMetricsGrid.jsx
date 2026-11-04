import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import {
  formatWind,
  formatPressure,
  getUVInfo,
  formatTime12h,
  getDaylightProgress,
  getWindDirection,
  formatTemp,
} from '../utils/formatters';
import {
  Sun,
  Wind,
  Sunrise,
  Sunset,
  Droplets,
  Gauge,
  Eye,
  Compass,
  Sparkles,
} from 'lucide-react';

export default function WeatherMetricsGrid() {
  const { weatherData, unit } = useWeather();
  const { styles } = useTheme();

  if (!weatherData?.current) return null;

  const { current } = weatherData;
  const uvInfo = getUVInfo(current.uvIndex);
  const daylightProgress = getDaylightProgress(current.sunrise, current.sunset);
  const windDirName = getWindDirection(current.windDirection);

  // Visibility status
  const visKm = current.visibility || 10;
  const visMiles = Math.round(visKm * 0.621371);
  const visLabel = unit === 'F' ? `${visMiles} mi` : `${visKm} km`;
  const visStatus = visKm >= 10 ? 'Excellent visibility' : visKm >= 5 ? 'Moderate visibility' : 'Low visibility';

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className={`w-5 h-5 ${styles.accentColor}`} />
        <h3 className={`text-lg font-bold ${styles.textPrimary}`}>
          Atmospheric Metrics
        </h3>
        <span className={`text-xs px-2.5 py-0.5 rounded-full border ${styles.badge}`}>
          Detailed
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. UV Index Card */}
        <div className={`p-5 rounded-3xl border transition-all duration-300 ${styles.cardBg} ${styles.cardHover}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>UV Index</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${uvInfo.bg} ${uvInfo.color}`}>
              {uvInfo.level}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-3xl font-extrabold font-display ${styles.textPrimary}`}>
              {uvInfo.rating}
            </span>
            <span className="text-xs text-slate-400">/ 12 Max</span>
          </div>

          {/* UV Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-800/40 relative overflow-hidden mb-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500"
              style={{ width: `${Math.min(100, (current.uvIndex / 12) * 100)}%` }}
            />
          </div>

          <p className={`text-xs leading-relaxed ${styles.textSecondary}`}>
            {uvInfo.advice}
          </p>
        </div>

        {/* 2. Wind & Compass Card */}
        <div className={`p-5 rounded-3xl border transition-all duration-300 ${styles.cardBg} ${styles.cardHover}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Wind className="w-4 h-4 text-teal-400" />
              <span>Wind Speed & Direction</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${styles.badge}`}>
              {windDirName}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className={`text-3xl font-extrabold font-display ${styles.textPrimary}`}>
                {formatWind(current.windSpeed, unit)}
              </div>
              <div className={`text-xs mt-1 ${styles.textSecondary}`}>
                Angle: {current.windDirection}° {windDirName}
              </div>
            </div>

            {/* Compass Visualization */}
            <div className="relative w-14 h-14 rounded-full border-2 border-teal-500/30 flex items-center justify-center bg-teal-500/5">
              <span className="absolute top-0.5 text-[8px] font-bold text-slate-400">N</span>
              <span className="absolute bottom-0.5 text-[8px] font-bold text-slate-400">S</span>
              <span className="absolute left-1 text-[8px] font-bold text-slate-400">W</span>
              <span className="absolute right-1 text-[8px] font-bold text-slate-400">E</span>
              <div
                className="w-1 h-7 rounded-full bg-gradient-to-t from-teal-400 to-rose-500 transition-transform duration-500"
                style={{ transform: `rotate(${current.windDirection}deg)` }}
              />
              <div className="w-2 h-2 rounded-full bg-white absolute" />
            </div>
          </div>
        </div>

        {/* 3. Sunrise & Sunset Card */}
        <div className={`p-5 rounded-3xl border transition-all duration-300 ${styles.cardBg} ${styles.cardHover}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Sunrise className="w-4 h-4 text-amber-400" />
              <span>Sun Schedule</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${styles.badge}`}>
              {daylightProgress}% Day Elapsed
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 my-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                <Sunrise className="w-3.5 h-3.5" />
                <span>Sunrise</span>
              </div>
              <div className={`text-lg font-bold mt-1 ${styles.textPrimary}`}>
                {formatTime12h(current.sunrise)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
                <Sunset className="w-3.5 h-3.5" />
                <span>Sunset</span>
              </div>
              <div className={`text-lg font-bold mt-1 ${styles.textPrimary}`}>
                {formatTime12h(current.sunset)}
              </div>
            </div>
          </div>

          {/* Sunlight progress bar */}
          <div className="w-full h-2 rounded-full bg-slate-800/40 relative overflow-hidden mt-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400"
              style={{ width: `${daylightProgress}%` }}
            />
          </div>
        </div>

        {/* 4. Humidity & Dew Point Card */}
        <div className={`p-5 rounded-3xl border transition-all duration-300 ${styles.cardBg} ${styles.cardHover}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Humidity & Moisture</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${styles.badge}`}>
              {current.humidity < 40 ? 'Dry' : current.humidity <= 60 ? 'Comfortable' : 'Humid'}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-3xl font-extrabold font-display ${styles.textPrimary}`}>
              {current.humidity}%
            </span>
          </div>

          {/* Humidity Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-800/40 relative overflow-hidden mb-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-500"
              style={{ width: `${current.humidity}%` }}
            />
          </div>

          <p className={`text-xs ${styles.textSecondary}`}>
            Dew point is calculated at {formatTemp(current.dewPoint, unit)}.
          </p>
        </div>

        {/* 5. Air Pressure Card */}
        <div className={`p-5 rounded-3xl border transition-all duration-300 ${styles.cardBg} ${styles.cardHover}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Gauge className="w-4 h-4 text-purple-400" />
              <span>Barometric Pressure</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${styles.badge}`}>
              {current.pressure >= 1018 ? 'High' : current.pressure <= 1008 ? 'Low' : 'Normal'}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-3xl font-extrabold font-display ${styles.textPrimary}`}>
              {formatPressure(current.pressure)}
            </span>
          </div>

          <p className={`text-xs mt-3 ${styles.textSecondary}`}>
            {current.pressure >= 1015
              ? 'High atmospheric pressure indicates calm, stable conditions.'
              : 'Lower pressure indicates possible cloud development or precipitation.'}
          </p>
        </div>

        {/* 6. Visibility Card */}
        <div className={`p-5 rounded-3xl border transition-all duration-300 ${styles.cardBg} ${styles.cardHover}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Eye className="w-4 h-4 text-sky-400" />
              <span>Visibility</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${styles.badge}`}>
              Clear
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-3xl font-extrabold font-display ${styles.textPrimary}`}>
              {visLabel}
            </span>
          </div>

          <p className={`text-xs mt-3 ${styles.textSecondary}`}>
            {visStatus}. Safe driving and outdoor recreation conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
