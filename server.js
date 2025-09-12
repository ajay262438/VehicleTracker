const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// This will store the latest location data in memory
let latestLocation = {
    latitude: 27.0001, // Default starting latitude
    longitude: 80.9203, // Default starting longitude
    gforce: 0.0,
    timestamp: new Date().toISOString()
};

// This is the endpoint the WEB BROWSER will call to GET the location
app.get('/location', (req, res) => {
    // --- THE FIX IS HERE ---
    // Add headers to prevent caching on the browser and on network proxies
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1.
    res.setHeader('Pragma', 'no-cache'); // HTTP 1.0.
    res.setHeader('Expires', '0'); // Proxies.

    res.json(latestLocation);
});

// This is the endpoint the ESP32 will call to POST new location data
app.post('/location', (req, res) => {
    const { lat, lon, gforce } = req.body;

    if (lat === undefined || lon === undefined) {
        return res.status(400).send({ message: 'Invalid data format. requires lat and lon.' });
    }

    latestLocation = {
        latitude: lat,
        longitude: lon,
        gforce: gforce || 0.0, // Default gforce to 0 if not provided
        timestamp: new Date().toISOString()
    };
    
    console.log('Received new location:', latestLocation);
    res.status(200).send({ message: 'Location received' });
});

app.listen(PORT, () => {
    console.log(`Vehicle tracking server is running on port ${PORT}`);
});

