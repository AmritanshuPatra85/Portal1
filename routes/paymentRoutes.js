//debugging
console.log('payment routes file executing');

import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Student creates a payment order before paying
router.post('/create-order', verifyToken, requireRole('student'), createOrder);

// Student verifies payment after Razorpay popup closes
router.post('/verify', verifyToken, requireRole('student'), verifyPayment);
console.log('payment routes registered');
export default router;