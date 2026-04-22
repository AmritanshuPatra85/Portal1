import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import pool from './config/db.js';
import studentRoutes from './Control/routes.js';
import { verifyToken, SECRET } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Hardcoded admin credentials
const ADMIN = {
  username: 'admin',
  password: 'admin123'
};

// Login route — public, no token needed
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN.username || password !== ADMIN.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username }, SECRET, { expiresIn: '1d' });
  res.json({ token });
});

// Protected routes — verifyToken runs before any student route
app.use('/api/students', verifyToken, studentRoutes);

// Test DB Connection
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