import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchWeatherData, reverseGeocode, detectUserLocation } from '../services/weatherService';
import {
  getRecentSearches,
  saveRecentSearch,
  clearRecentSearches,
  getStoredUnit,
  saveStoredUnit,
  getLastLocation,
  saveLastLocation,
} from '../utils/storage';
import { useTheme } from './ThemeContext';

const WeatherContext = createContext();

const DEFAULT_CITIES = [
  { name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', lat: 35.6762, lon: 139.6503, timezone: 'Asia/Tokyo' },
  { name: 'London', country: 'United Kingdom', admin1: 'England', lat: 51.5074, lon: -0.1278, timezone: 'Europe/London' },
  { name: 'New York', country: 'United States', admin1: 'New York', lat: 40.7128, lon: -74.006, timezone: 'America/New_York' },
  { name: 'Paris', country: 'France', admin1: 'Île-de-France', lat: 48.8566, lon: 2.3522, timezone: 'Europe/Paris' },
  { name: 'San Francisco', country: 'United States', admin1: 'California', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles' },
];

export function WeatherProvider({ children }) {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnitState] = useState(() => getStoredUnit('C'));
  const [searchHistory, setSearchHistory] = useState(() => getRecentSearches());
  const [activeLocation, setActiveLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const { setCurrentCondition } = useTheme();

  const setUnit = (newUnit) => {
    setUnitState(newUnit);
    saveStoredUnit(newUnit);
  };

  const toggleUnit = () => {
    setUnit(unit === 'C' ? 'F' : 'C');
  };

  const loadWeather = useCallback(async (lat, lon, locationInfo) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData(lat, lon, locationInfo);
      setWeatherData(data);
      setActiveLocation(locationInfo);
      saveLastLocation(locationInfo);

      // Notify theme provider of condition for dynamic CloudCheck theme
      if (data.current?.condition?.type) {
        setCurrentCondition(data.current.condition.type);
      }
    } catch (err) {
      console.error('Failed to fetch weather:', err);
      setError(err.message || 'Unable to retrieve weather data for this location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [setCurrentCondition]);

  const selectCity = useCallback((cityItem) => {
    if (!cityItem) return;
    const updatedHistory = saveRecentSearch(cityItem);
    setSearchHistory(updatedHistory || []);
    loadWeather(cityItem.lat, cityItem.lon, cityItem);
  }, [loadWeather]);

  const handleClearHistory = () => {
    clearRecentSearches();
    setSearchHistory([]);
  };

  /**
   * Robust Geolocation trigger:
   * 1. Attempts HTML5 navigator.geolocation (GPS / WiFi)
   * 2. Automatically falls back to IP Geolocation if permission is denied, timed out, or unavailable.
   */
  const useCurrentLocation = useCallback(async () => {
    setIsLocating(true);
    setError(null);

    // Fallback helper using IP geolocation
    const fallbackToIp = async () => {
      try {
        const detected = await detectUserLocation();
        if (detected && detected.lat && detected.lon) {
          selectCity(detected);
          return true;
        }
      } catch (e) {
        console.warn('IP fallback failed:', e);
      }
      return false;
    };

    if (!navigator.geolocation) {
      const ok = await fallbackToIp();
      setIsLocating(false);
      if (!ok) setError('Geolocation is not supported. Please search for your city above.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const locInfo = await reverseGeocode(latitude, longitude);
          selectCity({ ...locInfo, isCurrentLocation: true });
        } catch (e) {
          selectCity({
            name: 'Current Location',
            lat: latitude,
            lon: longitude,
            isCurrentLocation: true,
          });
        } finally {
          setIsLocating(false);
        }
      },
      async (geoError) => {
        console.warn('Browser geolocation denied or timed out, trying IP detection:', geoError);
        const ok = await fallbackToIp();
        setIsLocating(false);
        if (!ok) {
          let msg = 'Unable to detect location. Please search manually above.';
          if (geoError.code === 1) {
            msg = 'Location access was blocked. Please search for your city above.';
          }
          setError(msg);
        }
      },
      { timeout: 6000, enableHighAccuracy: true, maximumAge: 60000 }
    );
  }, [selectCity]);

  // Initial load: restore last saved location or automatically detect current location!
  useEffect(() => {
    const initWeather = async () => {
      const lastLoc = getLastLocation();
      if (lastLoc && lastLoc.lat && lastLoc.lon) {
        loadWeather(lastLoc.lat, lastLoc.lon, lastLoc);
        return;
      }

      // No previous location stored: attempt automatic location detection
      setIsLocating(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            try {
              const loc = await reverseGeocode(latitude, longitude);
              selectCity({ ...loc, isCurrentLocation: true });
            } catch {
              selectCity({ name: 'Current Location', lat: latitude, lon: longitude, isCurrentLocation: true });
            } finally {
              setIsLocating(false);
            }
          },
          async () => {
            // Permission denied or timeout: use IP geolocation seamlessly
            const detected = await detectUserLocation();
            if (detected) {
              selectCity(detected);
            } else {
              selectCity(DEFAULT_CITIES[0]);
            }
            setIsLocating(false);
          },
          { timeout: 4000, enableHighAccuracy: false }
        );
      } else {
        const detected = await detectUserLocation();
        selectCity(detected || DEFAULT_CITIES[0]);
        setIsLocating(false);
      }
    };

    initWeather();
  }, [loadWeather, selectCity]);

  const retry = () => {
    if (activeLocation && activeLocation.lat && activeLocation.lon) {
      loadWeather(activeLocation.lat, activeLocation.lon, activeLocation);
    } else {
      useCurrentLocation();
    }
  };

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        isLoading,
        error,
        unit,
        setUnit,
        toggleUnit,
        searchHistory,
        activeLocation,
        selectCity,
        clearHistory: handleClearHistory,
        useCurrentLocation,
        isLocating,
        retry,
        defaultCities: DEFAULT_CITIES,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
