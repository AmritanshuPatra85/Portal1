import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { SECRET } from '../middleware/auth.js';

const router = express.Router();

// Register karo 
router.post('/register', async (req, res) => {
  const { full_name, email, password, role } = req.body;

  try {
    // User pehlse se registered hai ki nhi dekhiyo
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash kardo
    const hashedPassword = await bcrypt.hash(password, 10);
                                                                                           
    // Save karlo
    await pool.query(
      'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
      [full_name, email, hashedPassword, role || 'student']
    );

    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login karenge ab yaha sw
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    console.log('rows found:', rows.length);
console.log('email received:', email);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];

    // Check if user is banned
    if (user.is_banned) {
      return res.status(403).json({ message: 'Your account has been banned' });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    console.log('password match:', match);
console.log('input password:', password);
console.log('stored hash:', user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token with role
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, role: user.role });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
