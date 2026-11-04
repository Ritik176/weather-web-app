const KEYS = {
  SEARCH_HISTORY: 'atmosphere_weather_recent_searches',
  THEME: 'atmosphere_weather_brand_theme',
  UNIT: 'atmosphere_weather_temp_unit',
  CUSTOM_API_KEY: 'atmosphere_custom_api_key',
  LAST_LOCATION: 'atmosphere_weather_last_location',
};

const MAX_RECENT_SEARCHES = 8;

export function getRecentSearches() {
  try {
    const raw = localStorage.getItem(KEYS.SEARCH_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load recent searches from localStorage', e);
    return [];
  }
}

export function saveRecentSearch(item) {
  if (!item || !item.name) return;
  try {
    const current = getRecentSearches();
    // Filter out duplicates (matching by name and country)
    const filtered = current.filter(
      (c) => !(c.name.toLowerCase() === item.name.toLowerCase() && c.country === item.country)
    );
    // Insert at front
    const updated = [
      {
        name: item.name,
        country: item.country || '',
        admin1: item.admin1 || '',
        lat: item.lat,
        lon: item.lon,
        timestamp: Date.now(),
      },
      ...filtered,
    ].slice(0, MAX_RECENT_SEARCHES);

    localStorage.setItem(KEYS.SEARCH_HISTORY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save search history', e);
    return [];
  }
}

export function clearRecentSearches() {
  try {
    localStorage.removeItem(KEYS.SEARCH_HISTORY);
    return [];
  } catch (e) {
    console.error('Failed to clear searches', e);
    return [];
  }
}

export function getStoredTheme(defaultTheme = 'skycast') {
  try {
    const theme = localStorage.getItem(KEYS.THEME);
    return ['skycast', 'weatherly', 'cloudcheck'].includes(theme) ? theme : defaultTheme;
  } catch {
    return defaultTheme;
  }
}

export function saveStoredTheme(theme) {
  try {
    localStorage.setItem(KEYS.THEME, theme);
  } catch (e) {
    console.error(e);
  }
}

export function getStoredUnit(defaultUnit = 'C') {
  try {
    const unit = localStorage.getItem(KEYS.UNIT);
    return unit === 'F' ? 'F' : 'C';
  } catch {
    return defaultUnit;
  }
}

export function saveStoredUnit(unit) {
  try {
    localStorage.setItem(KEYS.UNIT, unit);
  } catch (e) {
    console.error(e);
  }
}

export function getStoredApiKey() {
  try {
    return localStorage.getItem(KEYS.CUSTOM_API_KEY) || '';
  } catch {
    return '';
  }
}

export function saveStoredApiKey(key) {
  try {
    if (!key) {
      localStorage.removeItem(KEYS.CUSTOM_API_KEY);
    } else {
      localStorage.setItem(KEYS.CUSTOM_API_KEY, key.trim());
    }
  } catch (e) {
    console.error(e);
  }
}

export function getLastLocation() {
  try {
    const item = localStorage.getItem(KEYS.LAST_LOCATION);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

export function saveLastLocation(location) {
  try {
    localStorage.setItem(KEYS.LAST_LOCATION, JSON.stringify(location));
  } catch (e) {
    console.error(e);
  }
}
