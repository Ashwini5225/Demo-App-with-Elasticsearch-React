const express = require('express');
const { Client } = require('@elastic/elasticsearch');

// Initialize the Express app
const app = express();
const port = 3000;

// Set up Elasticsearch client
const client = new Client({ node: 'http://localhost:9200' });

// Middleware to parse JSON bodies
app.use(express.json());

// Sample health check route for Elasticsearch
app.get('/health', async (req, res) => {
  try {
    const response = await client.cluster.health();
    res.json({ status: response.body.status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect to Elasticsearch' });
  }
});

// Basic route for the homepage
app.get('/', (req, res) => {
  res.send('Welcome to the Demo App');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
