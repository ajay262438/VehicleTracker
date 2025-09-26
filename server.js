const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.text({ type: '*/*' }));

// --- MODIFICATION START ---
let latestLocation = {
    latitude: 27.0001,
    longitude: 80.9203,
    gforce: 0.0,
    timestamp: new Date().toISOString(),
    isAcknowledged: true, // Start as 'true' (no active alert)
    crashTimestamp: null  // To store the time of the crash event
};
// --- MODIFICATION END ---


app.get('/location', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(latestLocation);
});

app.post('/location', (req, res) => {
    console.log(`--- New POST request received at ${new Date().toISOString()} ---`);
    console.log('RAW Request Body:', req.body);

    let data;
    try {
        data = JSON.parse(req.body);
    } catch (error) {
        console.error('JSON Parsing Error:', error.message);
        return res.status(400).send({ message: 'Bad JSON format' });
    }

    const { lat, lon, gforce } = data;

    if (typeof lat !== 'number' || typeof lon !== 'number') {
        return res.status(400).send({ message: 'Invalid data format.' });
    }

    latestLocation.latitude = lat;
    latestLocation.longitude = lon;
    latestLocation.gforce = typeof gforce === 'number' ? gforce : 0.0;
    latestLocation.timestamp = new Date().toISOString();

    // --- MODIFICATION START ---
    // If a significant impact is detected, trigger the alert state
    [cite_start]// This uses the same threshold as your device [cite: 12]
    if (latestLocation.gforce >= 2.5) { 
        console.log("CRASH EVENT DETECTED! Setting alert status to UNACKNOWLEDGED.");
        latestLocation.isAcknowledged = false;
        latestLocation.crashTimestamp = new Date().toISOString();
    }
    // --- MODIFICATION END ---
    
    console.log('Successfully updated location:', latestLocation);
    res.status(200).send({ message: 'Location updated successfully' });
});

// --- NEW ENDPOINT START ---
// New endpoint for the dashboard button to call
app.post('/acknowledge', (req, res) => {
    console.log("--- ACKNOWLEDGMENT RECEIVED ---");
    latestLocation.isAcknowledged = true;
    res.status(200).send({ message: 'Alert acknowledged successfully' });
});
// --- NEW ENDPOINT END ---


app.listen(PORT, () => {
    console.log(`Vehicle tracking server is running on port ${PORT}`);
});
