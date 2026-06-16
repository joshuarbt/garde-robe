export type WeatherLocation = {
  latitude: number;
  longitude: number;
  label: string;
};

export type DayForecast = {
  date: string;
  tempMin: number;
  tempMax: number;
  weatherCode: number;
  label: string;
  icon: string;
};

export type CitySearchResult = {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
};

export type WeatherActionResult =
  | { success: true }
  | { success: false; error: string };
