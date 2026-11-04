import React, { useState, useEffect, useRef } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import { searchCities } from '../services/weatherService';
import { Search, MapPin, Navigation, History, X, Loader2, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchBar() {
  const {
    selectCity,
    searchHistory,
    clearHistory,
    useCurrentLocation,
    isLocating,
    defaultCities,
  } = useWeather();
  const { styles } = useTheme();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNoResults, setHasNoResults] = useState(false);

  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      setHasNoResults(false);
      return;
    }

    setIsSearching(true);
    setHasNoResults(false);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const list = await searchCities(query);
        setResults(list);
        setHasNoResults(list.length === 0);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 320);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSelect = (item) => {
    selectCity(item);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' && results.length > 0) {
      handleSelect(results[0]);
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto px-4 sm:px-6 my-2 relative z-30">
      {/* Search Input Bar */}
      <div className={`relative flex items-center rounded-2xl transition-all duration-300 border ${styles.cardBg} ${isOpen ? 'ring-2 ring-cyan-400/50' : ''}`}>
        <div className="pl-4 pr-2 text-slate-400">
          {isSearching ? (
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for a city, state, or country..."
          className={`w-full py-3.5 bg-transparent text-sm sm:text-base outline-none placeholder:text-slate-400 font-medium ${styles.textPrimary}`}
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Current Location Button */}
        <button
          onClick={useCurrentLocation}
          disabled={isLocating}
          title="Use current geolocation"
          className={`flex items-center gap-1.5 px-3 py-1.5 mr-2 rounded-xl text-xs font-semibold border transition-all ${
            isLocating
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 animate-pulse'
              : `${styles.badge} hover:bg-cyan-500/20`
          }`}
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">Current Location</span>
        </button>
      </div>

      {/* Dropdown Suggestions & History */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className={`absolute left-4 right-4 mt-2 rounded-2xl overflow-hidden border shadow-2xl z-50 ${styles.cardBg}`}
          >
            {/* Live Search Results */}
            {results.length > 0 && (
              <div className="p-2">
                <div className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${styles.textSecondary}`}>
                  Suggestions
                </div>
                {results.map((item, idx) => (
                  <button
                    key={`${item.lat}-${item.lon}-${idx}`}
                    onClick={() => handleSelect(item)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm transition-all hover:bg-white/10 ${styles.textPrimary}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <span className="font-semibold">{item.name}</span>
                        {(item.admin1 || item.country) && (
                          <span className={`text-xs ml-2 ${styles.textSecondary}`}>
                            {[item.admin1, item.country].filter(Boolean).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {Math.abs(item.lat).toFixed(1)}°{item.lat >= 0 ? 'N' : 'S'}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Empty search state */}
            {hasNoResults && !isSearching && (
              <div className={`p-6 text-center text-sm ${styles.textSecondary}`}>
                No matching cities found for "{query}". Try a different spelling.
              </div>
            )}

            {/* Recent Searches Section */}
            {searchHistory.length > 0 && !query && (
              <div className="p-2 border-t border-white/5">
                <div className="flex items-center justify-between px-3 py-1.5">
                  <div className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${styles.textSecondary}`}>
                    <History className="w-3.5 h-3.5" />
                    <span>Recent Searches</span>
                  </div>
                  <button
                    onClick={clearHistory}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
                  {searchHistory.map((item, idx) => (
                    <button
                      key={`${item.name}-${idx}`}
                      onClick={() => handleSelect(item)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs sm:text-sm hover:bg-white/10 transition-all ${styles.textPrimary}`}
                    >
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate font-medium">{item.name}</span>
                      {item.country && (
                        <span className={`text-[11px] truncate ${styles.textSecondary}`}>
                          ({item.country})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Pick Popular Cities */}
            {!query && (
              <div className="p-3 bg-black/10 dark:bg-slate-950/20 border-t border-white/5">
                <div className={`text-[11px] font-semibold uppercase tracking-wider mb-2 ${styles.textSecondary}`}>
                  Popular Cities
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {defaultCities.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => handleSelect(c)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all hover:bg-white/15 border border-white/10 ${styles.textPrimary}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
