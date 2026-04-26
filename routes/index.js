import { Router } from 'express';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';
import courseRoutes from './courseRoutes.js';
import moduleRoutes from './moduleRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import enrollmentRoutes from './enrollmentRoutes.js';
import progressRoutes from './progressRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import adminRoutes from './adminRoutes.js';
import announcementRoutes from './announcementRoutes.js';
import reviewRoutes from './reviewRoutes.js';


const router = Router();
//debugg 
router.use((req, res, next) => {
  console.log('index router hit:', req.method, req.url);
  next();
});
router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/courses', courseRoutes);
router.use('/modules', moduleRoutes);
router.use('/upload', uploadRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/progress', progressRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);
router.use('/announcements', announcementRoutes);
router.use('/reviews', reviewRoutes);
export default router;


