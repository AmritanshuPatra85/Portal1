import pool from '../config/db.js';

export const getAllUsers = async (req, res) => {
  const [users] = await pool.query(
    'SELECT id, full_name, email, role, is_banned, created_at FROM users ORDER BY created_at DESC'
  );
  res.json(users);
};

export const toggleBan = async (req, res) => {
  const { user_id } = req.params;

  // Get current ban status
  const [[user]] = await pool.query('SELECT is_banned, role FROM users WHERE id = ?', [user_id]);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === 'admin') return res.status(400).json({ message: 'Cannot ban an admin' });

  // Flip the ban status
  const newStatus = user.is_banned ? 0 : 1;
  await pool.query('UPDATE users SET is_banned = ? WHERE id = ?', [newStatus, user_id]);

  res.json({ message: newStatus ? 'User banned' : 'User unbanned', is_banned: !!newStatus });
};

export const getDashboardStats = async (req, res) => {
  const [[{ total_students }]] = await pool.query(
    "SELECT COUNT(*) as total_students FROM users WHERE role = 'student'"
  );
  const [[{ total_teachers }]] = await pool.query(
    "SELECT COUNT(*) as total_teachers FROM users WHERE role = 'teacher'"
  );
  const [[{ total_courses }]] = await pool.query(
    'SELECT COUNT(*) as total_courses FROM courses'
  );
  const [[{ total_revenue }]] = await pool.query(
    "SELECT COALESCE(SUM(amount), 0) as total_revenue FROM payments WHERE status = 'completed'"
  );

  res.json({ total_students, total_teachers, total_courses, total_revenue });
};

export const changeUserRole = async (req, res) => {
  const { user_id } = req.params;
  const { role } = req.body;

  if (!['student', 'teacher'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const [[user]] = await pool.query('SELECT id, role FROM users WHERE id = ?', [user_id]);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === 'admin') return res.status(400).json({ message: 'Cannot change admin role' });

  await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, user_id]);
  res.json({ message: 'Role updated successfully' });
};
