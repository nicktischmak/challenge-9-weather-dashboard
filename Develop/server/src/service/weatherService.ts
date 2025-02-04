import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}

// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;

  constructor(temperature: number, humidity: number, windSpeed: number, condition: string) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.condition = condition;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor(baseURL: string, apiKey: string, cityName: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
    this.cityName = cityName;
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    try {
      const response = await axios.get(`${this.baseURL}/geo/1.0/direct`, {
        params: {
          q: query,
          appid: this.apiKey,
        },
      });
      const data = response.data[0];
      return {
        latitude: data.lat,
        longitude: data.lon,
      };
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw error;
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { latitude, longitude } = locationData;
    return { latitude, longitude };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const query = `${this.baseURL}/geo/1.0/direct?q=${encodeURIComponent(this.cityName)}&appid=${this.apiKey}`;
    return query;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const query = `${this.baseURL}/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`;
    return query;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    try {
      const locationData = await this.fetchLocationData(this.cityName);
      return this.destructureLocationData(locationData);
    } catch (error) {
      console.error('Error fetching and destructuring location data:', error);
      throw error;
    }
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}/weather`, {
        params: {
          lat: coordinates.latitude,
          lon: coordinates.longitude,
          appid: this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const temperature = response.main.temp;
    const humidity = response.main.humidity;
    const windSpeed = response.wind.speed;
    const condition = response.weather[0].description;

    return new Weather(temperature, humidity, windSpeed, condition);
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecastArray: Weather[] = weatherData.map((data: any) => {
      const temperature = data.main.temp;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;
      const condition = data.weather[0].description;

      return new Weather(temperature, humidity, windSpeed, condition);
    });

    forecastArray.unshift(currentWeather);

    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather[]> {
    try {
      const locationData = await this.fetchLocationData(city);
      const coordinates = this.destructureLocationData(locationData);
      const weatherResponse = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherResponse);
      const forecastArray = this.buildForecastArray(currentWeather, weatherResponse.list);

      return forecastArray;
    } catch (error) {
      console.error('Error getting weather for city:', error);
      throw error;
    }
  }
}

export default new WeatherService(
  'https://api.openweathermap.org/data/2.5',
  process.env.WEATHER_API_KEY || '',
  'New York'
);
