import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getMyProfile, updateMyProfile } from '../controllers/profileController.js';

const router = express.Router();

router.get('/me', verifyToken, getMyProfile);
router.post('/me', verifyToken, updateMyProfile);

export default router;

