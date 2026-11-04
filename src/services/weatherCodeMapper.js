/**
 * Maps WMO Weather Interpretation Codes (0-99) and OpenWeatherMap weather IDs
 * into unified condition identifiers, human labels, and visual configurations.
 */

export const CONDITION_TYPES = {
  CLEAR: 'clear',
  PARTLY_CLOUDY: 'partly-cloudy',
  CLOUDY: 'cloudy',
  FOG: 'fog',
  DRIZZLE: 'drizzle',
  RAIN: 'rain',
  THUNDERSTORM: 'thunderstorm',
  SNOW: 'snow',
};

/**
 * Maps WMO weather code (Open-Meteo) to standard condition object
 */
export function mapWmoCode(code, isDay = 1) {
  const wmo = Number(code);
  switch (wmo) {
    case 0:
      return {
        type: CONDITION_TYPES.CLEAR,
        label: isDay ? 'Clear Sky' : 'Clear Night',
        icon: isDay ? 'Sun' : 'Moon',
        description: isDay ? 'Bright and sunny skies' : 'Starlit clear skies',
      };
    case 1:
      return {
        type: CONDITION_TYPES.CLEAR,
        label: isDay ? 'Mainly Clear' : 'Mainly Clear',
        icon: isDay ? 'SunMedium' : 'Moon',
        description: 'Mostly clear with faint haze',
      };
    case 2:
      return {
        type: CONDITION_TYPES.PARTLY_CLOUDY,
        label: 'Partly Cloudy',
        icon: isDay ? 'CloudSun' : 'CloudMoon',
        description: 'Scattered clouds and pleasant breaks',
      };
    case 3:
      return {
        type: CONDITION_TYPES.CLOUDY,
        label: 'Overcast',
        icon: 'Cloud',
        description: 'Dense overcast cloud cover',
      };
    case 45:
    case 48:
      return {
        type: CONDITION_TYPES.FOG,
        label: wmo === 48 ? 'Depositing Rime Fog' : 'Foggy Mist',
        icon: 'CloudFog',
        description: 'Reduced visibility with low ground mist',
      };
    case 51:
    case 53:
    case 55:
      return {
        type: CONDITION_TYPES.DRIZZLE,
        label: wmo === 51 ? 'Light Drizzle' : wmo === 53 ? 'Moderate Drizzle' : 'Dense Drizzle',
        icon: 'CloudDrizzle',
        description: 'Fine moisture droplets falling gently',
      };
    case 56:
    case 57:
      return {
        type: CONDITION_TYPES.DRIZZLE,
        label: 'Freezing Drizzle',
        icon: 'CloudDrizzle',
        description: 'Freezing mist and icy droplets',
      };
    case 61:
    case 63:
    case 65:
      return {
        type: CONDITION_TYPES.RAIN,
        label: wmo === 61 ? 'Slight Rain' : wmo === 63 ? 'Moderate Rain' : 'Heavy Rain',
        icon: 'CloudRain',
        description: wmo === 65 ? 'Heavy downpours expected' : 'Continuous rain showers',
      };
    case 66:
    case 67:
      return {
        type: CONDITION_TYPES.RAIN,
        label: 'Freezing Rain',
        icon: 'CloudRain',
        description: 'Cold rain freezing on surface contact',
      };
    case 71:
    case 73:
    case 75:
      return {
        type: CONDITION_TYPES.SNOW,
        label: wmo === 71 ? 'Slight Snow' : wmo === 73 ? 'Moderate Snow' : 'Heavy Snowfall',
        icon: 'CloudSnow',
        description: 'Crisp white snow accumulation',
      };
    case 77:
      return {
        type: CONDITION_TYPES.SNOW,
        label: 'Snow Grains',
        icon: 'CloudSnow',
        description: 'Delicate frozen crystal grains',
      };
    case 80:
    case 81:
    case 82:
      return {
        type: CONDITION_TYPES.RAIN,
        label: wmo === 82 ? 'Violent Showers' : 'Rain Showers',
        icon: 'CloudRainWind',
        description: 'Passing intense localized showers',
      };
    case 85:
    case 86:
      return {
        type: CONDITION_TYPES.SNOW,
        label: 'Snow Showers',
        icon: 'CloudSnow',
        description: 'Intermittent snow squalls',
      };
    case 95:
      return {
        type: CONDITION_TYPES.THUNDERSTORM,
        label: 'Thunderstorm',
        icon: 'CloudLightning',
        description: 'Active lightning with rumbling thunder',
      };
    case 96:
    case 99:
      return {
        type: CONDITION_TYPES.THUNDERSTORM,
        label: 'Severe Storm with Hail',
        icon: 'CloudLightning',
        description: 'Severe thunderstorm accompanied by hail',
      };
    default:
      return {
        type: CONDITION_TYPES.PARTLY_CLOUDY,
        label: 'Partly Cloudy',
        icon: 'CloudSun',
        description: 'Variable cloudiness throughout the day',
      };
  }
}

/**
 * Maps OpenWeatherMap code (e.g. 200, 500, 800) to standard condition object
 */
export function mapOwmCode(code, iconId = '01d', description = '') {
  const isDay = iconId.includes('d');
  const c = Number(code);

  if (c >= 200 && c < 300) {
    return {
      type: CONDITION_TYPES.THUNDERSTORM,
      label: description ? capitalize(description) : 'Thunderstorm',
      icon: 'CloudLightning',
      description: 'Atmospheric storm with lightning activity',
    };
  }
  if (c >= 300 && c < 400) {
    return {
      type: CONDITION_TYPES.DRIZZLE,
      label: description ? capitalize(description) : 'Drizzle',
      icon: 'CloudDrizzle',
      description: 'Gentle mist and fine precipitation',
    };
  }
  if (c >= 500 && c < 600) {
    return {
      type: CONDITION_TYPES.RAIN,
      label: description ? capitalize(description) : 'Rain Showers',
      icon: c >= 502 ? 'CloudRainWind' : 'CloudRain',
      description: 'Steady rain showers across the region',
    };
  }
  if (c >= 600 && c < 700) {
    return {
      type: CONDITION_TYPES.SNOW,
      label: description ? capitalize(description) : 'Snow',
      icon: 'CloudSnow',
      description: 'Cold winter snow flurries',
    };
  }
  if (c >= 700 && c < 800) {
    return {
      type: CONDITION_TYPES.FOG,
      label: description ? capitalize(description) : 'Atmospheric Mist',
      icon: 'CloudFog',
      description: 'Low visibility mist and atmospheric haze',
    };
  }
  if (c === 800) {
    return {
      type: CONDITION_TYPES.CLEAR,
      label: isDay ? 'Clear Sky' : 'Clear Night',
      icon: isDay ? 'Sun' : 'Moon',
      description: isDay ? 'Unclouded, bright sunlight' : 'Crisp starry night',
    };
  }
  // 801 - 804 clouds
  if (c === 801 || c === 802) {
    return {
      type: CONDITION_TYPES.PARTLY_CLOUDY,
      label: capitalize(description || 'Partly Cloudy'),
      icon: isDay ? 'CloudSun' : 'CloudMoon',
      description: 'Comfortable scattered cloud coverage',
    };
  }
  return {
    type: CONDITION_TYPES.CLOUDY,
    label: capitalize(description || 'Overcast'),
    icon: 'Cloud',
    description: 'Thick overcast covering the skies',
  };
}

function capitalize(str) {
  if (!str) return '';
  return str
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
