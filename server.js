const express = require('express');
const cors = require('cors'); // Re-adding CORS
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// This will store the latest location data in memory
let latestLocation = {
    latitude: 27.0001, // Default starting latitude
    longitude: 80.9203, // Default starting longitude
    gforce: 0.0,
    timestamp: new Date().toISOString()
};

// Endpoint for the WEB BROWSER to GET the location
app.get('/location', (req, res) => {
    res.json(latestLocation);
});

// Endpoint for the ESP32 to POST new location data
app.post('/location', (req, res) => {
    const { lat, lon, gforce } = req.body;

    if (lat === undefined || lon === undefined) {
        // G-force is optional for periodic updates
        return res.status(400).send({ message: 'Invalid data format. Requires lat and lon.' });
    }

    latestLocation = {
        latitude: lat,
        longitude: lon,
        gforce: gforce || latestLocation.gforce, // Keep old gforce if not provided
        timestamp: new Date().toISOString()
    };
    
    console.log('Received new location:', latestLocation);
    res.status(200).send({ message: 'Location received' });
});

app.listen(PORT, () => {
    console.log(`Vehicle tracking server is running on port ${PORT}`);
});

