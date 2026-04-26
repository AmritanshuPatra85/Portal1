import pool from '../config/db.js';

// Check if student is enrolled
export const checkEnrollment = async (req, res) => {
  const { course_id } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?',
      [req.user.id, course_id]
    );

    return res.status(200).json({ enrolled: rows.length > 0 });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Enroll in a free course
export const enrollFree = async (req, res) => {
  const { course_id } = req.params;

  try {
    // Check if course exists and is free
    const [course] = await pool.query(
      'SELECT * FROM courses WHERE id = ? AND is_published = TRUE',
      [course_id]
    );

    if (course.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course[0].price > 0) {
      return res.status(400).json({ message: 'This is a paid course. Please complete payment.' });
    }

    // Check if already enrolled
    const [existing] = await pool.query(
      'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?',
      [req.user.id, course_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Already enrolled' });
    }

    // Create enrollment
    await pool.query(
      'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)',
      [req.user.id, course_id]
    );

    // Update total enrollments count on course
    await pool.query(
      'UPDATE courses SET total_enrollments = total_enrollments + 1 WHERE id = ?',
      [course_id]
    );

    return res.status(201).json({ message: 'Enrolled successfully' });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all courses a student is enrolled in
export const getMyEnrollments = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, u.full_name AS teacher_name, e.enrolled_at
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       JOIN users u ON c.teacher_id = u.id
       WHERE e.student_id = ?`,
      [req.user.id]
    );

    return res.status(200).json(rows);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};