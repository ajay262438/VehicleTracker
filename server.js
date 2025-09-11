const express = require('express');
const cors = require('cors');
const app = express();
// Render provides the PORT environment variable.
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
    res.json(latestLocation);
});

// This is the endpoint the ESP32 will call to POST new location data
app.post('/location', (req, res) => {
    const { lat, lon, gforce } = req.body;

    if (lat === undefined || lon === undefined || gforce === undefined) {
        return res.status(400).send({ message: 'Invalid data format. requires lat, lon, and gforce.' });
    }

    latestLocation = {
        latitude: lat,
        longitude: lon,
        gforce: gforce,
        timestamp: new Date().toISOString()
    };
    
    console.log('Received new location:', latestLocation);
    res.status(200).send({ message: 'Location received' });
});

// --- THE FIX IS HERE ---
// We need to tell the server to listen on host '0.0.0.0' to be accessible from the internet.
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vehicle tracking server is running and listening on port ${PORT}`);
});

