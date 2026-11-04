# Atmosphere — Modern Weather Web Application

A responsive, high-performance weather web application built with **React**, **Vite**, **Tailwind CSS**, **Framer Motion**, and **Lucide React**.

---

## Key Features

### 1. Multi-Brand Switcher
Switch between three branding aesthetics at runtime via the header toggle:
- **SkyCast**: Sleek, deep-space aesthetic featuring dark cosmic gradients (`#050814`), futuristic HUD accents, and neon cyan/violet glowing borders.
- **Weatherly**: Clean, minimalist pastel theme with soft powder blues, light airy typography, and gentle frosted milk-glass card borders.
- **CloudCheck**: Dynamic, weather-reactive UI that adapts its atmospheric gradients, ambient lighting, and backdrop automatically based on live conditions (golden sunburst for clear skies, cool slate for rain, electric violet for thunderstorms, icy glacial blue for snow).

### 2. Core Weather Features
- **Search Bar with Geocoding**: Real-time debounced auto-complete city search, recent search history persisted to `localStorage`, popular quick-pick cities, and keyboard navigation.
- **HTML5 Geolocation**: "Current Location" button to auto-detect the user's location via browser GPS and reverse geocoding.
- **Current Weather Hero Card**: Displays location, country, local time, bold temperature display with instant °C/°F toggle, "Feels like", daily high/low range, condition badge, and quick indicators for humidity, wind, UV index, and air pressure.
- **Interactive Weather Visuals**: Animated Sun with rotating rays & solar corona, layered drifting clouds, falling rain drops with puddle splashes, flashing lightning bolts, fluttering snowflakes, and rolling fog banks using Framer Motion and SVG.
- **24-Hour Hourly Forecast**: Smooth horizontal scrollable timeline displaying hourly temperatures, condition visuals, rain probability percentage, and wind speed.
- **7-Day Expandable Forecast**: Daily forecast list featuring condition badges, visual temperature range distribution bars, and collapsible accordion panels with precipitation totals, peak UV index, sunrise/sunset, and wind gust details.
- **Atmospheric Metrics Grid**: Dedicated cards for UV index gauge with protection guidance, Wind compass needle with angle rotation, Sunrise & Sunset with daylight progress arc, Humidity & Dew Point, Barometric Pressure, and Visibility.
- **Error & Loading States**: Glassmorphic loading skeletons and user-friendly error banners with retry capabilities.

---

## Dual API Architecture (Zero-Setup Live Data + OpenWeatherMap)

The application provides a seamless dual-provider architecture:
1. **Out-of-the-Box Live Meteorological Data**: Uses Open-Meteo & Geocoding APIs by default. No API key or registration is required to start searching any city globally right away.
2. **OpenWeatherMap Integration**: Supports standard OpenWeatherMap 2.5 / 3.0 OneCall endpoints. Simply add your key in `.env` or paste it directly in the in-app **API Key Modal**.

### Setting Up OpenWeatherMap (Optional)

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Insert your OpenWeatherMap API key:
   ```env
   VITE_WEATHER_API_KEY=your_openweathermap_api_key_here
   ```
3. Restart the development server.

---

## Project Structure

```
├── .env.example
├── .env
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── Header.jsx                 # Multi-brand theme switcher + °C/°F toggle
    │   ├── SearchBar.jsx              # City geocoding, search history, geolocation
    │   ├── CurrentWeatherCard.jsx     # Hero weather card with large temp & quick metrics
    │   ├── HourlyForecast.jsx         # 24-hour horizontal scrollable card
    │   ├── WeeklyForecast.jsx         # 7-day expandable accordion forecast
    │   ├── WeatherMetricsGrid.jsx     # UV, Wind compass, Sun schedule, Pressure, Humidity
    │   ├── AnimatedWeatherVisual.jsx  # Framer Motion animated weather graphics
    │   ├── DynamicBackground.jsx      # Theme & condition-reactive background canvas
    │   ├── ApiKeyModal.jsx            # In-app API key configuration dialog
    │   ├── ErrorBanner.jsx            # Friendly error alert with retry
    │   └── WeatherSkeleton.jsx        # Glassmorphic skeleton loader
    ├── context/
    │   ├── ThemeContext.jsx           # Brand theme management (SkyCast, Weatherly, CloudCheck)
    │   └── WeatherContext.jsx         # Meteorological data, units, history & geolocation state
    ├── services/
    │   ├── weatherService.js          # Unified provider (OpenWeatherMap + Open-Meteo fallback)
    │   └── weatherCodeMapper.js       # WMO & OWM weather code normalization
    └── utils/
        ├── formatters.js              # Unit conversion (°C/°F), dates, wind speed, UV ratings
        └── storage.js                 # Safe localStorage persistence
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```
