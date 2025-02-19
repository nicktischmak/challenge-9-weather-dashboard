import dotenv from 'dotenv';

dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;

  constructor(temperature: number, humidity: number, windSpeed: number, description: string) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.description = description;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
    // TODO: Define the baseURL, API key, and city name properties
  private baseURL = process.env.BASE_URL;
  private apiKey = process.env.API_KEY;

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${this.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return this.destructureLocationData(data);
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    const { coord: { lat, lon } } = locationData;
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {
  //   const query = `${this.baseURL}/geo/1.0/direct?q=${encodeURIComponent(this.city)}&appid=${this.apiKey}`;
  //   return query;
  // }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData(): Promise<Coordinates> {
  //   try {
  //     const locationData = await this.fetchLocationData(this.city);
  //     return this.destructureLocationData(locationData);
  //   } catch (error) {
  //     console.error('Error fetching and destructuring location data:', error);
  //     throw error;
  //   }
  // }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const url = `${this.baseURL}?${weatherQuery}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any): Weather {
  //   const temperature = response.main.temp;
  //   const humidity = response.main.humidity;
  //   const windSpeed = response.wind.speed;
  //   const description = response.weather[0].description;

  //   return new Weather(temperature, humidity, windSpeed, description);
  // }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]): Weather[] {
    const forecastArray: Weather[] = weatherData.map((data: any) => {
      const { main, weather, wind } = data;
      const { temp, humidity } = main;
      const { description } = weather[0];
      const { speed: windSpeed } = wind;
      return new Weather(temp, humidity, description, windSpeed);
    });
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  public async getWeatherForCity(city: string): Promise<Weather[]> {
    const coordinates = await this.fetchLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const forecastArray = this.buildForecastArray(weatherData.list);
    return forecastArray;
  }
}

export default new WeatherService();
