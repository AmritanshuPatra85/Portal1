import express from 'express';
import { verifyToken, requireRole } from '../middleware/auth.js';
import {
  createCourse,
  getAllCourses,
  getCourseById,
  getMyCourses,
  updateCourse,
  deleteCourse
} from '../controllers/courseController.js';

const router = express.Router();

// Public — anyone can browse courses
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Teacher only
router.post('/', verifyToken, requireRole('teacher'), createCourse);
router.get('/my/courses', verifyToken, requireRole('teacher'), getMyCourses);
router.put('/:id', verifyToken, requireRole('teacher'), updateCourse);
router.delete('/:id', verifyToken, requireRole('teacher'), deleteCourse);

export default router;