const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('IT WORKS! The server is live on Render.');
});

app.listen(PORT, () => {
  console.log(`Hello World server running on port ${PORT}`);
});
