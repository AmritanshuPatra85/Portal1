import express from 'express';
import multer from 'multer';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { uploadVideo, getVideoUrl } from '../controllers/uploadController.js';

const router = express.Router();

// Store file in memory before sending to S3
const upload = multer({ storage: multer.memoryStorage() });
console.log('Bucket:', process.env.AWS_BUCKET_NAME);
console.log('Region:', process.env.AWS_REGION);

// Teacher uploads video
router.post('/video', verifyToken, requireRole('teacher'), upload.single('video'), uploadVideo);

// Get signed URL to watch a video
router.get('/video/:lecture_id', verifyToken, getVideoUrl);

export default router;