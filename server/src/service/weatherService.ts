import dayjs, { type Dayjs } from 'dayjs';
import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: Dayjs | string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  iconDescription: string;
  constructor(
    city: string,
    date: Dayjs | string,
    tempF: number,
    windSpeed: number,
    humidity: number,
    icon: string,
    iconDescription: string
  ) {
    this.city = city;
    this.date = date;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.icon = icon;
    this.iconDescription = iconDescription;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  
  private baseURL?: string;

  private apiKey?: string;

  private city = '';

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';

    this.apiKey = process.env.API_KEY || '';
  }
  // * Note: The following methods are here as a guide, but you are welcome to provide your own solution.
  // * Just keep in mind the getWeatherForCity method is being called in your
  // * 09-Servers-and-APIs/02-Challenge/Develop/server/src/routes/api/weatherRoutes.ts file
  
  // * the array of Weather objects you are returning ultimately goes to
  // * 09-Servers-and-APIs/02-Challenge/Develop/client/src/main.ts

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const geoQuery = this.buildGeocodeQuery(query);
    const response = await fetch(geoQuery);
    return await response.json();
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      name: locationData.name,
      lat: locationData.lat,
      lon: locationData.lon,
      country: locationData.country,
      state: locationData.state,
    };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }

  // TODO: Create buildForecastQuery method
  private buildForecastQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(query: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(query);
    if (!locationData || !locationData[0]) {
      throw new Error('City not found');
    }
    return this.destructureLocationData(locationData[0]);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }
    return await response.json();
  }

  // TODO: Create fetchForecastData method
  private async fetchForecastData(coordinates: Coordinates) {
    const forecastQuery = this.buildForecastQuery(coordinates);
    const response = await fetch(forecastQuery);
    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.statusText}`);
    }
    return await response.json();
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    if (!response || !response.main || !response.weather || !response.weather[0]) {
      throw new Error('Invalid weather data structure received from API');
    }
    
    const currentWeather = new Weather(
      response.name || 'Unknown',
      dayjs().format('MM/DD/YYYY'),
      response.main.temp || 0,
      response.wind?.speed || 0,
      response.main.humidity || 0,
      response.weather[0].icon || '',
      response.weather[0].description || ''
    );
    return currentWeather;
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, forecastData: any): Weather[] {
    const forecastArray: Weather[] = [];
    
    // Check if forecast data is valid
    if (!forecastData || !forecastData.list || !Array.isArray(forecastData.list)) {
      console.warn('Invalid forecast data received');
      return forecastArray;
    }
    
    // The forecast API returns a list of forecasts every 3 hours (40 items total)
    // We need to extract one forecast per day for the next 5 days
    // We'll use forecasts at 12:00 PM (noon) for each day, or the closest available
    
    const today = dayjs().startOf('day');
    const forecastsByDay: { [key: string]: any } = {};
    
    // Group forecasts by day
    forecastData.list.forEach((item: any) => {
      if (!item || !item.dt_txt) return;
      
      const forecastDate = dayjs(item.dt_txt).startOf('day');
      const dayKey = forecastDate.format('YYYY-MM-DD');
      
      // Skip today's forecasts, we already have current weather
      if (forecastDate.isSame(today, 'day')) {
        return;
      }
      
      // Store the first forecast for each day (or prefer noon forecasts)
      if (!forecastsByDay[dayKey]) {
        forecastsByDay[dayKey] = item;
      } else {
        // Prefer forecasts closer to noon (12:00)
        const currentHour = dayjs(item.dt_txt).hour();
        const storedHour = dayjs(forecastsByDay[dayKey].dt_txt).hour();
        if (Math.abs(currentHour - 12) < Math.abs(storedHour - 12)) {
          forecastsByDay[dayKey] = item;
        }
      }
    });
    
    // Extract up to 5 days of forecasts
    const sortedDays = Object.keys(forecastsByDay).sort().slice(0, 5);
    
    sortedDays.forEach((dayKey) => {
      const item = forecastsByDay[dayKey];
      if (item && item.main && item.weather && item.weather[0]) {
        forecastArray.push(
          new Weather(
            currentWeather.city,
            dayjs(item.dt_txt).format('MM/DD/YYYY'),
            item.main.temp || 0,
            item.wind?.speed || 0,
            item.main.humidity || 0,
            item.weather[0].icon || '',
            item.weather[0].description || ''
          )
        );
      }
    });
    
    return forecastArray;
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.city = city;
    const locationData = await this.fetchAndDestructureLocationData(city);
    const [weatherData, forecastData] = await Promise.all([
      this.fetchWeatherData(locationData),
      this.fetchForecastData(locationData)
    ]);
    
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(currentWeather, forecastData);

    console.log(`Weather data retrieved for: ${this.city}`);
    
    // Return array format: [currentWeather, ...forecastItems] to match client expectations
    return [currentWeather, ...forecastArray];
  }
}

export default new WeatherService();
