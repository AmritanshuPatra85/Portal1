import pool from '../config/db.js';

export const getMyProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM profiles WHERE user_id = ? LIMIT 1',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateMyProfile = async (req, res) => {
  const { mobile, dob, bio, avatar_url } = req.body;

  try {
    const [existing] = await pool.query(
      'SELECT id FROM profiles WHERE user_id = ? LIMIT 1',
      [req.user.id]
    );

    if (existing.length === 0) {
      await pool.query(
        'INSERT INTO profiles (user_id, mobile, dob, bio, avatar_url) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, mobile || null, dob || null, bio || null, avatar_url || null]
      );
    } else {
      await pool.query(
        'UPDATE profiles SET mobile = ?, dob = ?, bio = ?, avatar_url = ? WHERE user_id = ?',
        [mobile || null, dob || null, bio || null, avatar_url || null, req.user.id]
      );
    }

    const [rows] = await pool.query(
      'SELECT * FROM profiles WHERE user_id = ? LIMIT 1',
      [req.user.id]
    );

    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

