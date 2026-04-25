import pool from '../config/db.js';

// Add module to a course
export const createModule = async (req, res) => {
  const { course_id, title, order_index } = req.body;

  try {
    // Verify course belongs to this teacher
    const [course] = await pool.query(
      'SELECT * FROM courses WHERE id = ? AND teacher_id = ?',
      [course_id, req.user.id]
    );

    if (course.length === 0) {
      return res.status(403).json({ message: 'Course not found or access denied' });
    }

    const [result] = await pool.query(
      'INSERT INTO modules (course_id, title, order_index) VALUES (?, ?, ?)',
      [course_id, title, order_index]
    );

    const [rows] = await pool.query('SELECT * FROM modules WHERE id = ?', [result.insertId]);
    return res.status(201).json(rows[0]);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all modules for a course
export const getModules = async (req, res) => {
  const { course_id } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM modules WHERE course_id = ? ORDER BY order_index ASC',
      [course_id]
    );
    return res.status(200).json(rows);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update module
export const updateModule = async (req, res) => {
  const { id } = req.params;
  const { title, order_index } = req.body;

  try {
    // Verify ownership via course
    const [module] = await pool.query(
      `SELECT m.* FROM modules m
       JOIN courses c ON m.course_id = c.id
       WHERE m.id = ? AND c.teacher_id = ?`,
      [id, req.user.id]
    );

    if (module.length === 0) {
      return res.status(403).json({ message: 'Module not found or access denied' });
    }

    await pool.query(
      'UPDATE modules SET title = ?, order_index = ? WHERE id = ?',
      [title, order_index, id]
    );

    const [rows] = await pool.query('SELECT * FROM modules WHERE id = ?', [id]);
    return res.status(200).json(rows[0]);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete module
export const deleteModule = async (req, res) => {
  const { id } = req.params;

  try {
    const [module] = await pool.query(
      `SELECT m.* FROM modules m
       JOIN courses c ON m.course_id = c.id
       WHERE m.id = ? AND c.teacher_id = ?`,
      [id, req.user.id]
    );

    if (module.length === 0) {
      return res.status(403).json({ message: 'Module not found or access denied' });
    }

    await pool.query('DELETE FROM modules WHERE id = ?', [id]);
    return res.status(200).json({ message: 'Module deleted successfully' });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};