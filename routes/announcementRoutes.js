console.log('announcement routes file executing');
import express from 'express';
import { createAnnouncement, getCourseAnnouncements, getAllAnnouncements } from '../controllers/announcementController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Teacher or admin can create announcements
router.post('/', verifyToken, requireRole('teacher', 'admin'), createAnnouncement);

// Student views announcements for a course they're enrolled in
router.get('/course/:course_id', verifyToken, requireRole('student'), getCourseAnnouncements);

// Admin views all announcements
router.get('/', verifyToken, requireRole('admin'), getAllAnnouncements);

export default router;