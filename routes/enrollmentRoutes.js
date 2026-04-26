import express from 'express';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { checkEnrollment, enrollFree, getMyEnrollments } from '../controllers/enrollmentController.js';
console.log('enrollment routes file executing');
const router = express.Router();

// Check enrollment status
router.get('/check/:course_id', verifyToken, checkEnrollment);

// Enroll in free course
router.post('/free/:course_id', verifyToken, requireRole('student'), enrollFree);

// Get my enrolled courses
router.get('/my', verifyToken, requireRole('student'), getMyEnrollments);

export default router;