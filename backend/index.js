// index.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse incoming JSON requests

// PostgreSQL connection pool setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Connect to PostgreSQL and handle errors
pool.connect((err) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Connected to PostgreSQL database');
  }
});

// Route to get all products
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Server Error');
  }
});

// Route to add a new product
app.post('/products', async (req, res) => {
  const { name, description, price, quantity } = req.body;

  // Validate input to ensure price and quantity are positive
  if (price <= 0 || quantity <= 0) {
    return res.status(400).json({ message: 'Price and quantity must be greater than 0.' });
  }

  try {
    await pool.query(
      'INSERT INTO products (name, description, price, quantity) VALUES ($1, $2, $3, $4)',
      [name, description, price, quantity]
    );
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).send('Server Error');
  }
});

// Route to update an existing product
app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity } = req.body;

  // Validate input to ensure price and quantity are positive
  if (price <= 0 || quantity <= 0) {
    return res.status(400).json({ message: 'Price and quantity must be greater than 0.' });
  }

  try {
    await pool.query(
      'UPDATE products SET name=$1, description=$2, price=$3, quantity=$4 WHERE id=$5',
      [name, description, price, quantity, id]
    );
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send('Server Error');
  }
});

// Route to delete a product
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM products WHERE id=$1', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send('Server Error');
  }
});

// Default route to confirm the API is running
app.get('/', (req, res) => {
  res.send('Welcome to the Product Management API!');
});

// Start the server on the specified port
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
