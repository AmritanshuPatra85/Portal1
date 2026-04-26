import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import s3 from '../config/s3.js';
import pool from '../config/db.js';

// Upload video to S3
export const uploadVideo = async (req, res) => {
  const { lecture_id } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Verify lecture belongs to teacher's course
    const [lecture] = await pool.query(
      `SELECT l.* FROM lectures l
       JOIN modules m ON l.module_id = m.id
       JOIN courses c ON m.course_id = c.id
       WHERE l.id = ? AND c.teacher_id = ?`,
      [lecture_id, req.user.id]
    );

    if (lecture.length === 0) {
      return res.status(403).json({ message: 'Lecture not found or access denied' });
    }

    // Create unique file key
    const fileKey = `videos/lecture_${lecture_id}_${Date.now()}.mp4`;

    // Upload to S3
    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    // Save file key in DB
    await pool.query(
      'UPDATE lectures SET video_url = ? WHERE id = ?',
      [fileKey, lecture_id]
    );

    return res.status(200).json({ message: 'Video uploaded successfully', key: fileKey });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Stream video directly through server
export const streamVideo = async (req, res) => {
  const { lecture_id } = req.params;

  try {
    // Get lecture
    const [rows] = await pool.query(
      'SELECT * FROM lectures WHERE id = ?',
      [lecture_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Lecture not found' });
    }

    const lecture = rows[0];

    // Check enrollment if not free
    if (!lecture.is_free) {
      const [enrollment] = await pool.query(
        `SELECT e.* FROM enrollments e
         JOIN modules m ON m.course_id = e.course_id
         JOIN lectures l ON l.module_id = m.id
         WHERE l.id = ? AND e.student_id = ?`,
        [lecture_id, req.user.id]
      );

      if (enrollment.length === 0) {
        return res.status(403).json({ message: 'Please enroll in this course to watch' });
      }
    }

    // Fetch video from S3
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: lecture.video_url,
    });

    const s3Response = await s3.send(command);

    // Set headers so browser knows it's a video
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Accept-Ranges', 'bytes');
    if (s3Response.ContentLength) {
      res.setHeader('Content-Length', s3Response.ContentLength);
    }

    // Stream video directly to student
    s3Response.Body.pipe(res);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};