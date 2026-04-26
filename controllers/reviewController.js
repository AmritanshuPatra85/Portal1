import pool from '../config/db.js';

export const createReview = async (req, res) => {
  const student_id = req.user.id;
  const { course_id, rating, comment } = req.body;

  // Rating must be between 1 and 5
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  // Check if student is enrolled
  const [[enrollment]] = await pool.query(
    'SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?',
    [student_id, course_id]
  );
  if (!enrollment) return res.status(403).json({ message: 'You must be enrolled to review this course' });

  // Check if student already reviewed this course
  const [[existing]] = await pool.query(
    'SELECT id FROM reviews WHERE student_id = ? AND course_id = ?',
    [student_id, course_id]
  );
  if (existing) return res.status(400).json({ message: 'You have already reviewed this course' });

  // Insert review
  await pool.query(
    'INSERT INTO reviews (student_id, course_id, rating, comment) VALUES (?, ?, ?, ?)',
    [student_id, course_id, rating, comment || null]
  );

  // Recalculate and update average rating on the course
  const [[{ avg_rating }]] = await pool.query(
    'SELECT AVG(rating) as avg_rating FROM reviews WHERE course_id = ?',
    [course_id]
  );
  await pool.query(
    'UPDATE courses SET average_rating = ? WHERE id = ?',
    [avg_rating, course_id]
  );

  res.status(201).json({ message: 'Review submitted successfully' });
};

export const getCourseReviews = async (req, res) => {
  const { course_id } = req.params;

  const [reviews] = await pool.query(
    `SELECT r.id, r.rating, r.comment, r.created_at, u.full_name
     FROM reviews r
     JOIN users u ON r.student_id = u.id
     WHERE r.course_id = ?
     ORDER BY r.created_at DESC`,
    [course_id]
  );

  res.json(reviews);
};