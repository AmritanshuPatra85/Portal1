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

// Hardcoded admin credentials (keep for now)
const ADMIN = {
  username: 'admin',
  password: 'admin123'
};

// Old hardcoded login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN.username || password !== ADMIN.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username }, SECRET, { expiresIn: '1d' });
  res.json({ token });
});

// New auth routes (register + login via DB)
app.use('/auth', authRoutes);

// Student can access their own data — must come BEFORE admin-protected route
app.get('/api/students/me', verifyToken, async (req, res) => {
  try {
    const email = req.user.email;
    const [rows] = await pool.execute(
      'SELECT * FROM students WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Student record not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Student saves their own profile for the first time
app.post('/api/students/me', verifyToken, async (req, res) => {
  try {
    const email = req.user.email;
    const { full_name, dob, course } = req.body;

    await pool.execute(
      'INSERT INTO students (full_name, email, dob, course, updated_by) VALUES (?, ?, ?, ?, ?)',
      [full_name, email, dob, course, email]
    );

    const [rows] = await pool.execute(
      'SELECT * FROM students WHERE email = ?',
      [email]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin only — must come AFTER /me
app.use('/api/students', verifyToken, requireRole('admin'), studentRoutes);

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
