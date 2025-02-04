import { Router } from 'express';
const router = Router();
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
    const cityName = req.body.city;
    try {
        // Fetch weather data using WeatherService
        const weatherData = await WeatherService.getWeatherForCity(cityName);
        // Save city to search history using HistoryService
        await HistoryService.addCity(cityName);
        res.json(weatherData);
    }
    catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});
// TODO: GET weather data from city name
router.get('/weather/:city', async (req, res) => {
    const cityName = req.params.city;
    try {
        // Fetch weather data using WeatherService
        const weatherData = await WeatherService.getWeatherForCity(cityName);
        // Save city to search history using HistoryService
        await HistoryService.addCity(cityName);
        res.json(weatherData);
    }
    catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});
// TODO: GET search history
router.get('/history', async (_req, res) => {
    try {
        const searchHistory = await HistoryService.getCities();
        res.json(searchHistory);
    }
    catch (error) {
        console.error('Error fetching search history:', error);
        res.status(500).json({ error: 'Failed to fetch search history' });
    }
});
// * BONUS TODO: DELETE city from search history
// router.delete('/history/:id', async (req: Request, res: Response) => {});
export default router;
