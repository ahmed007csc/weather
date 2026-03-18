const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Get available countries
app.get('/api/countries', (req, res) => {
    db.all("SELECT DISTINCT country FROM locations ORDER BY country ASC", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows.map(row => row.country));
    });
});

// Get cities for a specific country
app.get('/api/cities/:country', (req, res) => {
    const country = req.params.country;
    db.all("SELECT id, city, latitude, longitude FROM locations WHERE country = ? ORDER BY city ASC", [country], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Proxy weather data from Open-Meteo
app.get('/api/weather', async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
        return res.status(400).json({ error: "lat and lon are required" });
    }
    
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Open-Meteo API returned access error: ${response.status}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching weather:", error);
        res.status(500).json({ error: "Could not fetch weather data from external API" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
