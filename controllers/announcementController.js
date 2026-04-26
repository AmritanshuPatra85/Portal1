import pool from '../config/db.js';

export const createAnnouncement = async (req, res) => {
  const sender_id = req.user.id;
  const role = req.user.role;
  const { title, message, target, course_id } = req.body;

  // Teachers can only send course announcements
  if (role === 'teacher') {
    if (target !== 'course' || !course_id) {
      return res.status(400).json({ message: 'Teachers can only announce to their own course' });
    }

    // Verify course belongs to this teacher
    const [[course]] = await pool.query(
      'SELECT id FROM courses WHERE id = ? AND teacher_id = ?',
      [course_id, sender_id]
    );
    if (!course) return res.status(403).json({ message: 'You do not own this course' });
  }

  await pool.query(
    'INSERT INTO announcements (sender_id, target, course_id, title, message) VALUES (?, ?, ?, ?, ?)',
    [sender_id, target, course_id || null, title, message]
  );

  res.status(201).json({ message: 'Announcement created' });
};

export const getCourseAnnouncements = async (req, res) => {
  const student_id = req.user.id;
  const { course_id } = req.params;

  // Verify student is enrolled in this course
  const [[enrollment]] = await pool.query(
    'SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?',
    [student_id, course_id]
  );
  if (!enrollment) return res.status(403).json({ message: 'You are not enrolled in this course' });

  const [announcements] = await pool.query(
    'SELECT * FROM announcements WHERE course_id = ? ORDER BY created_at DESC',
    [course_id]
  );

  res.json(announcements);
};

export const getAllAnnouncements = async (req, res) => {
  const [announcements] = await pool.query(
    'SELECT * FROM announcements ORDER BY created_at DESC'
  );
  res.json(announcements);
};