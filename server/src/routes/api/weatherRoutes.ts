import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
      const cityName = req.body.cityName;

      // Get weather data for the city
      const weatherData = await WeatherService.getWeatherForCity(cityName);

      // Save city to search history
      HistoryService.addCity(cityName);

      // Return weather data to the client
      res.json(weatherData);
  } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve weather data', error });
  }
});
  
// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
      const history = await HistoryService.getCities();
      return res.json(history);
  } catch (err) {
      res.status(500).json({ message: 'Failed to fetch search history', error: err });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const cityId = req.params.id;

  try {
      // Call HistoryService to delete city by ID
      await HistoryService.deleteCity(cityId);
      res.status(200).json({ message: `City with ID ${cityId} deleted successfully` });
  } catch (err) {
      res.status(500).json({ message: 'Failed to delete city from history', error: err });
  }
});

export default router;
