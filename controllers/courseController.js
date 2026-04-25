import pool from '../config/db.js';

//Course banao
export const createCourse = async (req, res) => {
  const { title, description, price, thumbnail_url } = req.body;
  const teacher_id = req.user.id; 

  try {
    const [result] = await pool.query(
      'INSERT INTO courses (teacher_id, title, description, price, thumbnail_url) VALUES (?, ?, ?, ?, ?)',
      [teacher_id, title, description, price || 0, thumbnail_url || null]
    );

    const [rows] = await pool.query('SELECT * FROM courses WHERE id = ?', [result.insertId]);
    return res.status(201).json(rows[0]);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all published courses 
export const getAllCourses = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, u.full_name AS teacher_name 
      FROM courses c
      JOIN users u ON c.teacher_id = u.id
      WHERE c.is_published = TRUE
    `);
    return res.status(200).json(rows);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get one course
export const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(`
      SELECT c.*, u.full_name AS teacher_name 
      FROM courses c
      JOIN users u ON c.teacher_id = u.id
      WHERE c.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.status(200).json(rows[0]);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get teacher's own courses
export const getMyCourses = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM courses WHERE teacher_id = ?',
      [req.user.id]
    );
    return res.status(200).json(rows);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update a course — teacher only
export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, thumbnail_url, is_published } = req.body;

  try {
   //Check ki teacher apna hi course update kare
    const [existing] = await pool.query(
      'SELECT * FROM courses WHERE id = ? AND teacher_id = ?',
      [id, req.user.id]
    );

    if (existing.length === 0) {
      return res.status(403).json({ message: 'Course not found or access denied' });
    }

    await pool.query(
      `UPDATE courses 
       SET title = ?, description = ?, price = ?, thumbnail_url = ?, is_published = ?
       WHERE id = ?`,
      [title, description, price, thumbnail_url, is_published, id]
    );

    const [rows] = await pool.query('SELECT * FROM courses WHERE id = ?', [id]);
    return res.status(200).json(rows[0]);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Apna hi course ek teacher hataye
export const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await pool.query(
      'SELECT * FROM courses WHERE id = ? AND teacher_id = ?',
      [id, req.user.id]
    );

    if (existing.length === 0) {
      return res.status(403).json({ message: 'Course not found or access denied' });
    }

    await pool.query('DELETE FROM courses WHERE id = ?', [id]);
    return res.status(200).json({ message: 'Course deleted successfully' });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};