const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// Use a raw body parser to inspect what the ESP32 is sending
app.use(express.text({ type: '*/*' }));

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
    console.log(`--- New POST request received at ${new Date().toISOString()} ---`);
    console.log('RAW Request Body:', req.body); // Log the raw text

    let data;
    try {
        // We will now try to parse the raw text body as JSON
        data = JSON.parse(req.body);
    } catch (error) {
        console.error('JSON Parsing Error:', error.message);
        return res.status(400).send({ message: 'Bad JSON format' });
    }

    const { lat, lon, gforce } = data;

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
