/**
 * Converts temperature based on unit ('C' or 'F')
 */
export function formatTemp(celsius, unit = 'C') {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return '--';
  const val = unit === 'F' ? (celsius * 9) / 5 + 32 : celsius;
  return `${Math.round(val)}°`;
}

/**
 * Returns raw numeric temperature in chosen unit
 */
export function getConvertedTemp(celsius, unit = 'C') {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return 0;
  return unit === 'F' ? Math.round((celsius * 9) / 5 + 32) : Math.round(celsius);
}

/**
 * Formats wind speed based on unit ('C' uses km/h, 'F' uses mph)
 */
export function formatWind(speedKmh, unit = 'C') {
  if (speedKmh === null || speedKmh === undefined || isNaN(speedKmh)) return '--';
  if (unit === 'F') {
    const mph = speedKmh * 0.621371;
    return `${Math.round(mph)} mph`;
  }
  return `${Math.round(speedKmh)} km/h`;
}

/**
 * Formats air pressure (hPa)
 */
export function formatPressure(hpa) {
  if (!hpa) return '--';
  return `${Math.round(hpa)} hPa`;
}

/**
 * UV index description and color classification
 */
export function getUVInfo(uv) {
  if (uv === null || uv === undefined || isNaN(uv)) {
    return { level: 'Normal', rating: 'N/A', color: 'text-slate-400', advice: 'No data' };
  }
  const val = Math.round(uv * 10) / 10;
  if (val <= 2) {
    return { level: 'Low', rating: val, color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/30', advice: 'Low risk. No sunglasses required.' };
  } else if (val <= 5) {
    return { level: 'Moderate', rating: val, color: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500/30', advice: 'Wear sunglasses & SPF 30+ outdoors.' };
  } else if (val <= 7) {
    return { level: 'High', rating: val, color: 'text-orange-400', bg: 'bg-orange-500/20 border-orange-500/30', advice: 'Cover up and seek shade during midday.' };
  } else if (val <= 10) {
    return { level: 'Very High', rating: val, color: 'text-rose-400', bg: 'bg-rose-500/20 border-rose-500/30', advice: 'Extra protection needed. Avoid midday sun.' };
  } else {
    return { level: 'Extreme', rating: val, color: 'text-purple-400', bg: 'bg-purple-500/20 border-purple-500/30', advice: 'Take full precautions. Avoid outdoor exposure.' };
  }
}

/**
 * Formats date to day name (e.g. "Monday", "Today")
 */
export function formatDay(dateStr, isToday = false) {
  if (isToday) return 'Today';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  } catch {
    return dateStr;
  }
}

/**
 * Formats full readable date (e.g., "Tuesday, Nov 4")
 */
export function formatFullDate(dateStr) {
  try {
    const d = dateStr ? new Date(dateStr) : new Date();
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * Formats 24h ISO string or hour number to 12h format (e.g., "2 PM", "Now")
 */
export function formatHour(hourStr, isNow = false) {
  if (isNow) return 'Now';
  try {
    const d = new Date(hourStr);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  } catch {
    return hourStr;
  }
}

/**
 * Formats time from ISO or HH:MM string to readable 12-hour time (e.g. "6:42 AM")
 */
export function formatTime12h(timeStr) {
  if (!timeStr) return '--:--';
  try {
    if (timeStr.includes('T')) {
      return new Date(timeStr).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
    const [h, m] = timeStr.split(':');
    const d = new Date();
    d.setHours(parseInt(h, 10), parseInt(m, 10));
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return timeStr;
  }
}

/**
 * Calculates current daylight progress percentage (0 - 100)
 */
export function getDaylightProgress(sunriseStr, sunsetStr) {
  try {
    const now = new Date();
    const sunrise = new Date(sunriseStr);
    const sunset = new Date(sunsetStr);

    if (now < sunrise) return 0;
    if (now > sunset) return 100;

    const total = sunset.getTime() - sunrise.getTime();
    const current = now.getTime() - sunrise.getTime();
    return Math.min(100, Math.max(0, Math.round((current / total) * 100)));
  } catch {
    return 50;
  }
}

/**
 * Converts degrees (0-360) into compass direction (e.g., N, NE, E)
 */
export function getWindDirection(deg) {
  if (deg === undefined || deg === null) return 'N';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}
