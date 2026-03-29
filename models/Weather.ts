import { ObjectId } from 'mongodb';

// ─── Sub-types ────────────────────────────────────────────────────────────────

export interface IWeatherLocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

export interface IWeatherCondition {
  text: string;
  icon: string;
  code: number;
}

export interface IWeatherCurrent {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;               // 1 = day, 0 = night
  condition: IWeatherCondition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;             // percentage
  cloud: number;                // percentage
  feelslike_c: number;
  feelslike_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
}

export interface IWeatherAirQuality {
  co: number;                   // Carbon Monoxide μg/m3
  o3: number;                   // Ozone μg/m3
  no2: number;                  // Nitrogen dioxide μg/m3
  so2: number;                  // Sulphur dioxide μg/m3
  pm2_5: number;                // PM2.5 μg/m3
  pm10: number;                 // PM10 μg/m3
  'us-epa-index': number;       // 1=Good … 6=Hazardous
  'gb-defra-index': number;
}

// ── Forecast day sub-types ──────────────────────────────────────────────────

export interface IForecastDay {
  maxtemp_c: number;
  maxtemp_f: number;
  mintemp_c: number;
  mintemp_f: number;
  avgtemp_c: number;
  avgtemp_f: number;
  maxwind_mph: number;
  maxwind_kph: number;
  totalprecip_mm: number;
  totalprecip_in: number;
  totalsnow_cm: number;
  avgvis_km: number;
  avgvis_miles: number;
  avghumidity: number;
  daily_will_it_rain: number;   // 1 or 0
  daily_chance_of_rain: number; // percentage
  daily_will_it_snow: number;
  daily_chance_of_snow: number;
  condition: IWeatherCondition;
  uv: number;
}

export interface IForecastAstro {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moon_phase: string;
  moon_illumination: number;
  is_moon_up: number;
  is_sun_up: number;
}

export interface IForecastHour {
  time_epoch: number;
  time: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: IWeatherCondition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  precip_mm: number;
  precip_in: number;
  snow_cm: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  windchill_c: number;
  windchill_f: number;
  heatindex_c: number;
  heatindex_f: number;
  dewpoint_c: number;
  dewpoint_f: number;
  will_it_rain: number;
  chance_of_rain: number;
  will_it_snow: number;
  chance_of_snow: number;
  vis_km: number;
  vis_miles: number;
  gust_mph: number;
  gust_kph: number;
  uv: number;
}

export interface IForecastForecastDay {
  date: string;
  date_epoch: number;
  day: IForecastDay;
  astro: IForecastAstro;
  hour: IForecastHour[];
}

// ─── Root document ────────────────────────────────────────────────────────────

export interface IWeather {
  _id?: ObjectId;
  query: string;
  location: IWeatherLocation;
  current: IWeatherCurrent;
  air_quality?: IWeatherAirQuality;
  forecast?: IForecastForecastDay[];
  forecast_days: number;
  source: string;
  fetchedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreateWeatherDTO = Omit<IWeather, '_id' | 'createdAt' | 'updatedAt'>;