import { mapWmoCode, mapOwmCode } from './weatherCodeMapper';
import { getStoredApiKey } from '../utils/storage';

/**
 * Searches for cities matching query via Geocoding API
 */
export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];

  const trimmed = query.trim();

  // Try Open-Meteo Geocoding
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      trimmed
    )}&count=7&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Geocoding request failed');
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results.map((item) => ({
      name: item.name,
      admin1: item.admin1 || '',
      country: item.country || '',
      countryCode: item.country_code || '',
      lat: item.latitude,
      lon: item.longitude,
      timezone: item.timezone || 'auto',
    }));
  } catch (err) {
    console.error('Error fetching city search results:', err);
    throw err;
  }
}

/**
 * Reverse geocodes coordinates (lat, lon) to get city and country names
 */
export async function reverseGeocode(lat, lon) {
  try {
    // Free open reverse geocoding via bigdatacloud open api or nominatim
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Current Location';
      const country = data.countryName || '';
      const admin1 = data.principalSubdivision || '';
      return { name: city, country, admin1, lat, lon };
    }
  } catch (err) {
    console.warn('Reverse geocoding fallback:', err);
  }

  // Fallback label
  return {
    name: 'Your Location',
    country: '',
    admin1: '',
    lat,
    lon,
  };
}

/**
 * Fetches comprehensive weather data for a given latitude and longitude.
 * Automatically handles OpenWeatherMap if key is provided, or seamlessly falls back
 * to live Open-Meteo meteorological feed.
 */
export async function fetchWeatherData(lat, lon, locationInfo = {}) {
  const envKey = import.meta.env.VITE_WEATHER_API_KEY;
  const storedKey = getStoredApiKey();
  const apiKey = (storedKey || envKey || '').trim();

  if (apiKey) {
    try {
      return await fetchFromOpenWeatherMap(lat, lon, locationInfo, apiKey);
    } catch (owmError) {
      console.warn('OpenWeatherMap failed or key invalid, falling back to Open-Meteo:', owmError);
      // Fallback to Open-Meteo with an indicator
      const fallbackData = await fetchFromOpenMeteo(lat, lon, locationInfo);
      return {
        ...fallbackData,
        warning: `OpenWeatherMap: ${owmError.message || 'Key invalid'}. Showing live Open-Meteo data.`,
      };
    }
  }

  // Default: Open-Meteo (zero key required, fast, accurate, full 7-day + hourly + UV data)
  return await fetchFromOpenMeteo(lat, lon, locationInfo);
}

/**
 * Fetches live weather from Open-Meteo API
 */
async function fetchFromOpenMeteo(lat, lon, locationInfo = {}) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m',
    hourly:
      'temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m,surface_pressure,uv_index',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max',
    timezone: locationInfo.timezone || 'auto',
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather service returned ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  const current = data.current;
  const daily = data.daily;
  const hourly = data.hourly;

  if (!current || !daily) {
    throw new Error('Weather data unavailable for this location');
  }

  // Parse condition
  const condition = mapWmoCode(current.weather_code, current.is_day);

  // Hourly: find index closest to now, take next 24 hours
  const nowIso = new Date().toISOString();
  let startIndex = 0;
  if (hourly?.time) {
    const idx = hourly.time.findIndex((t) => new Date(t) >= new Date(Date.now() - 30 * 60 * 1000));
    startIndex = idx >= 0 ? idx : 0;
  }

  const next24Hours = (hourly?.time || []).slice(startIndex, startIndex + 24).map((timeStr, i) => {
    const idx = startIndex + i;
    const hourDate = new Date(timeStr);
    const hourIsDay = hourDate.getHours() >= 6 && hourDate.getHours() < 20 ? 1 : 0;
    const wCode = hourly.weather_code?.[idx] ?? 0;
    const itemCondition = mapWmoCode(wCode, hourIsDay);

    return {
      time: timeStr,
      temp: hourly.temperature_2m?.[idx] ?? 0,
      precipitationProb: hourly.precipitation_probability?.[idx] ?? 0,
      condition: itemCondition,
      windSpeed: hourly.wind_speed_10m?.[idx] ?? 0,
      humidity: hourly.relative_humidity_2m?.[idx] ?? 0,
    };
  });

  // Calculate current UV index from hourly data or daily max
  let currentUv = daily.uv_index_max?.[0] ?? 4;
  if (hourly?.uv_index && hourly.uv_index[startIndex] !== undefined) {
    currentUv = hourly.uv_index[startIndex];
  }

  // Daily: 7 days
  const sevenDays = (daily.time || []).slice(0, 7).map((dateStr, idx) => {
    const wCode = daily.weather_code?.[idx] ?? 0;
    const itemCondition = mapWmoCode(wCode, 1);

    return {
      date: dateStr,
      tempMin: daily.temperature_2m_min?.[idx] ?? 0,
      tempMax: daily.temperature_2m_max?.[idx] ?? 0,
      apparentMin: daily.apparent_temperature_min?.[idx] ?? 0,
      apparentMax: daily.apparent_temperature_max?.[idx] ?? 0,
      precipitationProb: daily.precipitation_probability_max?.[idx] ?? 0,
      precipitationSum: daily.precipitation_sum?.[idx] ?? 0,
      uvMax: daily.uv_index_max?.[idx] ?? 3,
      sunrise: daily.sunrise?.[idx] || '',
      sunset: daily.sunset?.[idx] || '',
      windSpeedMax: daily.wind_speed_10m_max?.[idx] ?? 0,
      condition: itemCondition,
    };
  });

  // Dew point approximation: T - ((100 - RH) / 5)
  const tempC = current.temperature_2m;
  const rh = current.relative_humidity_2m;
  const dewPoint = Math.round(tempC - (100 - rh) / 5);

  return {
    provider: 'Open-Meteo',
    location: {
      name: locationInfo.name || 'Current Location',
      country: locationInfo.country || '',
      admin1: locationInfo.admin1 || '',
      lat,
      lon,
      timezone: data.timezone || locationInfo.timezone || 'auto',
      localTime: current.time,
    },
    current: {
      temp: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      tempMin: daily.temperature_2m_min?.[0] ?? current.temperature_2m - 3,
      tempMax: daily.temperature_2m_max?.[0] ?? current.temperature_2m + 3,
      humidity: current.relative_humidity_2m,
      dewPoint,
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      pressure: current.surface_pressure,
      uvIndex: currentUv,
      visibility: 10, // Standard baseline km
      isDay: current.is_day,
      condition,
      sunrise: daily.sunrise?.[0] || '',
      sunset: daily.sunset?.[0] || '',
    },
    hourly: next24Hours,
    daily: sevenDays,
  };
}

/**
 * Fetches weather data using OpenWeatherMap 2.5/3.0 APIs
 */
async function fetchFromOpenWeatherMap(lat, lon, locationInfo, apiKey) {
  // Current weather
  const curRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );
  if (!curRes.ok) {
    const errData = await curRes.json().catch(() => ({}));
    throw new Error(errData.message || `OpenWeatherMap returned ${curRes.status}`);
  }
  const curData = await curRes.json();

  // 5 day / 3 hour forecast
  const forecastRes = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );
  if (!forecastRes.ok) {
    throw new Error('Failed to load forecast data from OpenWeatherMap');
  }
  const forecastData = await forecastRes.json();

  const curWeatherObj = curData.weather?.[0] || {};
  const condition = mapOwmCode(curWeatherObj.id, curWeatherObj.icon, curWeatherObj.description);

  // Hourly mapping (taking 8 3-hour periods = 24h)
  const hourly = (forecastData.list || []).slice(0, 8).map((item) => {
    const itemWeather = item.weather?.[0] || {};
    return {
      time: item.dt_txt || new Date(item.dt * 1000).toISOString(),
      temp: Math.round(item.main.temp),
      precipitationProb: Math.round((item.pop || 0) * 100),
      condition: mapOwmCode(itemWeather.id, itemWeather.icon, itemWeather.description),
      windSpeed: Math.round((item.wind?.speed || 0) * 3.6), // m/s to km/h
      humidity: item.main.humidity,
    };
  });

  // Group forecast by date for 5-7 days
  const dailyGroups = {};
  (forecastData.list || []).forEach((item) => {
    const date = item.dt_txt ? item.dt_txt.split(' ')[0] : new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!dailyGroups[date]) {
      dailyGroups[date] = {
        date,
        temps: [],
        conditions: [],
        pops: [],
        winds: [],
      };
    }
    dailyGroups[date].temps.push(item.main.temp);
    dailyGroups[date].conditions.push(item.weather?.[0]);
    dailyGroups[date].pops.push(item.pop || 0);
    dailyGroups[date].winds.push(item.wind?.speed || 0);
  });

  const daily = Object.values(dailyGroups)
    .slice(0, 7)
    .map((d, index) => {
      const min = Math.min(...d.temps);
      const max = Math.max(...d.temps);
      const midCond = d.conditions[Math.floor(d.conditions.length / 2)] || {};
      const maxPop = Math.round(Math.max(...d.pops) * 100);
      const maxWind = Math.round(Math.max(...d.winds) * 3.6);

      // Sunrise & sunset approximation from current
      const sunrise = index === 0 ? new Date(curData.sys?.sunrise * 1000).toISOString() : '';
      const sunset = index === 0 ? new Date(curData.sys?.sunset * 1000).toISOString() : '';

      return {
        date: d.date,
        tempMin: Math.round(min),
        tempMax: Math.round(max),
        apparentMin: Math.round(min - 1),
        apparentMax: Math.round(max - 1),
        precipitationProb: maxPop,
        precipitationSum: 0,
        uvMax: 5, // fallback
        sunrise,
        sunset,
        windSpeedMax: maxWind,
        condition: mapOwmCode(midCond.id, midCond.icon, midCond.description),
      };
    });

  const sunrise = curData.sys?.sunrise ? new Date(curData.sys.sunrise * 1000).toISOString() : '';
  const sunset = curData.sys?.sunset ? new Date(curData.sys.sunset * 1000).toISOString() : '';

  return {
    provider: 'OpenWeatherMap',
    location: {
      name: locationInfo.name || curData.name || 'Current Location',
      country: locationInfo.country || curData.sys?.country || '',
      admin1: locationInfo.admin1 || '',
      lat,
      lon,
      timezone: 'auto',
      localTime: new Date().toISOString(),
    },
    current: {
      temp: Math.round(curData.main.temp),
      feelsLike: Math.round(curData.main.feels_like),
      tempMin: Math.round(curData.main.temp_min),
      tempMax: Math.round(curData.main.temp_max),
      humidity: curData.main.humidity,
      dewPoint: Math.round(curData.main.temp - (100 - curData.main.humidity) / 5),
      windSpeed: Math.round((curData.wind?.speed || 0) * 3.6), // km/h
      windDirection: curData.wind?.deg || 0,
      pressure: curData.main.pressure,
      uvIndex: 5,
      visibility: curData.visibility ? Math.round(curData.visibility / 1000) : 10,
      isDay: curWeatherObj.icon?.includes('d') ? 1 : 0,
      condition,
      sunrise,
      sunset,
    },
    hourly,
    daily,
  };
}
