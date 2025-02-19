import { Router } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();


// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    const weatherData = await WeatherService.getWeatherForCity(city);
    
    await HistoryService.addCity(city);

    return res.status(200).json(weatherData);
  } catch (error) {
    return res.status(500).json({ error: 'Error retrieving weather data' });
  }
});

router.get('/history', async (_req, res) => {
  try {
    const cities = await HistoryService.getCities();
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving search history' });
  }
});

// BONUS
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await HistoryService.removeCity(Number(id));
    res.status(200).json({ message: 'City removed from history' });
  } catch (error) {
    res.status(500).json({ error: 'Error removing city from search history' });
  }
});

export default router;
