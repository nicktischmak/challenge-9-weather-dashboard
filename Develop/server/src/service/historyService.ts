import fs from 'fs';
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
  private historyFilePath: string = path.resolve(__dirname, 'searchHistory.json');

  private async read(): Promise<City[]> {
    try {
      const data = await fs.promises.readFile(this.historyFilePath, 'utf-8');
      return JSON.parse(data) as City[];
    } catch (err) {
      return [];
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    const data = JSON.stringify(cities, null, 2);
    await fs.promises.writeFile(this.historyFilePath, data, 'utf-8');
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  public async getCities(): Promise<City[]> {
    return await this.read();
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  public async addCity(cityName: string): Promise<void> {
    const cities = await this.read();
    const newCity = new City(Date.now().toString(), cityName);
    cities.push(newCity);
    await this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  public async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const updatedCities = cities.filter(city => city.id !== id);
    await this.write(updatedCities);
  }
}

export default new HistoryService();
