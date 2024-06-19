import express from 'express';
import fetch from 'node-fetch';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// OpenWeatherMap API endpoint
const apiKey = 'd53e387e630a81ad8ce58d3e76fb36e1';
const weatherBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Route to render the index page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle weather request
app.get('/weather', async (req, res) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ error: 'Location parameter is required' });
  }

  try {
    // Fetch weather data from the API
    const apiUrl = `${weatherBaseUrl}?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch weather data');
    }

    // Extract relevant data from the API response
    const weatherInfo = {
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      location: data.name,
      icon: data.weather[0].icon,
    };

    // Send weather data back to the client
    res.json(weatherInfo);
  } catch (error) {
    console.error('Error fetching weather:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
