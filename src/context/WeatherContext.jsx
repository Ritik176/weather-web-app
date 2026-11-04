import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchWeatherData, reverseGeocode } from '../services/weatherService';
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
  { name: 'San Francisco', country: 'United States', admin1: 'California', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles' },
  { name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', lat: 35.6762, lon: 139.6503, timezone: 'Asia/Tokyo' },
  { name: 'London', country: 'United Kingdom', admin1: 'England', lat: 51.5074, lon: -0.1278, timezone: 'Europe/London' },
  { name: 'New York', country: 'United States', admin1: 'New York', lat: 40.7128, lon: -74.006, timezone: 'America/New_York' },
  { name: 'Paris', country: 'France', admin1: 'Île-de-France', lat: 48.8566, lon: 2.3522, timezone: 'Europe/Paris' },
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

  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const locInfo = await reverseGeocode(latitude, longitude);
          selectCity(locInfo);
        } catch (e) {
          selectCity({
            name: 'Your Location',
            lat: latitude,
            lon: longitude,
          });
        } finally {
          setIsLocating(false);
        }
      },
      (geoError) => {
        setIsLocating(false);
        let msg = 'Unable to retrieve your location.';
        if (geoError.code === 1) {
          msg = 'Location permission denied. You can search for your city above.';
        } else if (geoError.code === 2) {
          msg = 'Location unavailable. Please search manually.';
        } else if (geoError.code === 3) {
          msg = 'Location request timed out. Please try again.';
        }
        setError(msg);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, [selectCity]);

  // Initial load: restore last searched city or default
  useEffect(() => {
    const lastLoc = getLastLocation();
    if (lastLoc && lastLoc.lat && lastLoc.lon) {
      loadWeather(lastLoc.lat, lastLoc.lon, lastLoc);
    } else {
      const defaultCity = DEFAULT_CITIES[0];
      loadWeather(defaultCity.lat, defaultCity.lon, defaultCity);
    }
  }, [loadWeather]);

  const retry = () => {
    if (activeLocation && activeLocation.lat && activeLocation.lon) {
      loadWeather(activeLocation.lat, activeLocation.lon, activeLocation);
    } else {
      const defaultCity = DEFAULT_CITIES[0];
      loadWeather(defaultCity.lat, defaultCity.lon, defaultCity);
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
