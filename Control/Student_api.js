import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// POST - Add Student
router.post('/addStudents', async (req, res) => {
  try {
    const { full_name, email, dob, course, updated_by } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO students (full_name, email, dob, course, updated_by) 
       VALUES (?, ?, ?, ?, ?)`,
      [full_name, email, dob, course, updated_by]
    );

    res.status(201).json({ 
      message: 'Student added successfully', 
      studentId: result.insertId 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//Edit Karo-PUT 

router.put('/editStudent/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, dob, course, updated_by } = req.body;

    const [result] = await pool.execute(
      `UPDATE students SET full_name = ?, email = ?, dob = ?, course = ?, updated_by = ? 
       WHERE id = ?`,
      [full_name, email, dob, course, updated_by, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student updated successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// GET - Get All Students
router.get('/getStudents', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM students');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Get Single Student
router.get('/getStudent/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM students WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE - Delete Student
router.delete('/deleteStudent/:id', async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM students WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;