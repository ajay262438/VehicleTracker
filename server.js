const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware to enable CORS and parse JSON bodies
app.use(cors());
app.use(express.json());

// This is a simple in-memory storage. 
// When the server restarts, the location will be reset.
let latestVehicleData = {
    latitude: 27.0001, // Default starting location
    longitude: 80.9203,
    gforce: 0.0,
    timestamp: new Date().toISOString()
};

// This is the endpoint our ESP32 will send data TO.
// It listens for POST requests at the path '/update'
app.post('/update', (req, res) => {
    console.log('Received data from vehicle:', req.body);
    
    // Basic validation to make sure we have the data we need
    if (req.body.latitude && req.body.longitude) {
        latestVehicleData = {
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            gforce: req.body.gforce || 0.0,
            timestamp: new Date().toISOString()
        };
        // Send a success response back to the ESP32
        res.status(200).json({ message: 'Data received successfully' });
    } else {
        // Send an error response if the data is incomplete
        res.status(400).json({ message: 'Invalid data format. Latitude and longitude are required.' });
    }
});

// This is the endpoint our web dashboard will get data FROM.
// It listens for GET requests at the path '/location'
app.get('/location', (req, res) => {
    res.status(200).json(latestVehicleData);
});

// Start the server
app.listen(port, () => {
    console.log(`Vehicle tracking server is running on http://localhost:${port}`);
});

