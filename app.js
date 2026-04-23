import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import pool from './config/db.js';
import studentRoutes from './Control/routes.js';
import { verifyToken, SECRET, requireRole } from './middleware/auth.js';
import authRoutes from './Control/authRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Hardcoded admin credentials (temporary)
const ADMIN = {
  username: 'admin',
  password: 'admin123'
};

// Old login (keep for testing)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN.username || password !== ADMIN.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username }, SECRET, { expiresIn: '1d' });
  res.json({ token });
});

// Auth routes (DB based)
app.use('/auth', authRoutes);

// ---------------- USER ROUTES ----------------

// Get own student data
app.get('/api/students/me', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM students WHERE user_id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Student record not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create student profile
app.post('/api/students/me', verifyToken, async (req, res) => {
  try {
    const { full_name, dob, course } = req.body;
    const { id, email } = req.user;

    await pool.execute(
      'INSERT INTO students (full_name, email, dob, course, updated_by, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [full_name, email, dob, course, email, id]
    );

    const [rows] = await pool.execute(
      'SELECT * FROM students WHERE user_id = ?',
      [id]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ---------------- ADMIN ROUTES ----------------

// MUST be after /me routes
app.use('/api/students', verifyToken, requireRole('admin'), studentRoutes);

// ---------------- SERVER ----------------

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