import React, { useState } from 'react';
import { useWeather } from './context/WeatherContext';
import { useTheme, BRAND_THEMES } from './context/ThemeContext';
import DynamicBackground from './components/DynamicBackground';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import HourlyForecast from './components/HourlyForecast';
import WeeklyForecast from './components/WeeklyForecast';
import WeatherMetricsGrid from './components/WeatherMetricsGrid';
import WeatherSkeleton from './components/WeatherSkeleton';
import ErrorBanner from './components/ErrorBanner';
import ApiKeyModal from './components/ApiKeyModal';
import { Cloud, Heart, Info, RefreshCw } from 'lucide-react';

function WeatherAppContent() {
  const { weatherData, isLoading, error, retry } = useWeather();
  const { theme, styles } = useTheme();
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [dismissError, setDismissError] = useState(false);

  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-x-hidden">
      {/* Immersive Dynamic Backdrop */}
      <DynamicBackground />

      {/* Main Container */}
      <div className="w-full flex-1 pb-16">
        {/* Header with Multi-Brand Switcher & Controls */}
        <Header onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)} />

        {/* Search Bar with Geocoding, History & Geolocation */}
        <SearchBar />

        {/* Error / Warning Alert Banner */}
        {error && !dismissError && (
          <div className="mt-4">
            <ErrorBanner
              message={error}
              onRetry={retry}
              onDismiss={() => setDismissError(true)}
            />
          </div>
        )}

        {/* Warning banner if fallback occurred */}
        {weatherData?.warning && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 my-2">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{weatherData.warning}</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Weather Interface */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
          {isLoading ? (
            <WeatherSkeleton />
          ) : weatherData ? (
            <div className="space-y-6">
              {/* Top Hero: Current Weather Card */}
              <CurrentWeatherCard />

              {/* Middle Section: Hourly Forecast (24-Hour Horizontal Scroll) */}
              <HourlyForecast />

              {/* Bottom Section: 2-Column Responsive Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left (7 cols on Desktop): Detailed Atmospheric Metrics */}
                <div className="lg:col-span-7">
                  <WeatherMetricsGrid />
                </div>

                {/* Right (5 cols on Desktop): 7-Day Expandable Daily Forecast */}
                <div className="lg:col-span-5">
                  <WeeklyForecast />
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-white/5 backdrop-blur-md text-xs relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">
              Atmosphere Weather
            </span>
            <span>•</span>
            <span>
              Powered by{' '}
              <strong className="text-cyan-400 font-medium">
                {weatherData?.provider || 'Open-Meteo'}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span>Themes: SkyCast, Weatherly, CloudCheck</span>
            <span>•</span>
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="text-cyan-400 hover:underline"
            >
              API Key
            </button>
          </div>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return <WeatherAppContent />;
}
