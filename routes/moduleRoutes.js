import express from 'express';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { createModule, getModules, updateModule, deleteModule } from '../controllers/moduleController.js';
import { createLecture, getLectures, updateLecture, deleteLecture } from '../controllers/lectureController.js';

const router = express.Router();

// Module routes
router.post('/', verifyToken, requireRole('teacher'), createModule);
router.get('/:course_id', getModules);
router.put('/:id', verifyToken, requireRole('teacher'), updateModule);
router.delete('/:id', verifyToken, requireRole('teacher'), deleteModule);

// Lecture routes
router.post('/lectures', verifyToken, requireRole('teacher'), createLecture);
router.get('/lectures/:module_id', getLectures);
router.put('/lectures/:id', verifyToken, requireRole('teacher'), updateLecture);
router.delete('/lectures/:id', verifyToken, requireRole('teacher'), deleteLecture);

export default router;