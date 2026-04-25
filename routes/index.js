import { Router } from 'express';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';
import courseRoutes from './courseRoutes.js';
import moduleRoutes from './moduleRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/courses', courseRoutes);
router.use('/modules', moduleRoutes);
router.use('/upload', uploadRoutes);

export default router;