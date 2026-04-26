import express from 'express';
import { createReview, getCourseReviews } from '../controllers/reviewController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Student submits a review
router.post('/', verifyToken, requireRole('student'), createReview);

// Anyone can see reviews for a course
router.get('/course/:course_id', getCourseReviews);

export default router;