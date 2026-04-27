import Razorpay from 'razorpay';
import crypto from 'crypto';
import pool from '../config/db.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  const student_id = req.user.id;
  const { course_id } = req.body;

  // Fetch course price from DB
  const [[course]] = await pool.query('SELECT price FROM courses WHERE id = ?', [course_id]);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  if (course.price === 0) return res.status(400).json({ message: 'This is a free course' });

  // Razorpay expects amount in paise (1 INR = 100 paise)
  const amount = course.price * 100;

  const order = await razorpay.orders.create({
    amount,
    currency: 'INR',
    receipt: `receipt_${student_id}_${course_id}_${Date.now()}`,
  });

  // Save pending payment in DB
  await pool.query(
    'INSERT INTO payments (student_id, course_id, amount, razorpay_order_id, status) VALUES (?, ?, ?, ?, ?)',
    [student_id, course_id, course.price, order.id, 'pending']
  );

  res.json({ order_id: order.id, amount, currency: 'INR', key: process.env.RAZORPAY_KEY_ID });
};

export const verifyPayment = async (req, res) => {
  const student_id = req.user.id;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, course_id } = req.body;

  // Recreate the signature using our secret
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: 'Invalid payment signature' });
  }

  // Signature matched — update payment status
  await pool.query(
    'UPDATE payments SET razorpay_payment_id = ?, status = ? WHERE razorpay_order_id = ?',
    [razorpay_payment_id, 'completed', razorpay_order_id]
  );

  // Enroll the student
  await pool.query(
    'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)',
    [student_id, course_id]
  );

  res.json({ message: 'Payment verified, enrollment successful' });
};
