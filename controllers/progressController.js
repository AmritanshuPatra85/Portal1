import pool from '../config/db.js';


export const markProgress = async (req, res) => {
  const student_id = req.user.id;
  const { lecture_id, watched_seconds, total_seconds } = req.body;

  if (!lecture_id || watched_seconds == null || !total_seconds) {
    return res.status(400).json({ message: 'lecture_id, watched_seconds, total_seconds are required' });
  }
//>90% means mark as complete

  const is_completed = watched_seconds / total_seconds >= 0.9 ? 1 : 0;

  const sql = `
    INSERT INTO progress (student_id, lecture_id, watched_seconds, is_completed)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      watched_seconds = VALUES(watched_seconds),
      is_completed = GREATEST(is_completed, VALUES(is_completed)),
      last_watched = CURRENT_TIMESTAMP
  `;

  await pool.query(sql, [student_id, lecture_id, watched_seconds, is_completed]);
  res.json({ message: 'Progress saved', is_completed: !!is_completed });
};

// Returns all lecture progress for a student in a specific course
export const getCourseProgress = async (req, res) => {
  const student_id = req.user.id;
  const { course_id } = req.params;

  const sql = `
    SELECT p.lecture_id, p.watched_seconds, p.is_completed, p.last_watched
    FROM progress p
    JOIN lectures l ON p.lecture_id = l.id
    JOIN modules m ON l.module_id = m.id
    WHERE p.student_id = ? AND m.course_id = ?
  `;

  const [rows] = await pool.query(sql, [student_id, course_id]);
  res.json(rows);
};