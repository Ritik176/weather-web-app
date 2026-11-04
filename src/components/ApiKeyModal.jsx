import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useWeather } from '../context/WeatherContext';
import { getStoredApiKey, saveStoredApiKey } from '../utils/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, X, Check, ExternalLink, ShieldCheck, Info } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose }) {
  const { styles } = useTheme();
  const { weatherData, retry } = useWeather();
  const [apiKey, setApiKey] = useState(() => getStoredApiKey());
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveStoredApiKey(apiKey);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
      retry();
    }, 800);
  };

  const handleClear = () => {
    setApiKey('');
    saveStoredApiKey('');
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
      retry();
    }, 600);
  };

  const currentProvider = weatherData?.provider || 'Open-Meteo';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl relative ${styles.cardBg}`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30`}>
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${styles.textPrimary}`}>
                Weather API Settings
              </h3>
              <p className={`text-xs ${styles.textSecondary}`}>
                Active Data Provider: <strong className="text-cyan-400">{currentProvider}</strong>
              </p>
            </div>
          </div>

          {/* Zero Config Notice */}
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200 mb-4 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Zero Configuration Active:</span> The application runs seamlessly out-of-the-box using the global live Open-Meteo meteorological API (no API key required).
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${styles.textSecondary}`}>
                OpenWeatherMap API Key (Optional)
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your 32-character API key"
                className={`w-full px-4 py-3 rounded-xl bg-black/20 dark:bg-slate-900/50 border border-white/10 focus:border-cyan-400 text-sm outline-none font-mono ${styles.textPrimary}`}
              />
              <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Keys can also be configured in <code className="text-cyan-300">.env</code> as <code className="text-cyan-300">VITE_WEATHER_API_KEY</code>.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              {apiKey && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2.5 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-500/15 text-xs font-semibold transition-all"
                >
                  Clear Key
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/10 text-xs font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow-lg shadow-cyan-500/25 hover:brightness-110 transition-all"
                >
                  {isSaved ? <Check className="w-4 h-4" /> : null}
                  <span>{isSaved ? 'Saved!' : 'Save & Apply'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* External link */}
          <div className="mt-5 pt-4 border-t border-white/10 text-center">
            <a
              href="https://home.openweathermap.org/users/sign_up"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
            >
              <span>Get an OpenWeatherMap API key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
