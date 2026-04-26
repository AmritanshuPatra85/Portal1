import express from 'express';
import { markProgress, getCourseProgress } from '../controllers/progressController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/',verifyToken,requireRole('student'),markProgress);

router.get('/course/:course_id', verifyToken, requireRole('student'), getCourseProgress);

export default router;