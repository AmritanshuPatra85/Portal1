import express from 'express';
import { getAllUsers, toggleBan, getDashboardStats, changeUserRole } from '../controllers/adminController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require login + admin role
router.get('/users', verifyToken, requireRole('admin'), getAllUsers);
router.patch('/users/:user_id/ban', verifyToken, requireRole('admin'), toggleBan);
router.patch('/users/:user_id/role', verifyToken, requireRole('admin'), changeUserRole);
router.get('/stats', verifyToken, requireRole('admin'), getDashboardStats);

export default router;
