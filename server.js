const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1kb' })); // Use JSON parser with a small limit

// This will store the latest location data in memory
let latestLocation = {
    latitude: 27.0001,
    longitude: 80.9203,
    gforce: 0.0,
    timestamp: new Date().toISOString()
};

app.get('/location', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(latestLocation);
});

// This is the endpoint the ESP32 will call to POST new location data
app.post('/location', (req, res) => {
    // --- THIS IS THE FIX ---
    // Log the raw body that was received BEFORE we try to process it.
    console.log(`--- New POST request received at ${new Date().toISOString()} ---`);
    console.log('Request Body:', req.body);

    const { lat, lon, gforce } = req.body;

    if (typeof lat !== 'number' || typeof lon !== 'number') {
        console.log('Validation failed: lat or lon is not a number.');
        return res.status(400).send({ message: 'Invalid data format. requires numeric lat and lon.' });
    }

    latestLocation = {
        latitude: lat,
        longitude: lon,
        gforce: typeof gforce === 'number' ? gforce : 0.0,
        timestamp: new Date().toISOString()
    };
    
    console.log('Successfully updated location:', latestLocation);
    res.status(200).send({ message: 'Location updated successfully' });
});

app.listen(PORT, () => {
    console.log(`Vehicle tracking server is running on port ${PORT}`);
});

