import { promises as fs } from 'fs';
import path from 'path';

// TODO: Define a City class with name and id properties
class City {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<any> {
    try {
      const filePath = path.join(__dirname, 'searchHistory.json');
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading search history:', error);
      throw error;
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    try {
      const filePath = path.join(__dirname, 'searchHistory.json');
      const data = JSON.stringify(cities, null, 2);
      await fs.writeFile(filePath, data, 'utf-8');
    } catch (error) {
      console.error('Error writing search history:', error);
      throw error;
    }
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    try {
      const data = await this.read();
      return data.map((city: any) => new City(city.id, city.name));
    } catch (error) {
      console.error('Error getting cities:', error);
      throw error;
    }
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string): Promise<void> {
    try {
      const cities = await this.read();
      if (!cities.includes(city)) {
        cities.push(city);
        await this.write(cities);
      }
    } catch (error) {
      console.error('Error adding city:', error);
      throw error;
    }
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
}

export default new HistoryService();