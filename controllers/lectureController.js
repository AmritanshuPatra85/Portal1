import pool from '../config/db.js';

// Add lecture to a module
export const createLecture = async (req, res) => {
  const { module_id, title, order_index, is_free } = req.body;

  try {
    // Verify module belongs to teacher's course
    const [module] = await pool.query(
      `SELECT m.* FROM modules m
       JOIN courses c ON m.course_id = c.id
       WHERE m.id = ? AND c.teacher_id = ?`,
      [module_id, req.user.id]
    );

    if (module.length === 0) {
      return res.status(403).json({ message: 'Module not found or access denied' });
    }

    const [result] = await pool.query(
      'INSERT INTO lectures (module_id, title, order_index, is_free) VALUES (?, ?, ?, ?)',
      [module_id, title, order_index, is_free || false]
    );

    const [rows] = await pool.query('SELECT * FROM lectures WHERE id = ?', [result.insertId]);
    return res.status(201).json(rows[0]);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all lectures for a module
export const getLectures = async (req, res) => {
  const { module_id } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM lectures WHERE module_id = ? ORDER BY order_index ASC',
      [module_id]
    );
    return res.status(200).json(rows);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update lecture
export const updateLecture = async (req, res) => {
  const { id } = req.params;
  const { title, order_index, is_free, duration_seconds } = req.body;

  try {
    const [lecture] = await pool.query(
      `SELECT l.* FROM lectures l
       JOIN modules m ON l.module_id = m.id
       JOIN courses c ON m.course_id = c.id
       WHERE l.id = ? AND c.teacher_id = ?`,
      [id, req.user.id]
    );

    if (lecture.length === 0) {
      return res.status(403).json({ message: 'Lecture not found or access denied' });
    }

    await pool.query(
      'UPDATE lectures SET title = ?, order_index = ?, is_free = ?, duration_seconds = ? WHERE id = ?',
      [title, order_index, is_free, duration_seconds, id]
    );

    const [rows] = await pool.query('SELECT * FROM lectures WHERE id = ?', [id]);
    return res.status(200).json(rows[0]);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete lecture
export const deleteLecture = async (req, res) => {
  const { id } = req.params;

  try {
    const [lecture] = await pool.query(
      `SELECT l.* FROM lectures l
       JOIN modules m ON l.module_id = m.id
       JOIN courses c ON m.course_id = c.id
       WHERE l.id = ? AND c.teacher_id = ?`,
      [id, req.user.id]
    );

    if (lecture.length === 0) {
      return res.status(403).json({ message: 'Lecture not found or access denied' });
    }

    await pool.query('DELETE FROM lectures WHERE id = ?', [id]);
    return res.status(200).json({ message: 'Lecture deleted successfully' });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};