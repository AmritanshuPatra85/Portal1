import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import pool from './config/db.js';
import router from './routes/index.js';

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// All routes
app.use('/api', router);

// Test DB connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL Connected Successfully');
    connection.release();
  } catch (error) {
    console.log('MySQL Connection Failed:', error.message);
  }
};

testConnection();

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});