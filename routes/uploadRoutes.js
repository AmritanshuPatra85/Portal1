import express from 'express';
import multer from 'multer';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { uploadVideo, streamVideo } from '../controllers/uploadController.js';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/video', verifyToken, requireRole('teacher'), upload.single('video'), uploadVideo);
router.get('/video/:lecture_id', verifyToken, streamVideo);

export default router;